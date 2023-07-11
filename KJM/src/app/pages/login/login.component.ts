import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { AuthService } from '../../services/firesbase/auth.service';
import { Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AppDataService } from 'src/app/services/app-data.service';
import { MatDialog } from '@angular/material/dialog';
import { LoadingModalComponent } from 'src/app/components/loading-modal/loading-modal.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import { ConsultService } from 'src/app/services/http/consult.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('500ms ease-in')),
    ]),
  ]
})
export class LoginComponent implements OnDestroy {

  darkMode: boolean = false;

  userAuth$: any;
  userDb$: any;

  private subscriptionAuth: Subscription = new Subscription;
  private subscriptionDb: Subscription = new Subscription;

  constructor(
    public fireAuth: AuthService,
    private fireStore: FirestoreService,
    private http: ConsultService,
    private router: Router,
    private appData: AppDataService,
    public platform: Platform,
    private dialog: MatDialog
  ) {
    
    this.subscriptionDb = this.appData.userDb$.subscribe(
      (userDb) => {
        this.userDb$ = userDb;
      }
    );
    
    this.subscriptionAuth = this.appData.userAuth$.subscribe(
      (userAuth) => {
        this.userAuth$ = userAuth;
      }
    );
  }

  toggleMode(): void {
    this.darkMode = !this.darkMode;
    console.log("Togle Dark",this.darkMode);
  }

  ngOnDestroy(): void {
    this.subscriptionAuth.unsubscribe();
  }
}