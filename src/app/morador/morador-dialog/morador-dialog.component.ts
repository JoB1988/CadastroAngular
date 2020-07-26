import { Component, ViewChild, ElementRef, Inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import { Important } from 'src/app/shared/methods';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-morador-dialog',
  templateUrl: './morador-dialog.component.html',
  styleUrls: ['./morador-dialog.component.scss']
})
export class MoradorDialogComponent implements OnInit {

  public image = null;
  public resetButton = '';
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
        born: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        cpf: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        rg: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        tel: [''],
        cel: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        email: [''],
        civil: ['', Validators.required],
        id: ['']
      }),
      profesional: this.formBuilder.group({
        profession: [''],
        salary: [''],
      }),
      condominium: this.formBuilder.group({
        block: ['', Validators.compose([Validators.required])],
        unit: ['', Validators.compose([Validators.required, Validators.pattern(null)])],
      }),
      familiar: this.formBuilder.group({
        wife: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(null)])],
        children: [''],
      })
    })
  );

  constructor(
    public readonly formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MoradorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private morador: {}
  ) { }

  ngOnInit(): void {
    if (this.morador) {
      this.resetButton = 'Cancelar';
    } else {
      this.resetButton = 'Limpar';
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

  public endModal() {
    const MORADOR = this.moradorForm$.value.controls.personal.value;
    this.dialogRef.close({ modificated: true, morador: this.morador });
  }

  public cleanForm() {
    if (this.resetButton === 'Limpar') {
      this.fileInput.nativeElement.value = '';
      this.image = '';
      Important.cleanForm(this.nameInput, this.form);
    } else {
      this.endModal();
    }
  }
}

// popular campos
// ajustar maskara dos campos
// ajustar erros do form

