import { Link } from 'angular-resource-router';

export interface Hero {
  id?: number;
  name: string;

  _links: {
    self: Link;
  };
}

export interface Heroes {
  items: Hero[];

  _links: {
    self: Link;
  };
}
