import { NgModule } from '@angular/core';
import { MoradorComponent } from './morador.component';
import { MoradorDialogComponent } from './morador-dialog/morador-dialog.component';
import { MoradorDialogService } from './morador-dialog/morador-dialog.service';
import { MoradorService } from './morador.service';
import { SharedModule } from '../shared/shared.module';
import { AppGuardService } from '../app.guard.service';
import { Routes, RouterModule } from '@angular/router';
import { NgxMaskModule, IConfig } from 'ngx-mask';

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
    MoradorDialogComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes), NgxMaskModule.forRoot()],
  exports: [MoradorComponent],
  providers: [MoradorDialogService, MoradorService]
})
export class MoradorModule { }
