import { Component, ViewChild, ElementRef, Inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import { Important } from 'src/app/shared/methods';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Morador } from 'src/app/shared/app.model';
import { debug } from 'console';

@Component({
  selector: 'app-morador-dialog',
  templateUrl: './morador-dialog.component.html',
  styleUrls: ['./morador-dialog.component.scss']
})
export class MoradorDialogComponent implements OnInit {

  public image = null;
  public showPhotoSpinner = false;
  public labelPhoto = 'clique e escolha a imagem do morador';

  // variáveis do DOM
  @ViewChild('nameInput', { static: false }) nameInput: ElementRef;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('myForm', { static: false }) form: NgForm;

  // formulário com a composição dos validadores
  public moradorForm$: BehaviorSubject<FormGroup> = new BehaviorSubject(
    this.formBuilder.group({
      personal: this.formBuilder.group({
        photo: [''],
        name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        bornDate: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        cpf: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        rg: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        tel: ['', Validators.compose([Validators.pattern(null)])],
        cel: ['', Validators.compose([Validators.pattern(null)])],
        email: [''],
        civilStatus: ['', Validators.required]
      }),
      professional: this.formBuilder.group({
        profession: [''],
        salary: [''],
      }),
      condominium: this.formBuilder.group({
        block: ['', Validators.compose([Validators.required])],
        unit: ['', Validators.compose([Validators.required, Validators.pattern(null)])],
      }),
      familiar: this.formBuilder.group({
        partner: [''],
        partnerId: [''],
        dependents: ['']
      }),
      id: ['']
    })
  );

  constructor(
    public readonly formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MoradorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public morador: Morador
  ) { }

  ngOnInit(): void {
    if (this.morador) {
      this.image = this.morador.personal.photo;
      this.moradorForm$.value.controls.personal['controls'].photo.setValue(this.morador.personal.photo);
      this.moradorForm$.value.controls.personal['controls'].name.setValue(this.morador.personal.name);
      this.moradorForm$.value.controls.personal['controls'].bornDate.setValue(this.morador.personal.bornDate);
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
      this.civilStateChange(this.morador.personal.civilStatus);
    }
  }

  public getInputFile(event) {
    this.showPhotoSpinner = true;
    this.labelPhoto = 'carregando';
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // Read file as data url
      reader.onloadend = (e) => { // function call once readAsDataUrl is completed
        if (event.target.files[0].size < 5000000) {
          this.image = e.target.result;
        } else {
          console.log('imagem maior que 5MB');
        }
        this.labelPhoto = 'clique e escolha a imagem do morador';
        this.showPhotoSpinner = false;
      };
    }
  }

  public endModal(save?: boolean) {
    if (!save) {
      this.dialogRef.close();
    } else {
      const morador: any = {};
      morador.personal = this.moradorForm$.value.value.personal;
      morador.personal.photo = this.image;
      morador.professional = this.moradorForm$.value.value.professional;
      morador.professional.salary = parseInt(morador.professional.salary);
      morador.condominium = this.moradorForm$.value.value.condominium;
      morador.condominium.unit = parseInt(morador.condominium.unit);
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

  public cleanForm(value) {
    if (value.toLowerCase() === 'limpar') {
      this.fileInput.nativeElement.value = '';
      this.image = '';
      Important.cleanForm(this.nameInput, this.form);
    } else {
      this.endModal();
    }
  }

  public civilStateChange(value) {
    if (value.toLowerCase() === 'casado(a)') {
      this.moradorForm$.value.controls.familiar['controls'].partner.setValidators(
        Validators.compose([Validators.required, Validators.pattern(null)])
      );
      this.moradorForm$.value.controls.familiar['controls'].partner.enable();
      return;
    }
    this.moradorForm$.value.controls.familiar['controls'].partner.setValidators(null);
    this.moradorForm$.value.controls.familiar['controls'].partner.disable();
  }

}

// ajustar maskara dos campos
// ajustar erros do form


