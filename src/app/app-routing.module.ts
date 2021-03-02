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
  { path: 'admin', loadChildren: () => import('src/app/pages/admin/admin.module').then(m => m.AdminPageModule), canActivate: [AuthGuard]},
  { path: 'list', loadChildren: () => import('src/app/pages/list/list.module').then(m => m.ListPageModule), canActivate: [AuthGuard] },
  { path: 'users', loadChildren: () => import('src/app/pages/users/users.module').then(m => m.UsersPageModule), canActivate: [AuthGuard] },
  { path: 'modal', loadChildren: () => import('src/app/pages/modal/modal.module').then(m => m.ModalPageModule), canActivate: [AuthGuard] },
  { path: 'support', loadChildren: () => import('src/app/pages/support/support.module').then(m => m.SupportPageModule), canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}