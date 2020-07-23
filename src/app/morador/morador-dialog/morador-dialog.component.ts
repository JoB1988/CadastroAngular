import { Component, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
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
export class MoradorDialogComponent implements AfterViewInit {

  // variáveis do DOM
  @ViewChild('nameInput', { static: false }) nameInput: ElementRef;
  @ViewChild('myForm', { static: false }) form: NgForm;

  // formulário com a composição dos validadores
  public moradorForm$: BehaviorSubject<FormGroup> = new BehaviorSubject(
    this.formBuilder.group({
      personal: this.formBuilder.group({
        nome: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        nascimento: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        cpf: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        rg: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        tel: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        cel: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        email: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        civil: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        id: ['']
      }),
      profesional: this.formBuilder.group({
        profissao: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
      }),
      condominium: this.formBuilder.group({
        bloco: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        unidade: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
      })
    })
  );

  constructor(
    public readonly formBuilder: FormBuilder,
    private readonly moradorService: MoradorService,
    public dialogRef: MatDialogRef<MoradorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private morador: {}
  ) { }

  public ngAfterViewInit(): void {
    this.nameInput.nativeElement.focus();
  }

  public endModal() {
    const MORADOR = this.moradorForm$.value.controls.personal.value;
    this.dialogRef.close({ modificated: true, morador: this.morador });
  }

  public cleanForm() {
    Important.cleanForm(this.nameInput, this.form);
  }
}
