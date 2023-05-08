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
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface Reporte {
  fecha: string;
  nombre: string;
  constesta: boolean;
  afirmador: string;
}

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
  //para el grid
  reportes: ObjectWithReference<AfirmacionReporte>[] = [];
  displayedColumns: string[] = ['fecha', 'afirmador'];
  dataSource: Reporte[] = [];


  //
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
    private home: HomeComponent,
    private _snackBar: MatSnackBar,) {

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
    if (contactoEncontrado) {
      this.personaRef = contactoEncontrado.id;
      console.log("Antes de llamar el servicio, Data => ", contactoEncontrado.id.id);
      this.fireService.listaReportesAfirmacion(contactoEncontrado.id.id).then(obj => {
        this.reportes = obj.objetosMostrables;
        const dataSource2: Reporte[] = [];
        obj.objetosMostrables.forEach(rep => {
          const fecha = new Date(rep.objeto.fechaReporte);
          console.log(rep.objeto.fechaReporte);
          const dia = fecha.getDate().toString().padStart(2, "0"); // Se obtiene el día y se rellena con cero a la izquierda si es necesario
          const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // Se obtiene el mes y se rellena con cero a la izquierda si es necesario (se suma 1 porque los meses en JavaScript comienzan en 0)
          const anio = fecha.getFullYear().toString(); // Se obtiene el año
          const fechaString = `${dia}/${mes}/${anio}`; // Se concatena la fecha en el formato deseado
          console.log(fechaString); // "09/05/2023"
          const report: Reporte = {
            fecha: fechaString,
            nombre: contactoEncontrado.objeto.nombre,
            constesta: rep.objeto.personaContesta,
            afirmador: rep.objeto.afirmador
          }
          dataSource2.push(report);
          console.log("Creado =>", report)
          this.dataSource = dataSource2;
        });
      });
      this.telPersonaAfirmada = contactoEncontrado.objeto.telefono;
    }
  }

  enviarReporte() {

    const data: AfirmacionReporte = {
      registroDate: this.fireService.getTimeStamp(),
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
    if (!this.fechaReporte) {
      this._snackBar.open('Fecha invalida', 'Cerrar',
        {
          duration: 3000
        }
      );
      return;
    }
    if (!this.selectedOption) {
      this._snackBar.open('Seleccione Persona', 'Cerrar',
        {
          duration: 3000
        }
      );
      return;
    }
    this.fireService.createNewAfirmacionRecord(data);
    this.fechaReporte = '';
    this.selectedOption = '';

    this.personaContesta = false;

    //novedades
    this.personaNoContesta = false;
    this.noContestaSeDejaMensaje = false;
    this.personaNumeroIncorrecto = false;
    this.personaFueraDeLaCiudad = false;
    this.personaOtraIglesia = false;

    //si contesta, entonces
    this.personaInteresada = false;
    this.personaAsistira = false;
    this.personaPideOracion = false;

    //para el step 3
    this.reporteOracion = '';
    this.reporteGeneral = '';

    this.dataSource = [];

  }
  
}
