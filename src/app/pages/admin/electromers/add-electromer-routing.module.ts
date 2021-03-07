import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddElectromerPage } from './add-electromer.page';

const routes: Routes = [
  {
    path: '',
    component: AddElectromerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddElectromerPageRoutingModule {}
