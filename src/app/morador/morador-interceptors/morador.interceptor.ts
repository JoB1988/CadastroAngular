import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpResponse,
  HttpProgressEvent,
  HttpUserEvent,
  HttpErrorResponse,
  HttpEventType
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MoradorService } from '../morador.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Injectable()
export class MoradorInterceptor implements HttpInterceptor {

  constructor(private moradorService: MoradorService, private toastService: ToastService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<
    HttpSentEvent |
    HttpHeaderResponse |
    HttpResponse<any> |
    HttpProgressEvent |
    HttpUserEvent<any>> {

    return next.handle(request).pipe(
      tap((event) => {
        // Quando estiver fazendo upload de dados
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round(100 * event.loaded / event.total);
          this.moradorService.progressBar$.next({ mode: 'determinate', value: progress });
          return;
        }

        // Response
        if (event instanceof HttpResponse || event instanceof HttpErrorResponse) {
          this.moradorService.progressBar$.next({ mode: 'determinate', value: 100 });
          this.toastService.toast$.next({ message: 'Sucesso!', show: true, type: 'success' });
        } else {
          this.moradorService.progressBar$.next({ mode: 'indeterminate', value: null });
          this.toastService.toast$.next({ message: 'Erro!', show: true, type: 'error' });
        }
      })
    );
  }
}
