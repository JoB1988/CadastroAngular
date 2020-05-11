import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from './shared/app.model';

@Injectable({
  providedIn: 'root'
})
export class AppService implements OnDestroy {

  // variável que recebe o valor de logado sim ou não
  public islogged$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // variável que recebe o valor do backend do nome e perfil do usuário
  public user$: BehaviorSubject<Usuario> = new BehaviorSubject(undefined);

  /* observador do usuário, caso ele escute alguma alteração, ele verifica se o valor é nulo, se sim
  retorna, se não, altera o valor da variavel isLogged$ para true*/
  private userSubscription = this.user$.subscribe(user => {
    if (!user) {
      return;
    }
    if (user.nome && user.perfil) {
      this.islogged$.next(true);
    }
  });

  // desincreve-se
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
