import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Morador } from '../shared/app.model';

const PRAGMA = `pragma`;
const NO_CACHE = `no-cache`;
const CACHE_CONTROL = `Cache-Control`;
const URLMORADOR = `http://localhost:3000/morador`;

const HEADERS = new HttpHeaders({
  CACHE_CONTROL: NO_CACHE,
  PRAGMA: NO_CACHE
});

// providedin root quano o serviço for global
@Injectable()
export class MoradorService {

  public progressBar$: BehaviorSubject<any> = new BehaviorSubject(undefined);
  public moradores$: BehaviorSubject<Array<Morador>> = new BehaviorSubject(undefined);

  constructor(private http: HttpClient) { }

  public getMorador(id?: number): Observable<any> {
    let urlget = URLMORADOR;
    if (id) {
      urlget += `/${id}`;
    }
    return this.http.get<any>(urlget, { headers: HEADERS, observe: 'response' })
      .pipe(map((response: any) => response.body),
        catchError((error: HttpErrorResponse) => throwError(error))
      );
  }

  public createMorador(morador: Morador): Observable<any> {
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

  public deleteMorador(moradorId: string): Observable<any> {
    return this.http.delete<any>(`${URLMORADOR}/${moradorId}`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}

