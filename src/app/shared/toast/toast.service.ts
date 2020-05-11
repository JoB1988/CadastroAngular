import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../app.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  // váriavel que recebe o valor do componente para montar o toast
  public toast$: BehaviorSubject<Toast> = new BehaviorSubject(undefined);

}
