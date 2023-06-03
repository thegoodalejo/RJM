import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import firebase from 'firebase/compat';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css']
})
export class DetalleUsuarioComponent {
  modalInfo: any;

  constructor(public matDialog: MatDialog,
    private dialogRef: MatDialogRef<DetalleUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) _data: any,
    private _firestore: FirestoreService) {

    const docRef = _data.id as firebase.firestore.DocumentReference;

    this._firestore.getDocFromRef(docRef).then(response => {
      this.modalInfo = response;
      console.log("Modal data", this.modalInfo.data());
    });
    
  }
}
