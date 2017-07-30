/* @flow */
import Halson from 'halson'

export default class ApiRoot {
  constructor(resource) {
    this.link         = resource.getLink('self').href
    this.stories      = resource.getLink('stories').href
    this.user         = resource.getLink('user').href
    this.categorized_stories = resource.getLink('categorized_stories').href
  }
}
