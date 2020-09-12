import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReservasResolve } from './reservas/reservas.resolver.service';

const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Sign In' }
  },
  {
    path: 'funcionarios',
    loadChildren: () => import('./cadastro/cadastro.module').then(m => m.CadastroModule),
    data: { title: 'Funcionários' }
  },
  {
    path: 'areas-comum',
    loadChildren: () => import('./areas-comum/areas-comum.module').then(m => m.AreasComumModule),
    data: { title: 'Áreas Comum' }
  },
  {
    path: 'moradores',
    loadChildren: () => import('./morador/morador.module').then(m => m.MoradorModule),
    data: { title: 'Moradores' }
  },
  {
    path: 'reservas',
    loadChildren: () => import('./reservas/reservas.module').then(m => m.ReservasModule),
    resolve: {
      logs: ReservasResolve
    }
  },
  {
    path: '**',
    redirectTo: 'not-found'
  },
  {
    path: 'not-found',
    loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule),
    data: { title: 'Não Encontrado' }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      ROUTES,
      {
        preloadingStrategy: PreloadAllModules,
        useHash: true
      }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
