/* @flow */
import Halson from 'halson';
import Story  from './Story';

export default class Favorite {
  constructor(json) {
    const resource = Halson(json);

    this.story = new Story(resource.story);

    this.link  = resource.getLink('self').href;
  }
}
