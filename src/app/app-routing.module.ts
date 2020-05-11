import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AreasComumComponent } from './areas-comum/areas-comum.component';
import { InventarioComponent } from './inventario/inventario.component';
import { LoginComponent } from './login/login.component';
import { MoradorComponent } from './morador/morador.component';
import { ReservasComponent } from './reservas/reservas.component';
import { LogReservasComponent } from './log-reservas/log-reservas.component';

const routes: Routes = [
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
    component: CadastroComponent
  },
  {
    path: 'areas-comum',
    component: AreasComumComponent
  },
  {
    path: 'inventario',
    component: InventarioComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'moradores',
    component: MoradorComponent
  },
  {
    path: 'reservas',
    component: ReservasComponent
  },
  {
    path: 'historico-reservas',
    component: LogReservasComponent
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
