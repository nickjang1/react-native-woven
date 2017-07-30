/* @flow */

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  PushNotificationIOS,
  AppState,
  ActivityIndicator,
  AsyncStorage
} from 'react-native'

import WovenRequestManager  from './src/models/WovenRequestManager'
import codePush             from "react-native-code-push"
import Halson               from 'halson'
import Story                from './src/models/Story'
import User                 from './src/models/User'
import ApiRoot              from './src/models/ApiRoot'
import NavigationManager    from './src/components/Navigation/NavigationManager'

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from 'react-native-google-analytics-bridge'

const DEBUG_MODE = false

let rootEndpoint = 'http://write.readlongshorts.com/api'
if (DEBUG_MODE) {
  rootEndpoint = 'http://woven-api-staging.herokuapp.com/api/v1/'
}

let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME
};

class WovenReader extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      numberOfBadges: 0
    }
    this._fetchRoot()
  }

  componentWillMount() {
    PushNotificationIOS.addEventListener(
      'register',
      this._onRegistered
    )

    PushNotificationIOS.addEventListener(
      'notification',
      this._onRemoteNotification
    )
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener(
      'register',
      this._onRegistered
    )
    PushNotificationIOS.removeEventListener(
      'notification',
      this._onRemoteNotification
    )
  }

  _onRegistered(deviceToken) { 
    console.log('deviceToken', deviceToken)
    AsyncStorage.setItem("deviceToken", deviceToken);
    
    // save device Token 
    // we need web service to save device
    // 
    const wovenRequestManager = new WovenRequestManager();
   
    wovenRequestManager._post(rootEndpoint + '/', { token: deviceToken }).then((response) => {
     
    })

  }

  _onRegistrationError(error) { 
    console.log( 'Failed To Register For Remote Push' );
  }


  _onRemoteNotification(notification) {
    if (AppState.currentState === 'background') {
      var story = new Story(notification._data)
      navigator.push({
        title:story.title,
        id:'feed',
        selectedStory: story,
        user: this.state.user ? this.state.user : ""
      })
    }

    PushNotificationIOS.setApplicationIconBadgeNumber(this.state.numberOfBadges + 1)
  }

  async _checkNotificationsNumber() {
    PushNotificationIOS.getApplicationIconBadgeNumber((numBadges) =>  {
      console.log(numBadges)
      this.setState({
           numberOfBadges: numBadges,
       })
    })
  }

  render() {

    GoogleAnalyticsSettings.setDispatchInterval(1)
    GoogleAnalyticsSettings.setDryRun(false)
    this.tracker = new GoogleAnalyticsTracker('UA-60734393-4')
    if (this.state.loading) {
      return(
       <ActivityIndicator
          animating={this.state.loading}
          style={{height: this.state.loading? 44 : 0}}
          size="large"/>
      )
    }else{
      return (
        <NavigationManager
          categoriesURL={this.state.categories_url}
          storiesURL={this.state.stories_url}
          />
      )
    }
  }

  _fetchRoot() {
    var wovenRequestManager = new WovenRequestManager

    wovenRequestManager._get(rootEndpoint).then((response) => {
      var resource = Halson(response)
      this.setState({
        stories_url: resource.getLink('stories').href,
        categories_url: resource.getLink('categorized_stories').href,
        loading: false
      })
      AsyncStorage.getItem("user", (err, data) => {
        console.log('_fetchRoot', response)
        if (data) {
          AsyncStorage.setItem("user", JSON.stringify(response))

          this.setState({
            stories_url: resource.getLink('stories').href,
            user: response,
            loading: false
          })
        }else{
          this._createDummyUser(resource.getLink('user').href)
        }
      })
    })
  }

  _createDummyUser(user) {
    var wovenRequestManager = new WovenRequestManager

    var body = {
      user: {
        name: "",
        email: ""
      }
    }

    wovenRequestManager._post(user, body).then((response) => {
      AsyncStorage.setItem("user", JSON.stringify(response))
      var resource = Halson(response)
      this.setState({
        stories_url: resource.getLink('stories').href,
        user: response,
        loading: false
      })
    })
  }
}

var styles = StyleSheet.create({
  main: {
   paddingTop: 20,
 },
})

WovenReader = codePush(codePushOptions)(WovenReader)

AppRegistry.registerComponent('WovenReader', () => WovenReader)
