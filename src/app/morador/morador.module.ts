import { NgModule } from '@angular/core';
import { MoradorComponent } from './morador.component';
import { MoradorDialogComponent } from './morador-dialog/morador-dialog.component';
import { MoradorTableComponent } from './morador-table/morador-table.component';
import { MoradorDialogService } from './morador-dialog/morador-dialog.service';
import { MoradorService } from './morador.service';
import { SharedModule } from '../shared/shared.module';
import { AppGuardService } from '../app.guard.service';
import { Routes, RouterModule } from '@angular/router';

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
    MoradorTableComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [MoradorComponent],
  providers: [MoradorDialogService, MoradorService]
})
export class MoradorModule { }
