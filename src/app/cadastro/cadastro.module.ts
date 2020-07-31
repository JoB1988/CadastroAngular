import { NgModule } from '@angular/core';
import { CadastroComponent } from './cadastro.component';
import { CadastroService } from './cadastro.service';
import { NgxMaskModule, IConfig } from 'ngx-mask';
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
  providers: [CadastroService]
})
export class CadastroModule {}
