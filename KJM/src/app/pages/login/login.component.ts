import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/firesbase/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  constructor(
    public fireAuth: AuthService,
    private router: Router,
  ) {
    this.fireAuth.isAuth().subscribe(res => {
      if (res) {
        console.log('logueado redireccionar al HOME')
        this.router.navigate(['/app-home']);
      } else {
        console.log('quedarse en login')
      }
    })
  }
  ngOnInit(): void {
    console.log("LoginAuth()");
  }
}