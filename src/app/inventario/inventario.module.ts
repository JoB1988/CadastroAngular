import { NgModule } from '@angular/core';
import { InventarioComponent } from './inventario.component';
import { SharedModule } from '../shared/modules.module';

@NgModule({
  declarations: [InventarioComponent],
  imports: [SharedModule],
  exports: [InventarioComponent]
})
export class InventarioModule { }
