import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/firesbase/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit{
  constructor(public authService: AuthService) { }
  ngOnInit() {
    console.log("OnInit LoginPageComponent");    
  }
}
