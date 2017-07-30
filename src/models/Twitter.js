/* @flow */

import {
  AsyncStorage,
  NativeModules
} from 'react-native'

import TwitterUserCredentials from './TwitterUserCredentials'

const authManager = NativeModules.OAuthManager
const appUrl      = "woven://twitter-auth"
const service     = "twitter"

const app_keys = {
  consumer_key:    "e6oJ3uykpRNhb3SP6FBEhzzdT",
  consumer_secret: "uRiokVz92pM1BpT7kBrR9HVPn7wrZrYpL8n9zMvgvBVwOSMu1f"
}

export default class Twitter {
  constructor() {
    this._setupManager()
  }

  async _setupManager() {

    await this.authenticated().then((authenticated) => {
      if (authenticated == true) {
        AsyncStorage.getItem("TWITTER_USER_CREDENTIALS", (err, result) => {

          var userCredentials = new TwitterUserCredentials(JSON.parse(result))

          var credentials = Object.assign({}, userCredentials, app_keys)
          for (var key in userCredentials) {
            if (credentials[key] == 'undefined') {
              credentials[key] = userCredentials[key]
            }
          }
          return this.configureProvider(credentials)
        })
      }else{
        return this.configureProvider(app_keys)
      }
    })

  }

  async configureProvider(credentials) {
    authManager.configureProvider(
      service,
      credentials
    ).then((response) => {
      if (response == true) {
        return this._requestUserInfo(credentials.username)
      }
    }).catch((error) => {
      console.error(error)
    })
  }

  async authenticated() {
    return await AsyncStorage.getItem("TWITTER_USER_CREDENTIALS") ? true : false
  }

  async logout() {
    try {
      await AsyncStorage.removeItem("TWITTER_USER_CREDENTIALS")
      return {success: true}
    } catch (error) {
      return {error: error}
    }
  }

  async authenticate() {
    return await authManager.authorizeWithCallbackURL(service, appUrl)
    .then((response) => {
      return AsyncStorage.setItem("TWITTER_USER_CREDENTIALS", JSON.stringify(response), () => {
        var credentials = app_keys
        var userCredentials = new TwitterUserCredentials(response)
        for (var key in userCredentials) {
          credentials[key] = userCredentials[key]
        }
        return this._setupManager(credentials)
      })
    }).catch((error) => {
      return {error: error}
    })
  }

  async _requestUserInfo(username) {
    return await authManager.makeSignedRequest('twitter', 'get', 'users/show', {username: username})
    .then((response) => {
      return response[0]
    })
    .catch((erro) => {
      return erro
    })
  }

  async favorite(identifier) {
    const params = {
      "id": identifier
    }

   return await authManager.makeSignedRequest(
      'twitter',
      'post',
      'favorites/create',
      params
    ).then((response) => {
      return response[0].favorited
    }).catch((err) => {
      return this.favoriteStatus(identifier)
    })
  }

  async unfavorite(identifier) {
    const params = {
      "id": identifier
    }

    return await authManager.makeSignedRequest(
      'twitter',
      'post',
      'favorites/destroy',
      params
    ).then((resp) => {
      return false
    }).catch((err) => {
      return false
    })
  }

  async favoriteStatus(identifier) {
    const params = {
      "id": identifier
    }

    return await authManager.makeSignedRequest(
      'twitter',
      'get',
      'statuses/show',
      params
    ).then((response) => {
      return response[0].favorited
    }).catch((err) => {
      return false
    })
  }

  async follow(username) {
    const params = {
      "username": username
    }

    return await authManager.makeSignedRequest(
      'twitter',
      'post',
      'friendships/create',
      params
    ).then((result) => {
        return true
    }).catch((err) => {
        return false
    })
  }

  async unfollow(username) {
    const params = {
      "screen_name" : username
    }

    return await authManager.makeSignedRequest(
      'twitter',
      'post',
      'friendships/destroy',
      params
    ).then((result) => {
      return false
    }).catch((err) => {
      return false
    })
  }

  async followStatus(username) {
    const params = {
      "usernames": [username]
    }

    return await authManager.makeSignedRequest(
      'twitter',
      'get',
      'friendships/lookup',
      params
    ).then((response) => {
      let following = response[0].connections.indexOf('following')
      return following >= 0
    }).catch((err) => {
      return false
    })
  }

  async reply(status, text, kind) {
    const params = {
      "status": text
    }

    if (kind == "quote") {
      params["attachment_url"] = status.social_network_url
    }else if(kind == "reply"){
      params["ref_status_id"] = status.social_id
    }

    return await authManager.makeSignedRequest(
      'twitter',
      'post',
      'statuses/update',
      params
    ).then((resp) => {
      return resp
    }).catch((err) => {
      return false
    })
  }

  async retweet(identifier) {
    const params = {
      'id': identifier
    }

    await authManager.makeSignedRequest(
      'twitter',
      'post',
      'statuses/retweet',
      params
    ).then((response) => {
        return true
    }).catch((error) => {
        return false
    })
  }

}
