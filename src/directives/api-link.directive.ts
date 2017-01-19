import { Directive, Input, HostBinding } from '@angular/core';
import { Location } from '@angular/common';
import { ResourceViewRegistry } from '../resource-view-registry';
import { ApiUrl } from '../api-url';


// TODO on anchor and outside anchor, like routerLink
@Directive({selector: '[apiLink]'})
export class ApiLinkDirective {

    @HostBinding() href?: string;
    // @Input() target: string;
    // @Input() type: string;
    // @Input() skipLocationChange: boolean;
    // @Input() replaceUrl: boolean;

    private url: string;

    constructor(private apiUrl: ApiUrl,
                private location: Location,
                private dataRouteRegistry: ResourceViewRegistry) {
    }

    @Input()
    set apiLink(url: string) {
        this.url = url ? this.apiUrl.mapApiToView(url) : null;
        this.href = this.url ? this.location.prepareExternalUrl('/' + this.url) : (url || '');
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
