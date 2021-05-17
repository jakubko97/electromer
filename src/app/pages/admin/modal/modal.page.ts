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

  data: any; //electromers or users
  temp: any;
  user: User;
  mode: any;
  apiResult = {
    loading: false,
    error: '',
    info: ''
  };

  userElectromers: any;
  togglerState = [];
  value = [];
  theme: any;
  constructor(
    public modalCtrl: ModalController,
    private authService: AuthService,
    public navParams: NavParams,
    public alertController: AlertController,
    public alertService: AlertService
  ) { }

  isThemeDark(){
    return document.body.getAttribute('color-theme') === 'dark';
  }
  ngOnInit() {
    this.theme = this.isThemeDark() ? 'dark' : 'material';
    this.user = this.navParams.get('user');
    this.mode = this.navParams.get('mode');

    if (this.mode === 0){
      this.getElectromers();
    }
    if (this.mode === 1){
      this.getUsers();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss();
  }

  setInitUserElectromerState(){
    for (let d = 0; d < this.data.length; d++ ){
      this.data[d].toggler = 'DEACTIVATED';
      for (const e of this.userElectromers){
        if (this.data[d].id === e.electromer_id){
          this.data[d].toggler = 'ACTIVATED';
        }
      }
    }
  }

  assignUserToAdmin(user) {
    this.authService.assignUserToAdmin(user.id, this.user.id).subscribe(
      data => {
        this.alertService.presentToast('User ' + user.name + ' was succesfully assigned to ' + this.user.name);
      },
      error => {
        console.log(error);
      })
  }

  async assignUserToAdminAlert(user) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Please, confirm assiging ' + user.name + 'to' + this.user.name,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            return false;
          }
        }, {
          text: 'Confirm',
          handler: () => {
            this.assignUserToAdmin(user);
          }
        }
      ]
    });

    await alert.present();
  }

  myChange(data) {
    // data.toggler = 'PENDING';
}


  deassignElectromerTitle(electromer){
    return 'Do you want deassign ' + electromer.name + ' from ' + this.user.name + '?';
  }

  assignElectromerTitle(electromer){
    return 'Please, confirm assiging ' + electromer.name + ' to ' + this.user.name + '.';
  }
  async assigningElectromerAlert(electromer) {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: electromer.toggler === 'ACTIVATED' ? this.deassignElectromerTitle(electromer) : this.assignElectromerTitle(electromer),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            if (electromer.toggler === 'ACTIVATED'){
            }else{
              electromer.toggler = 'DEACTIVATED';
            }
          }
        }, {
          text: 'Confirm',
          handler: () => {
            this.update(electromer);
          }
        }
      ]
    });

    await alert.present();
  }

  update(electromer){
    this.apiResult.error = null;
    this.apiResult.loading = true;
    if (electromer.toggler === 'ACTIVATED'){
      this.authService.deassignElectromerFromUser(electromer.id, this.user.id).subscribe(
        data => {
          this.apiResult.loading = false;
          electromer.toggler = 'DEACTIVATED';
        },
        error => {
          this.apiResult.error = error;
          this.apiResult.loading = false;
          electromer.toggler = 'ACTIVATED';
        }
      );
    }
    this.authService.assignElectromerToUser(electromer.id, this.user.id).subscribe(
      data => {
        this.apiResult.loading = false;
        electromer.toggler = 'ACTIVATED';
      },
      error => {
        this.apiResult.error = error;
        this.apiResult.loading = false;
        electromer.toggler = 'DEACTIVATED';
      }
    );
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    let temp = null;
    if(this.mode === 0){
      temp = this.temp.filter(d => {
         return (d.name.toLowerCase().indexOf(val) !== -1 || !val) || (d.db_table.toLowerCase().indexOf(val) !== -1 || !val)
          || (d.type.toLowerCase().indexOf(val) !== -1 || !val);
      });
    }else{
      temp = this.temp.filter(d => {
        return (d.name.toLowerCase().indexOf(val) !== -1 || !val) || (d.email.toLowerCase().indexOf(val) !== -1 || !val);
      });
    }

    // update the rows
    this.data = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  public getElectromers() {
    this.apiResult.loading = true;
    return this.authService.getAllElectromers()
      .subscribe(
        electromers => {
          this.data = electromers as Electromer;
          this.temp = this.data;
          this.authService.getUserElectromersById(this.user.id).subscribe(
            (data) => {
              this.userElectromers = data;
              this.setTogglePendingValues();
              this.setInitUserElectromerState();
              this.apiResult.loading = false;
            },
            error =>{
            }
          )
          return electromers;
        },
        error => {
          this.apiResult.error = error;
          this.apiResult.loading = false;
        },
        () => {
          this.apiResult.loading = false;
        }
        )
  }

  setTogglePendingValues(){
    for (let i = 0; i < this.data.length; i++){
      this.value[i] = false;
      this.togglerState[i] = 'DEACTIVATED';
      this.data[i].toggler = 'DEACTIVATED';
    }
  }
  getUsers() {
    this.apiResult.loading = true;
    return this.authService.getAll()
      .subscribe(users => {
        this.data = users as User;
        this.temp = users;
        this.apiResult.loading = false;
      },
        error => {
          this.apiResult.error = error;
          this.apiResult.loading = false;
        }
      )
  }
}