import { ReadOnlyHeaders } from './read-only-headers';
import { Observable } from 'rxjs';

export interface Resolve {
  resolve(body: any, headers: ReadOnlyHeaders, status: number): any | Promise<any> | Observable<any>;
}
