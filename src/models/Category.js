/* @flow */
import Halson from 'halson';

export default class Category {
  constructor(json) {
    const resource = Halson(json);

    this.name           = resource.name;
    this.stories           = resource.stories;
  }
}
