import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/firesbase/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit{
  constructor(
    public fireAuth: AuthService,
    private router: Router,
    ) { 
    this.fireAuth.isAuth().subscribe( res => {
      if(res){
        console.log('logueado redireccionar al HOME')
        this.router.navigate(['/home']);
      }else{
        console.log('quedarse en login')
        this.router.navigate(['/app-login-page']);
      }
    })
  }
  ngOnInit() {
    console.log("OnInit LoginPageComponent");    
  }
}
