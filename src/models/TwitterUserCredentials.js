/* @flow */

export default class TwitterUserCredentials {

  constructor(user_info) {
    this.username     = user_info["username"]
    this.oauth_token  = user_info["token"]
    this.oauth_secret = user_info["secret"]
  }

}
