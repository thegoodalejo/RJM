import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import { DocumentData, DocumentReference, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DetalleMiembroComponent } from 'src/app/PopupModals/detalle-miembro/detalle-miembro.component';
import ObjectWithReference from 'src/app/models/objectWithReferenc';
import NuevoMiembro from 'src/app/models/nuevoMiembro';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

/*export interface TestDocs {
  nombre: string,
  telefono: string,
  fecha: any,
  docRef: any
}*/

@Component({
  selector: 'app-membrecia',
  templateUrl: './membrecia.component.html',
  styleUrls: ['./membrecia.component.css']
})
export class MembreciaComponent implements OnInit {

  filtro:any;

  private miembrosCollection: AngularFirestoreCollection<NuevoMiembro>;
  miembros$: Observable<NuevoMiembro[]>;
  miembrosFiltrados$: any;

  ngOnInit() {
    this.miembros$ = this.miembrosCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as NuevoMiembro;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    this.miembrosFiltrados$ = this.miembros$;

    this.miembrosFiltrados$ = this.miembros$.pipe(
      map(
        (array: NuevoMiembro[]) =>
          array.sort((a, b) => a.nombre.localeCompare(b.nombre))
      )
    );
  }

  constructor(
    private _snackBar: MatSnackBar,
    private _firestore: FirestoreService,
    private dialog: MatDialog,
    private afs: AngularFirestore
  ) {

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

  actualizarPersona(persona: NuevoMiembro) {

    console.log("Modal Data =>",persona);

    const dialogRef = this.dialog.open(DetalleMiembroComponent, {
      width: '300px',
      data: persona
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Result Data =>", result);
      if (result) {
        this.miembrosCollection.doc(persona.id).update(result);
      }
    });
  }
}