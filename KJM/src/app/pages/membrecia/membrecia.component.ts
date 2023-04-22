import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import NuevoMiembro from 'src/app/models/nuevoMiembro';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-membrecia',
  templateUrl: './membrecia.component.html',
  styleUrls: ['./membrecia.component.css']
})
export class MembreciaComponent {

  //step 1
  autorizaCompartirInfo: boolean = false;
  numeroDocumento: string = '';

  //step 2
  nombre: string = '';
  telefono: string = '';
  fechaNacimiento: string = '';
  genero: string = '';

  barrio: string = '';
  direccion: string = '';
  correo: string = '';
  redPerteneciente: string = '';

  myFormStep1: FormGroup;

  constructor(
    private _snackBar: MatSnackBar,
    private _firestoreService: FirestoreService,
    private fb: FormBuilder
  ) {
    this.myFormStep1 = this.fb.group({
      formNumeroDocumento: ['', Validators.required]
    });
  }



  crearMiembro() {
    const data: NuevoMiembro = {
      numeroDocumento: this.numeroDocumento,

      nombre: this.nombre,
      telefono: this.telefono,
      fechaNacimiento: this.fechaNacimiento,
      genero: this.genero,

      barrio: this.barrio,
      direccion: this.direccion,
      correo: this.correo,
      redPerteneciente: this.redPerteneciente
    }

    this._firestoreService.crearNuevoMiembro(data);

    this.autorizaCompartirInfo = false;

    this.numeroDocumento = '';

    //step 2
    this.nombre = '';
    this.telefono = '';
    this.fechaNacimiento = '';
    this.genero = '';

    this.barrio = '';
    this.direccion = '';
    this.correo = '';
    this.redPerteneciente = '';

  }

}
