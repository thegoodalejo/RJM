import firebase from 'firebase/compat';

import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import UserDb from '../models/userDb';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  private userAuthSource = new BehaviorSubject<firebase.User | null>(null);
  userAuth$ = this.userAuthSource.asObservable();

  private userDbSource = new BehaviorSubject<UserDb>({ onBoarding: false, lastConection: "", email: "", listToCall: [], ministerio: "", nombre: "", posicion: "", recordDate: "", rol: [], ubicacion: "", updateDate: "", updateUser: "" });
  userDb$ = this.userDbSource.asObservable();

  updateUserDb(userDb: UserDb) {
    this.userDbSource.next(userDb);
    console.log("Update UserDb", userDb);
  }

  updateOnBoading(data:any){
    this.userDb$.pipe(take(1)).subscribe(userDb => {
      userDb.onBoarding = data.onBoarding;
      userDb.ministerio = data.ministerio;
      userDb.ubicacion = data.ubicacion;
      this.userDbSource.next(userDb);
    });
  }

  updateUserAuth(userAuth: firebase.User) {
    this.userAuthSource.next(userAuth);
    console.log("Update UserAuth", userAuth);
  }

  constructor() { }
}
