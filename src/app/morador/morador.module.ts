import { NgModule } from '@angular/core';
import { MoradorComponent } from './morador.component';
import { MoradorDialogComponent } from './morador-dialog/morador-dialog.component';
import { MoradorService } from './morador.service';
import { SharedModule } from '../shared/shared.module';
import { AppGuardService } from '../app.guard.service';
import { Routes, RouterModule } from '@angular/router';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { MenuModule } from '../shared/menu/menu.module';
import { AllowOnlyNumbersDirective } from '../shared/directives/allow-only-numbers.directive';
import { MoradorInterceptor } from './morador-interceptors/morador.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


export const options: Partial<IConfig> | (() => Partial<IConfig>) = undefined;

const routes: Routes = [
  {
    path: '',
    component: MoradorComponent,
    canActivate: [AppGuardService]
  }
];

@NgModule({
  declarations: [
    MoradorComponent,
    MoradorDialogComponent,
    AllowOnlyNumbersDirective
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes), NgxMaskModule.forRoot(),
    MenuModule],
  providers: [
    MoradorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MoradorInterceptor,
      multi: true
    }
  ],
  exports: [MoradorComponent]
})
export class MoradorModule { }
