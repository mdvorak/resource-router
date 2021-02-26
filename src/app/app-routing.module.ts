import { NgModule } from '@angular/core';
import { ResourceRouterModule } from 'angular-resource-router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { TenderNamesResolver } from './resolvers/tender-names/tender-names.resolver';

@NgModule({
  imports: [
    ResourceRouterModule.forTypes([
      {
        type: 'application/x.dashboard',
        component: DashboardComponent
      },
      {
        type: 'application/x.heroes',
        component: HeroesComponent
      },
      {
        type: 'application/x.hero',
        component: HeroDetailComponent,
        resolve: {
          tenderNames: TenderNamesResolver
        }
      }
    ])
  ],
  exports: [
    ResourceRouterModule
  ],
})
export class AppRoutingModule {
}
