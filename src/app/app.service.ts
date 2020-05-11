import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public islogged$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }
}
