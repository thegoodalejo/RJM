import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';
import { ConsultService } from 'src/app/services/http/consult.service';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/firesbase/auth.service';
import { AppDataService } from 'src/app/services/app-data.service';

@Component({
  selector: 'app-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrls: ['./on-boarding.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('500ms ease-in')),
    ]),
  ]
})
export class OnBoardingComponent implements OnInit {

  @HostBinding('@fadeIn') fadeIn = false;

  ministerios: any[] = [];
  sedes: any[] = [];

  selectedMinisterioObj: any = { id: 0, nombre: "", descripcion: "" };
  selectedSedeObj: any = { id: 0, nombre: "", direccion: "", descripcion: "" };

  selectedMinisterioId: number = 0;
  selectedSedeId: number = 0;

  constructor(
    private appData: AppDataService,
    private firestore: FirestoreService,
    private auth: AuthService,
    private router: Router,
    private mySql: ConsultService) { }

  ngOnInit() {
    this.mySql.obtenerMinisterios().subscribe(
      (response) => {
        this.ministerios = response;
      }
    );;
  }



  onMinisterioChange() {
    this.selectedMinisterioObj = this.ministerios.find(ministerio => ministerio.id === this.selectedMinisterioId);
    this.mySql.obtenerSedes(this.selectedMinisterioId.toString()).subscribe(
      (response) => {
        this.sedes = response;
      }
    );;
  }

  onSedeChange() {
    this.selectedSedeObj = this.sedes.find(sede => sede.id === (+this.selectedSedeId));
  }

  async updateOnBoading() {
    const data = {
      ministerio: this.selectedMinisterioObj.sigla,
      ubicacion: this.selectedSedeObj.nombre,
      onBoarding: true
    }
    console.log("updateOnBoading", data);

    try {
      const OK = await this.firestore.onBoardingUpdate(data);
      if (OK) {
        const data = {
          id_ministerio: this.selectedMinisterioId,
          id_sede: this.selectedSedeId
        };
        await this.mySql.crearUsuario(data).then(response => {
          console.log("response.action",response.action);
        });
        console.log("StatikData");
        const appData = this.appData.getStaticData();
        appData.isNewUser = true;
        await this.appData.updateStaticData(appData);
        this.router.navigate(['/app-home/app-welcome-new-user']);
      } else {
        this.router.navigate(['/app-login']);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }
}
