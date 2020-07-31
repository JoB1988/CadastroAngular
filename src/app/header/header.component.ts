import { Component, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../shared/app.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {

  /*observador da variável islogged$ da appService, quando houver alguma alteração, se undefined,
  retorna, se vier alguma valor, ele preenche a variável isLogged$ desse componente com o o valor*/
  public isLoggedSubscription = this.appService.islogged$.subscribe(isLogged => {
    if (!isLogged) {
      return;
    }
    this.isLogged$.next(isLogged);
  });

  /*observador da variável user$ da appService, quando houver alguma alteração, se undefined,
  retorna, se vier alguma valor, ele preenche a variável user$ desse componente com o o valor*/
  public userSubscription = this.appService.user$.subscribe(user => {
    if (!user) {
      return;
    }
    this.user$.next(user);
  });

  /*variável que recebe controla a visibilidade dos links outrora escondidos*/
  public isLogged$ = new BehaviorSubject(false);

  /*variável que recebe mostra o nome do usuário no header da aplicação*/
  public user$: BehaviorSubject<Usuario> = new BehaviorSubject(undefined);

  constructor(private appService: AppService) { }

  // desinscreve-se
  ngOnDestroy(): void {
    this.isLoggedSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
