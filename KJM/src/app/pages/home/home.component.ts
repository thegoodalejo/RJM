import { Component } from '@angular/core';
import { AuthService } from '../../services/firesbase/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(
    private fireAuth: AuthService,
    private router:Router
    ){
    this.fireAuth.isAuth().subscribe( res => {
      if(res){
        console.log('logueado quedarse en HOME')
      }else{
        console.log('redireccionar al login')
        this.router.navigate(['/app-login']);
      }
    })
  }

}
