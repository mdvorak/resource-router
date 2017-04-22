import { Directive, HostBinding, HostListener, Input, OnChanges, Optional } from '@angular/core';
import { TARGET_SELF, TARGET_TOP, TargetType } from './resource-link';
import { ApiMapper } from '../api-mapper';
import { ResourceViewRegistry } from '../resource-view-registry';
import { ViewData } from '../view-data';
import { supportsNavigation } from '../navigation-handler';
import { ApiLocation } from '../api-location';

@Directive({selector: 'a[resourceLink]'})
export class ResourceLinkWithHrefDirective implements OnChanges {

  @HostBinding() href: string;
  @Input() resourceLink: string;
  @Input() type?: string;
  @Input() target?: TargetType;
  @Input() external = false;
  private unsupported = false;

  constructor(private apiMapper: ApiMapper,
              private apiLocation: ApiLocation,
              private resourceViewRegistry: ResourceViewRegistry,
              @Optional() private view?: ViewData<any>) {
  }

  ngOnChanges(): void {
    let unsupported = this.external;

    // Is the link supported? Note that its pointless for external links
    if (this.type && !unsupported) {
      // Is it known type for successful response?
      // Note that this mechanism does not work for other status codes, you will have to set [external] manually
      unsupported = !this.resourceViewRegistry.match(this.type, 200);
    }

    // Map to API, if it fails, mark as external
    let viewUrl = this.resourceLink || '';
    if (viewUrl && !unsupported) {
      // Map API to View
      const url = this.apiMapper.mapApiToView(viewUrl);
      if (url) {
        // Use mapped url, since its internal link
        viewUrl = url;
      }
    }

    // Store mapped URL to href
    this.href = this.apiLocation.prepareExternalUrl(viewUrl);
    this.unsupported = unsupported;
  }

  @HostListener('click', ['$event.button', '$event.ctrlKey', '$event.metaKey'])
  onClick(button: number, ctrlKey: boolean, metaKey: boolean): boolean {
    // Let the browser do the navigation if any key was pressed or this link unsupported
    if (button !== 0 || ctrlKey || metaKey || !this.resourceLink || this.unsupported) {
      return true;
    }

    // Handle target
    let target = this.target;

    if (typeof target === 'string') {
      if (target === TARGET_SELF) {
        target = this.view && this.view.navigation;
      } else if (target === TARGET_TOP) {
        target = undefined;
      } else {
        // Custom target, open new window
        return true;
      }
    }

    // Custom target
    if (supportsNavigation(target)) {
      // Navigate using original non-mapped link
      target.go(this.resourceLink);
      return false;
    } else {
      // Default - navigate using page location
      this.apiLocation.go(this.resourceLink);
      return false;
    }
  }
}
