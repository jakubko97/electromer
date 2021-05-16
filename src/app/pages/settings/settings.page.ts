import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { SIZE_TO_MEDIA } from '@ionic/core/dist/collection/utils/media'
import { TranslateService } from '@ngx-translate/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    public authService: AuthService,
    private translate: TranslateService,
    private storage: NativeStorage
  ) { }

  user: User
  admins: any
  electromers: any
  isUserAdmin: Boolean
  users: any
  language: string

  apiResult = {
    loading: false,
    error: '',
    info: '',
  };

  electromersLoading = false;
  usersLoading = false;
  adminsLoading = false;

  ngOnInit() {
    this.user = this.authService.user
    this.isUserAdmin = this.user.is_admin == 1 ? true :  false
    this.getElectromers()
    this.getUsers()
    this.getAdmins()
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
      this.language = language;
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
