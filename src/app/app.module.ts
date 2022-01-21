import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { environment } from './environments/environment';
import { ResourceRouterModule } from 'angular-resource-router';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { AppRoutingModule } from './app-routing.module';
import { MessageService } from './message.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageHttpInterceptor } from './message-http-interceptor';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    // Mock HTTP backend
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      apiBase: environment.prefix,
      dataEncapsulation: false
    }),
    // Router config
    ResourceRouterModule.configure({
      prefix: environment.prefix,
      useHash: environment.useHash
    }),
    // Routes
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    MessagesComponent,
    DashboardComponent,
    HeroesComponent,
    HeroDetailComponent,
  ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MessageHttpInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
