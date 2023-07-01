import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsultService {

  constructor(private http: HttpClient) {
    console.log("Holaaa");
    console.log(this.getMinisterioById(1));
   }

  getMinisterioById(id: number) {
    const url = 'https://legacysoftware.000webhostapp.com/services/consultar_onboarding.php';

    // Crear el objeto de datos a enviar en la solicitud POST
    const data = { id };

    // Realizar la solicitud POST
    return this.http.post(url, data);
  }
}
