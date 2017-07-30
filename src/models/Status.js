/* @flow */

import Character from './Character'

export default class Status {
  constructor(resource) {
    this.status_id          = resource.status_reference_id
    this.message            = resource.message
    this.timestamp          = resource.publish_at
    this.kind               = resource.kind
    this.priority           = resource.priority
    this.social_id          = resource.social_network_status_id
    this.social_network_url = resource.social_network_url
    this.favorited          = false
    this.status_url         = resource._links.self.href
    this.conversation_url   = resource._links.conversation.href


    this.related_statuses   = resource.related_statuses.map(
                                (resource) => new Status(resource)
                              )

    this.character          = new Character(resource.character)

    this._buildMediaContent(resource)
  }

  _buildMediaContent(resource) {
    this.media_attachement = resource.social_network_attachments.map((resource) => {
                                return resource._links.media_url.href }
                              )[0]
    this.media_type        = resource.social_network_attachments.map((resource) => {
                                return resource.media_type }
                              )[0]

    var media_sizes        = resource.social_network_attachments.map((resource) => {
      return resource.media_sizes
    })[0]

    if (media_sizes) {
      media_sizes.forEach((size)=>{
        if (size.kind == "large"){
          this.media_height = size.height
          this.media_width  = size.width
        }
      })
    }
  }
}
