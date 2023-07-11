import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuerySnapshot, DocumentData } from 'firebase/firestore';
import { DetalleMiembroComponent } from 'src/app/PopupModals/detalle-miembro/detalle-miembro.component';
import NuevoMiembro from 'src/app/models/nuevoMiembro';
import ObjectWithReference from 'src/app/models/objectWithReferenc';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import UserDb from 'src/app/models/userDb';
import { DetalleUsuarioComponent } from 'src/app/PopupModals/detalle-usuario/detalle-usuario.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppDataService } from 'src/app/services/app-data.service';
import { ConsultService } from 'src/app/services/http/consult.service';
import { Subscription } from 'rxjs';
import { LoadingModalComponent } from 'src/app/components/loading-modal/loading-modal.component';

export interface TestDocs {
  nombre: string,
  docRef: any
}

@Component({
  selector: 'app-gobierno',
  templateUrl: './gobierno.component.html',
  styleUrls: ['./gobierno.component.css'],
  animations: [
    trigger('expandAnimation', [
      state('expanded', style({ height: '*' })),
      state('collapsed', style({ height: '0' })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out')),
    ]),
  ],
})
export class GobiernoComponent implements OnDestroy{

  private userDb$: any;

  //HTTP
  usuariosNuevos: any[] = [];


  personas: ObjectWithReference<UserDb>[] = [];
  displayedColumns: string[] = ['nombre', 'telefono'];
  dataSource: TestDocs[] = [{ nombre: "a", docRef: null }];

  filtro: any;
  gobiernoFiltrados$: any;

  private subscriptionDb: Subscription = new Subscription;

  dialogRef: any;

  constructor(
    private appData: AppDataService,
    private http: ConsultService,
    private _firestore: FirestoreService,
    private afs: AngularFirestore,
    private dialog: MatDialog,


  ) {

    this.subscriptionDb = this.appData.userDb$.subscribe(
      (userDb) => {
        this.userDb$ = userDb;
        console.log("this.userDb$", this.userDb$);
        if (this.userDb$.id > 0)
          this.http.obtenerUsuariosSede(this.userDb$.id_sede).then(response => {
            this.usuariosNuevos = response;
          });
      }
    );
  }
  
  ngOnDestroy(): void {
    this.subscriptionDb.unsubscribe();
  }

  showObject(item: any) {
    if (item.activo) {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = item
      
      const localDialogRef = this.dialog.open(DetalleUsuarioComponent, dialogConfig);

      localDialogRef.afterClosed().subscribe((response: any) => {
        if (response) {
          const usuarioFinded =
            this.usuariosNuevos.find(itemFinded => itemFinded.id === item.id);
          if (usuarioFinded) {
            usuarioFinded.displayName = response.displayName,
              usuarioFinded.numeroTelefonico = response.numeroTelefonico,
              usuarioFinded.rol = response.rol
          }
        }
      });
    }

  }

  applyFilter() {

    /*this.gobiernoFiltrados$ = this.gobierno$.pipe(
      map((nuevoMiembros: UserDb[]) => {
        // Aplica aquí tu lógica de filtro
        return nuevoMiembros.filter((nuevoMiembro: UserDb) => {
          return nuevoMiembro.nombre.toLowerCase().includes(this.filtro.toLowerCase());
        });
      })
    );*/
  }

  toggleSwitch(usuario: any) {
    console.log("toggleSwitch", usuario);

    this.dialogRef = this.dialog.open(LoadingModalComponent, {
      disableClose: true,
      panelClass: 'custom-modal-container' // Ajusta el nombre de la clase según tus estilos
    });

    this.dialogRef.componentInstance.open('loading');

    setTimeout(() => {

      const data = {
        id: usuario.id,
        activo: usuario.activo
      };

      this.http.actualizarUsuarioActivar(data).then(response => {
        if (!response) {
          const usuarioFinded = this.usuariosNuevos.find(item => item.id === usuario.id);
          if (usuarioFinded) {
            usuarioFinded.activo = !usuarioFinded.activo;
          }
        }
      });

      this.dialogRef.componentInstance.close();
    }, 100); // Ajusta el valor del retraso según sea necesario
  }
}
