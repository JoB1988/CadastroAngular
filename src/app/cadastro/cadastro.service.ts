import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Cadastro } from "./cadastro";

const PRAGMA = `pragma`;
const NO_CACHE = `no-cache`;
const CACHE_CONTROL = `Cache-Control`;
const URL = `https://viacep.com.br/ws/`;
const URLCADASTRO = `http://localhost:3000/cadastro`;

const HEADERS = new HttpHeaders({
  CACHE_CONTROL: NO_CACHE,
  PRAGMA: NO_CACHE
});

@Injectable({
  providedIn: `root`
})
export class CadastroService {
  constructor(private http: HttpClient) {}

  public getAddress(cepAddress: string): Observable<any> {
    console.log(cepAddress)
    return this.http
      .get<any>(`${URL + cepAddress}/json/`)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }

  public getCadastro(id?: string): Observable<any> {
    let urlget = URLCADASTRO;
    if (id) {
      urlget += `/${id}`;
    }
    return this.http
      .get<any>(urlget, { headers: HEADERS })
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }

  public saveForm(cadastro: Cadastro): Observable<any> {
    return this.http.post<any>(URLCADASTRO, cadastro).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  public updateForm(cadastro: Cadastro): Observable<any> {
    return this.http.put<any>(`${URLCADASTRO}/${cadastro.id}`, cadastro).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  public delete(id: string): Observable<any> {
    return this.http.delete<any>(`${URLCADASTRO}/${id}`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
