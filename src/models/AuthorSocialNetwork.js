/* @flow */
let halson = require('halson');

export default class AuthorSocialNetwork {
  constructor(json) {
    const resource = halson(json);

    this.username   = resource.username;
    this.name       = resource.name;
    this.link       = resource.link;
    this.kind       = resource.kind;
  }
}
