import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import UserDb from 'src/app/models/userDb';
import { AppDataService } from 'src/app/services/app-data.service';
import { DetalleMiembroComponent } from '../detalle-miembro/detalle-miembro.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

export interface UserRol {
  isSelected: boolean,
  rol: string
}

@Component({
  selector: 'app-actualizar-rol',
  templateUrl: './actualizar-rol.component.html',
  styleUrls: ['./actualizar-rol.component.css']
})
export class ActualizarRolComponent {

  userDb!: UserDb;
  private wasAdmin : boolean = false;
  private subscription: Subscription = new Subscription;



  ELEMENT_DATA: UserRol[] = [
    { isSelected:false,rol:'Miembro'}, 
    { isSelected:false,rol:'Afirmador'}, 
    { isSelected:false,rol:'LiderDpto'}
  ];
  
  dataSource = new MatTableDataSource<UserRol>(this.ELEMENT_DATA);

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
    this.loadPerms();
  }

  cerrarDialogo(): void {
    this.data.updateDate = Date.now();
    this.data.updateUser = this.userDb.nombre;
    this.data.rol = this.ELEMENT_DATA
    .filter(item => item.isSelected === true) // Filtrar solo los objetos con valor true
    .map(item => item.rol); // Mapear solo los valores de permiso
    if(this.wasAdmin){
      this.data.rol.push("Admin");
    }
    this.dialogRef.close(this.data);
  }

  loadPerms(){
    this.data.rol.forEach((element: any) => {
      if(element == "Admin"){
        this.wasAdmin = true;
      }
      const permisoEncontrado = this.ELEMENT_DATA.find(item => item.rol === element);
      if (permisoEncontrado) {
        permisoEncontrado.isSelected = true;
      }
    });
  }

}
