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

  public hamburguer$ = new BehaviorSubject(false);

  public isLogged$ = new BehaviorSubject(false);

  public user$: BehaviorSubject<Usuario> = new BehaviorSubject(undefined);

  public isLoggedSubscription = this.appService.islogged$.subscribe(isLogged => {
    if (!isLogged) {
      return;
    }
    this.isLogged$.next(isLogged);
  });

  public userSubscription = this.appService.user$.subscribe(user => {
    if (!user) {
      return;
    }
    this.user$.next(user);
  });

  public hamburguerSubscription = this.navigation.hamburguer$.subscribe(value => {
    this.hamburguer$.next(value);
  });

  constructor(
    private readonly appService: AppService,
    private navigation: NavigationService
  ) { }

  public ngOnDestroy(): void {
    this.isLoggedSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.hamburguerSubscription.unsubscribe();
  }

  public openSideBar(event) {
    event.stopPropagation();
    this.navigation.openSideBar$.pipe(take(1)).subscribe(value => {
      this.navigation.openSideBar$.next(!value);
    });
  }
}
