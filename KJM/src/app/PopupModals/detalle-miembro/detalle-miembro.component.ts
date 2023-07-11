import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import { FormsModule } from '@angular/forms';
import firebase from 'firebase/compat';
import NuevoMiembro from 'src/app/models/nuevoMiembro';
import { AppDataService } from 'src/app/services/app-data.service';
import UserDb from 'src/app/models/userDb';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detalle-miembro',
  templateUrl: './detalle-miembro.component.html',
  styleUrls: ['./detalle-miembro.component.css']
})
export class DetalleMiembroComponent {

  userDb!: UserDb;
  private subscription: Subscription = new Subscription;

  selectedDate: Date;
  
  constructor(public matDialog: MatDialog,
    private dialogRef: MatDialogRef<DetalleMiembroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _appData: AppDataService) { 
      //Get User Info
      this.subscription = this._appData.userDb$.subscribe(
        (userDb) => {
          this.userDb = userDb;
        }
      );
      //Update datePicker
      const date = new Date(this.data.fechaNacimiento);
      this.selectedDate = date;
      console.log("MemberTimestamp Before", this.data.fechaNacimiento);
      console.log("MemberDate Before", this.selectedDate);
  }

  cerrarDialogo(): void {
    console.log("MemberTimestamp After", this.selectedDate.getTime());
    console.log("MemberDate After", this.selectedDate);
    if (this.selectedDate) {
      const timestamp = this.selectedDate.getTime();
      console.log(timestamp);
      this.data.fechaNacimiento = timestamp;
    }

    this.data.updateDate = Date.now();
    this.data.updateUser = this.userDb.displayName;
    this.dialogRef.close(this.data);
  }

}
