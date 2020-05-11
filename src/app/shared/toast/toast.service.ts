import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from './toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  public toast$: BehaviorSubject<Toast> = new BehaviorSubject(undefined);

}