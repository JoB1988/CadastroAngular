import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderModule } from './header/header.module';
import { RouterModule } from '@angular/router';
import { CadastroModule } from './cadastro/cadastro.module';
import { ToastComponent } from './shared/toast/toast.component';
import { MoradorComponent } from './morador/morador.component';
import { ModalComponent } from './shared/modal/modal.component';
import { LoginComponent } from './login/login.component';
import { AreasComumComponent } from './areas-comum/areas-comum.component';
import { ReservasComponent } from './reservas/reservas.component';
import { InventarioComponent } from './inventario/inventario.component';

@NgModule({
  declarations: [AppComponent, ToastComponent, MoradorComponent, ModalComponent, LoginComponent, AreasComumComponent, ReservasComponent, InventarioComponent],
  imports: [AppRoutingModule, RouterModule, BrowserModule, HeaderModule, CadastroModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
