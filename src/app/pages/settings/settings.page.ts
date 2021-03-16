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
  electromers: any
  isUserAdmin: Boolean
  users: any

  ngOnInit() {
    this.user = this.authService.user
    this.isUserAdmin = this.user.is_admin == 1 ? true :  false
    this.getElectromers()
    this.getUsers()
  }

  getElectromers(){
    this.authService.getAllElectromers().subscribe(
      data => {
        this.electromers = JSON.parse(JSON.stringify(data))
      }
    )
  }
  getUsers(){
    this.authService.getAll().subscribe(
      data => {
        this.users = JSON.parse(JSON.stringify(data))
      }
    )
  }
}
