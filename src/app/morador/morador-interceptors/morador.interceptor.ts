import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpResponse,
  HttpProgressEvent,
  HttpUserEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MoradorService } from '../morador.service';

@Injectable()
export class MoradorInterceptor implements HttpInterceptor {

  constructor(private moradorService: MoradorService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<
    HttpSentEvent |
    HttpHeaderResponse |
    HttpResponse<any> |
    HttpProgressEvent |
    HttpUserEvent<any>> {

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.moradorService.progressBar$.next({ mode: 'determinate', value: 100 });
        } else {
          this.moradorService.progressBar$.next({ mode: 'indeterminate', value: null });
        }
      })
    );
  }
}
