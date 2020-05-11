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
import { AppGuardService } from './app.guard.service';

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
    component: CadastroComponent,
    canActivate: [AppGuardService]
  },
  {
    path: 'areas-comum',
    component: AreasComumComponent,
    canActivate: [AppGuardService]
  },
  {
    path: 'inventario',
    component: InventarioComponent,
    canActivate: [AppGuardService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'moradores',
    component: MoradorComponent,
    canActivate: [AppGuardService]
  },
  {
    path: 'reservas',
    component: ReservasComponent,
    canActivate: [AppGuardService]
  },
  {
    path: 'historico-reservas',
    component: LogReservasComponent,
    canActivate: [AppGuardService]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
