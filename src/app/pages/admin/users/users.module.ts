import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersPageRoutingModule } from './users-routing.module';
import { UsersPage } from './users.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UserFormPage } from '../user-form/user-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UsersPageRoutingModule,
    NgxDatatableModule
    ],
  declarations: [UsersPage, UserFormPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsersPageModule {}
