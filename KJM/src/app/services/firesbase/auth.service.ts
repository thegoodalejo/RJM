import { Injectable, OnInit } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { FirestoreService } from './firestore.service';
import { Router } from '@angular/router';
import { AppDataService } from '../app-data.service';
import UserDb from 'src/app/models/userDb';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ConsultService } from '../http/consult.service';
import { MatDialog } from '@angular/material/dialog';
import { LoadingModalComponent } from 'src/app/components/loading-modal/loading-modal.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private dialogRef: any;

  private userAuth$: any;
  private userDb$: any;

  constructor(
    private fireAuth: AngularFireAuth, // Inject Firebase auth service
    private firestore: AngularFirestore,
    private http: ConsultService,
    private appData: AppDataService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.dialogRef = this.dialog.open(LoadingModalComponent, {
      disableClose: true,
      panelClass: 'custom-modal-container' // Ajusta el nombre de la clase según tus estilos
    });
    this.dialogRef.componentInstance.open('loading');
    this.fireAuth.authState.subscribe(userAuth => {
      this.userAuth$ = userAuth;
      if (userAuth) {
        this.appData.updateUserAuth(userAuth);
        const data = {
          'id_firebaseRef': this.userAuth$.uid,
          'email': this.userAuth$.email,
          'phoneNumber': this.userAuth$.phoneNumber,
          'displayName': this.userAuth$.displayName
        }
        const response = this.http.obtenerUsuarioIndividual(data);
      }else{
        console.log("Auth else");
      }
    });

  }

  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  async AuthLogin(provider: GoogleAuthProvider | firebase.auth.AuthProvider) {
    try {
      await this.fireAuth
        .signInWithPopup(provider).then(result => {
          console.log('You have been successfully logged in!');
        });
    } catch (error) {
      console.log(error);
    }
  }

  async AuthLogOut() {
    await this.fireAuth.signOut();
    this.router.navigate(['/app-login']);
  }

  isAuth() {
    return this.fireAuth.authState;
  }
}