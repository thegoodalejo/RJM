import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Contacto } from 'src/app/models/contacto';
import { AuthService } from 'src/app/services/firesbase/auth.service';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import { HomeComponent } from '../home/home.component';
import { MatStepper } from '@angular/material/stepper';
import { map } from 'rxjs/operators';
import ToAfirm from 'src/app/models/afirmacionList';
import { ActivatedRoute } from '@angular/router';
import NuevoMiembro from 'src/app/models/nuevoMiembro';
import AfirmacionReporte from 'src/app/models/afirmacionReporte';
import firebase from 'firebase/compat';
import ObjectWithReference from 'src/app/models/objectWithReferenc';

@Component({
  selector: 'app-afirmacion',
  templateUrl: './afirmacion.component.html',
  styleUrls: ['./afirmacion.component.css']
})

export class AfirmacionComponent {

  //@Input() childMessage: string;

  //user info
  user: any;

  //para el dropdown
  personas: ObjectWithReference<NuevoMiembro>[] = [];
  telPersonaAfirmada: any;
  selectedOption!: string;

  //para el step 1
  personaRef!: firebase.firestore.DocumentReference;
  fechaReporte: any;

  //para el step 2
  //contesta si no 
  personaContesta = false;

  //novedades
  personaNoContesta = false;
  noContestaSeDejaMensaje = false;
  personaNumeroIncorrecto = false;
  personaFueraDeLaCiudad = false;
  personaOtraIglesia = false;

  //si contesta, entonces
  personaInteresada = false;
  personaAsistira = false;
  personaPideOracion = false;

  //para el step 3
  reporteOracion = '';
  reporteGeneral = '';

  constructor(
    private route: ActivatedRoute,
    private fireService: FirestoreService,
    private fireAuth: AuthService,
    private home: HomeComponent) {

    this.fireAuth.isAuth().pipe(
      map((user) => {
        if (user) {
          // Si el usuario está autenticado, almacena su información en la variable user
          this.user = user;
          console.log("AfirmacionComponent tiene la info del usuario " + user.displayName);
        } else {
          // Si el usuario no está autenticado, establece la variable user en null
          this.user = null;
        }
      })
    ).subscribe(
      () => {
        this.fireService.listaPersonasAfirmacion(this.fireAuth.user?.uid).then(obj => {
          this.personas = obj.objetosMostrables;
        });
      }
    );
  }


  onSelectionChange() {
    console.log(this.selectedOption);
    const opcionSeleccionada = this.selectedOption;
    console.log(`La opción seleccionada es: ${opcionSeleccionada}`);
    const contactoEncontrado = this.personas.find((contacto) => contacto.objeto.nombre === opcionSeleccionada);
    console.log(`Telefono de la opción seleccionada es: ${contactoEncontrado?.objeto.telefono}`);
    if(contactoEncontrado){
      this.personaRef = contactoEncontrado.id;
      this.telPersonaAfirmada = contactoEncontrado.objeto.telefono;
    }
  }

  enviarReporte() {
    const data: AfirmacionReporte = {
      //Info
      personaRef: this.personaRef,
      afirmador: this.user.displayName,
      afirmadorID: this.user.uid,
      fechaReporte: this.fechaReporte,

      personaContesta: this.personaContesta,

      //novedades
      personaNoContesta: this.personaNoContesta,
      noContestaSeDejaMensaje: this.noContestaSeDejaMensaje,
      personaNumeroIncorrecto: this.personaNumeroIncorrecto,
      personaFueraDeLaCiudad: this.personaFueraDeLaCiudad,
      personaOtraIglesia: this.personaOtraIglesia,

      //si contesta, entonces
      personaInteresada: this.personaInteresada,
      personaAsistira: this.personaAsistira,
      personaPideOracion: this.personaPideOracion,

      //para el step 3
      reporteOracion: this.reporteOracion,
      reporteGeneral: this.reporteGeneral
    }

    this.fireService.createNewAfirmacionRecord(data);

  }


}
