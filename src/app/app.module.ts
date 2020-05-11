import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderModule } from './header/header.module';
import { RouterModule } from '@angular/router';
import { CadastroModule } from './cadastro/cadastro.module';
import { LoginModule } from './login/login.module';
import { AppGuardService } from './app.guard.service';
import { ReservasModule } from './reservas/reservas.module';
import { MoradorModule } from './morador/morador.module';
import { ToastModule } from './shared/toast/toast.module';
import { InventarioModule } from './inventario/inventario.module';
import { AreasComumModule } from './areas-comum/areas-comum.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    RouterModule,
    BrowserModule,
    HeaderModule,
    CadastroModule,
    LoginModule,
    ReservasModule,
    MoradorModule,
    ToastModule,
    InventarioModule,
    AreasComumModule],
  providers: [AppGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
