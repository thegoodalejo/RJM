import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateService {

  constructor() { }

  create() {

    const params = {
      param1: 'valor1',
      param2: 'valor2'
    };
    const url = 'https://legacysoftware.000webhostapp.com/services/insert_record.php';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        // Manejar errores
        console.error('Error al consumir el servicio:', error);
      });
  }
}
