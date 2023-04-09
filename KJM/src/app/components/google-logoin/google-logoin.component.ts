import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/firesbase/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google-logoin',
  templateUrl: './google-logoin.component.html',
  styleUrls: ['./google-logoin.component.css']
})
export class GoogleLogoinComponent {
  constructor(
    public fireAuth: AuthService
  ) {
    
  }
}
