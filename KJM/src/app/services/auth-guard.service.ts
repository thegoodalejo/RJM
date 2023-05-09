import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    return this.auth.authState.pipe(
      map((user) => {
        if (user) {
          // Si el usuario está autenticado, permite el acceso
          console.log("User autentikado ?");
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
}
