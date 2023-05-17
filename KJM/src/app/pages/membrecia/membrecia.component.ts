import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import { DocumentData, DocumentReference, QuerySnapshot, Timestamp } from 'firebase/firestore';

export interface TestDocs{
  nombre: string,
  telefono: string,
  fecha: any
}

@Component({
  selector: 'app-membrecia',
  templateUrl: './membrecia.component.html',
  styleUrls: ['./membrecia.component.css']
})
export class MembreciaComponent {

  displayedColumns: string[] = ['nombre', 'telefono'];
  dataSource: TestDocs[] = [{ nombre: "a", telefono: "b", fecha: 0}];

  constructor(
    private _snackBar: MatSnackBar,
    private _firestore: FirestoreService
  ) {

    const dataSource2: TestDocs[] = [];
    
    this._firestore.getMembreciaList().then(
      ((result: QuerySnapshot<DocumentData>) => {
        this.dataSource = result.docs.map((doc) => {
          return { nombre: doc.data()['nombre'], telefono: doc.data()['telefono'], fecha: doc.data()['registroDate'] };
        });
        
      })
    );
    this.dataSource = dataSource2;
  }

  mostrarTelefono(row:any){
    console.log(row);
  }
}