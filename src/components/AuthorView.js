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
  Navigator,
  Linking
} from 'react-native'
import Lightbox from 'react-native-lightbox'
import {
  GoogleAnalyticsTracker
} from 'react-native-google-analytics-bridge'


import {styles}            from '../styles/Styles'
import {profileStyles}     from '../styles/ProfileStyles'
import {indexStyles}       from '../styles/IndexStyles'
import variables           from '../styles/StyleVariables'
import AutoLink            from 'react-native-autolink'
import SafariView          from 'react-native-safari-view'
import Moment              from 'moment'
import Halson              from 'halson'

import Author              from '../models/Author'
import SocialbarView       from './SocialbarView'
import WovenRequestManager from '../models/WovenRequestManager'
import {barStyles}          from '../styles/BarStyles'
import SettingsButton       from './Navigation/SettingsButton'
import BackButton           from './Navigation/BackButton'

import { _openURL } from '../helpers'


let device = Dimensions.get('window');

export default class AuthorView extends Component {

  _openURL(url) {
    _openURL( url , this.props.navigator );
  }

  constructor(props) {
    super(props)

    this.state = {
      following: this.props.following
    }

    this.tracker = new GoogleAnalyticsTracker('UA-60734393-4')

    this._fetchAuthor(this.props.author_url)
  }

  _fetchAuthor(url) {
    var wovenRequestManager = new WovenRequestManager

    wovenRequestManager._get(url).then((response) => {
      const resource = Halson(response)
      var author = new Author(resource)
      this.setState({author: author})
    })

  }

  _rowForStory(story, key) {
    return(
      <TouchableOpacity
        key={key}
        onPress={() => this._openStory(story)}
        style={indexStyles.storyCell} >
        <Image
          source={{uri: story.cover}}
          style={indexStyles.storyPic}
        />
        <Text style={indexStyles.storyTitle}>
          {story.title.toUpperCase()}
        </Text>
        <View style={indexStyles.separator} />
        <Text style={indexStyles.storySynopsis}>
          {story.synopsis}
        </Text>
        <View style={indexStyles.storyCellBorders} />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Navigator
        navigationBar={this.configureNavigationBar()}
        renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
    )
  }

  configureNavigationBar() {
    var user = this.props.user
    var _navigator = this.props.navigator
    var author = this.state.author ? this.state.author : ""
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
            AUTHOR
          </Text>
        )
      }
    }
    return (
      <Navigator.NavigationBar
        style={barStyles.navBar}
        routeMapper={NavigationBarRouteMapper} />
    )
  }

  renderScene(route, navigator) {

    if (author = this.state.author) {
      this.tracker.trackScreenView('Author - ' + author.name)
      return (
        <View>
          <ScrollView style={[styles.scrollMain, {backgroundColor: '#FFF'}]}
            contentContainerStyle={profileStyles.profileCase}>
            <View style={profileStyles.backgroundStripe}/>
            <Text style={[profileStyles.bioName]}>
              {author.name}
            </Text>
            <TouchableOpacity
              onPress={() => this._openURL(author.author_social_networks[0].link)}>
              <Text style={profileStyles.authorTwitter}>
                {'@' + author.author_social_networks[0].username}
              </Text>
            </TouchableOpacity>
            <Lightbox
              activeProps={{width: device.width, height:0.6 * device.height, borderRadius: 0}}>
              <Image style={profileStyles.xlAvatar}
                source={{uri: author.avatar_url}}
              />
            </Lightbox>

            <AutoLink text= {author.biography}
              webFallback={true}
              style={profileStyles.biography}
              hashtag="twitter"
              mention="twitter"
              onPress={(url) => this._openURL(url)}
              linkStyle={{color: '#f22b10'}}
            />

            <Text style={profileStyles.ellipsis}>
              •••
            </Text>
            <Text style={profileStyles.authorIndexLead}>
              Stories by them
            </Text>
            {author.stories.map((story,key) => this._rowForStory(story, key))}
          </ScrollView>
          <View style={styles.bottomPadding} />
          <SocialbarView
            socialNetworks={author.author_social_networks} twitterLink={`@${author.author_social_networks[0].username}`}
          />
        </View>
      )
    }
  }

  _openStory(story) {
    this.tracker.trackEvent('Story', 'open', { label: story.title })
    this.props.navigator.push({
         id: 'story',
      story: story,
       user: this.props.user
    })
  }
}
