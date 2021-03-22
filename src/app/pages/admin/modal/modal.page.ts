import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { User } from '../../../models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Electromer } from 'src/app/models/electromer';
import { AlertController } from '@ionic/angular';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  data: any
  // electromers: any;
  temp: any;
  user: User
  mode: any
  apiResult = {
    loading: false,
    error: '',
    info: ''
  }
  constructor(
    public modalCtrl: ModalController,
    private authService: AuthService,
    public navParams: NavParams,
    public alertController: AlertController,
    public alertService: AlertService
  ) { }

  ngOnInit() {
    this.user = this.navParams.get('user');
    this.mode = this.navParams.get('mode');

    if(this.mode == 0){
      this.getElectromers()
    }
    if(this.mode == 1){
      this.getUsers()
    }
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss();
  }

  assignUserToAdmin(user) {
    this.authService.assignUserToAdmin(user.id, this.user.id).subscribe(
      data => {
        console.log(data)
        this.alertService.presentToast('User '+ user.name + ' was succesfully assigned to ' + this.user.name)
      },
      error => {
        console.log(error)
      })
  }

  async assigningElectromerAlert(electromer) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Please, confirm assiging ' + electromer.name + ' to '+ this.user.name +'.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Confirm',
          handler: () => {
            this.update(electromer)
          }
        }
      ]
    });

    await alert.present();
  }

  update(electromer){
    this.apiResult.error = null
    this.apiResult.loading = true
    this.authService.assignElectromerToUser(electromer.id, this.user.id).subscribe(
      data => {
        this.apiResult.loading = false
      },
      error => {
        this.apiResult.error = error
        this.apiResult.loading = false
      }
    )
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    let temp = null
    if(this.mode == 0){
      temp = this.temp.filter(function (d) {
        return (d.name.toLowerCase().indexOf(val) !== -1 || !val) || (d.db_table.toLowerCase().indexOf(val) !== -1 || !val) || (d.type.toLowerCase().indexOf(val) !== -1 || !val);
      });
    }else{
      temp = this.temp.filter(function (d) {
        return (d.name.toLowerCase().indexOf(val) !== -1 || !val) || (d.email.toLowerCase().indexOf(val) !== -1 || !val);
      });
    }

    // update the rows
    this.data = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  public check(item: Electromer): Boolean {
    return true
  }

  public getElectromers() {
    this.apiResult.loading = true
    return this.authService.getAllElectromers()
      .subscribe(
        electromers => {
          this.data = electromers as Electromer
          this.temp = this.data
          this.apiResult.loading = false
          return electromers
        },
        error => {
          this.apiResult.error = error
          this.apiResult.loading = false
        },
        () => {
          this.apiResult.loading = false
        }
        )
  }
  getUsers() {
    this.apiResult.loading = true
    return this.authService.getAll()
      .subscribe(users => {
        this.data = users as User
        this.temp = users
        this.apiResult.loading = false
      },
        error => {
          this.apiResult.error = error
          this.apiResult.loading = false
        }
      )
  }
}