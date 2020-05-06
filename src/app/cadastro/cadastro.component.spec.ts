import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroComponent } from './cadastro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastroService } from './cadastro.service';
import { HttpClientModule } from '@angular/common/http';

const CADASTRO = [{
  nome: 'Flávio',
  cep: '09790000',
  rua: 'Av. Albert Schweitzer',
  numero: 490,
  id: 4
},
{
  nome: 'Jonathan',
  cep: '09890430',
  rua: 'Rua Professor Rubião Meira',
  numero: 266,
  id: 9
}, {
  nome: 'Silvia',
  cep: '09890430',
  rua: 'Rua Professor Rubião Meira',
  numero: 266,
  id: 10
},
{
  nome: 'Antonia',
  cep: '09790000',
  rua: 'Av. Albert Schweitzer',
  numero: 490,
  id: 11
}];

describe('CadastroComponent', () => {
  let component: CadastroComponent;
  let fixture: ComponentFixture<CadastroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule],
      providers: [CadastroService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test ngOnInit', () => {
    spyOn(component, 'cleanForm');
    spyOn(component, 'getCadastro');
    component.ngOnInit();
    expect(component.cleanForm).toHaveBeenCalledTimes(1);
    expect(component.getCadastro).toHaveBeenCalledTimes(1);
  });

  it('should test edit', () => {
    spyOn(component.option$, 'next');
    spyOn(component, 'setForm');
    const response = { value: '1234', number: 1234 };
    component.edit(response);
    expect(component.option$.next).toHaveBeenCalledTimes(1);
    expect(component.option$.next).toHaveBeenCalledWith('updateForm');
    expect(component.setForm).toHaveBeenCalledTimes(1);
    // expect(component.setForm).toHaveBeenCalledWith(response);
  });

  it('should test setForm', () => {
    const spy = spyOn(component.cadastroForm$.value.controls.pessoa, 'setValue');
    component.setForm();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ nome: '', cep: '', rua: '', numero: null, id: null });
  });

  it('should test cleanForm', () => {
    const spy = spyOn(component.nameInput.nativeElement, 'focus');
    spyOn(component.option$, 'next');
    spyOn(component, 'setForm');
    component.cleanForm();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.setForm).toHaveBeenCalledTimes(1);
    expect(component.option$.next).toHaveBeenCalledWith('saveForm');
  });

  it('should test updateTable wit value saveForm', () => {
    component.option$.next('saveForm');
    const spy = spyOn(component.cadastros$.value, 'push');
    component.updateTable(undefined, CADASTRO[0]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(CADASTRO[0]);
  });

  it('should test updateTable with value updateForm', () => {
    const NEWCADASTRO = {
      nome: 'Flávio',
      cep: '09790000',
      rua: 'Rua Professor Rubião Meira',
      numero: 490,
      id: 4
    };
    const spy = spyOn(component.cadastros$.value, 'push');
    component.cadastros$.next(CADASTRO);
    component.option$.next('updateForm');
    component.updateTable(CADASTRO[0], NEWCADASTRO);
    expect(spy).not.toHaveBeenCalled();
    expect(component.cadastros$.value[0]).toEqual(NEWCADASTRO);
  });

  it('should test updateTable call for method filter', () => {
    component.cadastros$.next(CADASTRO);
    component.option$.next('updateForm');
    const spy = spyOn(component.cadastros$.value, 'filter');
    component.updateTable(CADASTRO[0], CADASTRO[1]);
    expect(spy).toHaveBeenCalled();
  });

  // FALTA getCadastro, getAddress, onSubmit, remove
});
