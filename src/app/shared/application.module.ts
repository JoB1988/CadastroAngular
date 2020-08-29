import { NgModule, ModuleWithProviders } from '@angular/core';
import { HeaderModule } from '../header/header.module';
import { LoginModule } from '../login/login.module';
import { HomeModule } from '../home/home.module';
import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';

const COMPONENTS_MODULES = [
    HeaderModule,
    LoginModule,
    HomeModule,
    BreadcrumbModule
];

@NgModule({
    imports: [...COMPONENTS_MODULES],
    exports: [...COMPONENTS_MODULES]
})
export class ApplicationModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ApplicationModule,
            providers: []
        };
    }
}
