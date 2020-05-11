import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderModule } from './header/header.module';
import { RouterModule } from '@angular/router';
import { CadastroModule } from './cadastro/cadastro.module';
import { ToastComponent } from './shared/toast/toast.component';
import { MoradorComponent } from './morador/morador.component';

@NgModule({
  declarations: [AppComponent, ToastComponent, MoradorComponent],
  imports: [AppRoutingModule, RouterModule, BrowserModule, HeaderModule, CadastroModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
