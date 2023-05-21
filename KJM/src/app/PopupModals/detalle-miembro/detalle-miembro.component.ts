import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import firebase from 'firebase/compat';

@Component({
  selector: 'app-detalle-miembro',
  templateUrl: './detalle-miembro.component.html',
  styleUrls: ['./detalle-miembro.component.css']
})
export class DetalleMiembroComponent {

  modalInfo: any;

  constructor(public matDialog: MatDialog,
    private dialogRef: MatDialogRef<DetalleMiembroComponent>,
    @Inject(MAT_DIALOG_DATA) _data:any,
    private _firestore: FirestoreService) {

      this._firestore.getDocFromRef(_data.docRef).then(response => {
        this.modalInfo = response;
        console.log("Modal data",this.modalInfo.data());
      });

      

  }

  convertTimestampToDate(timestamp: number): Date {
    return new Date(timestamp);
  }

  actualizarMiembro(){

  }
  
}
