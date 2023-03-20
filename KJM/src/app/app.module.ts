import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
