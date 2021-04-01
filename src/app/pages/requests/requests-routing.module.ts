import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestsPage } from './requests.page';

const routes: Routes = [
  {
    path: '',
    component: RequestsPage
  },
  {
    path: 'preview',
    loadChildren: () => import('./preview/preview.module').then( m => m.PreviewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestsPageRoutingModule {}
