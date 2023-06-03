import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MembreciaComponent } from './pages/membrecia/membrecia.component';
import { AfirmacionComponent } from './pages/afirmacion/afirmacion.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { RegistroMiembroComponent } from './pages/registro-miembro/registro-miembro.component';
import { GobiernoComponent } from './pages/gobierno/gobierno.component';


const routes: Routes = [
  { path: '', component: LoginComponent, },
  {
    path: 'app-home', component: HomeComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'app-inicio', component: InicioComponent  },
      { path: 'app-afirmacion', component: AfirmacionComponent },
      { path: 'registro-miembro', component: RegistroMiembroComponent },
      { path: 'app-membrecia', component: MembreciaComponent },
      { path: 'app-gobierno', component: GobiernoComponent },
    ]
  },
  { path: 'app-login', component: LoginComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
