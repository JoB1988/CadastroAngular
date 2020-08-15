import { Component, OnDestroy, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavigationService } from '../shared/services/navigation.service';
import { AppService } from '../app.service';
import { withLatestFrom } from 'rxjs/operators';
import { Usuario } from '../shared/app.model';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnDestroy {

  /*variável que permite abrir side bar*/
  public hambuguer$ = new BehaviorSubject(false);

  /*variável que mostra o hambuger*/
  public menu$ = new BehaviorSubject(false);

  /*variável que recebe controla a visibilidade dos links outrora escondidos*/
  public isLogged$ = new BehaviorSubject(false);

  /*variável que recebe mostra o nome do usuário no header da aplicação*/
  public user$: BehaviorSubject<Usuario> = new BehaviorSubject(undefined);

  /*observador da variável openSideBar$ da navigation, quando houver alguma alteração, ele
  mostra ou esconde o menu lateral*/
  public menuSubscription = this.navigation.openSideBar$.subscribe(value => {
    if (this.hambuguer$.value) {
      this.menu$.next(value);
    }
  });

  /*observador da variável hamburguer$ da navigation, quando houver alguma alteração, ele
  mostra ou esconde o menu lateral*/
  public hamburguerSubscription = this.navigation.hamburguer$.subscribe(value => {
    this.hambuguer$.next(value);
    if (!value) {
      this.menu$.next(value);
    }
  });

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

  constructor(
    private readonly appService: AppService,
    private readonly navigation: NavigationService
  ) { }

  public ngOnDestroy(): void {
    this.hamburguerSubscription.unsubscribe();
    this.isLoggedSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.menuSubscription.unsubscribe();
  }

  //  Ao dar resize, ele verifica a necessidade de mostrar o hamburguer
  @HostListener('window:click', ['$event']) onClickPage() {
    this.close();
  }

  public close() {
    this.navigation.openSideBar$.next(false);
  }
}
