import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { AppService } from '../app.service';
import { SharedModule } from '../shared/modules.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [SharedModule],
  providers: [AppService],
  exports: [LoginComponent]
})
export class LoginModule { }
