import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { SIZE_TO_MEDIA } from '@ionic/core/dist/collection/utils/media'
import { TranslateService } from '@ngx-translate/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Utils } from 'src/app/services/plugins/utils';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  userForm: FormGroup;

  constructor(
    public authService: AuthService,
    private translate: TranslateService,
    private storage: NativeStorage,
    public formBuilder: FormBuilder,
    public utils: Utils,
    public alertService: AlertService
  ) { }


  user: any;
  admins: any;
  electromers: any;
  isUserAdmin: boolean;
  users: any;
  language: string;

  apiResult = {
    loading: false,
    error: '',
    info: '',
  };

  electromersLoading = false;
  usersLoading = false;
  adminsLoading = false;

  ngOnInit() {
    this.storage.getItem('lang')
    .then(
      language => {
        if (!language) {
          language = navigator.language.split('-')[0];
        }
        this.language = language;
        console.log('OnInit', this.language);
        this.translate.getLangs()
      }
    );

    this.user = this.authService.user;
    this.isUserAdmin = this.user.is_admin == 1 ? true :  false
    this.getElectromers()
    this.getUsers()
    this.getAdmins()

    if (this.user.electricity_price != null){
      this.userForm = this.formBuilder.group({
        price: [this.user.electricity_price, Validators.required],
      });
    }else{
      this.userForm = this.formBuilder.group({
        price: [Validators.required],
      });
    }

  }
  toggleMenu(){
    const splitPane = document.querySelector('ion-split-pane')
    if (window.matchMedia(SIZE_TO_MEDIA[splitPane.when] || splitPane.when).matches)
        splitPane.classList.toggle('split-pane-visible')
}

  isThemeDark(){
    return document.body.getAttribute('color-theme') === 'dark'
  }

  async languageChanged(event: CustomEvent<{ value: string }>) {
    let language = event.detail.value;

    if (!language) {
      console.log(navigator.language);
      language = navigator.language.split('-')[0];
      console.log(language);
    }
    this.storage.setItem('lang', language);

    this.translate.use(language).subscribe();
  }

  onClick(event){
    let systemDark = window.matchMedia('(prefers-color-scheme: dark)');
    systemDark.addListener(this.colorTest);
    if(event.detail.checked){
      document.body.setAttribute('color-theme', 'dark');
    }
    else{
      document.body.setAttribute('color-theme', 'light');
    }
  }

   colorTest(systemInitiatedDark) {
    if (systemInitiatedDark.matches) {
      document.body.setAttribute('color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
    }
  }

  save(){
    if (this.userForm.valid){
      this.apiResult.loading = true;
      this.user.electricity_price = this.userForm.value.price;
      this.authService.editUser(this.user).subscribe(
        data => {
          this.apiResult.loading = false;
          this.alertService.presentToast('Saved successfully.');
        },
        error => {
          this.apiResult.loading = false;
          this.apiResult.error = error;
        }
      );
    }else{
      this.alertService.presentToast('Electricity input is required');
    }
  }
  cleanElectromersData(){
    var clean_array = []
    for (let data of Object.entries(this.electromers)) { //data -> mapa 0 key, 1 value
      if(data[1] != null){
        clean_array.push(data[1]);
      }
    }
    return clean_array
    ;
  }

  getUsers(){
    this.usersLoading = true;
    this.authService.getAll().subscribe(
      data => {
        this.users = JSON.parse(JSON.stringify(data))
        this.usersLoading = false;
      },
      error => {
      }
    )
  }

  getElectromers(){
    this.electromersLoading = true;
    this.authService.getAllElectromers().subscribe(
      data => {
        this.electromers = JSON.parse(JSON.stringify(data))
        this.electromersLoading = false;
      },
      error => {
      }
    )
  }

  getAdmins(){
    this.adminsLoading = true;
    this.authService.getAdmins().subscribe(
      data => {
        this.admins = JSON.parse(JSON.stringify(data))
        this.adminsLoading = false;
      },
      error => {
      }
    )
  }
}
