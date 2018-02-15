import { Link } from 'angular-resource-router';

export interface Hero {
  id: number;
  name: string;

  _links: {
    self: Link;
  };
}
