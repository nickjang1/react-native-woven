/* @flow */
import MobileDevice from './MobileDevice'
import Favorite     from './Favorite'

export default class User {
  constructor(resource) {
    this.name                         = resource.name
    this.email                        = resource.email
    this.user_token                   = resource.user_token

    this.mobile_devices               = this._mobileDevices(resource.mobile_devices)
    this.favorites                    = this._favorites(resource.favorites)

    this.link                         = resource.getLink('self').href
    this.stories                      = resource.getLink('stories').href
    this.notification_preferences_url = resource.getLink('notification_preferences').href
    this.mobile_devices               = resource.getLink('mobile_devices').href
    this.notification_test            = resource.getLink('notification_test').href
    this.categorized_stories          = resource.getLink('categorized_stories').href
  }

  _mobileDevices(mobileDevices) {
    let devices = []

    mobileDevices.map((mobile_device) => {
      devices.push(new MobileDevice(mobile_device))
    })

    return devices
  }

  _favorites(favorites) {
    let favs = []

    favorites.map((fav) => {
      favs.push(new Favorite(fav))
    })

    return favs
  }
}
