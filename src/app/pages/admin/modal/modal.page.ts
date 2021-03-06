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

  allElectromers: any;
  electromers: Array<Electromer>
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
    this.initItems()
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
      return (d.name.toLowerCase().indexOf(val) !== -1 || !val) || (d.ip.toLowerCase().indexOf(val) !== -1 || !val) || (d.port.toLowerCase().indexOf(val) !== -1 || !val);
    });

    // update the rows
    this.electromers = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  public check(item: Electromer): Boolean {
    return true
  }

  initItems() {
    this.electromers = [
      {
        id: 1,
        name: "Elektromer 1",
        ip: "192.168.0.1",
        port: "8080",
        type: "type",
      },
      {
        id: 2,
        name: "Elektromer 2",
        ip: "192.168.0.2",
        port: "8080",
        type: "type",
      },
      {
        id: 3,
        name: "Elektromer 3",
        ip: "192.168.0.3",
        port: "8080",
        type: "type",
      }
    ]
  }
  public getElectromers() {
    this.apiResult.loading = true
    return this.authService.getAllElectromers()
      .subscribe(
        electromers => {
          console.log(electromers)
          this.allElectromers = electromers as Electromer
          this.temp = this.allElectromers
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