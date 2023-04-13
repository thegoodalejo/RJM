import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/firesbase/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  user: any;
  userImageURL: any = '';


  constructor(
    public fireAuth: AuthService,
    private router: Router
  ) {
    this.fireAuth.isAuth().pipe(
      map((user) => {
        if (user) {
          // Si el usuario está autenticado, almacena su información en la variable user
          this.user = user;
          this.userImageURL = user.photoURL;
        } else {
          // Si el usuario no está autenticado, establece la variable user en null
          this.user = null;
        }
      })
    ).subscribe();

    
  }

}
