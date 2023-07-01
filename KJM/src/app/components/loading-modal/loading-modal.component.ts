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
  status: 'loading' | 'success' | 'failure' = 'loading';

  open(status: any) {
    this.status = status;
    this.show = true;
    setTimeout(() => {
      this.close();
    }, 3000);
  }

  close() {
    this.show = false;
    this.dialogRef.close();
  }

  update(status: any, message: any) {
    this.status = status;
    setTimeout(() => {
      this.close();
    }, 500);
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000
    });
  }

}
