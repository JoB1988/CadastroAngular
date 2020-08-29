import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NotFoundComponent } from './not-found.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: NotFoundComponent
  }
];

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [NotFoundComponent]
})
export class NotFoundModule { }
