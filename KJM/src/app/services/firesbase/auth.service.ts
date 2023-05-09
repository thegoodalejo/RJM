import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { firstValueFrom, from } from 'rxjs';
import { FirestoreService } from './firestore.service';
import User from 'src/app/models/userDb';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  user!: firebase.User;

  constructor(
    private fireAuth: AngularFireAuth, // Inject Firebase auth service
    private fireStore: FirestoreService,
    private router: Router
  ) {
    this.fireAuth.authState.subscribe(user => {
      if(user)
      this.user = user
    });
  }
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  async AuthLogin(provider: GoogleAuthProvider | firebase.auth.AuthProvider) {
    try {
      const result = await this.fireAuth
        .signInWithPopup(provider);
      console.log('You have been successfully logged in!');

      this.fireStore.createNewUser(this.user?.uid);

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

 /* getCurrentUserId(){
    //console.log("dfghjkljhgfdsfghjk" + this.user.user?.uid?.toString());
    return this.user.user?.uid?.toString();
  }

  getCurrentUserName(){
    //console.log("Retornando getCurrentUserName " + this.user.user?.displayName)
    return  this.user.user?.displayName?.toString();
  }*/
}