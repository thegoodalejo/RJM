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

@Component({
  selector: 'app-afirmacion',
  templateUrl: './afirmacion.component.html',
  styleUrls: ['./afirmacion.component.css']
})

export class AfirmacionComponent {

  //@Input() childMessage: string;

  //user info
  user: any;

  //para el step 1
  fechaReporte: any;
  //para el dropdown
  personas: Contacto[] = [];
  telPersonaAfirmada: any;
  selectedOption!: string;

  //para el step 2
  //contesta si no 
  personaContesta = false;

  //novedades
  personaNoContesta = false;
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
        this.fireService.getListToCall(this.fireAuth.user?.uid).then((contactos: Contacto[]) => {
          console.log(contactos);
          this.personas = contactos;
        }).catch((error) => {
          console.error(error);
        });
      }
    );
  }


  onSelectionChange() {
    console.log(this.selectedOption);
    const opcionSeleccionada = this.selectedOption;
    console.log(`La opción seleccionada es: ${opcionSeleccionada}`);
    const contactoEncontrado = this.personas.find((contacto) => contacto.nombre === opcionSeleccionada);
    console.log(`Telefono de la opción seleccionada es: ${contactoEncontrado?.telefono}`);
    this.telPersonaAfirmada = contactoEncontrado?.telefono;
  }

  enviarReporte() {
    const data: ToAfirm = {
      fecha: "fechaS",
      afirmador: "afirmadorS",
      personaAfirmada: "toAfirmPersonS",
      descripcion: "descripcionS"
    }

    this.fireService.createNewAfirmacionRecord(data);
  }


}
