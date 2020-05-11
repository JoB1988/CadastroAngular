import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../shared/models/usuario';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {

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

  public isLogged$ = new BehaviorSubject(false);
  public user$: BehaviorSubject<Usuario> = new BehaviorSubject(undefined);

  constructor(private appService: AppService) { }


  ngOnDestroy(): void {
    this.isLoggedSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

}
