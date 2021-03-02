import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/user';
import { MenuController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
 

  user: User;
  users: any;
  
  displayedColumns: string[] = ['id', 'name', 'email', 'created'];
  dataSource: any

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private menu: MenuController, private authService: AuthService, public modalCtrl: ModalController) { 
    this.menu.enable(true);
  }


  ionViewWillEnter() {
    this.authService.user().subscribe(
      user => {
        this.user = user;
      }
    );
  }

  public openModal(currentUser: User){
    this.showModal(currentUser)
  }

  async showModal(currentUser: User) {  
    const modal = await this.modalCtrl.create({  
      component: ModalPage ,
      componentProps: {
         user: currentUser
      }
    });  
    return await modal.present();  
  }  

  ngOnInit() {
    this.getUsers()
    this.dataSource = new MatTableDataSource<User>(this.users);
    this.dataSource.paginator = this.paginator;
  }

  
  public getUsers(){
    return this.authService.getAllUsers() 
      .subscribe(users => {
        this.users = users as User
    
  })
  }
}
