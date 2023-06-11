import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppDataService } from 'src/app/services/app-data.service';
import { DetalleMiembroComponent } from '../detalle-miembro/detalle-miembro.component';
import UserDb from 'src/app/models/userDb';
import { Observable, Subscription, filter, map, tap } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import NuevoMiembro from 'src/app/models/nuevoMiembro';
import { MatCheckboxChange } from '@angular/material/checkbox';

export interface TemporalData {
  isCheck: boolean,
  object: NuevoMiembro
}

@Component({
  selector: 'app-asignar-afirmacion',
  templateUrl: './asignar-afirmacion.component.html',
  styleUrls: ['./asignar-afirmacion.component.css']
})
export class AsignarAfirmacionComponent implements OnInit {

  userDb!: UserDb;
  private subscription: Subscription = new Subscription;

  filtro: any;

  private miembrosCollection: AngularFirestoreCollection<NuevoMiembro>;
  newMiembros$: any;
  miembros$: Observable<NuevoMiembro[]>;
  miembrosFiltrados$: any;

  ngOnInit() {

    this.miembros$ = this.miembrosCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as NuevoMiembro;
          const id = a.payload.doc.id;
          const ref = a.payload.doc.ref;
          return { id, ref, ...data };
        })
      )
    );
    this.miembrosFiltrados$ = this.miembros$.pipe(
      map(
        (array: NuevoMiembro[]) =>
          array.sort((a, b) => a.nombre.localeCompare(b.nombre))
      )
    );


  }

  constructor(public matDialog: MatDialog,
    private dialogRef: MatDialogRef<DetalleMiembroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _appData: AppDataService,
    private afs: AngularFirestore) {
    //Get User Info
    this.subscription = this._appData.userDb$.subscribe(
      (userDb) => {
        this.userDb = userDb;
      }
    );
    // Obtiene los IDs de los documentos de listToCall

    this.miembrosCollection = this.afs.collection<NuevoMiembro>('miembros');
    this.miembros$ = this.miembrosCollection.valueChanges();
  }


  applyFilter() {

    this.miembrosFiltrados$ = this.miembros$.pipe(
      map((nuevoMiembros: NuevoMiembro[]) => {
        // Aplica aquí tu lógica de filtro
        return nuevoMiembros.filter((nuevoMiembro: NuevoMiembro) => {
          return nuevoMiembro.nombre.toLowerCase().includes(this.filtro.toLowerCase()) || nuevoMiembro.telefono.includes(this.filtro);
        });
      })
    );
  }

  cerrarDialogo() {
    console.log("Hola");
    this.data.updateDate = Date.now();
    this.data.updateUser = this.userDb.nombre;
    this.dialogRef.close(this.userDb);
  }

  onCheckboxChange(event: MatCheckboxChange, object: NuevoMiembro) {
    if (event.checked) {
      console.log('Objeto seleccionado:', object);
      if (object.ref) {
        if (!this.userDb.listToCall.includes(object.ref)) {
          // La referencia no está repetida, se puede agregar al array
          this.userDb.listToCall.push(object.ref);
        }
      }

      console.log(this.userDb.listToCall);
    } else {
      console.log('Objeto deseleccionado:', object);
      if (object.ref) {
        const index = this.userDb.listToCall.indexOf(object.ref);
        if (index !== -1) {
          // Eliminar la referencia utilizando splice
          this.userDb.listToCall.splice(index, 1);
        }
      }
      console.log(this.userDb.listToCall);
    }
  }

}
