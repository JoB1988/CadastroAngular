import { NgModule, ModuleWithProviders } from '@angular/core';
import { HeaderModule } from '../header/header.module';
import { CadastroModule } from '../cadastro/cadastro.module';
import { ReservasModule } from '../reservas/reservas.module';
import { MoradorModule } from '../morador/morador.module';
import { ToastModule } from './toast/toast.module';
import { InventarioModule } from '../inventario/inventario.module';
import { AreasComumModule } from '../areas-comum/areas-comum.module';
import { LoginModule } from '../login/login.module';
import { HomeModule } from '../home/home.module';
import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';

const COMPONENTS_MODULES = [
    HeaderModule,
    CadastroModule,
    ReservasModule,
    MoradorModule,
    ToastModule,
    InventarioModule,
    AreasComumModule,
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
