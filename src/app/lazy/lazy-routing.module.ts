import { NgModule } from '@angular/core';
import { ResourceRouterModule } from 'angular-resource-router';
import { LazyComponent } from './lazy.component';

@NgModule({
  imports: [
    ResourceRouterModule.forTypes([
      {
        type: 'application/x.lazy.component',
        component: LazyComponent
      }
    ])
  ],
  exports: [
    ResourceRouterModule
  ],
})
export class LazyRoutingModule {
}
