/* @flow */

import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
  AsyncStorage,
  processColor,
  Navigator,
  ActionSheetIOS,
  Alert
} from 'react-native'

import {styles}       from '../styles/Styles'
import {statusStyles} from '../styles/StatusStyles'
import Moment         from 'moment'
import Hyperlink      from 'react-native-hyperlink'
import SafariView     from 'react-native-safari-view'
import Twitter        from '../models/Twitter'
import Character      from '../models/Character'
import WovenRequestManager from '../models/WovenRequestManager'
import Halson     from 'halson'
import {
  GoogleAnalyticsTracker
} from 'react-native-google-analytics-bridge'

import { _openURL } from '../helpers'

const retweetConstant = "retweet"
class TweetHeaderView extends Component {

  render() {
    this.tracker = new GoogleAnalyticsTracker('UA-60734393-4')
    let text = <Text style={[statusStyles.tweetUsername]}>
      {this.props.character.name}
    </Text>
    if (this.props.headerType == 'twitter_rt') {
      text = <Text style={[statusStyles.tweetUsername]}>
        {this.props.rtPreviewCharacter.name}
      </Text>
    }
    else if (this.props.headerType == 'twitter_reply') {
      if (this.props.inReplyToCharacter != undefined) {
        if (this.props.character.name !== this.props.inReplyToCharacter.name) {
          text = <View style={statusStyles.tweetLead}>
            <Text style={[statusStyles.tweetUsername]}>
              {text}
            </Text>
            <Text style={[statusStyles.tweetUsername, statusStyles.tweetFollow]}>
              {" replied to " + this.props.inReplyToCharacter.name + "…"}
            </Text>
          </View>
        }else if (this.props.character.name == this.props.inReplyToCharacter.name) {
          text = <View style={statusStyles.tweetLead}>
            <Text style={[statusStyles.tweetUsername]}>
              {text}
            </Text>
            <Text style={[statusStyles.tweetUsername, statusStyles.tweetFollow]}>
              {" followed up…"}
            </Text>
          </View>
        }
      }
    }

    let avatar = this.props.character.avatar
    if (this.props.headerType == 'twitter_rt') {
      avatar = this.props.rtPreviewCharacter.avatar
    }
    else {
      avatar = this.props.character.avatar
    }

    return <TouchableOpacity onPress={() => this._showCharacterPage(this.props.character)}>
      <View style={statusStyles.tweetHeader}>
        <Image style={statusStyles.tweetAvatar}
          source={{uri: avatar}} />
        <View style={statusStyles.user}>
          {text}
          <Text style={statusStyles.tweetHandle}>
            {'@' + this.props.character.profiles.twitter}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  }

  // - Show character
  _showCharacterPage(character) {
    if (this.props.isComment) {
      this._openURL(`http://twitter.com/${character.profiles.twitter}`)
    }else{
      this.tracker.trackEvent('Story', 'show-character', { label: character.name })
      this.props.navigator.push({
        id: 'character',
        character: character,
        user: this.props.user
      })
    }
  }

  _openURL(url) {
    _openURL( url, this.props.navigator )
  }
}

class TweetstormHeaderView extends Component {

  render() {
    this.tracker = new GoogleAnalyticsTracker('UA-60734393-4')
    let text = this.props.character.name
    if (this.props.headerType == 'twitter_rt') {
      text = this.props.rtPreviewCharacter.name
    }
    else if (this.props.headerType == 'twitter_reply') {
      if (this.props.inReplyToCharacter != undefined) {
        if (text !== this.props.inReplyToCharacter.name) {
          text = text + " replied to " + this.props.inReplyToCharacter.name + "…"
        }else if (text == this.props.inReplyToCharacter.name) {
          text = text + " followed up…"
        }
      }
    }

    let avatar = this.props.character.avatar
    if (this.props.headerType == 'twitter_rt') {
      avatar = this.props.rtPreviewCharacter.avatar
    }
    else {
      avatar = this.props.character.avatar
    }

    return <TouchableOpacity onPress={() => this._showCharacterPage(this.props.character)}>
      <View style={[statusStyles.tweetstormHeader, {borderTopWidth: this.props.timeLead ? 0 : 1}]}>
        <Image style={statusStyles.tweetstormAvatar}
          source={{uri: avatar}} />
        <View style={statusStyles.user}>
          <Text style={[statusStyles.tweetUsername, statusStyles.tweetstormUsername]}>
            {text}
          </Text>
          <Text style={statusStyles.tweetHandle}>
            {'@' + this.props.character.profiles.twitter}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  }

  // - Show character
  _showCharacterPage(character) {
    if (this.props.isComment) {
      this._openURL(`http://twitter.com/${character.profiles.twitter}`)
    }else{
      this.tracker.trackEvent('Story', 'show-character', { label: character.name })
      this.props.navigator.push({
        id: 'character',
        character: character,
        user: this.props.user
      })
    }
  }

  _openURL(url) {
    _openURL( url, this.props.navigator )
  }
}

class TweetTextView extends Component {

  _openURL(url) {
    _openURL( url, this.props.navigator )
  }

  render() {
    var retweetText = this.props.kind == 'twitter_post' ?
    this.props.message : this.props.rtPreviewMessage

    return <Hyperlink
      onPress={(url) => this._openURL(url)}
      linkStyle={{color: variables.tappableColor}}
    >
      <Text style={styles.tweetText}>
        {this.props.message}
      </Text>
    </Hyperlink>
  }

}

class TweetFooterView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      favorited: false,
      retweeted: false,
    }

    this._checkIfFavorite()
    this._checkIfRetweet()
    this.tracker = new GoogleAnalyticsTracker('UA-60734393-4')
  }

  async _checkIfFavorite() {
    AsyncStorage.getItem(this.props.status.social_id, (err, result) => {
      if (result == null) {

        var twitter = new Twitter()
        twitter.authenticated().then((authenticated) => {
          if (authenticated == true) {
            twitter.favoriteStatus(this.props.status.social_id).then((result) => {
              AsyncStorage.setItem(this.props.status.social_id, JSON.stringify({favorited: result}))
              this.setState({favorited: result})
            })
          }
        })
      }else{
        var favorite = JSON.parse(result)
        this.setState({favorited: favorite.favorited})
      }
    })

  }

  async _checkIfRetweet() {
      let retweetKey = retweetConstant + "" + this.props.status.social_id
      AsyncStorage.getItem(retweetKey, (err, result) => {
        if (result == null) {

          var twitter = new Twitter()
          twitter.authenticated().then((authenticated) => {
            if (authenticated == true) {
                this.setState({retweeted: result})
            }
          })
        }else{
          var retweet = JSON.parse(result)
          this.setState({retweeted: retweet.retweeted})
        }
      })
    }

  render() {
    return <View>
      {this.tweetFooter()}
    </View>
  }

  tweetFooter() {
    return <View style={statusStyles.tweetFooter}>
      <View style={statusStyles.actionButtons}>
        {this.buttonReply()}
        {this.buttonRetweet()}
        {this.buttonFavorite()}
      </View>

      <TouchableOpacity
        onPress={() => this._openConversation(this.props.status)}>
        <Text style={statusStyles.timestamp}>
          {Moment(this.props.status.timestamp).format("M/D • HH:mm")}
        </Text>
      </TouchableOpacity>
    </View>
  }

  // - Conversation
  _openConversation(status, comment = null) {
    if (this.props.isComment) {
      if (comment) {
        this.props.navigator.pop()
        Alert.alert(
          'Now Posting to Twitter',
          'Check back in a sec and your comment will be added to the convo',
          [
            {
              text: 'Got it!'
            }
          ]
        )
      }else{
        this.openURL(status.social_network_url)
      }
    }else{
      this.tracker.trackEvent('Status', 'open-conversation', { label: status.message })
      this.props.navigator.replace({
        id: 'status-detail',
        status: status,
        statuses: this.props.statuses,
        comment: comment,
        user: this.props.user
      })
    }
  }

  async _favorite() {
    var twitter = new Twitter()
    await twitter.authenticated().then((authenticated) => {
      if (authenticated == true) {
        if (this.state.favorited == true) {
          twitter.unfavorite(this.props.status.social_id).then((result) => {

            AsyncStorage.setItem(this.props.status.social_id, JSON.stringify({favorited: result}))
            this.setState({favorited: result})
          })
        }else{
          twitter.favorite(this.props.status.social_id).then((result) => {
            AsyncStorage.setItem(this.props.status.social_id, JSON.stringify({favorited: result}))
            this.setState({favorited: result})
            this._checkFollowStatus(this.props.status.character.profiles.twitter, "like")
          })
        }
      }else{
        twitter.authenticate()
      }
    })
  }

  // Buttons
  buttonFavorite() {
    const source = this.state.favorited?
    require('./../../img/favorite-post.png') :
    require('./../../img/favorite.png')

    return <TouchableOpacity
    onPress={() => this._favorite()}
    underlayColor="gray"
    style={[statusStyles.tweetFooterButtons, statusStyles.firstButton]}
    >
      <Image style={statusStyles.buttonActions}
        source={source}
      />
    </TouchableOpacity>
  }

  async _selectRetweetOrQuoteStatus(status) {
    var twitter = new Twitter()
    await twitter.authenticated().then((authenticated) => {
      if (authenticated == true) {
        ActionSheetIOS.showActionSheetWithOptions({
          options: ['Retweet', 'Quote', 'Cancel'],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
         switch (buttonIndex) {
          case 0:
            return this._retweet(status)
          case 1:
            return this._replyOrQuote(status, "quote")
        }
        })
      }else{
        twitter.authenticate()
      }
    })
  }

  async _retweet(status) {

    let retweetKey = retweetConstant + "" + this.props.status.social_id
    AsyncStorage.setItem(retweetKey, JSON.stringify({retweeted: true}))
    this.setState({retweeted: true})
    var twitter = new Twitter()

    await twitter.retweet(status.social_id).then((result) => {
      this._checkFollowStatus(status.character.profiles.twitter, "retweet")
    })
  }

  _replyOrQuote(status, kind) {
    var twitter = new Twitter()
    twitter.authenticated().then((authenticated) => {
      if (authenticated == true) {
        this.props.navigator.push({
          id: 'reply',
          status: status,
          kind: kind,
          callDetailsView: (comment) => this._openConversation(status, comment),
          sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
          user: this.props.user
        })
      }else{
        twitter.authenticate()
      }
    })
  }

  buttonReply() {
    return <TouchableOpacity
    onPress={() => this._replyOrQuote(this.props.status, "reply")}
    underlayColor="gray"
    style={[statusStyles.tweetFooterButtons]}
    >
      <Image style={statusStyles.buttonActions}
        source={require('./../../img/reply.png')}
      />
    </TouchableOpacity>
  }

  buttonRetweet() {
    return <TouchableOpacity
    onPress={() => this._selectRetweetOrQuoteStatus(this.props.status)}
    underlayColor="gray"
    style={[statusStyles.tweetFooterButtons]}
    >
      <Image style={statusStyles.buttonActions}
        source={ this.state.retweeted ?
                  require('./../../img/retweet-post.png') :
                  require('./../../img/retweet.png')}
      />
    </TouchableOpacity>
  }

  _checkFollowStatus(username, action) {
    if (this.props.isComment) {

    }else{
      AsyncStorage.getItem(username, (err, result) => {
        if (result == null) {
          var twitter = new Twitter()
          twitter.authenticated().then((authenticated) => {
            if (authenticated == true) {
              twitter.followStatus(username).then((result) => {
                if (result == false) {
                  this._showStayInTouchModal(username, action)
                }
              })
            }
          })
        }else if(result == false) {
          this._showStayInTouchModal(username, action)
        }
      })
    }
  }

  _showStayInTouchModal(username, action) {
    let verb
    if (action === 'like') {
      verb = 'liking'
    } else if (action === 'retweet') {
      verb =  'retweeting'
    } else {
      verb =  'replying'
    }

    Alert.alert(
    'Thanks for ' + verb + ' @' + username + '\'s tweet',
    'Stay in touch with them by following',
    [
      {text: 'Follow @' + username, onPress: () => this._follow(username)},
      {text: 'Follow all characters', onPress: () => this._fetchAllCharacters()},
      {text: 'Maybe later', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
    ])
  }

  _fetchAllCharacters() {
    var wovenRequestManager = new WovenRequestManager
    wovenRequestManager._get(this.props.characters_link).then((response) => {
    var resource = Halson(response)

    resource.getEmbeds('characters').map((character) => {
      this._follow(character.social_networks[0].username)
    })
  })
}
  _follow(username) {
    var twitter = new Twitter()
    twitter.authenticated().then((authenticated) => {
      if (authenticated == true) {
        twitter.follow(username).then((result) => {
          this.setState({following: result})
          AsyncStorage.setItem(username, JSON.stringify({following: result}))
        })
      }else{
        twitter.authenticate()
      }
    })
  }
}

export {
  TweetHeaderView,
  TweetstormHeaderView,
  TweetTextView,
  TweetFooterView,
}
