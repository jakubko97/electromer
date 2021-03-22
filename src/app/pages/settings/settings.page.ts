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

  ngOnInit() {
    this.user = this.authService.user
    this.isUserAdmin = this.user.is_admin == 1 ? true :  false
    this.getElectromers()
    this.getUsers()
    this.getAdmins()
  }

  getElectromers(){
    this.authService.getAllElectromers().subscribe(
      data => {
        this.electromers = JSON.parse(JSON.stringify(data))
      }
    )
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
    this.authService.getAll().subscribe(
      data => {
        this.users = JSON.parse(JSON.stringify(data))
      }
    )
  }
  getAdmins(){
    this.authService.getAdmins().subscribe(
      data => {
        this.admins = JSON.parse(JSON.stringify(data))
      }
    )
  }
}
