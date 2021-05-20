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
  searchValue = '';
  filterOption = null;
  userElectromers: any;
  adminUsers: any;
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

  searchOptions = [
    {
      text: 'all',
      value: null
    },
    {
      text: 'available',
      value: 1
    },
    {
      text: 'activated',
      value: 2
    },
    {
      text: 'deactivated',
      value: 3
    }];

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

  searchByKey(key){
    console.log(key)
    this.searchValue = key;
    this.updateFilter(key);
  }
  setInitUserElectromerState(assignData){
    for (let d = 0; d < this.data.length; d++ ){
      this.data[d].toggler = 'DEACTIVATED';
      for (const e of assignData){
        if (this.mode === 0){
          if (this.data[d].id === e.electromer_id){
            this.data[d].toggler = 'ACTIVATED';
          }
        }
        if (this.mode === 1){
          if (this.data[d].id === e.id){
            this.data[d].toggler = 'ACTIVATED';
          }
        }
      }
    }
  }

  assignUserToAdmin(user) {
    this.apiResult.error = null;
    this.apiResult.loading = true;
    if (user.toggler === 'ACTIVATED'){
      this.authService.assignUserToAdmin(user.id, null).subscribe(
        data => {
          this.alertService.presentToast('Succesfully deassigned');
          user.toggler = 'DEACTIVATED';
          this.apiResult.loading = false;
        },
        error => {
          this.apiResult.error = error;
          this.apiResult.loading = false;
      })
    }else{
      this.authService.assignUserToAdmin(user.id, this.user.id).subscribe(
        data => {
          this.alertService.presentToast('Succesfully assigned');
          user.toggler = 'ACTIVATED';
          this.apiResult.loading = false;
        },
        error => {
          this.apiResult.error = error;
          this.apiResult.loading = false;
      })
    }
  }

  async assignUserToAdminAlert(user) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: user.toggler === 'ACTIVATED' ? this.deassignTitle(user) : this.assignTitle(user),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            if (user.toggler === 'ACTIVATED'){
            }else{
              user.toggler = 'DEACTIVATED';
            }
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


  deassignTitle(data){
    return 'Do you want deassign ' + data.name + ' from ' + this.user.name + '?';
  }

  assignTitle(data){
    return 'Please, confirm assiging ' + data.name + ' to ' + this.user.name + '.';
  }
  async assigningElectromerAlert(electromer) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: electromer.toggler === 'ACTIVATED' ? this.deassignTitle(electromer) : this.assignTitle(electromer),
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
          // this.alertService.presentToast('Electromer ' + electromer.name + ' was succesfully deassigned from ' + this.user.name);
          this.alertService.presentToast('Succesfully deassigned');
        },
        error => {
          this.apiResult.error = error;
          this.apiResult.loading = false;
          electromer.toggler = 'ACTIVATED';
        }
      );
    } else {
      this.authService.assignElectromerToUser(electromer.id, this.user.id).subscribe(
        data => {
          this.apiResult.loading = false;
          electromer.toggler = 'ACTIVATED';
          // this.alertService.presentToast('Electromer ' + electromer.name + ' was succesfully assigned to ' + this.user.name);
          this.alertService.presentToast('Succesfully assigned');
        },
        error => {
          this.apiResult.error = error;
          this.apiResult.loading = false;
          electromer.toggler = 'DEACTIVATED';
        }
      );
    }
  }

  updateFilter(event) {
    let val = null;
    if (event.target){
      val = event.target.value.toLowerCase();
    } else{
      val = event.toLowerCase();
    }
    // filter our data
    let temp = null;
    if (this.mode === 0){

      if (this.filterOption == null){
        temp = this.temp.filter(d => {
         return (d.name.toLowerCase().indexOf(val) !== -1 || !val) || (d.db_table.toLowerCase().indexOf(val) !== -1 || !val)
          || (d.type.toLowerCase().indexOf(val) !== -1 || !val);
      });
      }
      else if(this.filterOption === 1){
        temp = this.temp.filter(d => {
          return ((d.name.toLowerCase().indexOf(val) !== -1 || !val) || (d.db_table.toLowerCase().indexOf(val) !== -1 || !val))
          || (d.type.toLowerCase().indexOf(val) !== -1 || !val);
        });
      }
      else if(this.filterOption === 2){
        temp = this.temp.filter(d => {
          return ((d.name.toLowerCase().indexOf(val) !== -1 || !val) || (d.db_table.toLowerCase().indexOf(val) !== -1 || !val)
          || (d.type.toLowerCase().indexOf(val) !== -1 || !val)) && d.toggler === 'ACTIVATED';
        });
      }
      else if(this.filterOption === 3){
        temp = this.temp.filter(d => {
          return ((d.name.toLowerCase().indexOf(val) !== -1 || !val) || (d.db_table.toLowerCase().indexOf(val) !== -1 || !val)
          || (d.type.toLowerCase().indexOf(val) !== -1 || !val)) && d.toggler === 'DEACTIVATED';
        });
      }
    }else{
      if (this.filterOption == null){
        temp = this.temp.filter(d => {
          return (d.name.toLowerCase().indexOf(val) !== -1 || !val) || (d.db_table.toLowerCase().indexOf(val) !== -1 || !val);
        });
      }else if(this.filterOption === 1){
        temp = this.temp.filter(d => {
          return ((d.name.toLowerCase().indexOf(val) !== -1 || !val) || (d.email.toLowerCase().indexOf(val) !== -1 || !val))
          && d.admin_id === null;
        });
      }
      else if(this.filterOption === 2){
        temp = this.temp.filter(d => {
          return ((d.name.toLowerCase().indexOf(val) !== -1 || !val) || (d.email.toLowerCase().indexOf(val) !== -1 || !val))
          && d.toggler === 'ACTIVATED';
        });
      }
      else if(this.filterOption === 3){
        temp = this.temp.filter(d => {
          return ((d.name.toLowerCase().indexOf(val) !== -1 || !val) || (d.email.toLowerCase().indexOf(val) !== -1 || !val))
          && d.toggler === 'DEACTIVATED';
        });
      }

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
              this.setInitUserElectromerState(this.userElectromers);
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
    return this.authService.getUsersOnly()
      .subscribe(users => {
        this.data = users as User;
        this.temp = users;
        this.authService.getAdminUsersById(this.user.id).subscribe(
          data => {
            this.adminUsers = data;
            this.setTogglePendingValues();
            this.setInitUserElectromerState(this.adminUsers);
            this.apiResult.loading = false;
          },
          error => {

          }
        )
      },
        error => {
          this.apiResult.error = error;
          this.apiResult.loading = false;
        }
      )
  }
}