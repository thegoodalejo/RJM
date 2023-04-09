import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { firstValueFrom, from } from 'rxjs';
import { FirestoreService } from './firestore.service';
import User from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private user!: firebase.auth.UserCredential;

  constructor(
    private fireAuth: AngularFireAuth, // Inject Firebase auth service
    private fireStore: FirestoreService,
  ) {
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
      this.user = result;
      console.log(this.user.user?.displayName);
      console.log(this.user.user?.uid);
      console.log(this.user.user?.email);

      this.fireStore.createNewUser(this.user.user);

    } catch (error) {
      console.log(error);
    }
  }

  async AuthLogOut() {
    await this.fireAuth.signOut();
  }

  isAuth() {
    return this.fireAuth.authState;
  }

  getCurrentUserId(){
    //console.log("dfghjkljhgfdsfghjk" + this.user.user?.uid?.toString());
    return this.user.user?.uid?.toString();
  }

  getCurrentUserName(){
    //console.log("Retornando getCurrentUserName " + this.user.user?.displayName)
    return  this.user.user?.displayName?.toString();
  }
}