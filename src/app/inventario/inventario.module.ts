import { NgModule } from '@angular/core';
import { InventarioComponent } from './inventario.component';
import { SharedModule } from '../shared/shared.module';
import { AppGuardService } from '../app.guard.service';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: InventarioComponent,
    canActivate: [AppGuardService],
  }
];
@NgModule({
  declarations: [InventarioComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [InventarioComponent]
})
export class InventarioModule { }
