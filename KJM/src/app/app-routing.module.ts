import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
//import { ErrorComponent } from './error/error.component';
//import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: '', component: HomeComponent,},
  { path: 'app-home', component : HomeComponent },
  { path: 'app-login', component: LoginComponent },
  //{ path: 'heroes', component: HeroListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
