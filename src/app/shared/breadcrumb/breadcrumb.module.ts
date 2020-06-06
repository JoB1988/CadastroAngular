import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [BreadcrumbComponent],
  imports: [SharedModule],
  exports: [BreadcrumbComponent]
})
export class BreadcrumbModule { }
