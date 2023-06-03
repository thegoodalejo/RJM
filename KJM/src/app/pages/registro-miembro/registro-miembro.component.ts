import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import NuevoMiembro from 'src/app/models/nuevoMiembro';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/firesbase/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-registro-miembro',
  templateUrl: './registro-miembro.component.html',
  styleUrls: ['./registro-miembro.component.css']
})
export class RegistroMiembroComponent {

  //user info
  user: any;


  //step 1
  autorizaCompartirInfo: boolean = false;

  //step 2
  nombre: string = '';
  telefono: string = '';
  fechaNacimiento: any = '';
  genero: string = '';
  quienLoInvito: string = '';

  barrio: string = '';
  direccion: string = '';
  correo: string = '';
  redPerteneciente: string = '';

  myFormStep1: FormGroup;

  constructor(
    private _snackBar: MatSnackBar,
    private _firestoreService: FirestoreService,
    private fb: FormBuilder,
    private _authService: AuthService,
  ) {
    
    console.log("Poderoso constructor");
    this._authService.isAuth().pipe(
      map((user) => {
        if (user) {
          // Si el usuario está autenticado, almacena su información en la variable user
          this.user = user;
          console.log("RegistroMiembroComponent tiene la info del usuario " + user.displayName);
        } else {
          // Si el usuario no está autenticado, establece la variable user en null
          this.user = null;
          console.log("User Null");
        }
      })
    ).subscribe();

    this.myFormStep1 = this.fb.group({
      formNumeroDocumento: ['', Validators.required]
    });
  }



  crearMiembro() {
    const datePickerLocal = this.fechaNacimiento as Date;
    const data: NuevoMiembro = {

      nombre: this.nombre,
      telefono: this.telefono,
      fechaNacimiento: datePickerLocal.getTime(),
      genero: this.genero,
      quienLoInvito: this.quienLoInvito,

      barrio: this.barrio,
      direccion: this.direccion,
      correo: this.correo,
      redPerteneciente: this.redPerteneciente,

      historialAfirmacion: [],

      recordDate: Date.now(),
      recordUser: this.user.displayName,
      updateDate: Date.now(),
      updateUser: this.user.displayName
    }

    this._firestoreService.crearNuevoMiembro(data);

    this.autorizaCompartirInfo = false;

    //step 2
    this.nombre = '';
    this.telefono = '';
    this.fechaNacimiento = '';
    this.genero = '';
    this.quienLoInvito = '';

    this.barrio = '';
    this.direccion = '';
    this.correo = '';
    this.redPerteneciente = '';

  }

}
