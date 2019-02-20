import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponseBase
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessageService } from './message.service';

/**
 * Diagnostic interceptor to visualise requests to mocked API.
 */
@Injectable()
export class MessageHttpInterceptor implements HttpInterceptor {

  private static nextId = 1;

  constructor(private readonly messageService: MessageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const id = MessageHttpInterceptor.nextId++;
    this.messageService.add(`[${id}] ${req.method} ${req.url} (${dumpHeaders(req.headers)})`);

    return next.handle(req).pipe(
      tap((res: HttpEvent<any>) => {
        if (res instanceof HttpResponseBase) {
          this.messageService.add(`[${id}] => ${res.status} ${res.statusText} (${dumpHeaders(res.headers)})`);
        }
      })
    );
  }
}

function dumpHeaders(headers: HttpHeaders) {
  return headers.keys().map(h => h + ': ' + (headers.getAll(h) || []).join(',')).join(', ');
}
