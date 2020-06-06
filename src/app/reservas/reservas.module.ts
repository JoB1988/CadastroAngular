import { NgModule } from '@angular/core';
import { ReservasComponent } from './reservas.component';
import { SharedModule } from '../shared/modules.module';

@NgModule({
  declarations: [ReservasComponent],
  imports: [SharedModule],
  exports: [ReservasComponent]
})
export class ReservasModule { }
