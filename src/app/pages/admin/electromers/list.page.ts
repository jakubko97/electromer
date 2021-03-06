import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from '../../../models/user';
import { MenuController } from '@ionic/angular';
import { Electromer } from 'src/app/models/electromer';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { NgForm } from '@angular/forms';

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
      component: ModalPage
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

  addElectromer(form: NgForm) {

  }

  public getElectromers() {
    return this.authService.getAllElectromers()
      .subscribe(electromers => {
        console.log(electromers)
        this.allElectromers = electromers as Electromer
        return electromers
      })
  }
}
