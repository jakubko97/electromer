import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPageRoutingModule } from './list-routing.module';

import { ListPage } from './list.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AddElectromerPage } from './add-electromer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [ListPage, AddElectromerPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListPageModule {}
