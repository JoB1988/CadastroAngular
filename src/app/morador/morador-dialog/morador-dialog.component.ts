import { Component, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MoradorDialogService } from './morador-dialog.service';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import { Important } from 'src/app/shared/methods';
import { Morador } from 'src/app/shared/app.model';

@Component({
  selector: 'app-morador-dialog',
  templateUrl: './morador-dialog.component.html',
  styleUrls: ['./morador-dialog.component.scss']
})
export class MoradorDialogComponent implements AfterViewInit {

  public morador: Morador;

  // variáveis do DOM
  @ViewChild('nameInput', { static: false }) nameInput: ElementRef;
  @ViewChild('myForm', { static: false }) form: NgForm;

  // formulário com a composição dos validadores
  public moradorForm$: BehaviorSubject<FormGroup> = new BehaviorSubject(
    this.formBuilder.group({
      morador: this.formBuilder.group({
        nome: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        nascimento: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        profissao: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        cpf: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        rg: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        tel: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        cel: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        email: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        civil: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        bloco: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        unidade: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        id: ['']
      })
    })
  );

  constructor(
    private moradorDialogService: MoradorDialogService,
    public readonly formBuilder: FormBuilder
  ) { }

  public ngAfterViewInit(): void {
    this.nameInput.nativeElement.focus();
    if (this.morador) {
      console.log('tem morador')
    }
  }

  public endModal() {
    const MORADOR = this.moradorForm$.value.controls.morador.value;
    this.moradorDialogService.destroy$.next(MORADOR);
  }

  public cleanForm() {
    Important.cleanForm(this.nameInput, this.form);
  }
}
