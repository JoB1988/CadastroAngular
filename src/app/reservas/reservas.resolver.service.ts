import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ReservasService } from './reservas.service';

@Injectable({ providedIn: 'root' })
export class ReservasResolve implements Resolve<Observable<any>> {

  constructor(private readonly reservasService: ReservasService) { }

  resolve():
    Observable<any> |
    Observable<Observable<any>> |
    Promise<Observable<any>> {
    return this.reservasService.getLogs();
  }
}
