import { Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { normalizeMediaType } from './normalize';

export abstract class ViewTypeStrategy {

  abstract extractType(response: Response): string|null;
}

@Injectable()
export class ContentTypeStrategy implements ViewTypeStrategy {

  extractType(response: Response): string|null {
    const contentType = response.headers.get('content-type');
    return contentType ? this.normalizeMediaType(contentType) : null;
  }

  //noinspection JSMethodCanBeStatic
  normalizeMediaType(contentType: string): string {
    return normalizeMediaType(contentType);
  }
}
