import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastroComponent } from './cadastro.component';
import { CommonModule } from '@angular/common';
import { CadastroService } from './cadastro.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ToastService } from '../shared/toast/toast.service';
import { SharedModule } from '../shared/modules.module';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = undefined;

@NgModule({
  declarations: [CadastroComponent],
  imports: [
    SharedModule,
    NgxMaskModule.forRoot(options),
  ],
  exports: [CadastroComponent],
  providers: [CadastroService, ToastService]
})
export class CadastroModule {}
