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
  Navigator
} from 'react-native'
import Lightbox from 'react-native-lightbox'
let device = Dimensions.get('window');


import Hyperlink          from 'react-native-hyperlink'
import AutoLink           from 'react-native-autolink'
import SafariView         from 'react-native-safari-view'
import {barStyles}          from '../styles/BarStyles'
import SettingsButton       from './Navigation/SettingsButton'
import BackButton           from './Navigation/BackButton'
import {
  GoogleAnalyticsTracker
} from 'react-native-google-analytics-bridge'

import {styles}           from '../styles/Styles'
import {profileStyles}    from '../styles/ProfileStyles'
import variables          from '../styles/StyleVariables'

import Character          from '../models/Character'
import SocialbarView      from './SocialbarView'
import { _openURL } from '../helpers'

export default class CharacterView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      following: this.props.following
    }

  }

  _openURL(url) {
    _openURL( url , this.props.navigator );
  }

  render() {
    return (
      <Navigator
        style={barStyles.navBar}
        navigationBar={this.configureNavigationBar()}
        renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
    )
  }

  configureNavigationBar() {
    var user = this.props.user
    var _navigator = this.props.navigator
    var character = this.props.character
    var NavigationBarRouteMapper = {
      LeftButton(route, navigator, index, navState) {
        return (
          <BackButton
            navigator={_navigator}/>
        )
      },
      RightButton(route, navigator, index, navState) {
        return (
          <SettingsButton
            user={user}
            navigator={_navigator}/>
        )
      },
      Title(route, navigator, index, navState) {
        return (
          <Text
            style={[barStyles.navBarText, barStyles.navBarTitleText]}
            numberOfLines={1}>
            {character.name.toUpperCase()}
          </Text>
        )
      }
    }
    return (
      <Navigator.NavigationBar
        routeMapper={NavigationBarRouteMapper} />
    )
  }

  renderScene(route, navigator) {
    this.tracker = new GoogleAnalyticsTracker('UA-60734393-4')
    this.tracker.trackScreenView('Character - ' + this.props.character.name)
    return (
      <View>
        <ScrollView style={styles.scrollMain}
          contentContainerStyle={profileStyles.profileCase}>

          <View style={profileStyles.backgroundStripe}/>

            <Lightbox
              activeProps={{width: device.width, height:0.6 * device.height, borderRadius: 0}}>
              <Image style={profileStyles.xlAvatar}
                source={{uri: this.props.character.avatar}}
              />
            </Lightbox>

            <Text style={profileStyles.bioName}>
              {this.props.character.name}
            </Text>

            <Text style={profileStyles.biography}>
              {this.props.character.biography}
            </Text>

            <Text style={profileStyles.ellipsis}>
              •••
            </Text>

            {this._buildSocialMediaInfo()}
        </ScrollView>
        <SocialbarView
          socialNetworks={this.props.character.social_networks} twitterLink={`@${this.props.character.profiles.twitter}`}/>
      </View>
    )
   }

    _buildSocialMediaInfo() {
      if (this.props.character.location) {
       var location = <View style={profileStyles.bioPoint}>
         <Text style={profileStyles.bioType}>
           location
         </Text>
         <Text style={profileStyles.bioStats}>
           {this.props.character.location}
         </Text>
       </View>
      }

      if (this.props.character.profile_link) {
        var website = <View style={profileStyles.bioPoint}>
          <Text style={profileStyles.bioType}>
            website
          </Text>
          <Hyperlink linkText={(url) =>{return url === 'http://96problems.com/story-micro-site' ? 'Share' : url}}>
            <Text style={profileStyles.bioStats}>
              {this.props.character.profile_link}
            </Text>
          </Hyperlink>
        </View>
      }

      return (
      <View>
        <View style={profileStyles.bioPoint}>
          <Text style={profileStyles.bioType}>
            twitter
          </Text>
          <AutoLink text={'@' + this.props.character.profiles.twitter}
            webFallback={true}
            style={profileStyles.bioStats}
            mention="twitter"
            onPress={(url) => this._openURL(url)}
            linkStyle={{color: variables.tappableColor}}
          />
        </View>
        {location}
        {website}
      </View>
      )
    }
}
