import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  // formulário com a composição dos validadores
  public loginForm$: BehaviorSubject<FormGroup> = new BehaviorSubject(
    this.formBuilder.group({
      user: [''],
      password: ['']
    })
  );

  constructor(
    public readonly formBuilder: FormBuilder,
    private appService: AppService,
    private router: Router) { }

  // método que envia o formulário para o back-end e após isso redireciona para a página 'home'
  public onSubmit() {
    this.appService.user$.next({ nome: 'Jonathan', perfil: 5 });
    this.router.navigate(['/home']);
  }

}
