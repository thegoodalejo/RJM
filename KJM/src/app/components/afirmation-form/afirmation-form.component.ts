import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import ToAfirm from 'src/app/models/afirmacionList';
import { AuthService } from 'src/app/services/firesbase/auth.service';
import { FirestoreService } from 'src/app/services/firesbase/firestore.service';


interface Contacto {
  nombre: string;
  telefono: string;
}

const today = new Date();

@Component({
  selector: 'app-afirmation-form',
  templateUrl: './afirmation-form.component.html',
  styleUrls: ['./afirmation-form.component.css']
})
export class AfirmationFormComponent implements OnInit {
  myForm!: FormGroup;
  myDatePickerOptions = {
    dateFormat: 'dd/mm/yyyy',
  };
  personas: Contacto[] = [];
  nombreAfirmador: any;
  descripcion = '';

  nombre = document.getElementById('fecha');

  constructor(private fb: FormBuilder, private fireService: FirestoreService, private fireAuth: AuthService) {

  }

  ngOnInit() {
    this.myForm = this.fb.group({
      fecha: [today, Validators.required],
      nombreAfirmador: [this.fireAuth.getCurrentUserName()],
      personaAfirmada: ['', Validators.required],
      descripcion: ['', Validators.required],
    });

    this.fireService.getListToCall(this.fireAuth.getCurrentUserId()).then((contactos: Contacto[]) => {
      console.log(contactos);
      this.personas = contactos;
      // Aquí puedes trabajar con la lista de contactos
    }).catch((error) => {
      console.error(error);
    });

    const miDropdown = document.getElementById('personaAfirmada') as HTMLSelectElement;
    miDropdown.addEventListener('change', () => {
      const opcionSeleccionada = miDropdown.value;
      console.log(`La opción seleccionada es: ${opcionSeleccionada}`);
      const contactoEncontrado = this.personas.find((contacto) => contacto.nombre === opcionSeleccionada);

      const inputElement = document.getElementById("telPersonaAfirmada") as HTMLInputElement;
      inputElement.value = "" + contactoEncontrado?.telefono;

    });
  }

  onSubmit() {
    const fechaS = (<HTMLInputElement>document.getElementById('fecha')).value;
    const afirmadorS = (<HTMLInputElement>document.getElementById('afirmador')).value;
    const toAfirmPersonS = (<HTMLSelectElement>document.getElementById('personaAfirmada')).value;
    const descripcionS = (<HTMLInputElement>document.getElementById('descripcion')).value;

    console.log("Click");
    console.log(fechaS);
    console.log(afirmadorS);
    console.log(toAfirmPersonS);
    console.log(descripcionS);

    const data: ToAfirm = {
      fecha: fechaS,
      afirmador: afirmadorS,
      personaAfirmada: toAfirmPersonS,
      descripcion: descripcionS
    }

    this.fireService.createNewAfirmacionRecord(data);

  }
}
