/* @flow */

export default class TwitterComment {
  constructor(resource, reference_status='undefined', related='undefined') {
    this.name                  = resource.user.name
    this.in_reply_to_status_id = resource.in_reply_to_status_id_str
    this.username              = resource.user.screen_name
    this.social_network_url    = `http://twitter.com/${resource.user.screen_name}/status/${resource.id_str}`
    this.avatar_url            = resource.user.profile_image_url
    this.message               = resource.text
    this.social_id             = resource.id_str
    this.timestamp             = resource.created_at
    this.character             = {
                                    name: resource.user.name,
                                    avatar: resource.user.profile_image_url,
                                    profiles: {
                                      twitter: resource.user.screen_name
                                    }
                                 }

    if (reference_status === 'undefined') {
      this.kind                = "twitter_post"
      this.related_statuses    = []
    }else{
      this.kind                = reference_status.social_id == resource.in_reply_to_status_id_str ? "twitter_post" : "twitter_reply"
      this.related_statuses    = this._buildRelated(related, resource.in_reply_to_status_id_str)
    }
  }

  _buildRelated(source, id) {
    var related = []
    for (var i = 0; i < source.length; i++) {
      if (source[i].id_str === id) {
        related.push(new TwitterComment(source[i]))
      }
    }

    return related
  }
}
