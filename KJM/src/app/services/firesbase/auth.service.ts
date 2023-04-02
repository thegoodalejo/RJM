import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { FirestoreService } from './firestore.service';

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
    } catch (error) {
      console.log(error);
    }

    this.fireStore.getCollection();
  }

  async AuthLogOut(){
    await this.fireAuth.signOut();
  }
  isAuth(){
    return this.fireAuth.authState;
  }
}