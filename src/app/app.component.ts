import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlertService } from './services/alert/alert.service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';

import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router'
import { Error } from '@material-ui/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public appPages: any
  public showOverlay = true
  user: User
  apiResult = {
    loading: false,
    error: '',
    info: ''
  }

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService,

  ) {
    this.initializeApp()

    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event)
    })
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.showOverlay = true;
    }
    if (event instanceof NavigationEnd) {
      this.showOverlay = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.showOverlay = false;
    }
    if (event instanceof NavigationError) {
      this.showOverlay = false;
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // Commenting splashScreen Hide, so it won't hide splashScreen before auth check
      // this.splashScreen.hide();
      this.authService.getToken().then(
        data => {
          this.authService.getUser().subscribe(
            user => {
              this.user = user
              this.setPages()
            },
            error => {
              console.log(error)
            }
          )
        },
        error => {
          console.log(error)
        }
      )

    });
  }

  setPages() {
    if (this.user.is_admin == 1) {
      this.appPages = [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: 'home'
        },
        {
          title: 'Users',
          url: '/users',
          icon: 'people'
        },
        {
          title: 'Electromers',
          url: '/list',
          icon: 'list'
        },
        {
          title: 'Profile',
          children: [
            {
              title: 'Settings',
              url: '/settings',
              icon: 'settings',
            }
          ]
        },
      ];
    }
    else {
      this.appPages = [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: 'home'
        },
        {
          title: 'Electromers',
          url: '/list',
          icon: 'list'
        },
        {
          title: 'Profile',
          children: [
            {
              title: 'Settings',
              url: '/settings',
              icon: 'settings',
            }
          ]
        },
      ];
    }
  }
  ngOnInit() {
  }

  ionViewWillEnter() {
  }
  // When Logout Button is pressed
  logout() {
    this.apiResult.loading = true
    this.authService.logout().subscribe(
      data => {
        this.user = null
        this.alertService.presentToast(data['message']);
        this.apiResult.loading = false
      },
      error => {
        this.alertService.presentToast(error);
        this.apiResult.loading = false
      },
      () => {
        this.navCtrl.navigateRoot('/landing');
      }
    );
  }
}