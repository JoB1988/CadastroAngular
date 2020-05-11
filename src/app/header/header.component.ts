import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import { BehaviorSubject } from 'rxjs';

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

  public isLogged$ = new BehaviorSubject(false);

  constructor(private appService: AppService) { }


  ngOnDestroy(): void {
    this.isLoggedSubscription.unsubscribe();
  }

  logar() {
    this.appService.islogged$.next(true);
  }
}
