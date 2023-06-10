import { Component, } from '@angular/core';
import { AuthService } from '../../services/firesbase/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import UserDb from 'src/app/models/userDb';
import { AppDataService } from 'src/app/services/app-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  user: any;

  userImageURL: any = '';
  userDbInfo: any;

  isDeptoLider: boolean = false;
  isAfirmador: boolean = false;
  isAdmin: boolean = false;
  isMiembro: boolean = false;


  constructor(
    public fireAuth: AuthService,
    private router: Router,
    private _firestore: FirestoreService,
    private _appData: AppDataService
  ) {
    this.fireAuth.isAuth().pipe(
      map((user) => {
        if (user) {
          // Si el usuario está autenticado, almacena su información en la variable user
          this.user = user;
          this.userImageURL = user.photoURL;
          
          this._firestore.getUserDbInfo(user.uid).then(
            (response => {
              
              this.userDbInfo = response as UserDb;
              console.log("User basic info", this.userDbInfo);
              if (this.userDbInfo.rol.includes('LiderDpto')) {
                this.isDeptoLider = true;
              } 
              if (this.userDbInfo.rol.includes('Afirmador')) {
                this.isAfirmador = true;
              } 
              if (this.userDbInfo.rol.includes('Admin')) {
                this.isAdmin = true;
              } 
              if (this.userDbInfo.rol.includes('Miembro')) {
                this.isMiembro = true;
              } 

              this._appData.updateUserDb(response);
            })
          ).catch(error => console.log('Error al consultar usuario', error));
        } else {
          // Si el usuario no está autenticado, establece la variable user en null
          this.user = null;
        }
      })
    ).subscribe();
  }

  roleCheck(role:string){
    try {
      return this.userDbInfo.rol.includes(role);
    } catch (error) {
      return false;
    }
    
  }

}

