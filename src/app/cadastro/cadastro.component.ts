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

  public cadastroForm$: BehaviorSubject<FormGroup> = new BehaviorSubject(
    this.formBuilder.group({
      // tslint:disable-next-line: max-line-length
      pessoa: this.formBuilder.group({
        nome: [
          '',
          Validators.compose(
            [
              Validators.required,
              Validators.minLength(2),
              Validators.pattern(/^[a-zA-ZÁÉÍÓÚÝÀÈÌÒÙÂÊÎÔÛÄËÏÖÜàèìòùáéíóúýâêîôûäëïöüãõñçÇ ]*$/)
            ]
          )
        ],
        cep: ['', Validators.compose([Validators.required, Validators.pattern(/\d{5}-\d{3}/)])],
        rua: ['', Validators.compose([Validators.required])],
        numero: ['', Validators.compose([Validators.required, Validators.pattern(/\d{1,5}/)])],
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
      numero: cadastro.numero,
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

  public getAddress() {
    const cep = this.cadastroForm$.value.controls.pessoa.value.cep;
    this.cadastroService.getAddress(cep).subscribe(
      direction => {
        this.cadastroForm$.value.controls.pessoa['controls'].rua.setValue(
          direction.logradouro
        );
      },
      error => console.log(error)
    );
  }

  public remove(id, arrayIndex) {
    this.cadastroService.delete(id).subscribe(
      response => {
        this.cadastros$.value.splice(arrayIndex, 1);
      },
      error => console.log(error)
    );
  }

}
