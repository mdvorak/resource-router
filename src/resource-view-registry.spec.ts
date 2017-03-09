import { async, TestBed, inject } from '@angular/core/testing';
import { ResourceViewRegistry, RESOURCE_VIEWS } from './resource-view-registry';
import { Type } from '@angular/core';

describe('ResourceViewRegistry', () => {
    beforeEach(async(() => {
        return TestBed.configureTestingModule({
            providers: [ResourceViewRegistry]
        });
    }));

    function fakeComponent(id: string): Type<any> {
        let type = class FakeComponent {
        };

        Object.defineProperty(type, 'name', {
            value: id,
            configurable: true,
            writable: false
        });

        return type;
    }

    describe('should initialize', () => {
        beforeEach(async(() => {
            return TestBed.configureTestingModule({
                providers: [
                    {
                        provide: RESOURCE_VIEWS,
                        useValue: [
                            {type: 'one', component: fakeComponent('one')},
                            {type: 'two', component: fakeComponent('two')},
                        ],
                        multi: true
                    },
                    {
                        provide: RESOURCE_VIEWS,
                        useValue: [
                            {type: 'three', component: fakeComponent('three')}
                        ],
                        multi: true
                    }
                ]
            });
        }));

        it('with configured views', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
            expect(registry).toBeTruthy();
            expect(registry.length).toBe(3);
            expect(registry.match('one', 200).component.name).toBe('one');
            expect(registry.match('two', 200).component.name).toBe('two');
            expect(registry.match('three', 200).component.name).toBe('three');
        }));
    });

    describe('should match exact type', () => {
        beforeEach(async(inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
            registry.addViews([
                {type: 'exact', component: fakeComponent('exact')},
                {type: 'application/exact', component: fakeComponent('application/exact')},
                {type: 'application/*', component: fakeComponent('application/*')},
                {type: 'exact', status: 201, component: fakeComponent('201 exact')},
                {type: 'exact', status: 400, component: fakeComponent('400 exact')},
                {type: 'exact', status: '4xx', component: fakeComponent('4?? exact')},
                {type: 'application/exact', status: '*', component: fakeComponent('??? application/exact')},
            ]);
        })));

        it('with default status', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
            expect(registry.match('exact', 200).component.name).toBe('exact');
            expect(registry.match('exact', 299).component.name).toBe('exact');
            expect(registry.match('application/exact', 200).component.name).toBe('application/exact');
            expect(registry.match('application/exact', 201).component.name).toBe('application/exact');
        }));

        it('with exact status', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
            expect(registry.match('exact', 201).component.name).toBe('201 exact');
            expect(registry.match('exact', 400).component.name).toBe('400 exact');
        }));

        it('with wildcard status', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
            expect(registry.match('exact', 499).component.name).toBe('4?? exact');
        }));

        it('with any status', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
            expect(registry.match('application/exact', 300).component.name).toBe('??? application/exact');
            expect(registry.match('application/exact', 0).component.name).toBe('??? application/exact');
            expect(registry.match('application/exact', 999).component.name).toBe('??? application/exact');
        }));

        it('without definition as null', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
            expect(registry.match('exact', 500)).toBeFalsy();
        }));

        it('with quality override', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
            // Extra data
            registry.addViews({
                type: 'exact', quality: 1.1, component: fakeComponent('quality exact')
            });
            registry.addViews({
                type: 'exact', quality: 1.1, status: 201, component: fakeComponent('201 quality exact')
            });
            registry.addViews({
                type: 'application/exact', quality: 0.9, component: fakeComponent('low quality exact')
            });

            // Test
            expect(registry.match('exact', 200).component.name).toBe('quality exact');
            expect(registry.match('exact', 201).component.name).toBe('201 quality exact');
            expect(registry.match('application/exact', 200).component.name).toBe('application/exact');
        }));
    });

    it('should match wildcard type with default status', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
    }));
    it('should match wildcard type with exact status', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
    }));
    it('should match wildcard type with wildcard status', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
    }));
    it('should match wildcard type with any status', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
    }));
    it('should match any type with exact status', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
    }));
    it('should match any type with wildcard status', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
    }));
    it('should match any type with any status', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
    }));
    it('should match exact type priority override', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
    }));
    it('should match wildcard type priority override', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
    }));
    it('should match any type priority override', inject([ResourceViewRegistry], (registry: ResourceViewRegistry) => {
    }));

    // TODO test default views

    // TODO test helper methods
});
