import { Component, ViewChild, ElementRef, AfterViewInit, Inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import { Important } from 'src/app/shared/methods';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MoradorService } from '../morador.service';

@Component({
  selector: 'app-morador-dialog',
  templateUrl: './morador-dialog.component.html',
  styleUrls: ['./morador-dialog.component.scss']
})
export class MoradorDialogComponent {

  public image = null;

  // variáveis do DOM
  @ViewChild('nameInput', { static: false }) nameInput: ElementRef;
  @ViewChild('myForm', { static: false }) form: NgForm;

  // formulário com a composição dos validadores
  public moradorForm$: BehaviorSubject<FormGroup> = new BehaviorSubject(
    this.formBuilder.group({
      personal: this.formBuilder.group({
        photo: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        born: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        cpf: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        rg: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        tel: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        cel: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        email: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        civil: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        id: ['']
      }),
      profesional: this.formBuilder.group({
        profession: [''],
        salary: [''],
      }),
      condominium: this.formBuilder.group({
        block: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        unit: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
      }),
      familiar: this.formBuilder.group({
        wife: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        children: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
      })
    })
  );

  constructor(
    public readonly formBuilder: FormBuilder,
    private readonly moradorService: MoradorService,
    public dialogRef: MatDialogRef<MoradorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private morador: {}
  ) { }

  public getInputFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // Read file as data url
      reader.onloadend = (e) => { // function call once readAsDataUrl is completed
        if (event.target.files[0].size < 5000000) {
          this.image = e.target.result;
          // console.log(this.moradorForm$.value.controls.personal['controls'].photo.setValue(e.target.result))
        }
      };
    }
  }

  public endModal() {
    const MORADOR = this.moradorForm$.value.controls.personal.value;
    this.dialogRef.close({ modificated: true, morador: this.morador });
  }

  public cleanForm() {
    Important.cleanForm(this.nameInput, this.form);
  }
}

// Estorar erro quando a imagem for muito grande
// Settar o valor no form do binario
