import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subscription, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AppDataService } from './app-data.service';
import UserDb from '../models/userDb';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  userAuth$: any;
  userDb$: any;

  private subscriptionAuth: Subscription = new Subscription;
  private subscriptionDb: Subscription = new Subscription;

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
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

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const requiredRole = next.data['role'];
    console.log("Actual userDb", this.userDb$);

    console.log("requiredRole", requiredRole);
    return this.fireAuth.authState.pipe(
      map((user) => {
        console.log("AuthGuard", user?.uid);
        if (user) {
          return true;
        } else {
          // Si el usuario no está autenticado, redirige al usuario a la página de inicio de sesión
          this.router.navigate(['/app-login']);
          console.log("Noooope");
          return false;
        }
      })
    );
  }

  private hasRequiredRoles(userRoles: string[], requiredRoles: string[]): boolean {
    // Verifica si el usuario tiene al menos uno de los roles requeridos
    return userRoles.some(role => requiredRoles.includes(role));
  }
}
