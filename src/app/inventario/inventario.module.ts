import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioComponent } from './inventario.component';



@NgModule({
  declarations: [InventarioComponent],
  imports: [
    CommonModule
  ],
  exports: [InventarioComponent]
})
export class InventarioModule { }
