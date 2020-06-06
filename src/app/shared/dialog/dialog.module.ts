import { NgModule } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [DialogComponent],
  imports: [SharedModule],
  exports: [DialogComponent]
})
export class DialogModule { }
