import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppGuardService } from './app.guard.service';
import { ApplicationModule } from './shared/application.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    ApplicationModule.forRoot(),
  ],
  providers: [AppGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
