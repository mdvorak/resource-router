import { Injectable } from '@angular/core';
import { ApiMapper } from './api-mapper';

/**
 * @deprecated For compatibility, replaced with {@link ApiMapper}.
 */
@Injectable()
export class ApiUrl {

  constructor(private apiMapper: ApiMapper) {
  }

  mapViewToApi(path: string): string {
    return this.apiMapper.mapViewToApi(path);
  }

  mapApiToView(url: string): string | null {
    return this.apiMapper.mapApiToView(url);
  }
}
