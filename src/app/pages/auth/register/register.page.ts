import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  apiResult = {
    loading: false,
    error: '',
    info: ''
  }

  constructor(private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }



  // Dismiss Register Modal
  dismissRegister() {
    this.modalController.dismiss();
  }

  // On Login button tap, dismiss Register modal and open login Modal
  async loginModal() {
    this.dismissRegister();
    const loginModal = await this.modalController.create({
      component: LoginPage,
    });
    return await loginModal.present();
  }

  matchPassword(form : NgForm){
    return form.value.password == form.value.password_confirmation
  }

  register(form: NgForm) {
    this.apiResult.error = null
    this.apiResult.loading = true
    this.authService.register(form.value.name, form.value.email, form.value.password, form.value.password_confirmation).subscribe(
      data => {
        this.alertService.presentToast(data['message']);
      },
      error => {
        this.apiResult.error = "Register failed. Please check your credentials."
        this.apiResult.loading = false
        this.alertService.presentToast(this.apiResult.error);

      },
      () => {
        this.apiResult.loading = false
        this.dismissRegister();
        this.navCtrl.navigateRoot('/dashboard');
      }
    );
  }
}