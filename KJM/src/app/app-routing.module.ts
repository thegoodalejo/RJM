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
import { MetricasAfirmacionComponent } from './pages/metricas-afirmacion/metricas-afirmacion.component';
import { ReportesAfirmacionComponent } from './pages/reportes-afirmacion/reportes-afirmacion.component';
import { OnBoardingComponent } from './pages/on-boarding/on-boarding.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'app-home', component: HomeComponent,
    canActivate: [AuthGuardService],data: { onBoarding: true },
    children: [
      { path: 'app-inicio', component: InicioComponent, canActivate: [AuthGuardService],data: { role: 'Admin' }  },
      { path: 'app-afirmacion', component: AfirmacionComponent, data: { role: 'Admin' } },
      { path: 'registro-miembro', component: RegistroMiembroComponent, data: { role: 'Admin' } },
      { path: 'app-membrecia', component: MembreciaComponent, data: { role: 'Admin' } },
      { path: 'app-gobierno', component: GobiernoComponent, data: { role: 'Admin' } },
      { path: 'app-reportes-afirmacion', component: ReportesAfirmacionComponent, data: { role: 'Admin' } },
      { path: 'app-metricas-afirmacion', component: MetricasAfirmacionComponent, data: { role: 'Admin' } },
    ]
  },
  { path: 'app-login', component: LoginComponent },
  { path: 'app-on-boarding', component: OnBoardingComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
