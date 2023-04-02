import { Component } from '@angular/core';
import { AuthService } from '../../services/firesbase/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google-logout',
  templateUrl: './google-logout.component.html',
  styleUrls: ['./google-logout.component.css']
})
export class GoogleLogoutComponent {
  constructor(
    public fireAuth: AuthService,
    private router: Router,
  ){
    
  }

}
