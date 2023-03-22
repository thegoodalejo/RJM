import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
//import { ErrorComponent } from './error/error.component';
//import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: '', component: HomeComponent,},
  { path: 'home', component : HomeComponent },
  { path: 'app-login-page', component: LoginPageComponent },
  //{ path: 'heroes', component: HeroListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
