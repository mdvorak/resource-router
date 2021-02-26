import { Injectable } from '@angular/core';
import { ReadOnlyHeaders, Resolve } from 'angular-resource-router';

@Injectable({
  providedIn: 'root'
})
export class TenderNamesResolver implements Resolve {
  resolve(body: any, headers: ReadOnlyHeaders, status: number): any {
    return ['Michael', 'Magenta', 'Elisabeth', 'Theodore', 'Poppy', 'Garen'];
  }
}
