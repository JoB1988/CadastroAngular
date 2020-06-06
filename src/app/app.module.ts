import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppGuardService } from './app.guard.service';
import { SharedModule } from './shared/modules.module';
import { ApplicationModule } from './shared/application.module';

@NgModule({
  declarations: [AppComponent],
  imports: [ApplicationModule, SharedModule],
  providers: [AppGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
