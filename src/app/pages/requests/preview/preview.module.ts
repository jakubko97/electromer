import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PreviewPageRoutingModule } from './preview-routing.module';
import { PreviewPage } from './preview.page';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    IonicModule,
    PreviewPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PreviewPage]
})
export class PreviewPageModule {}
