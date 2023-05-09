import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import NuevoMiembro from 'src/app/models/nuevoMiembro';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reporte } from '../afirmacion/afirmacion.component';
import ObjectWithReference from 'src/app/models/objectWithReferenc';
import { DocumentData, DocumentReference, QuerySnapshot } from 'firebase/firestore';

export interface TestDocs{
  nombre: string,
  telefono: string
}

@Component({
  selector: 'app-membrecia',
  templateUrl: './membrecia.component.html',
  styleUrls: ['./membrecia.component.css']
})
export class MembreciaComponent {

  displayedColumns: string[] = ['nombre', 'telefono'];
  dataSource: TestDocs[] = [{ nombre: "a", telefono: "b"}];

  constructor(
    private _snackBar: MatSnackBar,
    private _firestore: FirestoreService
  ) {
    const dataSource2: TestDocs[] = [];
    this._firestore.getMembreciaList().then(
      ((result: QuerySnapshot<DocumentData>) => {
        this.dataSource = result.docs.map((doc) => {
          return { nombre: doc.data()['nombre'], telefono: doc.data()['telefono'] };
        });
        
      })
    );
    this.dataSource = dataSource2;
  }
}