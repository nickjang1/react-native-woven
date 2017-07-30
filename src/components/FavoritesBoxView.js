/* @flow */

import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Alert,
  PushNotificationIOS
} from 'react-native'

import {styles}                 from '../styles/Styles'
import {indexStyles}            from '../styles/IndexStyles'
import variables                from '../styles/StyleVariables'
import TweetView                from '../tweets/TweetView'
import Halson                   from 'halson'
import Status                   from '../models/Status'
import Story                    from '../models/Story'
import {GoogleAnalyticsTracker} from 'react-native-google-analytics-bridge'

export default class FavoriteBoxView extends Component {

constructor(props) {
  super(props)
  this.tracker = new GoogleAnalyticsTracker('UA-60734393-4')
  this.state = {
    lastStatuses: [],
    loaded: false,
    favorites: [],
    numberOfBadges: 0
  }
  this._checkFavorites()
  this._checkNotificationsNumber()
}

async _checkNotificationsNumber() {
  PushNotificationIOS.getApplicationIconBadgeNumber((numBadges) =>  {
    console.log(numBadges)
     this.setState({
         numberOfBadges: numBadges,
     })
  })
}

async _checkFavorites() {
  AsyncStorage.getItem("user", (err, data) => {
    if (data) {
      var user = Halson(JSON.parse(data))
      if (user.favorites && user.favorites.length > 0) {
        this.setState({favorites: user.favorites})
      }
    }
  })
}

render() {
  return(this.state.favorites.length > 0 ? this._hasFavorites(this.state.favorites) : this._noFavoriteHeader())
}

_noFavoriteHeader() {
  return(
    <TouchableOpacity
      onPress={() => this._explainFavorites()}
      style={indexStyles.storyCell}>
      <View style={[indexStyles.storyPic, {backgroundColor: '#DDD', justifyContent: 'center', alignItems: 'center'}]}>
        <Text style={indexStyles.addFavorite}>
          +
        </Text>
      </View>
      <Text style={indexStyles.storyTitle}>
        ADD YOUR FAVORITE STORY HERE
      </Text>
      <View style={indexStyles.separator} />
      <Text style={indexStyles.storySynopsis}>
        Have its latest key tweets pushed to you in real-time and access it from here! Just tap "FAV" in any LIVE story.
      </Text>
      <View style={indexStyles.storyCellBg} />
      <View style={indexStyles.storyCellBorders} />
    </TouchableOpacity>
  )
}

_explainFavorites() {
  this.tracker.trackEvent('Favorite', 'explanation')
  Alert.alert(
    "Why should I favorite a story?",
    "Once you favorite a story you’ll be open it right from here\n\nSwipe left to the \"Live\" stories and get started by tapping \"FAV\" in a story.",
    [
      {
        text: "Got it!"
      }
    ]
  )
}

_openStory(story) {
  PushNotificationIOS.setApplicationIconBadgeNumber(0)
  this.setState({numberOfBadges: 0})
  this.props.onSelectFavoriteToOpen(story)
}

_buildFavoriteViewForFavorite(fav) {
  var notificationBadge = this.state.numberOfBadges == 0 ? null :
  <View style={indexStyles.notificationBadge}>
    <Text style={indexStyles.badgeText}>
      {this.state.numberOfBadges > 9 ? " 9+" : this.state.numberOfBadges}
    </Text>
  </View>

  return (
    <View key={fav}>
      <TouchableOpacity
        onPress={() => this._openStory(new Story(fav.story))}
        style={indexStyles.storyCell}>
          {notificationBadge}
          <Image
            source={{uri:fav.story.cover}}
            style={indexStyles.storyPic}
          />
          <Text style={indexStyles.storyTitle}>
            {fav.story.title.toUpperCase()}
          </Text>
          <View style={indexStyles.separator} />
          <Text style={indexStyles.storySynopsis}>
            {fav.story.synopsis}
          </Text>
          <View style={indexStyles.storyCellBg} />
          <View style={indexStyles.storyCellBorders} />

          <TouchableOpacity
            style={indexStyles.storyAuthor}
            onPress={() => this._showAuthor(fav.story.author_url)}>
            <Image style={styles.avatar}
              source={{uri: fav.story.author.avatar_url}}/>
            <Text style={indexStyles.authorName}>
              {fav.story.author.name}
            </Text>
          </TouchableOpacity>
      </TouchableOpacity>
    </View>
  )
}

_hasFavorites(favs) {
  var favorites = favs.map((fav) => this._buildFavoriteViewForFavorite(fav))
    return (
      <View>
        {favorites}
      </View>
  )
}

}
