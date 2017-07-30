/* @flow */

import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  ListView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  AsyncStorage,
  Modal,
  ActionSheetIOS,
  ActivityIndicator,
  Dimensions,
  Navigator
} from 'react-native'

import {styles}            from '../styles/Styles'
import {detailsStyles}     from '../styles/DetailsStyles'
import {storyStyles}       from '../styles/StoryFeedStyles'
import variables           from '../styles/StyleVariables'
import Halson              from 'halson'
import SafariView          from 'react-native-safari-view'
import Hyperlink           from 'react-native-hyperlink'
import TweetView           from '../tweets/TweetView'
import Status              from '../models/Status'
import BottombarView       from '../layout/common/BottombarView'
import TwitterComment      from '../models/TwitterComment'
import CommentCellView     from '../layout/conversation/CommentCellView'
import SocialbarView       from './SocialbarView'
import WovenRequestManager from '../models/WovenRequestManager'
import {barStyles}          from '../styles/BarStyles'
import SettingsButton       from './Navigation/SettingsButton'
import BackButton           from './Navigation/BackButton'

import {
  GoogleAnalyticsTracker
} from 'react-native-google-analytics-bridge'

export default class StatusDetailView extends Component {

  constructor(props) {
    super(props)
    this.tracker = new GoogleAnalyticsTracker('UA-60734393-4')
    const ds = new ListView.DataSource({
                              rowHasChanged: (r1, r2) => r1 !== r2,
                              sectionHeaderHasChanged: (s1, s2) => s1 !== s2
                    })

    this.state = {
      loading: true,
      dataSource: ds.cloneWithRowsAndSections([]),
      comments: [],
      statuses: []
    }


    var readingPoint = this.props.statuses[this.props.statuses.length - 1].timestamp
    this._loadConversationForStatus(this.props.status, readingPoint)
  }

  _renderRow(rowData, sectionData) {
    if (sectionData == 0) {
      return (
        <TweetView
          fromStatusDetailView
          navigator={this.props.navigator}
          status={rowData}
          statuses={this.state.statuses}/>
      )
    }else{
      return (
        <TweetView
          fromStatusDetailView
          isComment={true}
          status={rowData}
          statuses={this.state.comments}
          navigator={this.props.navigator}/>
      )
    }
  }

  _renderSectionHeader(sectionData) {
    if (sectionData == 1) {
      return (
        <View style={[detailsStyles.commentsHeader, {paddingLeft: variables.textInset}]}>
          <Text style={detailsStyles.commentsHeaderText}>
            Reader Comments
          </Text>
          <Text style={detailsStyles.commentsSubHeader}>
            (tap a comment for its full thread)
          </Text>
        </View>
      )
    }else{
      return (
        <View/>
      )
    }
  }

  _renderFooter(section) {
    if (this.state.comments.length < 1) {
      return (
        <View style={{top: -4, backgroundColor: 'transparent'}}>
          <Image
            style={[storyStyles.footerFade, {transform: [{scaleY: 1}]}]}
            resizeMode={'stretch'}
            source={require('./../../img/fade.png')} />
          <View style={detailsStyles.commentsHeader}>
            <Text style={detailsStyles.commentsHeaderText}>
              ↑ reply to start the convo
            </Text>
          </View>
        </View>
      )
    }
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
          </Text>
        )
      }
    }
    return (
      <Navigator.NavigationBar
        routeMapper={NavigationBarRouteMapper}
        style={barStyles.navBar} />
    )
  }

  renderScene(route, navigator) {
    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator
            animating={this.state.loading}
            style={[styles.centering, {height: this.state.loading? Dimensions.get('window').height : 0}]}
            size="large"/>
        </View>
      )
    }else{
    this.tracker.trackScreenView('Conversation - ' + this.props.status.message)
      return (
        <View>
          <View style={[styles.scrollMain, {paddingTop: 0}]}>
            <View style={styles.storyTweets}>
              <ListView
                style={detailsStyles.detailsScroll}
                dataSource={this.state.dataSource}
                renderRow={(rowData, sectionData) => this._renderRow(rowData, sectionData)}
                renderSectionHeader={(rowData, sectionData) => this._renderSectionHeader(sectionData)}
                renderFooter={() => this._renderFooter()}
              />
            </View>
          </View>
          <SocialbarView
            socialNetworks={this.props.status.character.social_networks} statusLink={this.props.status.social_network_url}/>
        </View>
      )
    }
  }

  async _loadConversationForStatus(status, readingPoint) {
    var wovenRequestManager = new WovenRequestManager

    var params = {reading_point: readingPoint}
    var url = status.conversation_url

    return await wovenRequestManager._get(url, params).then((response) => {
      var resource          = Halson(response)
      const statuses        = resource.getEmbeds('statuses').map((json) => new Status(json))
      const tweets          = resource.getEmbeds('twitter_comments')
      const twitterComments = tweets.map((json) => new TwitterComment(json, this.props.status, tweets))

      if (this.props.comment) {
        twitterComments.push(this.props.comment)
      }

      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections([statuses, twitterComments]),
        loading: false,
        comments: twitterComments,
        statuses: statuses
      })
    })
  }

}
