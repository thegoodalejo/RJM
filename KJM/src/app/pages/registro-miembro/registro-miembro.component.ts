import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import NuevoMiembro from 'src/app/models/nuevoMiembro';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/firesbase/auth.service';
import { map } from 'rxjs/operators';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-registro-miembro',
  templateUrl: './registro-miembro.component.html',
  styleUrls: ['./registro-miembro.component.css']
})
export class RegistroMiembroComponent {

  formGroup1: FormGroup;
  formGroup2: FormGroup;

  @ViewChild('stepper')
  stepper!: MatStepper;

  //user info
  //user: any;


  //step 1
  autorizaCompartirInfo: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private firestore: FirestoreService,
    private _authService: AuthService,
  ) {

    this.formGroup1 = this.formBuilder.group({
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      genero: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      invitador: ['', Validators.required]
    });

    this.formGroup2 = this.formBuilder.group({
      barrio: ['', Validators.required],
      direccion: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      red: ['', Validators.required]
    });

  }

  nextStep() {
    const currentStep = this.stepper.selectedIndex;
    this.stepper.selectedIndex = currentStep + 1;
  }

  submitForm() {
    // Aquí puedes realizar la lógica para enviar el formulario
    if (this.formGroup1.valid && this.formGroup2.valid) {
      // Ejemplo de enviar el formulario a través de una función de servicio o API
      console.log('Formulario válido. Enviar datos:', this.formGroup1.value, this.formGroup2.value);
      this.crearMiembro();
    } else {
      console.log('Formulario inválido. Por favor, complete todos los campos obligatorios.');
    }
  }

  crearMiembro() {
    const formValue1 = this.formGroup1.value;
    const formValue2 = this.formGroup2.value;

    const fechaNacimiento = formValue1.fechaNacimiento;
    const fechaNacimientoMilisegundos = fechaNacimiento instanceof Date ? fechaNacimiento.getTime() : null;

    const data: NuevoMiembro = {

      nombre: formValue1.nombre,
      telefono: formValue1.telefono,
      fechaNacimiento: fechaNacimientoMilisegundos,
      genero: formValue1.genero,
      quienLoInvito: formValue1.invitador,
      barrio: formValue2.barrio,
      direccion: formValue2.direccion || '',
      correo: formValue2.correoElectronico || '',
      redPerteneciente: formValue2.red || '',
      historialAfirmacion: [],

      recordDate: Date.now(),
      recordUser: "-",
      updateDate: Date.now(),
      updateUser: "-"
    }

    this.firestore.crearNuevoMiembro(data).then(ok => {
      if (ok) {
        this.autorizaCompartirInfo = false;
        this.formGroup1.reset();
        this.formGroup2.reset();
      }
    });
  }

}
