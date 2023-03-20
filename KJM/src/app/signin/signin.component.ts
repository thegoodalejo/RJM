import { Component,OnInit } from '@angular/core';
import { AuthService } from '../services/firestore/auth.service';
import { AngularFireAuth  } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit{
  constructor(public authService: AuthService) {
    
  }
  ngOnInit() {}
}
