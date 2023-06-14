import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subscription, map } from 'rxjs';
import { DetalleReporteAfirmacionComponent } from 'src/app/PopupModals/detalle-reporte-afirmacion/detalle-reporte-afirmacion.component';
import AfirmacionReporte from 'src/app/models/afirmacionReporte';
import UserDb from 'src/app/models/userDb';
import { AppDataService } from 'src/app/services/app-data.service';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';

@Component({
  selector: 'app-reportes-afirmacion',
  templateUrl: './reportes-afirmacion.component.html',
  styleUrls: ['./reportes-afirmacion.component.css']
})
export class ReportesAfirmacionComponent implements OnDestroy, OnInit {

  userDb!: UserDb;
  private subscription: Subscription = new Subscription;

  dataSource: any[] = [];

  documentosCollection: AngularFirestoreCollection<AfirmacionReporte>;
  documentos$: Observable<AfirmacionReporte[]>;

  constructor(private dialog: MatDialog,
    private firestore: AngularFirestore,
    private _appData: AppDataService) {

    this.subscription = this._appData.userDb$.subscribe(
      (userDb) => {
        this.userDb = userDb;
        console.log("New subscription", this.userDb);
      }
    );

    this.documentosCollection = this.firestore.collection<AfirmacionReporte>('historialAfirmacion', ref =>
      ref.orderBy('registroDate', 'desc')
    );

    this.documentos$ = this.documentosCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as AfirmacionReporte;
          const id = a.payload.doc.id;
          const ref = a.payload.doc.ref;
          return { id, ref, ...data };
        })
      )
    );

    console.log("Reportes =>" , this.documentos$);


  }
  ngOnInit(): void {
    

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  recordDetail(row: any) {
    console.log("Row darta", row);
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = row

    this.dialog.open(DetalleReporteAfirmacionComponent, dialogConfig);
  }

}
