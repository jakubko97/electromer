import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  user: User

  constructor(private menu: MenuController, private userService: UserService) {
    this.menu.enable(true);
  }

  ngOnInit() {
  }

    ionViewWillEnter() {
    this.userService.user().subscribe(
      user => {
        this.user = user;
      }
    );
  }
}
