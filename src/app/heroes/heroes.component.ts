import { Component, OnInit } from '@angular/core';
import { Hero, Heroes } from '../hero';
import { ActivatedView } from 'angular-resource-router';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Heroes;

  constructor(private readonly view: ActivatedView<Heroes>,
              private readonly http: HttpClient) {
  }

  ngOnInit() {
    this.view.body.subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }

    const hero = {name} as Hero;

    this.heroes.items.push(hero);
    this.http.post(this.heroes._links.self.href, hero)
      .subscribe(() => this.view.reload());
  }

  delete(hero: Hero): void {
    this.heroes.items = this.heroes.items.filter(h => h !== hero);
    this.http.delete(hero._links.self.href)
      .subscribe(() => this.view.reload());
  }
}
