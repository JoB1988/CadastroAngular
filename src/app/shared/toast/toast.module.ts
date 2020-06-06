import { NgModule } from '@angular/core';
import { ToastComponent } from './toast.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [ToastComponent],
  imports: [SharedModule],
  exports: [ToastComponent]
})
export class ToastModule { }
