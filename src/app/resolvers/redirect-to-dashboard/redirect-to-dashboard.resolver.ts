import { Injectable } from '@angular/core';
import { ReadOnlyHeaders, Resolve } from 'angular-resource-router';

@Injectable({
  providedIn: 'root'
})
export class RedirectToDashboardResolver implements Resolve {

  constructor() {
  }

  resolve(body: any, headers: ReadOnlyHeaders, status: number): any {
    window.location.href = window.location.origin + '/dashboard';
  }
}
