/* @flow */

import {
  AsyncStorage,
} from 'react-native'
import OAuthManager from 'react-native-oauth';

const authManager = new OAuthManager('woven');

const app_keys = {
  twitter: {
    consumer_key: 'e6oJ3uykpRNhb3SP6FBEhzzdT',
    consumer_secret: 'uRiokVz92pM1BpT7kBrR9HVPn7wrZrYpL8n9zMvgvBVwOSMu1f'
  },
};

export default class Twitter {
  constructor() {
    this.configureProvider();
  }

  configureProvider() {
    authManager.configure(
      app_keys
    );
    
  }

  authorize() {
    authManager.authorize('twitter')
    .then(resp => {

    }) // Save response object
    .catch(err => console.log('There was an error'));
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
    await authManager.authorize('twitter')
    .then(resp => {
      const response = resp['response'];
      if(resp['authorized']){
        AsyncStorage.setItem("TWITTER_USER_CREDENTIALS", JSON.stringify(response));

        return  { authorized: true };

      }
      else{
        return { error: 'not authorized' };
      }
      
    }) // Save response object
    .catch((error) => {
      return {error: error}
    });
  }

  _requestUserInfo(user_id) {
    return authManager.makeRequest(
      'twitter', 
      'https://api.twitter.com/1.1/account/verify_credentials.json'
    )
    .then((response) => {
      return response.data;
    }).catch((err) => {
      console.log(err);
      //return this.favoriteStatus(identifier)
    });
  }

  async favorite(identifier) {
    const params = {
      "id": identifier
    }

   return await authManager.makeRequest(
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

    return await authManager.makeRequest(
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

    return await authManager.makeRequest(
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

    return await authManager.makeRequest(
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

    return await authManager.makeRequest(
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

    return await authManager.makeRequest(
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

    return await authManager.makeRequest(
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

    await authManager.makeRequest(
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
