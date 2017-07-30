/* @flow */

import AuthorSocialNetwork from './AuthorSocialNetwork'
import Story               from './Story'

export default class Author {
  constructor(resource) {
    this.name                   = resource.name
    this.biography              = resource.biography
    this.avatar_url             = resource.avatar_url
    console.log(resource.stories);
    if (resource.stories) {
      this.stories                = resource.stories.map((story) => new Story(story))
    }
    this.author_social_networks = resource.author_social_networks.map(
                                          (network) => new AuthorSocialNetwork(network))
  }
}
