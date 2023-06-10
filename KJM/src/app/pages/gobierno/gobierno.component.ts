import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuerySnapshot, DocumentData } from 'firebase/firestore';
import { DetalleMiembroComponent } from 'src/app/PopupModals/detalle-miembro/detalle-miembro.component';
import NuevoMiembro from 'src/app/models/nuevoMiembro';
import ObjectWithReference from 'src/app/models/objectWithReferenc';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import UserDb from 'src/app/models/userDb';
import { DetalleUsuarioComponent } from 'src/app/PopupModals/detalle-usuario/detalle-usuario.component';
import { Observable, map } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ActualizarRolComponent } from 'src/app/PopupModals/actualizar-rol/actualizar-rol.component';

export interface TestDocs {
  nombre: string,
  docRef: any
}

@Component({
  selector: 'app-gobierno',
  templateUrl: './gobierno.component.html',
  styleUrls: ['./gobierno.component.css']
})
export class GobiernoComponent implements OnInit {
  personas: ObjectWithReference<UserDb>[] = [];
  displayedColumns: string[] = ['nombre', 'telefono'];
  dataSource: TestDocs[] = [{ nombre: "a", docRef: null }];

  filtro: any;

  private gobiernoCollection: AngularFirestoreCollection<UserDb>;
  gobierno$: Observable<UserDb[]>;
  gobiernoFiltrados$: any;



  ngOnInit() {
    this.gobierno$ = this.gobiernoCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as UserDb;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    this.gobiernoFiltrados$ = this.gobierno$;
  }

  constructor(
    private _snackBar: MatSnackBar,
    private _firestore: FirestoreService,
    private afs: AngularFirestore,
    private dialog: MatDialog
  ) {

    this.gobiernoCollection = this.afs.collection<UserDb>('usuarios');
    this.gobierno$ = this.gobiernoCollection.valueChanges();

    const dataSource2: TestDocs[] = [];

    this._firestore.getGobiernoList().then(
      ((result: QuerySnapshot<DocumentData>) => {
        this.dataSource = result.docs.map((doc) => {
          return { nombre: doc.data()['nombre'], docRef: doc.ref };
        });

      })
    );
    this.dataSource = dataSource2;
  }

  applyFilter() {

    this.gobiernoFiltrados$ = this.gobierno$.pipe(
      map((nuevoMiembros: UserDb[]) => {
        // Aplica aquí tu lógica de filtro
        return nuevoMiembros.filter((nuevoMiembro: UserDb) => {
          return nuevoMiembro.nombre.toLowerCase().includes(this.filtro.toLowerCase());
        });
      })
    );
  }

  actualizarRol(usuario: UserDb) {
    console.log("Modal Data =>",usuario);

    const dialogRef = this.dialog.open(ActualizarRolComponent, {
      width: '300px',
      data: usuario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Result Data =>", result);
      if (result) {
        this.gobiernoCollection.doc(usuario.id).update(result);
      }
    });
  }

  actualizarAfirmacion(usuario: UserDb) {

  }
}
