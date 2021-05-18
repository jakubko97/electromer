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
import { TranslateService } from '@ngx-translate/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

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
    private translate: TranslateService,
    private storage: NativeStorage

  ) {
    this.initializeApp()
    translate.setDefaultLang('en');

    translate.onLangChange.subscribe(change => console.log('lang changed to', change.lang));
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    })
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.showOverlay = true;
      if (event.url === '/dashboard'){
        this.authService.getToken().then(
          data => {
            this.authService.getUser().subscribe(
              user => {
                this.user = user;
                this.setPages();
              },
              error => {
              });
            })
        }
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

    });
  }

  setPages() {
    this.user = this.authService.user;
    if (this.user.is_admin === 1 || this.user.is_superadmin) {
      this.appPages = [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: 'home'
        },
        {
          title: this.translate.instant('common.users'),
          url: '/users',
          icon: 'people'
        },
        {
          title: this.translate.instant('common.electromers'),
          url: '/list',
          icon: 'list'
        },
        {
          title:  this.translate.instant('common.logs'),
          url: '/logs',
          icon: 'notifications-outline'
        },
        {
          title: this.user.email,
          children: [
            {
              title: 'Settings',
              url: '/settings',
              icon: 'settings',
            },
            {
              title: 'Requests',
              url: '/requests',
              icon: 'document-text-outline',
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
          title:  this.translate.instant('common.electromers'),
          url: '/list',
          icon: 'list'
        },
        {
          title: this.user.email,
          children: [
            {
              title:  this.translate.instant('settings.title'),
              url: '/settings',
              icon: 'settings',
            },
            {
              title: this.translate.instant('requests.title'),
              url: '/requests',
              icon: 'document-text-outline',
            }
          ]
        },
      ];
    }
  }
  async ngOnInit() {
    this.storage.getItem('lang')
    .then(
      language => {
        if (!language) {
          language = navigator.language.split('-')[0];
        }
        this.translate.use(language);
      },
      () => this.translate.use('en')
    );
  }


  ionViewWillEnter() {
  }
  // When Logout Button is pressed
  logout() {
    this.apiResult.loading = true;
    this.authService.logout().subscribe(
      data => {
        this.user = null;
        this.alertService.presentToast(data['message']);
        this.apiResult.loading = false;
      },
      error => {
        this.alertService.presentToast(error);
        this.apiResult.loading = false;
      },
      () => {
        this.navCtrl.navigateRoot('/landing');
        this.appPages = [];
      }
    );
  }
}