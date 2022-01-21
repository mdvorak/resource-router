import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Hero } from '../hero';
import { ActivatedView } from 'angular-resource-router';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  hero: Hero;
  tenderNames: string[];

  constructor(private readonly view: ActivatedView<Hero>,
              private readonly http: HttpClient,
              private location: Location) {
  }

  ngOnInit(): void {
    this.view.body.subscribe(hero => this.hero = hero);
    this.view.resolve.subscribe((resolve: any) => this.tenderNames = resolve.tenderNames);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    const url = this.hero._links.self.href;
    this.http.post(url, this.hero).subscribe(() => this.goBack());
  }

  select(name: string): void {
    this.hero.name = name;
  }
}
