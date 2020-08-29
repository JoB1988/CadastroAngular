import { NgModule } from '@angular/core';
import { HeaderComponent } from './header.component';
import { AppService } from '../app.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [SharedModule],
  providers: [AppService],
  exports: [HeaderComponent]
})
export class HeaderModule { }
