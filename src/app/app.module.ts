import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderModule } from './header/header.module';
import { RouterModule } from '@angular/router';
import { CadastroModule } from './cadastro/cadastro.module';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  declarations: [AppComponent, ToastComponent],
  imports: [AppRoutingModule, RouterModule, BrowserModule, HeaderModule, CadastroModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
