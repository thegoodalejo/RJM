import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.css']
})
export class LoadingModalComponent {

  constructor(public matDialog: MatDialog,
    private dialogRef: MatDialogRef<LoadingModalComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  show: boolean = false;
  message: string = '';

  open() {
    this.show = true;
    setTimeout(() => {
      this.close();
    }, 3000);
  }

  close(message?: any) {
    this.show = false;
    if (message) {
      this.snackBar.open(message, 'Cerrar', {
        duration: 3000
      });
    }
    this.dialogRef.close();
  }

  update() {
    setTimeout(() => {
      this.close();
    }, 500);

  }

}
