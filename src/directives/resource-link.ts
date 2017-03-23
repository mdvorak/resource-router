import { Directive, Input, HostBinding, Optional } from '@angular/core';
import { Location } from '@angular/common';
import { ResourceViewRegistry } from '../resource-view-registry';
import { ApiUrl } from '../api-url';
import { ViewData } from '../view-data';
import { NavigationHandler } from '../navigation-handler';


@Directive({selector: '[resourceLink]'})
export class ResourceLinkDirective {

  @HostBinding() href?: string;
  @Input() type?: string;
  @Input() target?: string|NavigationHandler;

  private targetUrl: string;
  private localUrl: string|null;

  constructor(private apiUrl: ApiUrl,
              private location: Location,
              private dataRouteRegistry: ResourceViewRegistry,
              @Optional() private view?: ViewData<any>) {
  }

  @Input()
  set resourceLink(url: string) {
    this.targetUrl = url || '';
    this.localUrl = url ? this.apiUrl.mapApiToView(url) || url : '';
    this.href = this.location.prepareExternalUrl(this.localUrl || this.targetUrl);
  }

  /*
   @HostListener('click', ['$event.button', '$event.ctrlKey', '$event.metaKey'])
   onClick(button: number, ctrlKey: boolean, metaKey: boolean): boolean {
   if (button !== 0 || ctrlKey || metaKey || !this.url) {
   return true;
   }

   if (typeof this.target === 'string' && this.target != '_self') {
   return true;
   }

   // TODO does not work for hashbang
   if (typeof this.type === 'string' && !this.dataRouteRegistry.isKnownType(this.type)) {
   return true;
   }

   const extras = {
   skipLocationChange: attrBoolValue(this.skipLocationChange),
   replaceUrl: attrBoolValue(this.replaceUrl),
   };
   this.router.navigateByUrl(this.url, extras);
   return false;
   }*/
}

function attrBoolValue(s: any): boolean {
  return s === '' || !!s;
}
