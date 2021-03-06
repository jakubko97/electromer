import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  user: User

  constructor(
    private menu: MenuController,
    private authService: AuthService) {
    this.menu.enable(true);
  }

  ngOnInit() {
  }

    ionViewWillEnter() {
    // this.authService.getUser().subscribe(
    //   user => {
    //     this.user = user;
    //   }
    // );
  }
}
