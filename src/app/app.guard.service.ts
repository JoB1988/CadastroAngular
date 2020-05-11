import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppService } from './app.service';


@Injectable({
    providedIn: 'root'
})
export class AppGuardService implements CanActivate {

    constructor(private appService: AppService, private router: Router) { }

    /* verifica se o usuário está logado, se sim devolve true, caso contrário false e redireciona
    para a página de login*/
    canActivate() {
        if (!this.appService.islogged$.value) {
            this.router.navigate(['/login']);
        }
        return this.appService.islogged$.value;
    }

}
