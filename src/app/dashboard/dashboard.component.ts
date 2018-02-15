import { Component, OnInit } from '@angular/core';
import { Heroes } from '../hero';
import { ActivatedView } from 'angular-resource-router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  heroes: Heroes;

  constructor(private readonly view: ActivatedView<Heroes>) {
  }

  ngOnInit() {
    this.view.body.subscribe(heroes => this.heroes = heroes);
  }
}
