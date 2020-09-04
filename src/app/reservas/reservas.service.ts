import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

const PRAGMA = `pragma`;
const NO_CACHE = `no-cache`;
const CACHE_CONTROL = `Cache-Control`;
const URLLOGS = `http://localhost:3000/logs`;

const HEADERS = new HttpHeaders({
  CACHE_CONTROL: NO_CACHE,
  PRAGMA: NO_CACHE
});

@Injectable({ providedIn: 'root' })
export class ReservasService {

  constructor(private readonly http: HttpClient) { }

  getLogs(): Observable<any> {
    return this.http.get<any>(URLLOGS, { headers: HEADERS, observe: 'response' })
      .pipe(
        tap(res => { console.log(res); }),
        map((response: any) => response.body),
        catchError((error: HttpErrorResponse) => throwError(error))
      );
  }

}
