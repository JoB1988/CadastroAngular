import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AppService } from '../app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Important } from '../shared/methods';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  @ViewChild('nameInput', { static: true }) nameInput: ElementRef<HTMLInputElement>;
  @ViewChild('myForm', { static: true }) form: NgForm;

  public desiredUrl = '/home';

  public loginForm$: BehaviorSubject<FormGroup> = new BehaviorSubject(
    this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    })
  );

  // observable que escuta a url que a pessoa queria acessar antes de entrar no login
  public routeSubscription = this.activatedRoute.queryParams.subscribe(value => {
    if (value.fromUrl) { this.desiredUrl = value.fromUrl; }
  });

  constructor(
    public readonly formBuilder: FormBuilder,
    private appService: AppService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  public ngOnInit(): void {
    this.nameInput.nativeElement.focus();
  }

  public login() {
    this.spinner.show();
    if (this.loginForm$.value.value.user === 'a' && this.loginForm$.value.value.password === 'a') {
      this.spinner.hide();
      this.appService.user$.next({ nome: 'Jonathan', perfil: 5 });
      this.router.navigate([this.desiredUrl]);
    } else {
      this.spinner.hide();
      console.log({ message: 'Login ou Senha não conferem', type: 'error', show: true });
    }
  }

  public cleanForm() {
    Important.cleanForm(this.nameInput, this.form);
  }
}
