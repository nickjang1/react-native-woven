/* @flow */

import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActionSheetIOS,
  AsyncStorage,
  Navigator,
  PushNotificationIOS
} from 'react-native'

import {styles}        from '../styles/Styles'
import {barStyles}     from '../styles/BarStyles'
import Hyperlink       from 'react-native-hyperlink'
import SafariView      from 'react-native-safari-view'
import FavoriteManager from '../models/FavoriteManager'
import Halson          from 'halson'
import Story           from '../models/Story'
import Twitter         from '../models/Twitter'
import {
  GoogleAnalyticsTracker
} from 'react-native-google-analytics-bridge'

import { _openURL } from '../helpers'

export default class StoryFooterbarView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      favorited: false,
      showToolTip: false
    }

    this.tracker = new GoogleAnalyticsTracker('UA-60734393-4')

    this._checkFavorites()
    this._needsShowToolTip()
  }

  async _needsShowToolTip() {
    await AsyncStorage.getItem("GetNextOnboarding", (err, result) => {
      this.setState({showToolTip: result != 1})
    })
  }
  async _checkFavorites() {
    await AsyncStorage.getItem("user", (err, data) => {
      if (data) {
        var user = Halson(JSON.parse(data))
        if (user.favorites && user.favorites.length > 0) {
          var fav = Halson(user.favorites[0])
          var story = new Story(fav.story)
          if (story.link == this.props.story.link) {
            this.setState({favorited: true})
          }
        }
      }
    })
  }

  _tooltip() {
    AsyncStorage.setItem("GetNextOnboarding", "1")
    return(
      <View style={styles.tooltip}>
        <View style={styles.tooltipBG}>
          <Text style={styles.tooltipText}>
            <Text style={styles.bold}>Tap here</Text> to continue the story!
          </Text>
          <View style={[styles.tooltipPoint, styles.tooltipPointBottom]}/>
        </View>
      </View>
    )
  }

  _getNextAction() {
    if (!this.props.loading) {
      this.setState({showToolTip: false})
      this.props.appendNewStatus()
    }
  }

  render() {
    return (
      <View style={barStyles.footerBar}>
        {
          this.state.showToolTip ? this._tooltip() : null
        }
        <TouchableOpacity
          style={barStyles.actionButton}
          onPress={() => this._getNextAction()}>
            <Text style={barStyles.actionButtonText}>
              Get Next
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            this.props.story.finished ?
            this._voteForStory(this.props.story) :
            this._addToFavorite(this.props.story, this.state.favorited)
          }
          style={[
            barStyles.actionButton,
            barStyles.actionSecondaryButton,
            this.props.story.finished ? "" : (this.state.favorited ? styles.buttonActive : "")
          ]}
        >
          <Text style={[barStyles.actionButtonText, barStyles.actionSecondaryButtonText, this.props.story.finished ? "" : (this.state.favorited ? styles.buttonActiveText : "")]}>
            {
              this.props.story.finished ?
              "Vote" :
              (this.state.favorited ? "Fav'd" : "Fav")
            }
            {/* When active make it Fav’d and add the buttonActive* classes to it's <TouchableOpacity> and <Text> */}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={barStyles.storyInfoButton}
          onPress={() => this._showAuthor(this.props.story.author_url)}>
          <Text style={barStyles.storyInfoButtonText}>
            Author
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this._shareWithFriends()}
          style={barStyles.storyInfoButton}>
          <Text style={barStyles.storyInfoButtonText}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  _favoriteStoryCallback(favorited) {
    this.setState({favorited: favorited})
  }

  _voteForStory(story) {
    var twitter = new Twitter()
    twitter.authenticated().then((authenticated) => {
      if (authenticated == true) {
        this.props.navigator.push({
          id: 'reply',
          story: story,
          kind: "vote",
          sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
          user: this.props.user
        })
      }else{
        twitter.authenticate()
      }
    })
  }

  _addToFavorite(story, favorited) {

    var favoriteManager = new FavoriteManager((favorited) => {
        this._favoriteStoryCallback(favorited)
      }
    )

    favoriteManager._addStoryToFavorites(
      story,
      favorited
    )
  }

  // - Show the author
  _showAuthor(author_url) {
    this.tracker.trackEvent('Story', 'show-author')
    this.props.navigator.push({
      id: 'author',
      author_url: author_url,
      user: this.props.user
    })
  }

  _shareWithFriends() {
    Alert.alert(
      'Share this story with friends?',
      'You can share this story’s teaser that’s on ReadLongShorts.com\n\nLongShorts is like watching movies, it’s better with friends!',
      [
        {
          text: 'Share Story Teaser',
          onPress: () => {
            this.tracker.trackEvent('ShareStory', 'social_sharing')
            this._socialShare()
          }
        },
        {
          text: 'Open Teaser Site',
          onPress: () => {
            this.tracker.trackEvent('ShareStory', 'webview')
            this._openURL(this.props.story.micro_site_url)
          }
        },
        {
          text: 'Maybe later…',
          onPress: () => {
            this.tracker.trackEvent('ShareStory', 'Maybe latter...')
          },
          style: 'cancel'
        }
      ]
    )
  }

  _socialShare() {
    ActionSheetIOS.showShareActionSheetWithOptions({
      url: this.props.story.micro_site_url,
      message: 'Check out ' + this.props.story.title + ' in the LongShorts app',
      subject: 'ReadLongShorts',
    },
      (error) => alert(error),
      (success, method) => {
       if (success) {
        this.tracker.trackEvent('ShareStory', 'social_sharing', {label: method})
       } else {
        this.tracker.trackEvent('ShareStory', 'social_sharing', {label: 'cancel'})
       }
    })
  }

  _openURL(url) {
    this.tracker.trackEvent('Status', 'open-url', { label: url })
    _openURL( url , this.props.navigator )
  }

}
