import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { CadastroService } from './cadastro.service';
import { debounceTime } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Cadastro } from '../shared/app.model';
import { Important } from '../shared/methods';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit, OnDestroy {

  private cepRegex = new RegExp(/\d{5}-?\d{3}/);
  private numeroRegex = new RegExp(/\d{1,5}/);
  private nomeRegex = new RegExp(/^[a-zA-ZÁÉÍÓÚÝÀÈÌÒÙÂÊÎÔÛÄËÏÖÜàèìòùáéíóúýâêîôûäëïöüãõñçÇ. ]*$/);
  private ruaRegex = new RegExp(/^[a-zA-ZÁÉÍÓÚÝÀÈÌÒÙÂÊÎÔÛÄËÏÖÜàèìòùáéíóúýâêîôûäëïöüãõñçÇ0-9ºª ]*$/);

  public carregando$: BehaviorSubject<string> = new BehaviorSubject('valor inicial');

  public cadastroForm$: BehaviorSubject<FormGroup> = new BehaviorSubject(
    this.formBuilder.group({
      pessoa: this.formBuilder.group({
        nome: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(this.nomeRegex)])],
        cep: ['', Validators.compose([Validators.required, Validators.pattern(this.cepRegex), Validators.maxLength(9)])],
        rua: ['', Validators.compose([Validators.required, Validators.pattern(this.ruaRegex)])],
        numero: ['', Validators.compose([Validators.required, Validators.pattern(this.numeroRegex)])],
        id: ['']
      })
    })
  );

  public formSubscription = this.cadastroForm$.value.statusChanges.pipe(debounceTime(200)).subscribe(valid => {
    if (!this.cadastroForm$.value.valid) {
      return;
    }
  });

  public cadastros$ = new BehaviorSubject([]);
  public option$: BehaviorSubject<string> = new BehaviorSubject('saveForm');

  @ViewChild('nameInput', { static: true }) nameInput: ElementRef<HTMLInputElement>;
  @ViewChild('myForm', { static: true }) form: NgForm;

  constructor(
    public readonly formBuilder: FormBuilder,
    private readonly cadastroService: CadastroService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getCadastro();
    this.nameInput.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  public getCadastro(id?: string) {
    this.carregando$.next('carregando cadastro...');
    this.spinner.show();
    this.cadastroService.getCadastro(id).subscribe(
      response => {
        if (response.length) {
          this.cadastros$.next(response);
        } else {
          this.edit(response);
        }
        this.spinner.hide();
      },
      error => { console.log(error); this.spinner.hide(); }
    );
  }

  public edit(response) {
    this.option$.next('updateForm');
    this.setForm(response);
  }

  public setForm(
    cadastro: Cadastro = { nome: '', cep: '', rua: '', numero: null, id: null }
  ) {
    this.cadastroForm$.value.controls.pessoa.setValue({
      nome: cadastro.nome,
      cep: cadastro.cep,
      rua: cadastro.rua,
      numero: cadastro.numero || '',
      id: cadastro.id
    });
    this.nameInput.nativeElement.focus();
  }

  public cleanForm() {
    Important.cleanForm(this.nameInput, this.form);
    this.option$.next('saveForm');
  }

  public onSubmit() {
    this.carregando$.next('salvando...');
    this.spinner.show();
    const formcadastrovalue = this.cadastroForm$.value.controls.pessoa.value;
    this.cadastroService[this.option$.getValue()](formcadastrovalue).subscribe(
      response => {
        this.spinner.hide();
        console.log({ message: 'Salvo com sucesso', show: true, type: 'success' });
        this.updateTable(formcadastrovalue, response);
        this.cleanForm();
      },
      error => {
        console.log(error);
        this.spinner.hide();
        console.log({ message: 'Erro ao salvar', show: true, type: 'error' });
      }
    );
  }

  public updateTable(oldValue?: Cadastro, newCadastro?: Cadastro) {
    if (this.option$.getValue() === 'updateForm') {
      let arrayPosition;
      this.cadastros$.value.filter((cadastro, index) => {
        cadastro.id === oldValue.id ? arrayPosition = index : undefined;
      });
      this.cadastros$.value[arrayPosition] = newCadastro;
    } else {
      this.cadastros$.value.push(newCadastro);
    }
  }

  public remove(id, arrayIndex) {
    this.carregando$.next('removendo...');
    this.spinner.show();
    this.cadastroService.delete(id).subscribe(
      response => {
        this.spinner.hide();
        console.log({ message: 'Removido com sucesso', show: true, type: 'success' });
        this.cadastros$.value.splice(arrayIndex, 1);
      },
      error => {
        console.log(error);
        this.spinner.hide();
        console.log({ message: 'Erro ao remover', show: true, type: 'error' });
      }
    );
  }

  public blurInput(inputFieldName) {
    let value = this.nullInputVerify(inputFieldName);
    if (!value) {
      return;
    }
    value = value.trim();
    switch (inputFieldName) {
      case 'cep':
        this.cepValidation(value);
        break;
      case 'nome':
        this.nomeValidation(value);
        break;
      case 'rua':
        this.ruaValidation(value);
        break;
      case 'numero':
        this.numeroValidation(value);
        break;
      default:
        break;
    }
  }

  private getAddress(cep: string) {
    this.carregando$.next('buscando cep...');
    this.spinner.show();
    this.cadastroService.getAddress(cep).subscribe(
      direction => {
        if (direction.erro === true) {
          this.cadastroForm$.value.controls.pessoa['controls'].cep.errors = 'cep não encontrado';
        }
        this.cadastroForm$.value.controls.pessoa['controls'].rua.setValue(
          direction.logradouro
        );
        this.spinner.hide();
      },
      error => {
        this.cadastroForm$.value.controls.pessoa['controls'].cep.errors = 'erro ao buscar cep';
        this.spinner.hide();
      });
  }

  private cepValidation(value) {
    if (value.length !== 9) {
      this.cadastroForm$.value.controls.pessoa['controls'].cep.errors = 'digite 8 números';
    } else if (!this.cepRegex.test(value)) {
      this.cadastroForm$.value.controls.pessoa['controls'].cep.errors = 'formato inválido';
    } else {
      this.getAddress(value);
    }
  }

  private numeroValidation(value) {
    if (!this.numeroRegex.test(value)) {
      this.cadastroForm$.value.controls.pessoa['controls'].numero.errors = 'apenas números';
    } else if (value == 0) {
      this.cadastroForm$.value.controls.pessoa['controls'].numero.errors = 'deve ser maior que 0';
    }
  }

  private ruaValidation(value) {
    if (!this.ruaRegex.test(value)) {
      this.cadastroForm$.value.controls.pessoa['controls'].rua.errors = 'formato inválido';
    }
  }

  private nomeValidation(value) {
    if (value.length < 2) {
      this.cadastroForm$.value.controls.pessoa['controls'].nome.errors = 'mínimo de duas letras';
    } else if (!this.nomeRegex.test(value)) {
      this.cadastroForm$.value.controls.pessoa['controls'].nome.errors = 'somente letras';
    }
  }

  private nullInputVerify(inputName) {
    const VALUE = this.cadastroForm$.value.controls.pessoa['controls'][inputName].value;
    if (!VALUE) {
      this.cadastroForm$.value.controls.pessoa['controls'][inputName].errors = '*campo obrigatório';
    }
    return VALUE;
  }

  public getError(controlName: string): string | undefined {
    const value = this.cadastroForm$.value.controls.pessoa['controls'][controlName].errors;
    if (typeof value === 'string') {
      return value;
    }
  }
}
