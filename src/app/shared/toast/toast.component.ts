import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService } from './toast.service';
import { BehaviorSubject } from 'rxjs';
import { Toast } from './toast';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {

  private toastSubscription;
  public toast$: BehaviorSubject<Toast> = new BehaviorSubject(undefined);

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastSubscription = this.toastService.toast$.subscribe(response => {
      if (!response) {
        return;
      }
      this.toast$.next(response);
      setTimeout(() => {
        this.toast$.next(undefined);
      }, 5000);
    });
  }

  ngOnDestroy(): void {
    this.toastSubscription.unsubscribe();
  }

  public bgcClass(): string {
    return `toast__${this.toast$.value.type.toLowerCase()}`;
  }

  public close() {
    this.toast$.next(undefined);
  }

}
