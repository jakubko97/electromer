import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Request } from 'src/app/models/request';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
})
export class PreviewPage implements OnInit {

  request: any;

  constructor(
    public modalCtrl: ModalController,
    private authService: AuthService,
    public navParams: NavParams,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    this.request = this.navParams.get('request');
  }

 apiResult = {
    loading: false,
    error: '',
    info: '',
  };

  async presentAlertRequest(request) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: request.subject,
      subHeader: request.type,
      message: request.body,
      buttons: [
        {
          text: 'Accept',
          handler: () => {
            request.status = 2;
            this.processRequest(request);
          }
        },
        {
          text: 'Cancel',
          role: 'destructive',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }
      ]
    });

    await alert.present();
  }

  processRequest(request) {
    this.apiResult.loading = true;
    return this.authService.processRequest(request).subscribe(
      (response) => {
      },
      (error) => {
        this.apiResult.error = 'Error occured while fetching data from server.';
        this.apiResult.loading = false;
      },
      () => {
        this.apiResult.loading = false;
      }
    );
  }
  cancel() {
    this.modalCtrl.dismiss();
  }

  reject() {
    this.request.status = 3;
    this.processRequest(this.request);
    this.modalCtrl.dismiss();
  }

  accept() {
    this.request.status = 3;
    this.processRequest(this.request);
    this.modalCtrl.dismiss();
  }

}
