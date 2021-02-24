import { AfterContentInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiLocation } from '../api-location';

@Directive({
  selector: '[resourceLink][resourceLinkActive]'
})
export class ResourceLinkActiveDirective implements AfterContentInit, OnDestroy {
  @Input() resourceLink: string;

  private subscription: Subscription;
  private classes: string[] = [];

  constructor(
    private render: Renderer2,
    private el: ElementRef,
    private apiLocation: ApiLocation
  ) {
    this.subscription = apiLocation.urlChange.subscribe(() => this.update());
  }

  @Input() set resourceLinkActive(data: string[] | string) {
    const classes = Array.isArray(data) ? data : data.split(' ');
    this.classes = classes.filter(c => !!c);
  }

  ngAfterContentInit(): void {
    this.update();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private update(): void {
    const url = this.apiLocation.url;
    const isActive = url.includes(this.resourceLink);

    this.classes.forEach((_class: string) => {
      if (isActive) {
        this.render.addClass(this.el.nativeElement, _class);
      } else {
        this.render.removeClass(this.el.nativeElement, _class);
      }
    });
  }
}
