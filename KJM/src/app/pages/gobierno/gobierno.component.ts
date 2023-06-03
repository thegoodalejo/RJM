import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuerySnapshot, DocumentData } from 'firebase/firestore';
import { DetalleMiembroComponent } from 'src/app/PopupModals/detalle-miembro/detalle-miembro.component';
import NuevoMiembro from 'src/app/models/nuevoMiembro';
import ObjectWithReference from 'src/app/models/objectWithReferenc';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import UserDb from 'src/app/models/userDb';
import { DetalleUsuarioComponent } from 'src/app/PopupModals/detalle-usuario/detalle-usuario.component';

export interface TestDocs{
  nombre: string,
  docRef: any
}

@Component({
  selector: 'app-gobierno',
  templateUrl: './gobierno.component.html',
  styleUrls: ['./gobierno.component.css']
})
export class GobiernoComponent {
  personas: ObjectWithReference<UserDb>[] = [];

  displayedColumns: string[] = ['nombre', 'telefono'];
  dataSource: TestDocs[] = [{ nombre: "a", docRef: null }];

  constructor(
    private _snackBar: MatSnackBar,
    private _firestore: FirestoreService,
    private dialog: MatDialog
  ) {

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

  rowInfo(row: any) {
    console.log("Row darta", row);
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = row

    this.dialog.open(DetalleUsuarioComponent, dialogConfig);
  }
}
