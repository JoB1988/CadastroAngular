import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AppService } from './app.service';

@Injectable({
    providedIn: 'root'
})
export class AppGuardService implements CanActivate {

    constructor(
        private appService: AppService,
        private router: Router
    ) { }

    /* verifica se o usuário está logado, se sim devolve true, caso contrário false e redireciona
    para a página de login*/
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.appService.islogged$.value) {
            // ele verifica se está logado, se não estiver, ele vai pra tela de login,
            // porém a rota fica salva a de onde ele queria acessar
            this.router.navigate(['/login'], {
                queryParams: {
                    fromUrl: state.url
                }
            });
        }
        return this.appService.islogged$.value;
    }

}
