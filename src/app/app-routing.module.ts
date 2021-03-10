import { AdminGuard } from './guard/admin.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  { path: 'landing', loadChildren: () => import('src/app/pages/landing/landing.module').then(m => m.LandingPageModule) },
  { path: 'login', loadChildren: () => import('src/app/pages/auth/login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('src/app/pages/auth/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'dashboard', loadChildren: () => import('src/app/pages/dashboard/dashboard.module').then(m => m.DashboardPageModule),canActivate: [AuthGuard]},
  { path: 'admin', loadChildren: () => import('src/app/pages/admin/admin.module').then(m => m.AdminPageModule), canActivate: [AdminGuard]},
  { path: 'list', loadChildren: () => import('src/app/pages/admin/electromers/list.module').then(m => m.ListPageModule), canActivate: [AdminGuard] },
  {
    path: 'users', loadChildren: () => import('src/app/pages/admin/users/users.module').then(m => m.UsersPageModule), canActivate: [AdminGuard]
  },
  { path: 'modal', loadChildren: () => import('src/app/pages/admin/modal/modal.module').then(m => m.ModalPageModule), canActivate: [AuthGuard] },
  {
    path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule), canActivate: [AuthGuard],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}