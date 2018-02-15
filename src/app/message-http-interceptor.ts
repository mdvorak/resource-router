import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { MessageService } from './message.service';

/**
 * Diagnostic interceptor to visualise requests to mocked API.
 */
@Injectable()
export class MessageHttpInterceptor implements HttpInterceptor {

  constructor(private readonly messageService: MessageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).do((res: HttpEvent<any>) => {
      if (res instanceof HttpResponseBase) {
        this.messageService.add(`${req.method} ${req.url} => ${res.status} ${res.statusText} (${dumpHeaders(res.headers)})`);
      }
    });
  }
}

function dumpHeaders(headers: HttpHeaders) {
  return headers.keys().map(h => h + ': ' + (headers.getAll(h) || []).join(',')).join(', ');
}
