import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/models/user';
import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ModalController, NavParams } from '@ionic/angular';
import { PreviewPage } from './preview/preview.page';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
  user: User;
  requests: any;
  requestForm: FormGroup;
  requestsLoading = false;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public alertService: AlertService
  ) {}


  request = {
    subject: null,
    type: null,
    body: null,
  };

  apiResult = {
    loading: false,
    error: '',
    info: '',
  };

  ngOnInit() {
    this.user = this.authService.user;
    if(this.user.is_admin == 1){
      this.getRequests();
    }
    this.requestForm = this.formBuilder.group({
      subject: ['', Validators.required],
      type: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  submit() {
    //form NgForm
    if (this.requestForm.valid) {
      this.apiResult.loading = true;
      this.request.subject = this.requestForm.value.subject;
      this.request.type = this.requestForm.value.type;
      this.request.body = this.requestForm.value.body;
      this.authService.createRequest(this.request).subscribe(
        (data) => {
          this.alertService.presentToast('The request has been sent successfully.')
          this.apiResult.error = null;
          this.requestForm.reset()
        },
        (error) => {
          this.apiResult.error = 'Error occured during sending to server';
          this.apiResult.loading = false;
        },
        () => {
          this.apiResult.loading = false;
        }
      );
    } else {
      this.apiResult.error = 'All fields are required!';
    }
  }

  async presentModalRequest(request) {
    const modal = await this.modalCtrl.create({
      component: PreviewPage,
      cssClass: 'my-custom-modal',
      componentProps: {
        request: request,
      },
    });
    return await modal.present();
  }

  public getRequests() {
    this.requestsLoading = true;
    return this.authService.getAllRequests().subscribe(
      (requests) => {
        this.requests = requests;
      },
      (error) => {
        this.apiResult.error = 'Error occured while fetching data from server.';
        this.requestsLoading = false;
      },
      () => {
        this.requestsLoading = false;
      }
    );
  }
}
