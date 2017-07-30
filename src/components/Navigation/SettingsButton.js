/* @flow */

import React, { Component } from 'react'
import {
  Text,
  Image,
  Alert,
  Stylesheet,
  TouchableOpacity,
  NativeModules,
  AsyncStorage,
  Platform
} from 'react-native'

import SafariView             from 'react-native-safari-view'

import {barStyles}            from '../../styles/BarStyles'
import Twitter                from '../../models/Twitter'
import TwitterUserCredentials from '../../models/Twitter'
import { _openURL } from '../../helpers'

const twitter = new Twitter();
export default class SettingsButton extends Component {

  state = {
    avatar: 'empty'
  }

  ComponentWillMount() {
    this.setupView()
  }
  
  async setupView() {
    const authenticated = await twitter.authenticated();

    if (authenticated == true) {
     AsyncStorage.getItem("TWITTER_USER_CREDENTIALS", (err, result) => {
        var userCredentials = JSON.parse(result);

        if(Platform.OS === 'ios'){
          twitter._requestUserInfo(userCredentials.username).then((userInfo) => {
            this.setState({avatar: userInfo["profile_image_url"]})
          });
        }
        else{
          const userInfo = twitter._requestUserInfo(userCredentials.uuid)
          .then((userInfo) => {
            
            this.setState({avatar: userInfo["profile_image_url"]})
          });
          
          
        }
        
      })
    }else{
    }
    
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => this._showAlertMenu()}
          style={barStyles.navBarRightButton}>
        <Text style={barStyles.rightText}>
          MENU
        </Text>
      </TouchableOpacity>
    )
  }

  async _showAlertMenu() {

    const buttons = Platform.OS === 'ios' ? [
      {
        text: 'Notification ⚙’s',
        onPress: () => this._showNotificationSettings()
      },
      {
        text: 'Live Chat with Us 💬',
        onPress: () => this._callIntercom()
      },
      {
        text: 'Beta Writers Program 📝',
        onPress: () => this._openURL('http://readlongshorts.com/apply')
      },
      {
        text: 'Contact About Branded Story 📧',
        onPress: () => this._openEmail()
      },
      {
        text: await twitter.authenticated() ? 'Logout' : 'Login',
        onPress: await twitter.authenticated() ? () => this._logout() : () => this._twitterLogin()
      },
      {
        text: 'Onboarding',
        onPress: () => this._showOnboarding()
      },
      {
        text: 'Close'
      },
    ]
    :
    [
      {
        text: 'Notification ⚙’s',
        onPress: () => this._showNotificationSettings()
      },
      {
        text: 'Live Chat with Us 💬',
        onPress: () => this._callIntercom()
      },
      {
        text: await twitter.authenticated() ? 'Logout' : 'Login',
        onPress: await twitter.authenticated() ? () => this._logout() : () => this._twitterLogin()
      },
    ];

    Alert.alert(
      'What would you like to do?',
      '',
      buttons
    )
  }

  _showNotificationSettings() {
    this.props.navigator.push({
      id: 'notification-settings',
      user: this.props.user,
      navigator: this.props.navigator
    })
  }

  _showOnboarding() {
    this.props.navigator.push({
      id: 'onboarding',
      user: this.props.user
    })
  }

  _callIntercom() {
    const Intercom = NativeModules.IntercomWrapper
    Intercom.registerUnidentifiedUser((error) => {
      if (error) {
        console.error(error)
      }
    })

    Intercom.displayMessageComposer((error) => {
      if (error) {
        console.error(error)
      }
    })
  }

  _openEmail() {
    var Mailer = require('NativeModules').RNMail

    Mailer.mail({
      subject: 'Branded story for LongShorts?',
      recipients: ['longshorts+inquiries@96problems.com'],
      ccRecipients: [''],
      bccRecipients: [''],
      body: 'Hi, I was just trying out your app LongShorts and was interested in learning more about your \"Branded Story\" program. Please send me the latest info!\n\n(feel free to change the above any way you like, to share more information or leave it just the way it is. We\'ll be in touch within 1 business day!)',
      isHTML: true, // iOS only, exclude if false
    }, (error, event) => {
        if(error) {
          Alert.alert('Error', 'Mail app not available', 'ok');
        }
    })

  }

  _openURL(url) {
    _openURL( url, this.props.navigator )
  }

  async _twitterLogin() {
    await twitter.authenticate();
 
    this.setupView();

  }

  async _logout() {
    twitter.logout().then((result) => {

      this.setState({ avatar: "empty" })
    })
  }
}
