import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { AlertService } from './services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appPages = [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: 'home'
    },
  
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    },
  ];

  
  getAppPages(){
    if(this.authService.isUser()){
      return [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: 'home'
        },
        {
          title: 'List',
          url: '/list',
          icon: 'list'
        },
        {
          title: 'Podpora',
          url: '/support',
          icon: 'support'
        },
      ];
    }
    else if(this.authService.isAdmin()){
      console.log(this.authService.isAdmin())
      return [
        {
          title: 'Admin ',
          url: '/admin',
          icon: 'home'
        },
        {
          title: 'Použivatelia ',
          url: '/users',
          icon: 'home'
        },
        {
          title: 'Pridať elektromer',
          url: '/list',
          icon: 'list'
        },
        {
          title: 'Podpora',
          url: '/support',
          icon: 'support'
        },
      ];
    }
  }

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // Commenting splashScreen Hide, so it won't hide splashScreen before auth check
      //this.splashScreen.hide();
      this.authService.getToken();
    });
  }

  // When Logout Button is pressed 
  logout() {
    this.authService.logout().subscribe(
      data => {
        this.alertService.presentToast(data['message']);        
      },
      error => {
        console.log(error);
      },
      () => {
        this.navCtrl.navigateRoot('/landing');
      }
    );
  }
}