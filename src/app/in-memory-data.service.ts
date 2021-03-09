import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Hero, Heroes } from './hero';

const LAZY_TYPE = 'application/x.lazy.component';
const DASHBOARD_TYPE = 'application/x.dashboard';
const HEROES_TYPE = 'application/x.heroes';
const HERO_TYPE = 'application/x.hero';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      {id: 11, name: 'Mr. Nice'},
      {id: 12, name: 'Narco'},
      {id: 13, name: 'Bombasto'},
      {id: 14, name: 'Celeritas'},
      {id: 15, name: 'Magneta'},
      {id: 16, name: 'RubberMan'},
      {id: 17, name: 'Dynama'},
      {id: 18, name: 'Dr IQ'},
      {id: 19, name: 'Magma'},
      {id: 20, name: 'Tornado'},
    ];
    return {heroes};
  }

  get(request: RequestInfo): Observable<any> | undefined {
    if (request.collectionName === 'heroes' && request.id) {
      const data = request.utils.findById(request.collection, request.id);

      if (data) {
        return request.utils.createResponse$(() => ({
          url: request.url,
          body: hyperHero(<any>data),
          status: 200,
          statusText: 'OK',
          headers: new HttpHeaders({
            'Content-Type': HERO_TYPE
          })
        }));
      }
    } else if (request.collectionName === 'heroes') {
      return request.utils.createResponse$(() => ({
        url: request.url,
        body: <Heroes>{
          items: request.collection.map(hyperHero),
          _links: {
            self: {href: '/api/heroes'},
          }
        },
        status: 200,
        statusText: 'OK',
        headers: new HttpHeaders({
          'Content-Type': HEROES_TYPE
        })
      }));
    } else if (request.collectionName === 'dashboard') {
      const collection = (request.utils.getDb() as any).heroes;

      return request.utils.createResponse$(() => ({
        url: request.url,
        body: <Heroes>{
          items: collection.slice(0, 4).map(hyperHero),
          _links: {
            self: {href: '/api/dashboard'}
          }
        },
        status: 200,
        statusText: 'OK',
        headers: new HttpHeaders({
          'Content-Type': DASHBOARD_TYPE
        })
      }));
    } else if (request.collectionName === 'lazy') {
      return request.utils.createResponse$(() => ({
        url: request.url,
        body: {},
        status: 200,
        statusText: 'OK',
        headers: new HttpHeaders({
          'Content-Type': LAZY_TYPE
        })
      }));
    }
  }
}

function hyperHero({id, name}: { id: number, name: string }, index?: number): Hero {
  return {
    id: id,
    name: name,
    _links: {
      self: {href: '/api/heroes/' + id}
    }
  };
}
