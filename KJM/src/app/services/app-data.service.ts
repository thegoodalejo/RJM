import firebase from 'firebase/compat';

import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import UserDb from '../models/userDb';
import { AppData } from '../models/appData';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  private staticAppData: AppData = {
    isNewUser: false
  };


  private userAuthSource = new BehaviorSubject<firebase.User | null>(null);
  userAuth$ = this.userAuthSource.asObservable();

  private userDbSource = new BehaviorSubject<UserDb>({ onBoarding: false, lastConection: "", email: "", listToCall: [], ministerio: "", nombre: "", posicion: "", recordDate: "", rol: [], ubicacion: "", updateDate: "", updateUser: "" });
  userDb$ = this.userDbSource.asObservable();

  updateUserDb(userDb: UserDb) {
    this.userDbSource.next(userDb);
    console.log("SomeUpdate");
  }

  async updateOnBoading(data: any) {
    this.userDb$.pipe(take(1)).subscribe(userDb => {
      userDb.onBoarding = data.onBoarding;
      userDb.ministerio = data.ministerio;
      userDb.ubicacion = data.ubicacion;
      this.userDbSource.next(userDb);
    });
  }

  updateUserAuth(userAuth: firebase.User) {
    this.userAuthSource.next(userAuth);
  }

  getUserDb() {
    return this.userDbSource.asObservable();
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
