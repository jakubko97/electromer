import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.page.html',
  styleUrls: ['./user-form.page.scss'],
})
export class UserFormPage implements OnInit {

  userForm: FormGroup;

  apiResult = {
    loading: false,
    error: '',
    info: ''
  }

  userEdit: any;
  user = {
    name: null,
    email: null
  }
  constructor(
    public modalCtrl: ModalController,
    public authService: AuthService,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertService: AlertService) { }

  ngOnInit() {
    this.userEdit = this.navParams.get('user');

    this.userForm = this.formBuilder.group({
      name: [this.userEdit.name, Validators.required],
      email: [this.userEdit.email, Validators.required],
    });
  }


  editUser() {
    this.apiResult.loading = true;
    this.user.name = this.userForm.value.name;
    this.user.email = this.userForm.value.email;

    if (!this.userForm.invalid) {
      this.authService.editUser(this.user).subscribe(
        data => {
          this.apiResult.loading = false;
          this.modalCtrl.dismiss();
          this.alertService.presentToast('Electromer '+ this.userForm.value.name +' was successfully added.');
        },
        error => {
          console.log(error)
          this.apiResult.error = 'An unexpected error occurred.'
          this.apiResult.loading = false;
        }
      )
    } else {
      this.apiResult.error = 'Saving electromer failed. Please check input data.'
      this.apiResult.loading = false;
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss();
  }

}
