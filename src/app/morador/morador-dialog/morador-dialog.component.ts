import { Component, OnInit, OnDestroy } from '@angular/core';
import { MoradorDialogService } from './morador-dialog.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-morador-dialog',
  templateUrl: './morador-dialog.component.html',
  styleUrls: ['./morador-dialog.component.scss']
})
export class MoradorDialogComponent implements OnInit, OnDestroy {

  public showComponent$ = new BehaviorSubject(false);
  private dialogSubscription = this.moradorDialogService.showDialog.subscribe(show => {
    this.showComponent$.next(show);
  });

  constructor(private moradorDialogService: MoradorDialogService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.dialogSubscription.unsubscribe();
  }

  public hide() {
    this.moradorDialogService.hide();
  }
}
