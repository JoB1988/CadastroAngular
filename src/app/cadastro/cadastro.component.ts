import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FormBuilder, FormGroup, Validators, NgForm, ValidationErrors, FormControl, AbstractControl } from '@angular/forms';
import { CadastroService } from './cadastro.service';
import { debounceTime } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../shared/toast/toast.service';
import { Cadastro } from '../shared/app.model';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit, OnDestroy {

  // regex
  private cepRegex = new RegExp(/\d{5}-?\d{3}/);
  private numeroRegex = new RegExp(/\d{1,5}/);
  private nomeRegex = new RegExp(/^[a-zA-ZÁÉÍÓÚÝÀÈÌÒÙÂÊÎÔÛÄËÏÖÜàèìòùáéíóúýâêîôûäëïöüãõñçÇ. ]*$/);
  private ruaRegex = new RegExp(/^[a-zA-ZÁÉÍÓÚÝÀÈÌÒÙÂÊÎÔÛÄËÏÖÜàèìòùáéíóúýâêîôûäëïöüãõñçÇ0-9ºª ]*$/);

  // variável do loading
  public carregando$: BehaviorSubject<string> = new BehaviorSubject('valor inicial');

  // formulário com a composição dos validadores
  public cadastroForm$: BehaviorSubject<FormGroup> = new BehaviorSubject(
    this.formBuilder.group({
      pessoa: this.formBuilder.group({
        nome: [
          '',
          {
            validators: [
              Validators.compose([
                Validators.required, Validators.minLength(2),
                Validators.pattern(this.nomeRegex)
              ])
            ],
            asyncValidators: this.nomeValidation.bind(this),
            updateOn: 'blur'
          }
        ],
        cep: ['', Validators.compose([Validators.required, Validators.pattern(this.cepRegex), Validators.maxLength(9)])],
        rua: ['', Validators.compose([Validators.required, Validators.pattern(this.ruaRegex)])],
        numero: ['', Validators.compose([Validators.required, Validators.pattern(this.numeroRegex)])],
        id: ['']
      })
    })
  );

  // inscrição do formulário
  public formSubscription = this.cadastroForm$.value.statusChanges.pipe(debounceTime(200)).subscribe(valid => {
    if (!this.cadastroForm$.value.valid) {
      return;
    }
  });

  public cadastros$ = new BehaviorSubject([]);
  public option$: BehaviorSubject<string> = new BehaviorSubject('saveForm');
  @ViewChild('nameInput', { static: true }) nameInput: ElementRef;
  @ViewChild('myForm', { static: true }) form: NgForm;

  constructor(
    public readonly formBuilder: FormBuilder,
    private readonly cadastroService: CadastroService,
    private spinner: NgxSpinnerService,
    private toast: ToastService
  ) { }

  // inicia chamando o método para pegar os cadastros e focando input nome
  ngOnInit(): void {
    this.getCadastro();
    this.nameInput.nativeElement.focus();
  }

  // se desinscreve do observable
  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  /*chama o serviço que pega um cadastro por id, no success se for um array, ele preenche o array
  de cadastros, se não for uma array e sim um objeto, ele chama o método edit, pois a resposta é
  fruto de uma busca de um objeto especifico, no erro não faz nada. No inicio da chamada do método,
  o spinner é mostrado na tela, no fim das requisições é escondido*/
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

  /*dá a opção de updateForm à variavel e chama o método setForm com o valor passado por parametro*/
  public edit(response) {
    this.option$.next('updateForm');
    this.setForm(response);
  }

  /*método que preenche os inputs do formulário coms os valores recebidos por parametros,
  depois foca no input de nome e limpa todas as mensagens de erro*/
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

  /*esse método foca o input nome, da a opção de saveForm, reseta os valores do form e dá aos
  spans de erro os valores iniciais do objeto, undefined
  */
  public cleanForm() {
    this.nameInput.nativeElement.focus();
    this.option$.next('saveForm');
    this.form.resetForm();
  }

  /*ao submeter o formulário, ele chama o método conforme a opção de novo cadastro ou atualizar
  existente passando por parametro o objeto, no success, ele chama o método de updateTable e 
  chama o método cleanForm, no error não faz nada. No inicio da chamada do método,
  o spinner é mostrado na tela, no fim das requisições é escondido. o Toast é chamado ao fim de
  cada operação.*/
  public onSubmit() {
    this.carregando$.next('salvando...');
    this.spinner.show();
    const formcadastrovalue = this.cadastroForm$.value.controls.pessoa.value;
    this.cadastroService[this.option$.getValue()](formcadastrovalue).subscribe(
      response => {
        this.spinner.hide();
        this.toast.toast$.next({ message: 'Salvo com sucesso', show: true, type: 'success' });
        this.updateTable(formcadastrovalue, response);
        this.cleanForm();
      },
      error => {
        console.log(error);
        this.spinner.hide();
        this.toast.toast$.next({ message: 'Erro ao salvar', show: true, type: 'error' });
      }
    );
  }

  /*verifica se a opção é de edição do objeto, se sim, percorre o array com filter, se o id do
  objeto cadastro for igual ao id do objeto antigo, o arrayposition recebe esse index, depois
  no array, vai lá no index que quer alterar e dá o valor do newCadastro, caso a opção não seja 
  atualizar o form, o array recebe um novo cadastro
  */
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

  /* chama o serviço de remoção do objeto, se der success, no array de objetos removemos o objeto
  desejado usando splice, que remove do arrayIndex até quanto quiser, indicado pelo 1, se der erro,
  não faz nada. No inicio da chamada do método, o spinner é mostrado na tela,
  no fim das requisições é escondido. o Toast é chamado ao fim de cada operação.*/
  public remove(id, arrayIndex) {
    this.carregando$.next('removendo...');
    this.spinner.show();
    this.cadastroService.delete(id).subscribe(
      response => {
        this.spinner.hide();
        this.toast.toast$.next({ message: 'Removido com sucesso', show: true, type: 'success' });
        this.cadastros$.value.splice(arrayIndex, 1);
      },
      error => {
        console.log(error);
        this.spinner.hide();
        this.toast.toast$.next({ message: 'Erro ao remover', show: true, type: 'error' });
      }
    );
  }

  /* ao sair de cada campo, ele chama o método nullInputVerify, que devolve uma string ou null,
  se o retorno for null, o método não faz nada, se o retorno for uma string, esse método chama
  outros métodos validadores, através do switch que validou o inputFieldName.
  */
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

  /* chama o serviço de busca de cep, se tiver sucesso mas a resposta for erro, dá o valor ao span
  de erro de 'cep não encontrado', se não, ele preenche o input de rua com o valor devolvido, se
  cair em algum erro, ele dá o valor ao span de erro de 'erro ao buscar cep'. No inicio da chamada
  do método, o spinner é mostrado na tela, no fim das requisições é escondido.
  */
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

  /* valida campo cep, se o tamanho do cep for diferente de 9, dá o valor ao span de erro de
  'digite 8 números', se o padrão estiver errado, dá o valor ao span de erro de 'formato inválido',
  qualquer outra coisa, chama a busca na api do cep
  */
  private cepValidation(value) {
    if (value.length !== 9) {
      this.cadastroForm$.value.controls.pessoa['controls'].cep.errors = 'digite 8 números';
    } else if (!this.cepRegex.test(value)) {
      this.cadastroForm$.value.controls.pessoa['controls'].cep.errors = 'formato inválido';
    } else {
      this.getAddress(value);
    }
  }

  /* valida campo numero, se o padrão estiver errado, dá o valor ao span de erro de 'formato inválido',
  qualquer outra coisa, dá o valor ao spand de erro de undefined
  */
  private numeroValidation(value) {
    if (!this.numeroRegex.test(value)) {
      this.cadastroForm$.value.controls.pessoa['controls'].numero.errors = 'apenas números';
    } else if (value == 0) {
      this.cadastroForm$.value.controls.pessoa['controls'].numero.errors = 'deve ser maior que 0';
    }
  }

  /* valida campo rua, se o padrão estiver errado, dá o valor ao span de erro de 'formato inválido',
  qualquer outra coisa, dá o valor ao spand de erro de undefined
  */
  private ruaValidation(value) {
    if (!this.ruaRegex.test(value)) {
      this.cadastroForm$.value.controls.pessoa['controls'].rua.errors = 'formato inválido';
    }
  }

  /* valida campo nome, se menor que 2, dá o valor ao span de erro de 'mínimo de duas letras',
  se não tiver o padrão correto, dá o valor ao span de erro de 'somente letras',
  se nada disso acima, dá o valor de undefined ao span de erro
  */
  private nomeValidation(value) {
    if (value.length < 2) {
      this.cadastroForm$.value.controls.pessoa['controls'].nome.errors = 'mínimo de duas letras';
    } else if (!this.nomeRegex.test(value)) {
      this.cadastroForm$.value.controls.pessoa['controls'].nome.errors = 'somente letras';
    }
  }

  /* esse método valida se o valor do input é válido,
  se sim, não faz nada, se não, dá o valor de 'campo obrigatório'
  no span
  */
  private nullInputVerify(inputName) {
    const VALUE = this.cadastroForm$.value.controls.pessoa['controls'][inputName].value;
    if (!VALUE) {
      this.cadastroForm$.value.controls.pessoa['controls'][inputName].errors = '*campo obrigatório';
    }
    return VALUE;
  }

  // método que lança o error no span de erro
  public getError(controlName: string): string | undefined {
    const value = this.cadastroForm$.value.controls.pessoa['controls'][controlName].errors;
    if (typeof value === 'string') {
      return value;
    }
  }
}
