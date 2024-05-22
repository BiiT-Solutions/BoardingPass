import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./services/auth-guard.service";

const login = import('./views/biit-login-page/biit-login-page.module').then(m => m.BiitLoginPageModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => login
  },
  {
    path: 'login',
    loadChildren: () => login
  },
  {
    path: 'schedule',
    loadChildren: () => import('./views/schedule-viewer/schedule-viewer.module').then(m => m.ScheduleViewerModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'scanner',
    loadChildren: () => import('./views/scanner/scanner.module').then(m => m.ScannerModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadChildren: () => login
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
