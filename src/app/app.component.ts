import { Component, HostListener, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { NavigationService } from './shared/services/navigation.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private navigation: NavigationService,
    // para checar a plataforma
    @Inject(PLATFORM_ID) private platformId: string
  ) { }

  ngOnInit(): void {
    if (window.innerWidth < 683) {
      this.navigation.hamburguer$.next(true);
    } else {
      this.navigation.hamburguer$.next(false);
    }
    // para checar a plataforma
    console.log(isPlatformBrowser(this.platformId));
  }

  @HostListener('window:resize', ['$event']) onResize(event) {
    if (event.target.innerWidth < 683) {
      this.navigation.hamburguer$.next(true);
    } else {
      this.navigation.hamburguer$.next(false);
    }
  }
}
