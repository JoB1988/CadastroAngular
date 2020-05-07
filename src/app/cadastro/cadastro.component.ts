import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadastroService } from './cadastro.service';
import { Cadastro } from './cadastro';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  private cepRegex = new RegExp(/\d{5}-?\d{3}/);
  private numeroRegex = new RegExp(/\d{1,5}/);
  private nomeRegex = new RegExp(/^[a-zA-ZÁÉÍÓÚÝÀÈÌÒÙÂÊÎÔÛÄËÏÖÜàèìòùáéíóúýâêîôûäëïöüãõñçÇ ]*$/);
  private ruaRegex = new RegExp(/^[a-zA-ZÁÉÍÓÚÝÀÈÌÒÙÂÊÎÔÛÄËÏÖÜàèìòùáéíóúýâêîôûäëïöüãõñçÇ0-9ºª ]*$/);
  public errorMessages$: BehaviorSubject<any> = new BehaviorSubject({
    nome: undefined,
    cep: undefined,
    rua: undefined,
    numero: undefined
  });

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
  
  public cadastros$ = new BehaviorSubject([]);
  public option$: BehaviorSubject<string> = new BehaviorSubject(undefined);
  @ViewChild('nameInput', { static: true }) nameInput: ElementRef;

  constructor(
    public readonly formBuilder: FormBuilder,
    private readonly cadastroService: CadastroService
  ) { }

  ngOnInit(): void {
    this.cleanForm();
    this.getCadastro();
  }

  public getCadastro(id?: string) {
    this.cadastroService.getCadastro(id).subscribe(
      response => {
        if (response.length) {
          this.cadastros$.next(response);
        } else {
          this.edit(response);
        }
      },
      error => console.log(error)
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
  }

  public cleanForm() {
    this.nameInput.nativeElement.focus();
    this.option$.next('saveForm');
    this.setForm();
  }

  public onSubmit() {
    const formcadastrovalue = this.cadastroForm$.value.controls.pessoa.value;
    this.cadastroService[this.option$.getValue()](formcadastrovalue).subscribe(
      response => {
        this.updateTable(formcadastrovalue, response);
        this.cleanForm();
      },
      error => console.log(error)
    );
  }

  public updateTable(oldValue?: Cadastro, newCadastro?: Cadastro) {
    if (this.option$.getValue() === 'updateForm') {
      let arrayPosition;
      this.cadastros$.value.filter((cadastro, index) => {
        cadastro.id === oldValue.id ? arrayPosition = index : null;
      });
      this.cadastros$.value[arrayPosition] = newCadastro;
    } else {
      this.cadastros$.value.push(newCadastro);
    }
  }

  public remove(id, arrayIndex) {
    this.cadastroService.delete(id).subscribe(
      response => {
        this.cadastros$.value.splice(arrayIndex, 1);
      },
      error => console.log(error)
    );
  }

  public blurInput(inputFieldName) {
    switch (inputFieldName) {
      case 'cep':
        this.cepValidation();
        break;
      case 'nome':
        this.nomeValidation();
        break;
      case 'rua':
        this.ruaValidation();
        break;
      case 'numero':
        this.numeroValidation();
        break;

      default:
        break;
    }
  }

  private getAddress(cep: string) {
    this.cadastroService.getAddress(cep).subscribe(
      direction => {
        if (direction.erro === true) {
          this.errorMessages$.next({ ...this.errorMessages$.value, cep: 'cep não encontrado' });
        } else {
          this.errorMessages$.next({ ...this.errorMessages$.value, cep: undefined, rua: undefined });
        }
        this.cadastroForm$.value.controls.pessoa['controls'].rua.setValue(
          direction.logradouro
        );
      },
      error => {
        this.errorMessages$.next({ ...this.errorMessages$.value, cep: 'cep não encontrado' });
      });
  }

  private cepValidation() {
    const cep = this.cadastroForm$.value.controls.pessoa['controls'].cep.value.trim();
    if (!cep) {
      this.errorMessages$.next({ ...this.errorMessages$.value, cep: 'campo obrigatório' });
    } else if (cep.length !== 9) {
      this.errorMessages$.next({ ...this.errorMessages$.value, cep: 'digite 8 números' });
    } else if (!this.cepRegex.test(cep)) {
      this.errorMessages$.next({ ...this.errorMessages$.value, cep: 'formato inválido' });
    } else {
      this.getAddress(cep);
    }
  }

  private numeroValidation() {
    const numero = this.cadastroForm$.value.controls.pessoa['controls'].numero.value.trim();
    if (!numero) {
      this.errorMessages$.next({ ...this.errorMessages$.value, numero: 'campo obrigatório' });
    } else if (!this.numeroRegex.test(numero)) {
      this.errorMessages$.next({ ...this.errorMessages$.value, numero: 'apenas números' });
    } else {
      this.errorMessages$.next({ ...this.errorMessages$.value, numero: undefined});
    }
  }

  private ruaValidation() {
    const rua = this.cadastroForm$.value.controls.pessoa['controls'].rua.value.trim();
    if (!rua) {
      this.errorMessages$.next({ ...this.errorMessages$.value, rua: 'campo obrigatório' });
    } else if (!this.ruaRegex.test(rua)) {
      this.errorMessages$.next({ ...this.errorMessages$.value, rua: 'formato inválido' });
    } else {
      this.errorMessages$.next({ ...this.errorMessages$.value, rua: undefined });
    }
  }

  private nomeValidation() {
    const nome = this.cadastroForm$.value.controls.pessoa['controls'].nome.value.trim();
    if (!nome) {
      this.errorMessages$.next({ ...this.errorMessages$.value, nome: 'campo obrigatório' });
    } else if (!this.nomeRegex.test(nome)) {
      this.errorMessages$.next({ ...this.errorMessages$.value, nome: 'somente letras' });
    } else {
      this.errorMessages$.next({ ...this.errorMessages$.value, nome: undefined });
    }
  }

}
