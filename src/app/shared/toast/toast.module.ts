import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { ToastComponent } from './toast.component';
import { ToastService } from './toast.service';

@NgModule({
    declarations: [ToastComponent],
    imports: [SharedModule],
    exports: [ToastComponent],
    providers: [ToastService]
})
export class ToastModule { }
