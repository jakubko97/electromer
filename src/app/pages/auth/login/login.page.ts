import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  role: any
  apiResult = {
    loading: false,
    error: '',
    info: ''
  }
  public icon: 'glyphicon glyphicon-eye-open'
  public inputTypePw: String = 'password'
  isPassword: Boolean = false

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
  }

  public showPassword(pw: Boolean){
    this.isPassword = pw
  }

  // Dismiss Login Modal
  dismissLogin() {
    this.modalController.dismiss();
  }

  // On Register button tap, dismiss login modal and open register modal
  // async registerModal() {
  //   this.dismissLogin();
  //   const registerModal = await this.modalController.create({
  //     component: RegisterPage
  //   });
  //   return await registerModal.present();
  // }

  isUserAdmin(){
    this.authService.isUserAdmin().subscribe(
      data => {
        if(data.is_admin==1){
          this.navCtrl.navigateRoot('/admin');
        } else {
          this.navCtrl.navigateRoot('/dashboard');
        }
      }
    )
  }
  login(form: NgForm) {
    this.apiResult.error = null
    this.apiResult.loading = true
    this.authService.login(form.value.email, form.value.password).subscribe(
      data => {
        this.alertService.presentToast("Logged In");
      },
      error => {
        this.apiResult.error = "Login failed. Please check your credentials."
        this.alertService.presentToast(this.apiResult.error);
        this.apiResult.loading = false
      },
      () => {
        this.apiResult.loading = false
        this.dismissLogin();
        this.isUserAdmin()
      }
    );
  }
}