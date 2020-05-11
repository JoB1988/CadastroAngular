import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoradorComponent } from './morador.component';



@NgModule({
  declarations: [MoradorComponent],
  imports: [
    CommonModule
  ],
  exports: [MoradorComponent]
})
export class MoradorModule { }
