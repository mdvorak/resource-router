import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { ResourceViewRegistry } from '../resource-view-registry';
import { TargetType } from './resource-link';
import { Location, LocationStrategy } from '@angular/common';
import { ApiMapper } from '../api-mapper';
import { Navigable, topLevelNavigableRef } from '../navigable';
import { By } from '@angular/platform-browser';
import { ResourceLinkWithHrefDirective } from './resource-link-with-href';
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
  template: `<a [resourceLink]="link" [target]="target">${ResourceLinkWithHrefDirective.name}</a>`
})
class TestComponent {
  link?: string;
  target?: TargetType;
}

function createSpyNavigable() {
  return jasmine.createSpyObj<Navigable>('navigable', ['go']);
}

describe(ResourceLinkWithHrefDirective.name, () => {
  let registry: ResourceViewRegistry;
  let resourceData: ResourceData;

  let comp: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  // Shared components
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResourceLinkWithHrefDirective,
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
          useValue: {
            match: () => {
            }
          }
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
        topLevelNavigableRef(),
      ]
    })
      .compileComponents();

    registry = TestBed.inject(ResourceViewRegistry);
  }));

  // Created with TOP_LEVEL_NAVIGABLE and NavigationRef
  describe('with navigation context', () => {
    beforeEach(waitForAsync(inject([ResourceData], (_resourceData: ResourceData) => {
      resourceData = _resourceData;
      fixture = TestBed.createComponent(TestComponent);
      comp = fixture.componentInstance;
      de = fixture.debugElement.query(By.directive(ResourceLinkWithHrefDirective));
      el = de.nativeElement;
    })));

    it('should be initialized', () => {
      expect(el).toBeDefined();
    });

    it('should change location onClick without target set', () => {
      comp.link = API_PREFIX + 'foo/bar';
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 0});

      // Verify
      expect(resourceData.url).toBe('http://example.com/foo/bar');
    });

    it('should not handle click with ctrlKey', () => {
      comp.link = API_PREFIX + 'foo/bar';
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 0, ctrlKey: true});

      // Verify
      expect(resourceData.url).toBe('');
    });

    it('should not handle click with metaKey', () => {
      comp.link = API_PREFIX + 'foo/bar';
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 0, metaKey: true});

      // Verify
      expect(resourceData.url).toBe('');
    });

    it('should not handle click with other mouse buttons', () => {
      comp.link = API_PREFIX + 'foo/bar';
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 1, metaKey: true});

      // Verify
      expect(resourceData.url).toBe('');
    });

    it('should change location onClick with target _self', () => {
      comp.link = API_PREFIX + 'foo/bar';
      comp.target = '_self';
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 0});

      // Verify
      expect(resourceData.url).toBe('http://example.com/foo/bar');
    });

    it('should change location onClick with target _top', () => {
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
    });

    it('should change location with external url', () => {
      const navigationMock = createSpyNavigable();

      comp.link = 'http://another.example.com/foo/bar';
      comp.target = navigationMock;
      fixture.detectChanges();

      // Note: We digest listeners manually, because we want to check handler return value
      const onClickHandler = de.listeners.find(listener => listener.name === 'click');
      if (!onClickHandler) {
        throw new Error();
      }

      // Test
      const cancel = onClickHandler.callback({button: 0});

      // Verify
      expect(de.nativeElement.getAttribute('href')).toBe('http://another.example.com/foo/bar');

      expect(cancel).toBe(true);
      expect(navigationMock.go).not.toHaveBeenCalled();
      expect(resourceData.url).toBe('');
    });
  });
});
