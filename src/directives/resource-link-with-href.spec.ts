import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { ResourceViewRegistry } from '../resource-view-registry';
import { ResourceLinkWithHrefDirective } from './resource-link';
import { Location } from '@angular/common';
import { ApiUrl, APP_API_PREFIX } from '../api-url';
import { ViewData } from '../view-data';
import { NavigationHandler } from '../navigation-handler';
import { Headers } from '@angular/http';
import { ApiLocation } from '../api-location';
import { By } from '@angular/platform-browser';
import { asSpy, createClassSpyObj } from '../utils/class-mock.spec';


describe(ResourceLinkWithHrefDirective.name, () => {
  let location: Location;
  let registry: ResourceViewRegistry;

  let comp: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  // Shared components
  beforeEach(async(() => {
    location = createClassSpyObj(Location);
    asSpy(location.path).and.returnValue('/');

    registry = createClassSpyObj(ResourceViewRegistry);

    return TestBed.configureTestingModule({
      declarations: [
        ResourceLinkWithHrefDirective,
        TestComponent,
      ],
      providers: [
        {
          provide: Location,
          useValue: location
        },
        {
          provide: ResourceViewRegistry,
          useValue: registry
        },
        {
          provide: APP_API_PREFIX,
          useValue: '/foo'
        },
        ApiUrl,
        ApiLocation,
      ]
    });
  }));

  // Without declared ViewData (typically outside resource-view directive)
  describe('without ViewData', () => {
    beforeEach(async(() => {
      fixture = TestBed.createComponent(TestComponent);
      comp = fixture.componentInstance;
      de = fixture.debugElement.query(By.directive(ResourceLinkWithHrefDirective));
      el = de.nativeElement;
    }));

    it('should be initialized', () => {
      expect(el).toBeDefined();
    });
  });

  // With declared ViewData (typically inside resource-view directive)
  describe('with ViewData', () => {
    let navigationMock: NavigationHandler;

    // Declare ViewData for DI
    beforeEach(async(() => {
      navigationMock = jasmine.createSpyObj<NavigationHandler>('navigation', ['go']);

      return TestBed.configureTestingModule({
        providers: [
          {
            provide: ViewData,
            useValue: new ViewData(navigationMock, null, null, '', 0, '', new Headers())
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

    it('should be initialized', () => {
      expect(el).toBeDefined();
    });
  });
});

/**
 * Helper component for tests.
 */
@Component({
  selector: 'my-test',
  template: `<a resourceLink="">${ResourceLinkWithHrefDirective.name}</a>`
})
class TestComponent {
}
