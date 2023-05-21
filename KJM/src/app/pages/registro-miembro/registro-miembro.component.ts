import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import NuevoMiembro from 'src/app/models/nuevoMiembro';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-miembro',
  templateUrl: './registro-miembro.component.html',
  styleUrls: ['./registro-miembro.component.css']
})
export class RegistroMiembroComponent {
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
    private fb: FormBuilder
  ) {
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
      registroDate: Date.now()

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
