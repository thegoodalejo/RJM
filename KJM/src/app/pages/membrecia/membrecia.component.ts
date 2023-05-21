import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import { DocumentData, DocumentReference, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DetalleMiembroComponent } from 'src/app/PopupModals/detalle-miembro/detalle-miembro.component';
import ObjectWithReference from 'src/app/models/objectWithReferenc';
import NuevoMiembro from 'src/app/models/nuevoMiembro';

export interface TestDocs{
  nombre: string,
  telefono: string,
  fecha: any,
  docRef: any
}

@Component({
  selector: 'app-membrecia',
  templateUrl: './membrecia.component.html',
  styleUrls: ['./membrecia.component.css']
})
export class MembreciaComponent {

  personas: ObjectWithReference<NuevoMiembro>[] = [];
  
  displayedColumns: string[] = ['nombre', 'telefono'];
  dataSource: TestDocs[] = [{ nombre: "a", telefono: "b", fecha: 0, docRef: null}];

  constructor(
    private _snackBar: MatSnackBar,
    private _firestore: FirestoreService,
    private dialog: MatDialog
  ) {

    const dataSource2: TestDocs[] = [];
    
    this._firestore.getMembreciaList().then(
      ((result: QuerySnapshot<DocumentData>) => {
        this.dataSource = result.docs.map((doc) => {
          return { nombre: doc.data()['nombre'], telefono: doc.data()['telefono'], fecha: doc.data()['registroDate'], docRef: doc.ref };
        });
        
      })
    );
    this.dataSource = dataSource2;
  }

  rowInfo(row: any) {
    console.log("Row darta",row);
    const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = row

        this.dialog.open(DetalleMiembroComponent, dialogConfig);
  }
}