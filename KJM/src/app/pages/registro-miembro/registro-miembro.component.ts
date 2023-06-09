import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import NuevoMiembro from 'src/app/models/nuevoMiembro';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/firesbase/auth.service';
import { map } from 'rxjs/operators';
import { MatStepper } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { ConsultService } from 'src/app/services/http/consult.service';
import { AppDataService } from 'src/app/services/app-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registro-miembro',
  templateUrl: './registro-miembro.component.html',
  styleUrls: ['./registro-miembro.component.css']
})
export class RegistroMiembroComponent implements OnInit, OnDestroy {

  formGroup1: FormGroup;
  formGroup2: FormGroup;

  @ViewChild('stepper')
  stepper!: MatStepper;

  //step 1
  autorizaCompartirInfo: boolean = false;

  redes: any[] = [];

  private userDb$: any;
  private subscriptionDb: Subscription = new Subscription;

  constructor(
    private appData: AppDataService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private firestore: FirestoreService,
    private http: ConsultService,
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
      direccion: [''],
      correoElectronico: ['', Validators.email],
      red: ['', Validators.required]
    });

    this.subscriptionDb = this.appData.userDb$.subscribe(
      (userDb) => {
        this.userDb$ = userDb;
      }
    );

  }

  ngOnInit() {
    this.http.obtenerRedes().then(response => {
      this.redes = response;
    });
  }

  ngOnDestroy(): void {
    this.subscriptionDb.unsubscribe();
  }

  nextStep() {
    const currentStep = this.stepper.selectedIndex;
    this.stepper.selectedIndex = currentStep + 1;
  }

  submitForm() {
    if (this.formGroup1.valid && this.formGroup2.valid) {
      this.crearMiembro();
    } else {
      //TODO
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
      redPerteneciente: this.redes.find(red => red.nombre === formValue2.red).id,

      recordDate: Date.now(),
      recordUser: this.userDb$.id,
      updateDate: Date.now(),
      updateUser: this.userDb$.id

    }

    this.http.crearNuevoMiembro(data).then(response => {
      if (response) {
        this.formGroup1.reset();
        this.formGroup2.reset();
        this.stepper.selectedIndex = 0;
      }
    });

    /*this.firestore.crearNuevoMiembro(data).then(ok => {
      if (ok) {
        this.autorizaCompartirInfo = false;
        this.formGroup1.reset();
        this.formGroup2.reset();
      }
    });*/

  }

}
