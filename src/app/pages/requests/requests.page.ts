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
import { SIZE_TO_MEDIA } from '@ionic/core/dist/collection/utils/media'

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
  isDownloading = false;
  temp: any;
  searchValue: any;
  requestTypeOption: any;
  requestTypes = ['electromer', 'permission', 'bug', 'other'];

  customPopoverOptions: any = {
    header: 'Type'
  };
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
    file: null
  };

  apiResult = {
    loading: false,
    error: '',
    info: '',
  };
  theme: any;

fileToUpload: File = null;

isThemeDark(){
  return document.body.getAttribute('color-theme') === 'dark'
}

  ngOnInit() {
    this.theme = this.isThemeDark() ? "dark" : "material";
    this.user = this.authService.user;
    this.getRequests();

    this.requestForm = this.formBuilder.group({
      subject: ['', Validators.required],
      type: ['', Validators.required],
      body: ['', Validators.required],
    });
  }
  toggleMenu(){
    const splitPane = document.querySelector('ion-split-pane')
    if (window.matchMedia(SIZE_TO_MEDIA[splitPane.when] || splitPane.when).matches)
        splitPane.classList.toggle('split-pane-visible')
}
  submit() {
    this.apiResult.error = null;
    //form NgForm
    if (this.requestForm.valid) {
      this.apiResult.loading = true;
      // this.request.subject = this.requestForm.value.subject;
      // this.request.type = this.requestForm.value.type;
      // this.request.body = this.requestForm.value.body;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      formData.append('subject', this.requestForm.value.subject);
      formData.append('type', this.requestForm.value.type);
      formData.append('body', this.requestForm.value.body);
      this.authService.postRequest(formData).subscribe(
        (data) => {
          this.alertService.presentToast('The request has been sent successfully.')
          this.apiResult.error = null;
          this.requestForm.reset();
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


  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}

searchByKey(key){
this.searchValue = key;
this.updateFilter(key);
}

formateDate(date){
  return new Date(date);
}

updateFilter(event) {
  let val = null;
  if (event.target){
    val = event.target.value.toLowerCase();
  } else{
    val = event.toLowerCase();
  }
  // filter our data
  const temp = this.temp.filter(function (d) {
    return (d.subject.toLowerCase().indexOf(val) !== -1 || !val) || (d.type.toLowerCase().indexOf(val) !== -1 || !val)
        || (d.body.toLowerCase().indexOf(val) !== -1 || !val) || (d.name.toLowerCase().indexOf(val) !== -1 || !val);
  });

  // update the rows
  this.requests = temp;
  // Whenever the filter changes, always go back to the first page
  // this.table.offset = 0;
}
doDownload(fileId){
  this.isDownloading = true;
  let url = null;
  return this.authService.downloadFile(fileId).subscribe(
    (data: any) => {
      // this.alertService.presentToast('The request has been sent successfully.')
      this.apiResult.error = null;
      const blob = data.slice(0, data.size, "application/pdf")
      url = window.URL.createObjectURL(blob);
      window.open(url);
      this.isDownloading = false;
    },
    (error) => {
      this.apiResult.error = 'Error occured during sending to server';
      this.isDownloading = false;
    },
    () => {
    }
  );
}

  public getRequests() {
    this.requestsLoading = true;
    return this.authService.getAllRequests().subscribe(
      (requests) => {
        this.requests = requests;
        this.temp = this.requests;
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
