import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MoradorService } from '../morador.service';
import { BehaviorSubject } from 'rxjs';
import { Morador } from 'src/app/shared/app.model';

@Component({
  selector: 'app-morador-table',
  templateUrl: './morador-table.component.html',
  styleUrls: ['./morador-table.component.scss']
})
export class MoradorTableComponent implements OnInit, OnDestroy {

  public morador$: BehaviorSubject<Array<Morador>> = new BehaviorSubject(undefined);
  @Output() someChange = new EventEmitter();

  private moradorSubscription = this.moradorService.morador$.subscribe((data) => {
    this.morador$.next(data);
  });

  constructor(private moradorService: MoradorService) { }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.moradorSubscription.unsubscribe();
  }

  public buttonAction(option, value) {
    this.someChange.emit({ action: option, arrayIndex: value });
  }
}
