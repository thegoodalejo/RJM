import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsultService } from 'src/app/services/http/consult.service';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css']
})
export class DetalleUsuarioComponent {
  usuarioForm: FormGroup;

  constructor(public matDialog: MatDialog,
    private dialogRef: MatDialogRef<DetalleUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private formBuilder: FormBuilder,
    private http: ConsultService) {
    console.log("Dialog updateuser init with =>", data);
    this.usuarioForm = this.formBuilder.group({
      id: [data.id],
      displayName: [data.displayName, Validators.required],
      email: [{ value: data.email, disabled: true }, Validators.required],
      numeroTelefonico: [data.numeroTelefonico, [Validators.required, Validators.pattern("^[0-9]*$")]],
      rol: [data.rol, Validators.required]
    });

  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.usuarioForm.valid) {
      const formData = this.usuarioForm.value;
      this.http.actualizarUsuarioInfo(formData).then(response => {
        if (response) {
          this.dialogRef.close(formData);
        } else {
          this.dialogRef.close();
        }
      });

    }
  }
}
