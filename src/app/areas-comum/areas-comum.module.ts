import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreasComumComponent } from './areas-comum.component';



@NgModule({
  declarations: [AreasComumComponent],
  imports: [
    CommonModule
  ],
  exports: [AreasComumComponent]
})
export class AreasComumModule { }
