import { NgModule } from '@angular/core';
import { ReservasComponent } from './reservas.component';
import { SharedModule } from '../shared/shared.module';
import { LogReservasComponent } from './log-reservas/log-reservas.component';
import { Routes, RouterModule } from '@angular/router';
import { AppGuardService } from '../app.guard.service';

const routes: Routes = [
  {
    path: '',
    component: ReservasComponent,
    canActivate: [AppGuardService]
  },
  {
    path: 'historico',
    children: [
      {
        path: '',
        component: LogReservasComponent,
        canActivate: [AppGuardService],
        data: { path: 'Histórico', lastPath: '/reservas' }
      }
    ]
  }
];

@NgModule({
  declarations: [ReservasComponent, LogReservasComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [ReservasComponent, LogReservasComponent]
})
export class ReservasModule { }
