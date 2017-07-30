/* @flow */
import Halson from 'halson';
import Author from './Author'

export default class Story {
  constructor(json) {
    const resource = Halson(json)

    this.title                        = resource.title
    this.synopsis                     = resource.synopsis
    this.start_date                   = resource.start_date
    this.end_date                     = resource.end_date
    this.cover                        = resource.cover
    this.favorites_count              = resource.favorites_count
    this.finished                     = resource.finished
    this.author                       = new Author(resource.author)
    this.micro_site_url               = resource.micro_site_url
    this.link                         = resource.getLink('self').href
    this.characters_link              = resource.getLink('characters').href
    this.statuses_link                = resource.getLink('statuses').href
    this.author_url                   = resource.getLink('author').href
    this.favorite_url                 = resource.getLink('favorite').href
    this.notification_preferences_url = resource.getLink('notification_preferences').href
  }
}
