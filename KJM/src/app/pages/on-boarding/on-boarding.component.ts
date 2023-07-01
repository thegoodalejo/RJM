import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';

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

  constructor(private http: HttpClient, private firestore: FirestoreService, private router: Router) { }

  ngOnInit() {
    this.obtenerMinisterios().subscribe(
      (response) => {
        this.ministerios = response;
      }
    );;
  }



  onMinisterioChange() {
    this.selectedMinisterioObj = this.ministerios.find(ministerio => ministerio.id === this.selectedMinisterioId);
    this.obtenerSedes().subscribe(
      (response) => {
        this.sedes = response;
      }
    );;
  }

  onSedeChange() {
    this.selectedSedeObj = this.sedes.find(sede => sede.id === (+this.selectedSedeId));
  }

  obtenerMinisterios(): Observable<any> {
    const url = 'https://legacysoftware.online/services/get_ministerios.php';
    const body = new FormData();

    return this.http.post(url, body);
  }

  obtenerSedes(): Observable<any> {
    const url = 'https://legacysoftware.online/services/get_sedes.php';
    const body = new FormData();
    body.append('id_ministerio', this.selectedMinisterioId.toString());

    return this.http.post(url, body);
  }

  updateOnBoading() {
    const data = {
      ministerio: this.selectedMinisterioObj.sigla,
      ubicacion: this.selectedSedeObj.nombre,
      onBoarding: true
    }
    this.firestore.onBoardingUpdate(data).then((ok)=>{
      if(ok){
        this.router.navigate(['/app-home']);
      }else{
        this.router.navigate(['/app-login']);
      }
    });
  }

}
