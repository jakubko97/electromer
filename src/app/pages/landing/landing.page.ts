import { Component, OnInit } from '@angular/core';
import { ModalController, MenuController, NavController } from '@ionic/angular';
import { RegisterPage } from '../auth/register/register.page';
import { LoginPage } from '../auth/login/login.page';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  language: string;
  constructor(
    private modalController: ModalController,
    private menu: MenuController,
    private authService: AuthService,
    private navCtrl: NavController,
    private translate: TranslateService
  ) {
    this.menu.enable(false);
  }
  ionViewWillEnter() {
    this.authService.getToken().then(() => {
      if(this.authService.isLoggedIn) {
        this.navCtrl.navigateRoot('/dashboard');
      }
    });
  }
  async ngOnInit() {
    this.language = "en";
    console.log('OnInit', this.language);
    console.log(this.translate.getLangs());
  }
  async register() {
    const registerModal = await this.modalController.create({
      component: RegisterPage
    });
    return await registerModal.present();
  }
  async login() {
    const loginModal = await this.modalController.create({
      component: LoginPage,
    });
    return await loginModal.present();
  }

  async languageChanged(event: CustomEvent<{ value: string }>) {
    let language = event.detail.value;

    if (!language) {
      console.log(navigator.language);
      language = navigator.language.split('-')[0];
      console.log(language);
    }
    //this.storage.set('language', language);

    this.translate.use(language).subscribe();
  }
}