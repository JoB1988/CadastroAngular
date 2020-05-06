import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderModule } from './header/header.module';
import { RouterModule } from '@angular/router';
import { CadastroModule } from './cadastro/cadastro.module';

@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule, RouterModule, BrowserModule, HeaderModule, CadastroModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
