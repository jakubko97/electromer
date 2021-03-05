import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from '../../models/user';
import { MenuController } from '@ionic/angular';
import { Electromer } from 'src/app/models/electromer';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { NgForm } from '@angular/forms';
import { UserService} from 'src/app/services/user/user.service';
import { ElectromerService } from 'src/app/services/electromer/electromer.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  allElectromers: any;
  user: User;

  constructor(
    private menu: MenuController,
    private authService: AuthService,
    public modalCtrl: ModalController,
    private userService: UserService,
    private electromerService: ElectromerService
    ) {
    this.menu.enable(true);
  }

  ngOnInit() {
    this.getElectromers()
  }

  async showModal() {
    const modal = await this.modalCtrl.create({
      component: ModalPage
    });
    return await modal.present();
  }

  ionViewWillEnter() {
    this.userService.user().subscribe(
      user => {
        this.user = user;
      }
    );
  }

  addElectromer(form: NgForm) {

  }

  public getElectromers() {
    return this.electromerService.getAll()
      .subscribe(electromers => {
        console.log(electromers)
        this.allElectromers = electromers as Electromer
        return electromers
      })
  }
}
