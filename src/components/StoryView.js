/* @flow */

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  ActionSheetIOS,
  Modal,
  ListView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  AsyncStorage,
  Navigator,
  Image,
  Platform
} from 'react-native'
import SettingsButton       from './Navigation/SettingsButton'
import BackButton           from './Navigation/BackButton'
import SafariView           from 'react-native-safari-view'
import Hyperlink            from 'react-native-hyperlink'
import Halson               from 'halson'
import Author               from '../models/Author'
import Status               from '../models/Status'
import Character            from '../models/Character'
import TweetView            from '../tweets/TweetView'
import StoryFooterbarView   from './StoryFooterbarView'
import TwitterComment       from '../models/TwitterComment'
import WovenRequestManager  from '../models/WovenRequestManager'
import Twitter              from '../models/Twitter'
import {styles}             from '../styles/Styles'
import {storyStyles}        from '../styles/StoryFeedStyles'
import {barStyles}          from '../styles/BarStyles'
import {
  GoogleAnalyticsTracker
} from 'react-native-google-analytics-bridge'

export default class StoryView extends Component {

  constructor(props) {
    super(props)
    this.tracker = new GoogleAnalyticsTracker('UA-60734393-4')
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    this.state = {
      statuses: [],
      queue: [],
      loading: true,
      dataSource: ds.cloneWithRows([]),
    }

    this._loadStory(this.props.story)
   }

  render() {
    return (
      <Navigator
        navigationBar={this.configureNavigationBar()}
        renderScene  ={(route, navigator) => this.renderScene(route, navigator)}/>
    )
  }

  configureNavigationBar() {
    var user = this.props.user
    var story = this.props.story
    var _navigator = this.props.navigator

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
          <View style={{
            alignItems: 'center'
          }}>
            <Image
              style={storyStyles.twitterLogo}
              source={require('./../../img/twitter.png')} />
            <Text
              style={[barStyles.navBarText, barStyles.navBarTitleText, {top: -2}]}
              numberOfLines={1}>
              {story.title.toUpperCase()}
            </Text>
          </View>
        )
      }
    }
    return (
      <Navigator.NavigationBar
        style={barStyles.navBar}
        routeMapper={NavigationBarRouteMapper} />
    )
  }

  footerFade() {
    return (
      <Image
        style={storyStyles.footerFade}
        resizeMode={'stretch'}
        source={require('./../../img/fade.png')} />
    )
  }

  renderScene(route,navigator) {
    this.tracker.trackScreenView('Story - ' + this.props.story.title)

    return (
      <View>
        <View style={storyStyles.twitterCredits}>

        </View>
        <ListView
          ref={component => this._listView = component}
          onLayout={event => {
            this.listViewHeight = event.nativeEvent.layout.height
          }}
          onContentSizeChange={() => {
          }}
          style={[styles.scrollMain, storyStyles.storyFeed]}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this._renderRow(rowData)}
          renderHeader={this.footerFade}
          enableEmptySections={true} />
        <View style={styles.bottomPadding} />
        <ActivityIndicator
          animating={this.state.loading}
          style={{height: this.state.loading? 44 : 0}}
          size="large"/>
        <StoryFooterbarView
          navigator={this.props.navigator}
          loading={this.state.loading}
          story={this.props.story}
          appendNewStatus={() => this._getAppendNewStatus()}
        />
      </View>
    )
  }

  _openURL(url) {
    this.tracker.trackEvent('Status', 'open-url', { label: url })
    _openURL( url, this.props.navigator )
  }

  componentDidUpdate() {

    // Is this the first loading?
    if (this.state.statuses.length == 0 && this.state.queue.length > 0) {
      this._getAppendNewStatus()
    }
  }

  _renderRow(status) {
    return (
      <TweetView
        characters_link={this.props.story.characters_link}
        navigator={this.props.navigator}
        status={status}
        statuses={this.state.statuses}
        invertedStyle={styles.invertedStyle}/>
    )
  }

  // - Story
  async _loadStory(story) {
    await this._restoreState()

    if (this.state.queue.length == 0) {
        this.state["loading"] = true
        this._fetchStatuses(story)
    }
  }

  _updateQueue(statuses, queue){

    this._updateDatasource(statuses)

    this.setState({
      statuses: statuses,
      queue: queue
    })

    this._storeState()
  }

  _getAppendNewStatus(){

    let append = () => {
      let statuses = this.state.statuses
      let queue = this.state.queue

      statuses.push(queue[0])
      queue.shift()
      this._updateQueue(statuses, queue)

      if (queue.length > 0) {
        if (queue[0].priority == "collapsed") {
          do {
            statuses.push(queue[0])
            queue.shift()
            this._updateQueue(statuses,queue)
          }while(queue[0].priority == "collapsed")

          try {
            append()
          }catch(error) {
            console.log(`Load next collaped ${error}`)
          }
        }
      }
    }

    if (this.state.queue.length > 0) {
      append()
      if (this.state.queue.length < 6) {
        this._fetchStatuses(this.props.story)
      }
    } else {
      this.setState({loading: true})
      this._fetchStatuses(this.props.story)
      .then((newQueue) => {
        if (newQueue.length > 0) {
          this.tracker.trackEvent(
            'Story',
            'load-next',
            {
              label: this.props.story.title
            }
          )
          append()
        } else {
          this.tracker.trackEvent(
            'Story',
            'load-next-to-be-continued',
            {
              label: this.props.story.title
            }
          )
          if(this.props.story.finished) {
            Alert.alert(
              'This chapter has ended…',
              'Keep an eye on the index to see when the next chapter is released!',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ]
            )
          }
          else {
            Alert.alert(
              'To be continued… soon?',
              'The next status will be here soon. Want a notification as soon as it is posted?\n\n(even for favorited stories only "key tweets" are notified)',
              [
                {text: 'Get Notified', onPress: () => this._getNotify()},
                {text: 'Can\'t wait!', onPress: () => console.log('OK Pressed')},
              ]
            )
          }
        }
      })
    }
  }

  async _getNotify() {
    var params = {
      "notification_preferences": {
        "kind": 2
      }
    }

    var wovenRequestManager = new WovenRequestManager
    await wovenRequestManager._post(this.props.story.notification_preferences_url, params).then((response) => {
      Alert.alert(
        "We’ll let you know!",
        "As soon as the next character shares something you’ll get a notification",
        [
          {
            text: "Ok",
            onPress: console.log("ok")
          }
        ]
      )
    }).catch((error) => {
      console.log(response)
    })
  }

  async _getStatuses(url) {

    var params = {}

    if (this.state.statuses.length > 0) {
      params.since = this.state.statuses.slice(-1).pop().timestamp
    }

    var wovenRequestManager = new WovenRequestManager

    return await wovenRequestManager._get(url, params).then((response) => {
      const resource = Halson(response)

      const embeds = resource.getEmbeds('statuses')

      let statuses = embeds.map((json) => new Status(json))
      this.tracker.trackEvent(
        'Story',
        'load-statuses',
        {
          label: this.props.story.title,
          value: statuses.lenght
        }
      )
      return statuses
    })
  }

  _fetchStatuses(story){
    return this._getStatuses(story.statuses_link)
    .then((queue) => {
         // remove status that we might already have locally
        const statusTable = this.state.statuses.map((status) => {return status.status_id})
        queue = queue.filter((status) => { return statusTable.indexOf(status.status_id) < 0 })
        this.setState({
          queue: queue,
          loading: false
        })

        this._storeState()

        return queue
      })
      .catch( (error) => {
        console.log("Errror getting story statuses: " + error)
      })

  }

  _updateDatasource(elements) {
    let rowIds = elements.map((row, index) => index)
    if(Platform.OS === 'ios'){
      rowIds = elements.map((row, index) => index).reverse()
    }
    this.setState({
      statuses: elements,
      dataSource: this.state.dataSource.cloneWithRows(elements, rowIds)
     })
  }

  async _storeState() {
    try {
    const state = await AsyncStorage.getItem("Feed:" + this.props.story.link)
    if (state !== null) {
      await AsyncStorage.mergeItem("Feed:" + this.props.story.link, JSON.stringify(this.state))
    }else{
      await AsyncStorage.setItem("Feed:" + this.props.story.link, JSON.stringify(this.state))
    }
    } catch (error) {
      console.error("Couldn't save state for story: " + this.props.story.link + "\n" + error)
    }
  }

  async _restoreState() {
    try {
      const state = await AsyncStorage.getItem("Feed:" + this.props.story.link)
      if (state !== null) {

        const  expandedState = JSON.parse(state)
        let statuses = expandedState.statuses;
        if(Platform.OS === 'ios'){
          statuses.reverse();
        }
        else{
          statuses
        }
        let rowIds = expandedState.statuses.map((row, index) => index)

        if(Platform.OS === 'ios'){
           rowIds = expandedState.statuses.map((row, index) => index).reverse()
        }

        //this.setState(expandedState)
        this.setState({
          statuses,
          dataSource: this.state.dataSource.cloneWithRows(statuses, rowIds)
        })
      }
    } catch (error) {
      console.error("Couldn't restore state for story: " + this.props.story.link + "\n" + error)
    }
  }
}
