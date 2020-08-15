import { Component, ViewChild, ElementRef, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import { Important } from 'src/app/shared/methods';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Morador } from 'src/app/shared/app.model';

@Component({
  selector: 'app-morador-dialog',
  templateUrl: './morador-dialog.component.html',
  styleUrls: ['./morador-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MoradorDialogComponent implements OnInit {

  public moradorImage = null;
  public showImageSpinner = false;
  public labelImage = 'clique e escolha a imagem do morador';

  // variáveis do DOM
  @ViewChild('nameInput', { static: false }) nameInput: ElementRef;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('myForm', { static: false }) form: NgForm;

  // Patterns
  public lettersRegex = new RegExp(/^[a-zA-ZÁÉÍÓÚÝÀÈÌÒÙÂÊÎÔÛÄËÏÖÜàèìòùáéíóúýâêîôûäëïöüãõñçÇ. ]*$/);
  public numberRegex = new RegExp(/^[0-9]*$/);
  public cpfRegex = new RegExp(/^[0-9]{11}/);
  public rgRegex = new RegExp(/^(\d{7}|\d{8})([MXmx]|[0-9]{1})?$/);
  public telRegex = new RegExp(/^[0-9]{10}/);
  public emailRegex = new RegExp(/^[a-z0-9._-]+@[a-z0-9]+\.[a-z]+(\.[a-z]{2})?$/);
  public salaryRegex = new RegExp(/^[0-9]+(\.[0-9]{2})?$/);
  public dateRegex = new RegExp(/^\d{4}\-\d{2}\-\d{2}$/);

  // formulário com a composição dos validadores
  public moradorForm$: BehaviorSubject<FormGroup> = new BehaviorSubject(
    this.formBuilder.group({
      personal: this.formBuilder.group({
        photo: [''],
        name: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.pattern(this.lettersRegex)])],
        bornDate: ['', Validators.compose([Validators.required, Validators.pattern(this.dateRegex)])],
        age: [''],
        cpf: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.pattern(this.cpfRegex)])],
        rg: ['', Validators.compose(
          [Validators.required, Validators.minLength(7), Validators.maxLength(9), Validators.pattern(this.rgRegex)]
        )],
        tel: ['', Validators.pattern(this.telRegex)],
        cel: ['', Validators.pattern(this.cpfRegex)],
        email: ['', Validators.pattern(this.emailRegex)],
        civilStatus: ['', Validators.required]
      }),
      professional: this.formBuilder.group({
        profession: ['', Validators.pattern(this.lettersRegex)],
        salary: ['', Validators.pattern(this.salaryRegex)],
      }),
      condominium: this.formBuilder.group({
        block: ['', Validators.compose([Validators.required, Validators.pattern(this.lettersRegex)])],
        unit: ['', Validators.compose([Validators.required, Validators.pattern(this.numberRegex)])],
      }),
      familiar: this.formBuilder.group({
        partner: ['', Validators.pattern(this.lettersRegex)],
        partnerId: [''],
        dependents: ['']
      }),
      id: ['']
    }, { updateOn: 'blur' })
  );

  constructor(
    public readonly formBuilder: FormBuilder,
    public readonly elementRef: ElementRef,
    public dialogRef: MatDialogRef<MoradorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public morador: Morador
  ) { }

  public ngOnInit(): void {
    if (this.morador) {
      this.moradorImage = this.morador.personal.photo;
      this.moradorForm$.value.controls.personal['controls'].photo.setValue(this.morador.personal.photo);
      this.moradorForm$.value.controls.personal['controls'].name.setValue(this.morador.personal.name);
      this.moradorForm$.value.controls.personal['controls'].bornDate.setValue(this.morador.personal.birthDate);
      this.moradorForm$.value.controls.personal['controls'].age.setValue(this.morador.personal.age);
      this.moradorForm$.value.controls.personal['controls'].cpf.setValue(this.morador.personal.cpf);
      this.moradorForm$.value.controls.personal['controls'].rg.setValue(this.morador.personal.rg);
      this.moradorForm$.value.controls.personal['controls'].civilStatus.setValue(this.morador.personal.civilStatus);
      this.moradorForm$.value.controls.personal['controls'].tel.setValue(this.morador.personal.tel);
      this.moradorForm$.value.controls.personal['controls'].cel.setValue(this.morador.personal.cel);
      this.moradorForm$.value.controls.personal['controls'].email.setValue(this.morador.personal.email);
      this.moradorForm$.value.controls.professional['controls'].profession.setValue(this.morador.professional.profession);
      this.moradorForm$.value.controls.professional['controls'].salary.setValue(this.morador.professional.salary);
      this.moradorForm$.value.controls.condominium['controls'].block.setValue(this.morador.condominium.block);
      this.moradorForm$.value.controls.condominium['controls'].unit.setValue(this.morador.condominium.unit);
      this.moradorForm$.value.controls.familiar['controls'].partner.setValue(this.morador.familiar.partner.name);
      this.moradorForm$.value.controls.familiar['controls'].partnerId.setValue(this.morador.familiar.partner.id);
      this.moradorForm$.value.controls.id.setValue(this.morador.id);
      // this.moradorForm$.value.controls.familiar['controls'].dependents
      this.civilStatusChange(this.morador.personal.civilStatus);
    }
  }

  public getInputFile(event) {
    this.showImageSpinner = true;
    this.labelImage = 'carregando';
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // Read file as data url
      reader.onloadend = (e) => { // function call once readAsDataUrl is completed
        if (event.target.files[0].size < 5000000) {
          this.moradorImage = e.target.result;
        } else {
          console.log('imagem maior que 5MB');
        }
        this.labelImage = 'clique e escolha a imagem do morador';
        this.showImageSpinner = false;
      };
    }
  }

  public closeModal(save?: boolean) {
    if (!save) {
      this.dialogRef.close();
    } else {
      const morador: any = {};
      morador.personal = this.moradorForm$.value.value.personal;
      morador.personal.photo = this.moradorImage;
      morador.professional = this.moradorForm$.value.value.professional;
      morador.professional.salary = parseInt(morador.professional.salary, 0);
      morador.condominium = this.moradorForm$.value.value.condominium;
      morador.condominium.unit = parseInt(morador.condominium.unit, 0);
      morador.id = this.moradorForm$.value.value.id;
      morador.familiar = {
        partner: { name: '', id: null },
        dependents: []
      };
      if (morador.personal.civilStatus === 'casado(a)') {
        morador.familiar.partner.name = this.moradorForm$.value.value.familiar.partner;
        morador.familiar.partner.id = this.moradorForm$.value.value.familiar.partnerId;
      }
      this.dialogRef.close(morador);
    }
  }

  public cleanForm(btnName: string) {
    if (btnName.toLowerCase() === 'limpar') {
      this.fileInput.nativeElement.value = '';
      this.moradorImage = '';
      Important.cleanForm(this.nameInput, this.form);
    } else {
      this.closeModal();
    }
  }

  public civilStatusChange(civilStatus: string) {
    if (civilStatus.toLowerCase() === 'casado(a)') {
      this.moradorForm$.value.controls.familiar['controls'].partner.setValidators(Validators.required);
      this.moradorForm$.value.controls.familiar['controls'].partner.enable();
      return;
    }
    this.moradorForm$.value.controls.familiar['controls'].partner.setValidators(null);
    this.moradorForm$.value.controls.familiar['controls'].partner.disable();
  }

  public allowNumbers(event) {
    Important.allowNumbers(event);
  }

  public displayError(formControl: string, formControlName: string): string {
    const error = this.moradorForm$.value.controls[formControl]['controls'][formControlName].errors;
    const touched = this.moradorForm$.value.controls[formControl]['controls'][formControlName].touched;
    if (!error || !touched) {
      return '';
    }
    if (error.required) {
      return 'Campo obrigatório';
    } else if (error.minlength || error.pattern) {
      if ((error.minlength && error.pattern) || error.pattern) {
        return `Valor incorreto <i aria-hidden="true" class="fa fa-question"></i><span>${this.regexMessages(formControlName)}</span>`;
      }
      if (error.minlength) {
        return 'Campo mínimo de ' + error.minlength.requiredLength + ' caracteres';
      }
    }
  }

  private regexMessages(formControl: string): string {
    let message = '';
    switch (formControl) {
      case 'name':
      case 'profession':
      case 'block':
      case 'partner':
        message = 'Digite somente letras.';
        break;
      case 'bornDate':
        message = 'Digite 2 digitos para o dia, 2 digitos para o mês e 4 digitos para o ano.';
        break;
      case 'bornDate':
      case 'cel':
      case 'cpf':
        message = 'Digite somente 11 números.';
        break;
      case 'tel':
        message = 'Digite somente 12 números.';
        break;
      case 'email':
        message = 'Digite um email que contenha algo como nome@servidor.extenção ou nome@servidor.extenção.extenção';
        break;
      case 'salary':
      case 'unit':
        message = 'Digite somente números.';
        break;
      case 'rg':
        message = 'Digite 8 números mais o digito se possuir, podendo ser número ou a letra m ou a letra x.';
        break;
      default:
        break;
    }
    return message;
  }
}

// ajustar hint quebrado
