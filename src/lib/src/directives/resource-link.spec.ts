import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { ResourceViewRegistry } from '../resource-view-registry';
import { ResourceLinkDirective, TargetType } from './resource-link';
import { Location, LocationStrategy } from '@angular/common';
import { ApiMapper } from '../api-mapper';
import { Navigable, rootNavigableRef } from '../navigable';
import { By } from '@angular/platform-browser';
import { createClassSpyObj } from '../utils/class-spy.spec';
import { MockLocationStrategy } from '@angular/common/testing';
import { BrowserUrlNormalizer, UrlNormalizer } from '../url-normalizer';
import { APP_API_PREFIX, SingleApiMapper } from '../single-api-mapper';
import { ResourceData, resourceDataNavigableRef } from '../resource-data';
import { HttpResourceClient, ResourceClient } from '../resource-client';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeaderViewTypeStrategy, ViewTypeStrategy } from '../view-type-strategy';


const API_PREFIX = 'http://example.com/';

/**
 * Helper component for tests.
 */
@Component({
  selector: 'my-test',
  template: `
    <button type="button" [resourceLink]="link" [target]="target">${ResourceLinkDirective.name}</button>`
})
class TestComponent {
  link?: string;
  target?: TargetType;
}

function createSpyNavigable() {
  return jasmine.createSpyObj<Navigable>('navigable', ['go']);
}

describe(ResourceLinkDirective.name, () => {
  let registry: ResourceViewRegistry;
  let resourceData: ResourceData;

  let comp: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  // Shared components
  beforeEach(async(() => {
    registry = createClassSpyObj(ResourceViewRegistry);

    return TestBed.configureTestingModule({
      declarations: [
        ResourceLinkDirective,
        TestComponent,
      ],
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: LocationStrategy,
          useClass: MockLocationStrategy
        },
        Location,
        {
          provide: ResourceViewRegistry,
          useValue: registry
        },
        {
          provide: APP_API_PREFIX,
          useValue: API_PREFIX
        },
        {
          provide: UrlNormalizer,
          useClass: BrowserUrlNormalizer
        },
        {
          provide: ApiMapper,
          useClass: SingleApiMapper
        },
        {
          provide: ResourceClient,
          useClass: HttpResourceClient
        },
        {
          provide: ViewTypeStrategy,
          useClass: HeaderViewTypeStrategy
        },
        ResourceData,
        resourceDataNavigableRef(),
        rootNavigableRef(),
      ]
    });
  }));

  // Created with ROOT_NAVIGATION and NavigationRef
  describe('with navigation context', () => {
    beforeEach(async(inject([ResourceData], (_resourceData: ResourceData) => {
      resourceData = _resourceData;
      fixture = TestBed.createComponent(TestComponent);
      comp = fixture.componentInstance;
      de = fixture.debugElement.query(By.directive(ResourceLinkDirective));
      el = de.nativeElement;
    })));

    it('should be initialized', () => {
      expect(el).toBeDefined();
    });

    it('should change url onClick without target set', () => {
      comp.link = API_PREFIX + 'foo/bar';
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 0});

      // Verify
      expect(resourceData.url).toBe('http://example.com/foo/bar');
    });

    it('should change url onClick with ctrlKey or metaKey', () => {
      comp.link = API_PREFIX + 'foo/bar';
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 0, ctrlKey: true, metaKey: true});

      // Verify
      expect(resourceData.url).toBe('http://example.com/foo/bar');
    });

    it('should change url onClick with target _self', () => {
      comp.link = API_PREFIX + 'foo/bar';
      comp.target = '_self';
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 0});

      // Verify
      expect(resourceData.url).toBe('http://example.com/foo/bar');
    });

    it('should change url onClick with target _top', () => {
      comp.link = API_PREFIX + 'foo/bar';
      comp.target = '_top';
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 0});

      // Verify
      expect(resourceData.url).toBe('http://example.com/foo/bar');
    });

    it('should navigate onClick with explicit target', () => {
      const navigationMock = createSpyNavigable();

      comp.link = API_PREFIX + 'foo/bar';
      comp.target = navigationMock;
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 0});

      // Verify
      expect(navigationMock.go).toHaveBeenCalledWith(API_PREFIX + 'foo/bar');
      expect(resourceData.url).toBe('');
    });
  });
});
