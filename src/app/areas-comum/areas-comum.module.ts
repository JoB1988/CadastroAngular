import { NgModule } from '@angular/core';
import { AreasComumComponent } from './areas-comum.component';
import { SharedModule } from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { AppGuardService } from '../app.guard.service';

const routes: Routes = [
  {
    path: '',
    component: AreasComumComponent,
    canActivate: [AppGuardService],
  }
];

@NgModule({
  declarations: [AreasComumComponent],
  imports: [
    SharedModule, RouterModule.forChild(routes)
  ],
  exports: [AreasComumComponent]
})
export class AreasComumModule { }
