import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddElectromerPageRoutingModule } from './add-electromer-routing.module';
import { AddElectromerPage } from './add-electromer.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AddElectromerPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: []
})
export class AddElectromerPageModule {}
