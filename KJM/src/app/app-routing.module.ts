import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MembreciaComponent } from './pages/membrecia/membrecia.component';
import { AfirmacionComponent } from './pages/afirmacion/afirmacion.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { RegistroMiembroComponent } from './pages/registro-miembro/registro-miembro.component';
import { GobiernoComponent } from './pages/gobierno/gobierno.component';
import { MetricasAfirmacionComponent } from './pages/metricas-afirmacion/metricas-afirmacion.component';
import { ReportesAfirmacionComponent } from './pages/reportes-afirmacion/reportes-afirmacion.component';
import { OnBoardingComponent } from './pages/on-boarding/on-boarding.component';
import { NewContentComponent } from './pages/new-content/new-content.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { WelcomeNewUserComponent } from './pages/welcome-new-user/welcome-new-user.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'app-login', component: LoginComponent },
  { path: 'app-on-boarding', component: OnBoardingComponent, canActivate: [AuthGuardService] },
  {
    path: 'app-home', component: HomeComponent,
    canActivate: [AuthGuardService], data: { onBoarding: true },
    children: [
      { path: 'app-welcome-new-user', component: WelcomeNewUserComponent, canActivate: [AuthGuardService], data: { role: ['Nuevo'], onBoarding: true } },
      { path: 'app-inicio', component: InicioComponent, canActivate: [AuthGuardService], data: { role: ['Nuevo', 'Miembro', 'LiderDpto', 'Admin'], onBoarding: true } },
      { path: 'app-afirmacion', component: AfirmacionComponent, canActivate: [AuthGuardService], data: { role: ['Miembro', 'LiderDpto', 'Admin'] } },
      { path: 'registro-miembro', component: RegistroMiembroComponent, canActivate: [AuthGuardService], data: { role: ['Miembro', 'LiderDpto', 'Admin'] } },
      { path: 'app-membrecia', component: MembreciaComponent, canActivate: [AuthGuardService], data: { role: ['Miembro', 'LiderDpto', 'Admin'] } },
      { path: 'app-reportes-afirmacion', component: ReportesAfirmacionComponent, canActivate: [AuthGuardService], data: { role: ['Miembro', 'LiderDpto', 'Admin'] } },
    ]
  },
  {
    path: 'app-new-content', component: NewContentComponent,
    canActivate: [AuthGuardService], data: { role: ['LiderDpto', 'Admin'] },
    children: [
      { path: 'app-membrecia', component: MembreciaComponent, canActivate: [AuthGuardService], data: { role: ['LiderDpto', 'Admin'] } },
    ]
  },
  {
    path: 'app-admin-panel', component: AdminPanelComponent,
    canActivate: [AuthGuardService], data: { role: ['Admin'] },
    children: [
      { path: 'app-gobierno', component: GobiernoComponent, canActivate: [AuthGuardService], data: { role: ['Admin'] } },
      { path: 'app-metricas-afirmacion', component: MetricasAfirmacionComponent, canActivate: [AuthGuardService], data: { role: ['Admin'] } },
    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
