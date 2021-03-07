import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { User } from '../../../models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Electromer } from 'src/app/models/electromer';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  electromers: any;
  temp: any;
  apiResult = {
    loading: false,
    error: '',
    info: ''
  }
  constructor(
    public modalCtrl: ModalController,
    private authService: AuthService,
    public navParams: NavParams,
  ) { }

  user: User = this.navParams.get('user');

  ngOnInit() {
    this.getElectromers()
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss();
  }

  update(electromer: Electromer){
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

  public check(item: Electromer): Boolean {
    return true
  }

  public getElectromers() {
    this.apiResult.loading = true
    return this.authService.getAllElectromers()
      .subscribe(
        electromers => {
          this.electromers = electromers as Electromer
          this.temp = this.electromers
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
}