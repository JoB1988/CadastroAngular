import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  /*variável que mostra o hambuger*/
  public hamburguer$ = new BehaviorSubject(false);

  /*variável que abre ou fecha o menu lateral*/
  public openSideBar$ = new BehaviorSubject(false);

}
