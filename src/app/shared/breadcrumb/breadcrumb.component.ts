import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivationStart } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface IBreadCrumbStep {
  stepName: string;
  stepUrl: string;
  lastStepUrl: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnDestroy {

  public breadCrumbStep$: BehaviorSubject<Array<IBreadCrumbStep>> = new BehaviorSubject([]);

  private routerSubscription = this.router.events.subscribe(event => {
    if (event instanceof ActivationStart) {
      if (!event.snapshot.data.stepName) {
        return;
      }
      const stepUrl: IBreadCrumbStep = {
        stepUrl: event.snapshot.data.stepUrl,
        lastStepUrl: event.snapshot.data.lastStepUrl,
        stepName: event.snapshot.data.stepName
      };
      this.breadCrumbStep$.value.push(stepUrl);
      console.log(this.breadCrumbStep$.value);
    }
  });

  constructor(public router: Router) { }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

}
