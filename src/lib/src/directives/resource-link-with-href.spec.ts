import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {ResourceViewRegistry} from '../resource-view-registry';
import {TargetType} from './resource-link';
import {Location, LocationStrategy} from '@angular/common';
import {ApiMapper} from '../api-mapper';
import {ViewData} from '../view-data';
import {Navigable} from '../navigation';
import {ApiLocation} from '../api-location';
import {By} from '@angular/platform-browser';
import {createClassSpyObj} from '../utils/class-spy.spec';
import {ResourceLinkWithHrefDirective} from './resource-link-with-href';
import {MockLocationStrategy} from '@angular/common/testing';
import {ApiUrl, BrowserApiUrl} from '../api-url';
import {APP_API_PREFIX, SingleApiMapper} from '../single-api-mapper';
import {NO_HEADERS} from '../read-only-headers';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ActivatedView} from '../activated-view';


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
  let mockLocationStrategy: MockLocationStrategy;
  let registry: ResourceViewRegistry;

  let comp: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  // Shared components
  beforeEach(async(() => {
    registry = createClassSpyObj(ResourceViewRegistry);

    return TestBed.configureTestingModule({
      declarations: [
        ResourceLinkWithHrefDirective,
        TestComponent,
      ],
      providers: [
        {provide: LocationStrategy, useClass: MockLocationStrategy},
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
          provide: ApiUrl,
          useClass: BrowserApiUrl
        },
        {
          provide: ApiMapper,
          useClass: SingleApiMapper
        },
        ApiLocation,
      ]
    });
  }));

  // Without declared ActivatedView (typically outside resource-view directive)
  describe('without ActivatedView', () => {
    beforeEach(async(inject([LocationStrategy], (locationStrategy: MockLocationStrategy) => {
      mockLocationStrategy = locationStrategy;
      fixture = TestBed.createComponent(TestComponent);
      comp = fixture.componentInstance;
      de = fixture.debugElement.query(By.directive(ResourceLinkWithHrefDirective));
      el = de.nativeElement;
    })));

    it('should be initialized', () => {
      expect(el).toBeDefined();
    });

    it('should change location onClick without target set', () => {
      mockLocationStrategy.internalPath = '/init';

      comp.link = API_PREFIX + 'foo/bar';
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 0});

      // Verify
      expect(mockLocationStrategy.internalPath).toBe('/foo/bar');
    });

    it('should not handle click with ctrlKey', () => {
      mockLocationStrategy.internalPath = '/init';

      comp.link = API_PREFIX + 'foo/bar';
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 0, ctrlKey: true});

      // Verify
      expect(mockLocationStrategy.internalPath).toBe('/init');
    });

    it('should not handle click with metaKey', () => {
      mockLocationStrategy.internalPath = '/init';

      comp.link = API_PREFIX + 'foo/bar';
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 0, metaKey: true});

      // Verify
      expect(mockLocationStrategy.internalPath).toBe('/init');
    });

    it('should not handle click with other mouse buttons', () => {
      mockLocationStrategy.internalPath = '/init';

      comp.link = API_PREFIX + 'foo/bar';
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 1, metaKey: true});

      // Verify
      expect(mockLocationStrategy.internalPath).toBe('/init');
    });

    it('should change location onClick with target _self', () => {
      mockLocationStrategy.internalPath = '/init';

      comp.link = API_PREFIX + 'foo/bar';
      comp.target = '_self';
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 0});

      // Verify
      expect(mockLocationStrategy.internalPath).toBe('/foo/bar');
    });

    it('should change location onClick with target _top', () => {
      mockLocationStrategy.internalPath = '/init';

      comp.link = API_PREFIX + 'foo/bar';
      comp.target = '_top';
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 0});

      // Verify
      expect(mockLocationStrategy.internalPath).toBe('/foo/bar');
    });

    it('should navigate onClick with explicit target', () => {
      mockLocationStrategy.internalPath = '/init';
      const navigationMock = createSpyNavigable();

      comp.link = API_PREFIX + 'foo/bar';
      comp.target = navigationMock;
      fixture.detectChanges();

      // Test
      de.triggerEventHandler('click', {button: 0});

      // Verify
      expect(navigationMock.go).toHaveBeenCalledWith(API_PREFIX + 'foo/bar');
      expect(mockLocationStrategy.urlChanges.length).toBe(0);
    });

    it('should change location with external url', () => {
      mockLocationStrategy.internalPath = '/init';
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
      expect(mockLocationStrategy.internalPath).toBe('/init');
    });
  });

  // With declared ActivatedView (typically inside resource-view directive)
  describe('with ActivatedView', () => {
    let navigationMock: Navigable;

    let viewData: ViewData<any>;
    let viewDataSubject: BehaviorSubject<ViewData<any>>;

    // Declare ViewData for DI
    beforeEach(async(() => {
      navigationMock = createSpyNavigable();

      viewData = {
        target: navigationMock,
        config: {type: 'test', component: TestComponent},
        type: 'test',
        url: '',
        status: 0,
        statusText: '',
        headers: NO_HEADERS,
        body: undefined,
      };
      viewDataSubject = new BehaviorSubject(viewData);

      return TestBed.configureTestingModule({
        providers: [
          {
            provide: ActivatedView,
            useValue: new ActivatedView(navigationMock, viewDataSubject)
          }
        ]
      });
    }));

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TestComponent);
      comp = fixture.componentInstance;
      de = fixture.debugElement.query(By.directive(ResourceLinkWithHrefDirective));
      el = de.nativeElement;
    }));

    // TODO
    it('should be initialized', () => {
      expect(el).toBeDefined();
    });
  });
});
