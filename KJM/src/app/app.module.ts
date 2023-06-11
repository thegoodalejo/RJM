import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { HomeComponent } from './pages/home/home.component';
import { GoogleLogoutComponent } from './components/google-logout/google-logout.component';
import { GoogleLogoinComponent } from './components/google-logoin/google-logoin.component';
import { LoginComponent } from './pages/login/login.component';
import { AfirmationFormComponent } from './components/afirmation-form/afirmation-form.component';
import { AfirmacionComponent } from './pages/afirmacion/afirmacion.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { MembreciaComponent } from './pages/membrecia/membrecia.component';
import { DatePipe } from '@angular/common';
import { RegistroMiembroComponent } from './pages/registro-miembro/registro-miembro.component';
import { DetalleReporteAfirmacionComponent } from './PopupModals/detalle-reporte-afirmacion/detalle-reporte-afirmacion.component';
import { DetalleMiembroComponent } from './PopupModals/detalle-miembro/detalle-miembro.component';
import { GobiernoComponent } from './pages/gobierno/gobierno.component';
import { DetalleUsuarioComponent } from './PopupModals/detalle-usuario/detalle-usuario.component';
import { ActualizarRolComponent } from './PopupModals/actualizar-rol/actualizar-rol.component';
import { AsignarAfirmacionComponent } from './PopupModals/asignar-afirmacion/asignar-afirmacion.component';


// TODO: Compilacion => ng build --configuration production
// TODO: Deploy => firebase deploy

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQZoC1ktOp1Sj9wJDDOEYgPgcvobVZsmY",
  authDomain: "fireapp-ce836.firebaseapp.com",
  databaseURL: "https://fireapp-ce836.firebaseio.com",
  projectId: "fireapp-ce836",
  storageBucket: "fireapp-ce836.appspot.com",
  messagingSenderId: "531112492033",
  appId: "1:531112492033:web:fac68f4bdd8950b8381400"
};

const clientID = "531112492033-62s1p3seii4v2ebjing18tlmhr0s9ift.apps.googleusercontent.com";
const secretID = "qhNUIZYDMJF-xUFtKd7Jdrpm";
// Initialize Firebase
const app = initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    GoogleLogoutComponent,
    GoogleLogoinComponent,
    AfirmationFormComponent,
    AfirmacionComponent,
    NotFoundComponent,
    NavBarComponent,
    InicioComponent,
    MembreciaComponent,
    RegistroMiembroComponent,
    DetalleReporteAfirmacionComponent,
    DetalleMiembroComponent,
    GobiernoComponent,
    DetalleUsuarioComponent,
    ActualizarRolComponent,
    AsignarAfirmacionComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatStepperModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatDialogModule
  ],
  providers: [DatePipe,],
  bootstrap: [AppComponent]
})
export class AppModule { }
