import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DetalleReporteAfirmacionComponent } from 'src/app/PopupModals/detalle-reporte-afirmacion/detalle-reporte-afirmacion.component';
import { Subscription } from 'rxjs';
import UserDb from 'src/app/models/userDb';
import { AppDataService } from 'src/app/services/app-data.service';
import DetalleAfirmador from 'src/app/models/detalleAfirmador';

export interface Reporte {
  fecha: any;
  constesta: boolean;
  afirmador: string;
  id: firebase.firestore.DocumentReference;
}

@Component({
  selector: 'app-afirmacion',
  templateUrl: './afirmacion.component.html',
  styleUrls: ['./afirmacion.component.css']
})

export class AfirmacionComponent implements OnDestroy {

  userDb!: UserDb;
  private subscription: Subscription = new Subscription;


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
    private _firestore: FirestoreService,
    private fireAuth: AuthService,
    private home: HomeComponent,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _appData: AppDataService) {

    this.subscription = this._appData.userDb$.subscribe(
      (userDb) => {
        this.userDb = userDb;
        console.log("New subscription", this.userDb);
      }
    );

    const objetoPpal: DetalleAfirmador = {
      nombre: '',
      listToCall: [],
      objetosMostrables: []
    };

    this.userDb.listToCall.forEach(member => {

      this._firestore.getDocFromRef(member).then(docSnap => {

        const datosDoc = docSnap.data() as NuevoMiembro;
        const data: ObjectWithReference<NuevoMiembro> = {
          id: member,
          objeto: datosDoc
        }
        // Agregar el objeto a la lista de objetos mostrables
        objetoPpal.objetosMostrables.push(data);
        console.log("Push Data", data);
      })
    })

    this.personas = objetoPpal.objetosMostrables; 

    this.fechaReporte = Date.now();
    console.log("this.fechaReporte", this.fechaReporte);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
      this._firestore.listaReportesAfirmacion(contactoEncontrado.id.id).then(obj => {
        this.reportes = obj.objetosMostrables;
        const dataSource2: Reporte[] = [];
        obj.objetosMostrables.forEach(rep => {
          console.log("Timestamp obj", rep.objeto.fechaReporte);
          const report: Reporte = {
            fecha: rep.objeto.fechaReporte,
            constesta: rep.objeto.personaContesta,
            afirmador: rep.objeto.afirmador,
            id: rep.id
          }
          dataSource2.push(report);
          console.log("Creado =>", report)
          console.log("Ref =>", report.id.path)

        });
        this.dataSource = dataSource2;
      });
      this.telPersonaAfirmada = contactoEncontrado.objeto.telefono;
      const datePickerLocal = this.fechaReporte as Date;
      console.log("this.fechaReporte ======>", datePickerLocal.getTime());
    }
  }

  enviarReporte() {

    const datePickerLocal = this.fechaReporte as Date;
    const data: AfirmacionReporte = {
      registroDate: Date.now(),
      //Info
      personaRef: this.personaRef,
      afirmador: this.userDb.nombre,
      afirmadorID: this.userDb.id,
      fechaReporte: datePickerLocal.getTime(),

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
    this._firestore.createNewAfirmacionRecord(data);
    this.fechaReporte = Date.now();
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

  rowInfo(row: any) {
    console.log("Row darta", row);
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = row

    this.dialog.open(DetalleReporteAfirmacionComponent, dialogConfig);
  }

}
