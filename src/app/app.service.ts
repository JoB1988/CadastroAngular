import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from './shared/app.model';

@Injectable({
  providedIn: 'root'
})
export class AppService implements OnDestroy {

  public islogged$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public user$: BehaviorSubject<Usuario> = new BehaviorSubject(undefined);

  private userSubscription = this.user$.subscribe(user => {
    if (!user) {
      return;
    }
    if (user.nome && user.perfil) {
      this.islogged$.next(true);
    }
  });
  constructor() { }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
