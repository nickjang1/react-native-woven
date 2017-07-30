/* @flow */

import React, { Component } from 'react'
import {
  Alert
} from 'react-native'

import WovenRequestManager  from './WovenRequestManager'
import {
  GoogleAnalyticsTracker
} from 'react-native-google-analytics-bridge'

export default class FavoriteManager {

  constructor(favoriteStoryCallback) {
    this._favoriteStoryCallback = favoriteStoryCallback
    this.tracker = new GoogleAnalyticsTracker('UA-60734393-4')
  }

  _addStoryToFavorites(story, favorited) {
    if (favorited) {
      Alert.alert(
        'Change your favorite story to this one?',
        'Currently you can favorite one story.\n\n' +
        'Would you like to make this story your favorite and get notifications for it?',
          [
            {
              text: 'Change Favorite',
              onPress: () => {
                this._saveFavorite(story)
                this.tracker.trackEvent('Favorites', 'new-favorite', { label: story.title })
              }
            },
            {
              text: 'I’d Like More Favorites…',
              onPress: () => this._iWantMoreAlert()
            },
            {
              text: 'Close',
              onPress: () => {
                this.tracker.trackEvent('Favorites', 'new-favorite', { label: 'close' })
              },
              style: 'cancel'
            }
          ]
        )
      }else{
      Alert.alert(
        'Want to Favorite this Story?',
        'Favoriting a story unlocks extra features for that story.\n\nRight now, favoriting will give you the latest key tweets to your lock screen, with more features to come soon!',
        [
          {
            text: 'Favorite',
            onPress: () => {
              this._saveFavorite(story)
              this.tracker.trackEvent('Favorites', 'get-notified', { label: story.title })
            }
          },
          {
            text: 'Close',
            onPress: () => {
              this.tracker.trackEvent('Favorites', 'get-notified', { label: 'close' })
            },
            style: 'cancel'
          }
        ]
      )
    }
  }

  async _saveFavorite(story){

    var wovenRequestManager = new WovenRequestManager
    await wovenRequestManager._post(story.favorite_url).then((response) => {
      console.log('_saveFavorite', story.favorite_url ,response)
      this._favoriteStoryCallback(true)
    }).catch((error) => {
      console.log('errorFavorite', response)
      this._favoriteStoryCallback(false)
    })
  }

  _iWantMoreAlert() {
    Alert.alert(
      'Thanks for letting us know!',
      'We’re thinking about adding in the ability to favorite multiple stories, and think it may be a good way to help support writers.\n\nHypothetically, how much would you be willing to pay to support writers and get more favorites slots?',
      [
        {
          text: '$5',
          onPress: () => this.tracker.trackEvent('Favorites', 'iwantmore', { label: '$5' })
        },
        {
          text: '$2',
          onPress: () => this.tracker.trackEvent('Favorites', 'iwantmore', { label: '$2' })
        },
        {
          text: '$1',
          onPress: () => this.tracker.trackEvent('Favorites', 'iwantmore', { label: '$1' })
        },
        {
          text: '$0',
          onPress: () => this.tracker.trackEvent('Favorites', 'iwantmore', { label: '$0' }),
          style: 'cancel'
        },
      ]
    )
  }
}
