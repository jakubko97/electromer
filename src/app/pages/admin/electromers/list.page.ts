import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from '../../../models/user';
import { MenuController } from '@ionic/angular';
import { Electromer } from 'src/app/models/electromer';
import { ModalController } from '@ionic/angular';
import { AddElectromerPage } from './add-electromer.page';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  electromers: any;
  temp: any;
  apiResult = {
    loading: false,
    error: '',
    info: ''
  }
  user: User;

  constructor(
    private menu: MenuController,
    public modalCtrl: ModalController,
    private authService: AuthService,
  ) {
    this.menu.enable(true);
  }

  ngOnInit() {
    this.getElectromers()
  }

  async showModal() {
    const modal = await this.modalCtrl.create({
      component: AddElectromerPage
    });
    return await modal.present();
  }

  ionViewWillEnter() {
    this.authService.getUser().subscribe(
      user => {
        this.user = user;
      }
    );
  }

  cleanElectromersData(){
    var clean_array = []
    for (let data of Object.entries(this.electromers)) { //data -> mapa 0 key, 1 value
      if(data[1] != null){
        clean_array.push(data[1])
      }
    }
    return clean_array
    ;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return (d.name.toLowerCase().indexOf(val) !== -1 || !val) || (d.db_table.toLowerCase().indexOf(val) !== -1 || !val) || (d.type.toLowerCase().indexOf(val) !== -1 || !val);
    });

    // update the rows
    this.electromers = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  async editElectromer(electromer: Electromer) {
      const modal = await this.modalCtrl.create({
        component: AddElectromerPage,
        componentProps: {
          electromer: electromer
        },
      });
      return await modal.present();

  }
  public getElectromers() {
    this.apiResult.loading = true
    return this.authService.getAllElectromers()
      .subscribe(
        electromers => {
          this.electromers = electromers as Electromer
          this.electromers = this.cleanElectromersData()
          this.temp = this.electromers
          return electromers
        },
        error => {
          this.apiResult.error = error
        },
        () => {
          this.apiResult.loading = false
        }
      )
  }
}
