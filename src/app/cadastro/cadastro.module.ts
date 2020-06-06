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
import { SharedModule } from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { AppGuardService } from '../app.guard.service';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = undefined;

const routes: Routes = [
  {
    path: '',
    component: CadastroComponent,
    canActivate: [AppGuardService],
  }
];

@NgModule({
  declarations: [CadastroComponent],
  imports: [
    SharedModule,
    NgxMaskModule.forRoot(options),
    RouterModule.forChild(routes)
  ],
  exports: [CadastroComponent],
  providers: [CadastroService, ToastService]
})
export class CadastroModule {}
