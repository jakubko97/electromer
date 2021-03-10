import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from '../../../models/user';
import { MenuController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { DatatableComponent } from '@swimlane/ngx-datatable/lib/components/datatable.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',

  styleUrls: ['./users.page.scss'],
})

export class UsersPage implements OnInit {

  user: User;
  users: any;
  temp: any;
  apiResult = {
    loading: false,
    error: '',
    info: ''
  }

  // @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private menu: MenuController,
    private authService: AuthService,
    public modalCtrl: ModalController,
    private userService: AuthService
  ) {
    this.menu.enable(true);

    this.getUsers()
  }

  columns = [
    { name: 'Name', prop: 'name' },
    { name: 'Email', prop: 'email' },
  ];

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return (d.name.toLowerCase().indexOf(val) !== -1 || !val) || (d.email.toLowerCase().indexOf(val) !== -1 || !val);
    });

    // update the rows
    this.users = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  public viewElectromers(currentUser: User) {
    this.showModal(currentUser)
  }

  async showModal(currentUser: User) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      cssClass: 'my-custom-modal',
      componentProps: {
        user: currentUser
      },
    });
    return await modal.present();
  }

  ngOnInit() {
  }


  public getUsers() {
    this.apiResult.loading = true
    return this.userService.getAll()
      .subscribe(users => {
        this.users = users as User
        this.temp = users
        this.apiResult.loading = false
        // var index = users.indexOf("red");
        // if (index >= 0) {
        //   users.splice( index, 1 );
        // }
      },
        error => {
          this.apiResult.error = error
        }
      )
  }
}
