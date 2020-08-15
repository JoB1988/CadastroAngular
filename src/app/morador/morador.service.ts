import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Morador } from '../shared/app.model';

const PRAGMA = `pragma`;
const NO_CACHE = `no-cache`;
const CACHE_CONTROL = `Cache-Control`;
const URLMORADOR = `http://localhost:3000/morador`;

const HEADERS = new HttpHeaders({
  CACHE_CONTROL: NO_CACHE,
  PRAGMA: NO_CACHE
});

@Injectable({
  providedIn: `root`
})
export class MoradorService {

  public moradores$: BehaviorSubject<Array<Morador>> = new BehaviorSubject(undefined);

  constructor(private http: HttpClient) { }

  public getMorador(id?: number): Observable<any> {
    let urlget = URLMORADOR;
    if (id) {
      urlget += `/${id}`;
    }
    return this.http.get<any>(urlget, { headers: HEADERS })
      .pipe(map((response: any) => response), catchError((error: HttpErrorResponse) => throwError(error)));
  }

  public createMorador(morador: Morador): Observable<any> {
    console.log(morador)
    return this.http.post<Morador>(URLMORADOR, morador).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  public updateMorador(morador: Morador): Observable<any> {
    return this.http.put<Morador>(`${URLMORADOR}/${morador.id}`, morador).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  public deleteMorador(id: string): Observable<any> {
    return this.http.delete<any>(`${URLMORADOR}/${id}`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}

