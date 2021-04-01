import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    public authService: AuthService
  ) { }

  user: User
  admins: any
  electromers: any
  isUserAdmin: Boolean
  users: any

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
