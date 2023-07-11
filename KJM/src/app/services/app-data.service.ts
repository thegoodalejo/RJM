import firebase from 'firebase/compat';

import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import UserDb from '../models/userDb';
import { AppData } from '../models/appData';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  constructor(private router: Router) {

  }

  private staticAppData: AppData = {
    sedeNombre: "Welcom to Kingdom",
    usuarioNombre: "Pablo"
  };


  private userAuthSource = new BehaviorSubject<firebase.User | null>(null);
  userAuth$ = this.userAuthSource.asObservable();

  private userDbSource = new BehaviorSubject<UserDb>(
    {
      id: 0,

      id_ministerio: 1,
      id_sede: 1,

      id_firebaseRef: "0",

      displayName: "Kingdom",
      email: "",
      numeroTelefonico: "",

      activo: false,
      onBoarding: 1,

      recDate: "",
      rol: "Nuevo"
    }
  );
  userDb$ = this.userDbSource.asObservable();

  updateUserDb(userDb: UserDb) {
    if (userDb.id > 0) {

      this.userDbSource.next(userDb);

      if (userDb.rol.length > 0) {
        
        if (userDb.onBoarding > 0) {
          
          this.router.navigate(['/app-home/app-inicio']);
        } else {
          
          this.router.navigate(['/app-on-boarding']);
        }
      } else {
        console.log("Req Auth", userDb.id);
      }



    } else {
      console.log("DenyuserDb");
    }

  }

  async updateOnBoading(data: any) {
    this.userDb$.pipe(take(1)).subscribe(userDb => {
      userDb.onBoarding = data.onBoarding;
      userDb.id_ministerio = data.id_ministerio;
      userDb.id_sede = data.id_sede;
      console.log("updateUserDb INC", userDb);
      this.userDbSource.next(userDb);
    });
  }

  updateUserAuth(userAuth: firebase.User) {
    this.userAuthSource.next(userAuth);
  }

  getStaticData(): AppData {
    return this.staticAppData;
  }

  async updateStaticData(updatedData: any): Promise<any> {
    console.log("AppStaticData", updatedData);
    this.staticAppData = { ...this.staticAppData, ...updatedData };
    return;
  }
}
