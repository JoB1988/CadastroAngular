import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppService } from '../app.service';
import { Usuario } from '../shared/app.model';
import { NavigationService } from '../shared/services/navigation.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {

  /*variável que mostra o hambuger*/
  public hamburguer$ = new BehaviorSubject(false);

  /*variável que recebe controla a visibilidade dos links outrora escondidos*/
  public isLogged$ = new BehaviorSubject(false);

  /*variável que recebe mostra o nome do usuário no header da aplicação*/
  public user$: BehaviorSubject<Usuario> = new BehaviorSubject(undefined);

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

  /*observador da variável hamburguer$ da navigation, quando houver alguma alteração, ele
  mostra ou esconde o hamburguer*/
  public hamburguerSubscription = this.navigation.hamburguer$.subscribe((value: boolean) => {
    this.hamburguer$.next(value);
  });

  constructor(
    private readonly appService: AppService,
    private navigation: NavigationService
  ) { }

  // desinscreve-se
  ngOnDestroy(): void {
    this.isLoggedSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.hamburguerSubscription.unsubscribe();
  }

  open(event) {
    event.stopPropagation();
    this.navigation.openSideBar$.pipe(take(1)).subscribe(value => {
      this.navigation.openSideBar$.next(!value);
    });
  }
}
