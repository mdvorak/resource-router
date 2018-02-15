import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders } from '@angular/common/http';
import { Hero } from './hero';

const DASHBOARD_TYPE = 'application/x.dashboard';
const HEROES_TYPE = 'application/x.heroes';
const HERO_TYPE = 'application/x.hero';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      createHero({id: 11, name: 'Mr. Nice'}),
      createHero({id: 12, name: 'Narco'}),
      createHero({id: 13, name: 'Bombasto'}),
      createHero({id: 14, name: 'Celeritas'}),
      createHero({id: 15, name: 'Magneta'}),
      createHero({id: 16, name: 'RubberMan'}),
      createHero({id: 17, name: 'Dynama'}),
      createHero({id: 18, name: 'Dr IQ'}),
      createHero({id: 19, name: 'Magma'}),
      createHero({id: 20, name: 'Tornado'})
    ];
    return {heroes};
  }

  get(request: RequestInfo): Observable<any> | undefined {
    if (request.collectionName === 'heroes' && request.id) {
      const data = request.utils.findById(request.collection, request.id);

      if (data) {
        return request.utils.createResponse$(() => ({
          url: request.url,
          body: JSON.stringify(data),
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
        body: JSON.stringify(request.collection),
        status: 200,
        statusText: 'OK',
        headers: new HttpHeaders({
          'Content-Type': HEROES_TYPE
        })
      }));
    } else if (request.url.endsWith('/api/dashboard')) {
      const collection: Hero[] = (request.utils.getDb() as any).heroes;

      return request.utils.createResponse$(() => ({
        url: request.url,
        body: JSON.stringify(collection.slice(1, 5)),
        status: 200,
        statusText: 'OK',
        headers: new HttpHeaders({
          'Content-Type': DASHBOARD_TYPE
        })
      }));
    }
  }
}

function createHero(obj: { id: number, name: string }) {
  return {
    id: obj.id,
    name: obj.name,
    _links: {
      self: {href: '/api/heroes/' + obj.id}
    }
  };
}
