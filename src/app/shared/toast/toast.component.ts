import { Component, OnDestroy } from '@angular/core';
import { Toast } from '../app.model';
import { ToastService } from './toast.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnDestroy {

  public toasts: Toast[] = [];

  public timeValue = 0;

  private toastSubscription = this.toastService.toast$.subscribe((toast: Toast) => {
    if (!toast) {
      return;
    }
    this.toasts.push(toast);
    this.timeValue += 3000;
  });

  constructor(private readonly toastService: ToastService) { }

  ngOnDestroy(): void {
    this.toastSubscription.unsubscribe();
  }
}
