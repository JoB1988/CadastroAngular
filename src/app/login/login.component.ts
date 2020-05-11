import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { Important } from '../shared/methods';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../shared/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // formulário com a composição dos validadores
  public loginForm$: BehaviorSubject<FormGroup> = new BehaviorSubject(
    this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    })
  );

  // variáveis do DOM
  @ViewChild('nameInput', { static: true }) nameInput: ElementRef;
  @ViewChild('myForm', { static: true }) form: NgForm;

  constructor(
    public readonly formBuilder: FormBuilder,
    private appService: AppService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toast: ToastService) { }

  ngOnInit(): void {
    this.nameInput.nativeElement.focus();
  }

  // método que envia o formulário para o back-end e após isso redireciona para a página 'home'
  public onSubmit() {
    this.spinner.show();
    if (this.loginForm$.value.value.user === 'a' && this.loginForm$.value.value.password === 'a') {
      this.spinner.hide();
      this.appService.user$.next({ nome: 'Jonathan', perfil: 5 });
      this.router.navigate(['/home']);
    } else {
      this.spinner.hide();
      this.toast.toast$.next({ message: 'Login ou Senha não conferem', type: 'error', show: true });
    }
  }

  public cleanForm() {
    Important.cleanForm(this.nameInput, this.form);
  }


}
