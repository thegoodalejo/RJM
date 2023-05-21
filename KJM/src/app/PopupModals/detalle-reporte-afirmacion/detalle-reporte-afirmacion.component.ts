import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import firebase from 'firebase/compat';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';

@Component({
  selector: 'app-detalle-reporte-afirmacion',
  templateUrl: './detalle-reporte-afirmacion.component.html',
  styleUrls: ['./detalle-reporte-afirmacion.component.css']
})
export class DetalleReporteAfirmacionComponent {

  modalInfo: any;

  constructor(public matDialog: MatDialog,
    private dialogRef: MatDialogRef<DetalleReporteAfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) _data:any,
    private _firestore: FirestoreService) {

      const docRef = _data.id as firebase.firestore.DocumentReference;

      this._firestore.getDocFromRef(docRef).then(response => {
        this.modalInfo = response;
        console.log("Modal data",this.modalInfo.data());
      });

  }

}
