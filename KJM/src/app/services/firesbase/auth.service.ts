import { Injectable, OnInit } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { FirestoreService } from './firestore.service';
import { Router } from '@angular/router';
import { AppDataService } from '../app-data.service';
import UserDb from 'src/app/models/userDb';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;

  private userAuth$: any;
  private userDb$: any;
  
  constructor(
    private fireAuth: AngularFireAuth, // Inject Firebase auth service
    private firestore: AngularFirestore,
    private appData: AppDataService,
    private router: Router
  ) {
    console.log("AuthService constr");
    this.doStuff();
    
  }

  async doStuff(){
    this.fireAuth.authState.subscribe(userAuth => {
      this.userAuth$ = userAuth;
      if (userAuth) {
        this.appData.updateUserAuth(userAuth);
        //user check
        const userRef = this.firestore.collection('usuarios').doc(this.userAuth$.uid);
        userRef.get().subscribe(userTmp => {
          if (userTmp.exists) {
            this.userDb$ = userTmp;
            this.appData.updateUserDb(userTmp.data() as UserDb);
          } else {
            const data: UserDb = {
              onBoarding: false,
              lastConection: Date.now(),
              nombre: this.userAuth$.displayName,
              email: this.userAuth$.email,
              rol: ["Nuevo"],
              ministerio: '',
              ubicacion: '',
              posicion: '',
              listToCall: [],
              recordDate: Date.now(),
              updateDate: Date.now(),
              updateUser: this.userAuth$.displayName
            };
            userRef.set(data).then(() => {
              console.log("Create response");
              userRef.get().subscribe(userTmp => {
                this.userDb$ = userTmp;
                this.appData.updateUserDb(userTmp.data() as UserDb);
              });
            }).catch(err => {
              console.log("Error => ", err);
            });
          }

        });
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
          console.log('You have been successfully logged in!', result);
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