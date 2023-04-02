import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-afirmation-form',
  templateUrl: './afirmation-form.component.html',
  styleUrls: ['./afirmation-form.component.css']
})
export class AfirmationFormComponent {
  myForm!: FormGroup;
  myDatePickerOptions = {
    dateFormat: 'dd/mm/yyyy',
  };
  personas = ['Persona 1', 'Persona 2', 'Persona 3'];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      fecha: ['', Validators.required],
      nombreAfirmador: [''],
      personaAfirmada: ['', Validators.required],
      descripcion: [''],
    });
  }

  onSubmit() {
    // Handle form submission
  }
}
