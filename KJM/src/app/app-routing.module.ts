import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/*
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { AuthGuard } from './auth.guard';
*/

const routes: Routes = [
  /*{
    path: 'home',
    component: HomeComponent,
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
