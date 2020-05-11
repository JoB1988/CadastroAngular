import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasComponent } from './reservas.component';



@NgModule({
  declarations: [ReservasComponent],
  imports: [
    CommonModule
  ],
  exports: [ReservasComponent]
})
export class ReservasModule { }
