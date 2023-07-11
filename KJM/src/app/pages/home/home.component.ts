import { Component, HostBinding, ViewChild, } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { AuthService } from '../../services/firesbase/auth.service';
import { AppDataService } from 'src/app/services/app-data.service';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { AppData } from 'src/app/models/appData';
import { ConsultService } from 'src/app/services/http/consult.service';
import { response } from 'express';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('500ms ease-in')),
    ]),
  ]
})
export class HomeComponent {

  @HostBinding('@fadeIn') fadeIn = false;
  @ViewChild('sidenav')
  sidenav!: MatSidenav;

  userAuth$: any;
  userDb$: any;
  
  title: string = "Welcome to Kingdom";

  isNuevo: boolean = true;
  isMiembro: boolean = false;
  isLiderDpto: boolean = false;
  isAdmin: boolean = false;

  private subscriptionAuth: Subscription = new Subscription;
  private subscriptionDb: Subscription = new Subscription;

  constructor(
    public fireAuth: AuthService,
    private http: ConsultService,
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
        if (userDb.id > 0)
          this.http.obtenerAppData(this.userDb$.id_sede).then(response => {
            this.title = response.nombre;
            this.isNuevo = this.roleCheck(['Nuevo']);

            this.isMiembro = this.roleCheck(['Miembro', 'LiderDpto', 'Admin']);
            this.isLiderDpto = this.roleCheck(['LiderDpto', 'Admin']);
            this.isAdmin = this.roleCheck(['Admin']);
          });
      }
    );



  }


  roleCheck(role: string[]) {
    try {
      return role.includes(this.userDb$.rol);
    } catch (error) {
      return false;
    }

  }

  closeNav() {
    this.sidenav.close();
  }

}


