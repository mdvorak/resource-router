import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedView } from 'angular-resource-router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private readonly view: ActivatedView<Hero[]>) {
  }

  ngOnInit() {
    this.view.body.subscribe(heroes => this.heroes = heroes);
  }
}
