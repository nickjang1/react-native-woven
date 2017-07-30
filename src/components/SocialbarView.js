/* @flow */

import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  AsyncStorage
} from 'react-native'

import {styles}   from '../styles/Styles'
import {barStyles} from '../styles/BarStyles'

import Moment     from 'moment'
import Halson     from 'halson'
import SafariView from 'react-native-safari-view'
import Twitter    from '../models/Twitter'
import AutoLink   from 'react-native-autolink'

import { _openURL } from '../helpers'

export default class SocialbarView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      following: false
    }

    this.props.socialNetworks.map((social, key) => {
      if (social.kind == "twitter") {
        this._checkFollowStatus(social)
      }
    })
  }

  _openURL(url) {
    _openURL( url , this.props.navigator )
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

  _unfollow(username) {
    var twitter = new Twitter()
    twitter.authenticated().then((authenticated) => {
      if (authenticated == true) {
        twitter.unfollow(username).then((result) => {
          this.setState({following: result})
          AsyncStorage.setItem(username, JSON.stringify({following: result}))
        })
      }
    })

  }

  _mainSocialNetworkButton(social, key) {
    return(
        <View
          style={barStyles.twitterButtons}
          key={key}>
          <TouchableOpacity
            onPress={() => {this.state.following ? this._unfollow(social.username) : this._follow(social.username)}}
            style={[barStyles.actionButton, this.state.following ? styles.buttonActive : ""]}
          >
            <Text style={[barStyles.followButtonText, this.state.following ? styles.buttonActiveText : ""]}>
              {this.state.following ? "Following" : "Follow" } @{social.username}
              {/* when active make it 'Following' and add the buttonActive* classes to it's <TouchableOpacity> and <Text> */}
            </Text>
          </TouchableOpacity>
          {this.props.twitterLink &&
            <TouchableOpacity
              webFallback={true}
              mention="twitter"
              onPress={(url) => this._openURL('http://twitter.com/' + this.props.twitterLink)}
              style={[barStyles.actionButton, barStyles.actionSecondaryButton]}>
              <Text style={[
                barStyles.actionButtonText, barStyles.actionSecondaryButtonText]}>
                {'Open on Twitter'}
              </Text>
            </TouchableOpacity>
          }
          {this.props.statusLink &&
            <TouchableOpacity onPress={() => this._openURL(this.props.statusLink)}
              style={[barStyles.actionButton, barStyles.actionSecondaryButton]}>
              <Text style={[
                barStyles.actionButtonText, barStyles.actionSecondaryButtonText]}>
                {'Open on Twitter'}
              </Text>
            </TouchableOpacity>
          }
        </View>
    )
  }

  _socialNetworkLink(social, key) {
    return(
        <TouchableOpacity
          key={key}
          onPress={() => this._openURL(social.link)}
          style={barStyles.storyInfoButton}>
          <Text style={barStyles.otherSites}>
            {social.name}
          </Text>
        </TouchableOpacity>
    )
  }

  render() {
    var socialNetworks = []
    this.props.socialNetworks.map((social, key) => {
      if (social.kind == "twitter") {
        socialNetworks.push(this._mainSocialNetworkButton(social, key))
      }else{
        socialNetworks.push(this._socialNetworkLink(social, key))
      }
    })

    return(
      <View style={barStyles.footerBar}>
        {socialNetworks}
      </View>
    )
  }

  _checkFollowStatus(social) {
    AsyncStorage.getItem(social.username, (err, result) => {
      if (result == null) {
        var twitter = new Twitter()
        twitter.authenticated().then((authenticated) => {
          if (authenticated == true) {
            twitter.followStatus(social.username).then((result) => {
              this.setState({following: result})
              AsyncStorage.setItem(social.username, JSON.stringify({following: result}))
            })
          }
        })
      }else{
        var following = JSON.parse(result)
        this.setState({following: following})
      }
    })
  }
}
