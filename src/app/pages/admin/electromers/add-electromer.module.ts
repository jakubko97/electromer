import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddElectromerPageRoutingModule } from './add-electromer-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AddElectromerPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  declarations: []
})
export class AddElectromerPageModule {}
