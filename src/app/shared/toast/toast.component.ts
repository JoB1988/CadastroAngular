import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService } from './toast.service';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../app.model';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnDestroy {

  /* escuta as mudanças da variável toast$, se não vir nada, retorna, se vier algum valor,
  a variável toast$ desse componente recebe o valor vindo do service para popular o html,
  após 5segundos, o valor do mesmo fica undefined*/
  private toastSubscription = this.toastService.toast$.subscribe(response => {
    if (!response) {
      return;
    }
    this.toast$.next(response);
    setTimeout(() => {
      this.toast$.next(undefined);
    }, 5000);
  });

  // variável que popula o html
  public toast$: BehaviorSubject<Toast> = new BehaviorSubject(undefined);

  constructor(private toastService: ToastService) { }

  // desinscreve-se
  ngOnDestroy(): void {
    this.toastSubscription.unsubscribe();
  }

  // função que retorna a classe correta que o toast deve receber
  public bgcClass(): string {
    return `toast__${this.toast$.value.type.toLowerCase()}`;
  }

  // função que fecha o toast
  public close() {
    this.toast$.next(undefined);
  }

}
