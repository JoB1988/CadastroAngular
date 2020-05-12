import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoradorDialogService {

  public showDialog: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  public show() {
    this.showDialog.next(true);
  }

  public hide() {
    this.showDialog.next(false);
  }
}
