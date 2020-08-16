import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { NavigationService } from './shared/services/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private navigation: NavigationService
  ) { }

  ngOnInit(): void {
    if (window.innerWidth < 683) {
      this.navigation.hamburguer$.next(true);
    } else {
      this.navigation.hamburguer$.next(false);
    }
  }

  @HostListener('window:resize', ['$event']) onResize(event) {
    if (event.target.innerWidth < 683) {
      this.navigation.hamburguer$.next(true);
    } else {
      this.navigation.hamburguer$.next(false);
    }
  }
}
