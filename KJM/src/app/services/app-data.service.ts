import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import UserDb from '../models/userDb';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  private userDbSource = new BehaviorSubject<UserDb>({ email: "", listToCall: [], ministerio: "", nombre: "", posicion: "", recordDate: "", rol: [], ubicacion: "", updateDate: "", updateUser: "" });
  userDb$ = this.userDbSource.asObservable();

  updateUserDb(userDb: UserDb) {
    this.userDbSource.next(userDb);
    console.log("Update UserDb", userDb);
  }

  constructor() { }
}
