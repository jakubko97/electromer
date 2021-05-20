import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from '../../../models/user';
import { MenuController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { SIZE_TO_MEDIA } from '@ionic/core/dist/collection/utils/media'
import { UserFormPage } from '../user-form/user-form.page';

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
  theme: any;

  isItemAvailable = false;
  items = [];

  // @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private menu: MenuController,
    private authService: AuthService,
    public modalCtrl: ModalController,
    private userService: AuthService,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController
  ) {
    this.menu.enable(true);

  }

  columns = [
    { name: 'Name', prop: 'name' },
    { name: 'Email', prop: 'email' },
  ];

  isThemeDark(){
    return document.body.getAttribute('color-theme') === 'dark'
  }

  ngOnInit() {
    this.theme = this.isThemeDark() ? "dark" : "material";
    this.user = this.authService.user
    this.getUsers()
  }
  toggleMenu(){
    const splitPane = document.querySelector('ion-split-pane')
    if (window.matchMedia(SIZE_TO_MEDIA[splitPane.when] || splitPane.when).matches)
        splitPane.classList.toggle('split-pane-visible')
}

async editUser(user: any) {
  const modal = await this.modalCtrl.create({
    component: UserFormPage,
    cssClass: 'my-custom-modal',
    componentProps: {
      user: user
    },
  });
  return await modal.present();

}
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    let role = null

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


  initializeItems(){
    this.items = ["Admin","User"];
}
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
        this.isItemAvailable = true;
        this.items = this.items.filter((item) => {
            return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    } else {
        this.isItemAvailable = false;
    }
}
  async showModal(currentUser: User) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      cssClass: 'my-custom-modal',
      componentProps: {
        user: currentUser,
        mode: 0 //electromers
      },
    });
    return await modal.present();
  }
  async assignUserToAdminModal(admin: User) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      cssClass: 'my-custom-modal',
      componentProps: {
        user: admin,
        mode: 1 //users
      },
    });
    return await modal.present();
  }

  async putRightsAlert(user) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Please, confirm admin rights for ' + user.name,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Confirm',
          handler: () => {
            this.putAdminRights(user)
          }
        }
      ]
    });

    await alert.present();
  }

  async presentActionSheet(user) {
    const buttons = [];
    if((this.user.is_admin === 1 || this.user.is_superadmin)){

      if(user.is_admin === 1 || this.user.is_admin === 1){
        buttons.push(
          {
            text: 'Assign Electromer to',
            icon: 'color-wand-outline',
            handler: () => {
              this.viewElectromers(user);
            }
          })
      }
    }
    if(this.user.is_superadmin === 1 && user.is_admin === 1){
      buttons.push(
        // {
        //   text: 'Put admin rights',
        //   icon: 'key-outline',
        //   handler: () => {
        //     this.putRightsAlert(user)
        //   }
        // },
        {
          text: 'Assign User to',
          icon: 'person-add-outline',
          handler: () => {
            this.assignUserToAdminModal(user);
          }
        },
        {
          text: 'Edit User',
          icon: 'pencil',
          handler: () => {
            this.editUser(user);
          }
        }
      )
    }
    if(user.is_admin === 0 && this.user.is_superadmin === 1){
      buttons.push(
        {
          text: 'Grant Admin Rights',
          icon: 'key-outline',
          handler: () => {
            this.putRightsAlert(user);
          }
        },
        {
          text: 'Edit User',
          icon: 'pencil',
          handler: () => {
            this.editUser(user);
          }
        }
      )
    }
    buttons.push(
      {
        text: 'Cancel',
        icon: 'close',
        role: 'destructive',
        handler: () => {
        }
      }
    )
    const actionSheet = await this.actionSheetController.create({
      header: user.name,
      cssClass: 'my-custom-class',
      buttons: buttons
    });
    await actionSheet.present();
  }

  putAdminRights(user){
    this.authService.assignAdminRights(user.id).subscribe(
    data => {
    },
    error => {
      console.log(error);
    })
  }

  public getUsers() {
    let email = this.user.email //remove myself from users array based on email
    this.apiResult.loading = true
    return this.userService.getAll()
      .subscribe(users => {
        this.users = users;
        this.users = this.users.filter(function( obj: User ) {
          return obj.email !== email;
      });
        this.temp = this.users;
        this.apiResult.loading = false;
        // var index = users.indexOf("red");
        // if (index >= 0) {
        //   users.splice( index, 1 );
        // }
      },
        error => {
          this.apiResult.error = error;
        }
      )
  }
}
