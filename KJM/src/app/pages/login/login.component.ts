import { Component } from '@angular/core';
import { AuthService } from '../../services/firesbase/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    public fireAuth: AuthService,
    private router: Router,
  ) {
    this.fireAuth.isAuth().subscribe(res => {
      if (res) {
        console.log('logueado redireccionar al HOME')
        this.router.navigate(['/home']);
      } else {
        console.log('quedarse en login')
        this.router.navigate(['/app-login-page']);
      }
    })
  }
}