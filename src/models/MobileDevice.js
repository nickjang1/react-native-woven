/* @flow */
import Halson from 'halson';
export default class MobileDevice {
  constructor(json) {
    const resource = Halson(json);

    this.kind  = resource.kind ;
    this.token = resource.synopsis;

    this.link  = resource.getLink('self').href;
  }
}
