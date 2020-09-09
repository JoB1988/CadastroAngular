import { Component, HostListener, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { NavigationService } from './shared/services/navigation.service';
import { isPlatformBrowser } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd, ActivationStart } from '@angular/router';
import { filter, map, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private routerSubscription = this.router.events
    // devolve um arry que seja uma instancia de NavigationEnd
    .pipe(filter(event => event instanceof NavigationEnd))
    // this.activatedRoute vira activatedRoute
    .pipe(map(() => this.activatedRoute))
    .pipe(map((activatedRoute) => {
      while (activatedRoute.firstChild) {
        activatedRoute = activatedRoute.firstChild;
      }
      return activatedRoute;
    }))
    // pega tudo acima e troca para isso
    .pipe(switchMap(route => route.data))
    .subscribe((event) => {
      // muda o title da página
      this.title.setTitle('Cadastro 3000: ' + event.title);
    });

  constructor(
    private navigation: NavigationService,
    // para checar a plataforma
    @Inject(PLATFORM_ID) private platformId: string,
    private title: Title,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
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
