import { Directive, HostBinding, HostListener, Inject, Input, OnChanges, Optional } from '@angular/core';
import { TARGET_SELF, TARGET_TOP } from './resource-link';
import { ApiMapper } from '../api-mapper';
import { ResourceViewRegistry } from '../resource-view-registry';
import { isNavigable, Navigable, NavigableRef, TOP_LEVEL_NAVIGABLE } from '../navigable';
import { Location } from '@angular/common';
import { debugLog } from '../utils/debug-log';

@Directive({selector: 'a[resourceLink]'})
export class ResourceLinkWithHrefDirective implements OnChanges {

  @HostBinding() href: string;
  @Input() resourceLink: string;
  @Input() type?: string;
  @Input() target?: Navigable | string;
  @Input() external = false;
  private unsupported = false;

  constructor(private readonly apiMapper: ApiMapper,
              private readonly location: Location,
              private readonly resourceViewRegistry: ResourceViewRegistry,
              @Optional() private readonly currentNavigable?: NavigableRef,
              @Optional() @Inject(TOP_LEVEL_NAVIGABLE) private readonly topLevelNavigable?: NavigableRef) {
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
        target = this.currentNavigable && this.currentNavigable.navigable;
        // Warn if undefined
        if (!target) {
          debugLog().warn('When resourceLink is not in a resource-view, target="_self" is not supported');
        }
      } else if (target === TARGET_TOP) {
        target = undefined;
      } else {
        // Custom target, open new window
        return true;
      }
    }

    // Fallback to page navigation
    if (!target) {
      // Fallback to current when top-level is unavailable
      const topLevel = this.topLevelNavigable || this.currentNavigable;
      target = topLevel && topLevel.navigable;
      // Warn if undefined
      if (!target) {
        debugLog().warn(`When resourceLink is not embedded in a <resource-view> component, ` +
          `it must have target set to a Navigable instance - navigation to "${this.resourceLink}" canceled`);
      }
    }

    if (isNavigable(target)) {
      // Navigate using original non-mapped link
      target.go(this.resourceLink);
    }

    // Cancel click
    return false;
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
        // Use mapped url, since its application link
        viewUrl = url;
      } else {
        // Unsupported location
        unsupported = true;
      }
    }

    // Store mapped URL to href
    this.unsupported = unsupported;
    this.href = unsupported ? viewUrl : this.location.prepareExternalUrl(viewUrl);
  }
}
