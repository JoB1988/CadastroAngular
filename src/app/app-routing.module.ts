import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';

const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./cadastro/cadastro.module').then(m => m.CadastroModule)
  },
  {
    path: 'areas-comum',
    loadChildren: () => import('./areas-comum/areas-comum.module').then(m => m.AreasComumModule)
  },
  {
    path: 'inventario',
    loadChildren: () => import('./inventario/inventario.module').then(m => m.InventarioModule),
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'moradores',
    loadChildren: () => import('./morador/morador.module').then(m => m.MoradorModule)
  },
  {
    path: 'reservas',
    loadChildren: () => import('./reservas/reservas.module').then(m => m.ReservasModule)
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
