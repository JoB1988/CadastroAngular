import { Injectable, ComponentFactoryResolver, ComponentRef, Compiler, ViewContainerRef, Injector, ReflectiveInjector } from '@angular/core';
import { MoradorDialogComponent } from './morador-dialog.component';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { Morador } from 'src/app/shared/app.model';

@Injectable({
  providedIn: 'root'
})
export class MoradorDialogService {

  // here we hold our placeholder
  private vcRef: ViewContainerRef;
  // here we hold our injector
  private injector: Injector;
  // we can use this to determine z-index of multiple modals
  public activeInstances = 0;

  public destroy$: BehaviorSubject<Morador> = new BehaviorSubject(undefined);

  constructor(private compiler: Compiler) { }

  registerViewContainerRef(vcRef: ViewContainerRef): void {
    this.vcRef = vcRef;
  }

  registerInjector(injector: Injector): void {
    this.injector = injector;
  }

}
