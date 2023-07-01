import { Component, OnInit, } from '@angular/core';

import { AuthService } from '../../services/firesbase/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import UserDb from 'src/app/models/userDb';
import { AppDataService } from 'src/app/services/app-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  userAuth$: any;
  userDb$: any;

  private subscriptionAuth: Subscription = new Subscription;
  private subscriptionDb: Subscription = new Subscription;

  constructor(
    public fireAuth: AuthService,
    private router: Router,
    private firestore: FirestoreService,
    private appData: AppDataService
  ) {
    this.subscriptionAuth = this.appData.userAuth$.subscribe(
      (userAuth) => {
        this.userAuth$ = userAuth;
      }
    );
    this.subscriptionDb = this.appData.userDb$.subscribe(
      (userDb) => {
        this.userDb$ = userDb;
      }
    );
  }


  roleCheck(role:string){
    try {
      return this.userDb$.rol.includes(role);
    } catch (error) {
      return false;
    }
    
  }

}


