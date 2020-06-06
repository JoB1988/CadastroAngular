import { NgModule } from '@angular/core';
import { LogReservasComponent } from './log-reservas.component';
import { SharedModule } from '../shared/modules.module';

@NgModule({
  declarations: [LogReservasComponent],
  imports: [SharedModule],
  exports: [LogReservasComponent]
})
export class LogReservasModule { }
