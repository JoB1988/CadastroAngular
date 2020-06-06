import { NgModule } from '@angular/core';
import { AreasComumComponent } from './areas-comum.component';
import { SharedModule } from '../shared/modules.module';

@NgModule({
  declarations: [AreasComumComponent],
  imports: [
    SharedModule
  ],
  exports: [AreasComumComponent]
})
export class AreasComumModule { }
