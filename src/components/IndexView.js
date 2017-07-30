/* @flow */

import React, { Component } from 'react'

import {
  ListView,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Alert,
  ActionSheetIOS,
  Navigator,
  NativeModules,
  AsyncStorage
} from 'react-native'

import SettingsButton      from './Navigation/SettingsButton'
import Halson              from 'halson'
import SafariView          from 'react-native-safari-view'
import Hyperlink           from 'react-native-hyperlink'
import WovenRequestManager from '../models/WovenRequestManager'
import TweetView           from '../tweets/TweetView'
import Story               from '../models/Story'
import Category            from '../models/Category'
import {styles}            from '../styles/Styles'
import {barStyles}         from '../styles/BarStyles'
import {indexStyles}       from '../styles/IndexStyles'
import {profileStyles}     from '../styles/ProfileStyles'
import FavoritesBoxView    from './FavoritesBoxView'
import {
  GoogleAnalyticsTracker
} from 'react-native-google-analytics-bridge'

import { _openURL } from '../helpers'

export default class IndexView extends Component {

  constructor(props) {
    super(props)
    this.tracker = new GoogleAnalyticsTracker('UA-60734393-4')
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      loading: true,
      datasource: ds.cloneWithRows(['sample']),
      finishedStories: ds.cloneWithRows([]),
      updatingStories: ds.cloneWithRows([]),
      miscStories: ds.cloneWithRows([]),
      CategoryData:[],
      currentTab: 0,
      isCategoryURL: false,
      isStoryURL: false,
    }
  }

  componentWillMount(){
    if (this.props.categoriesURL){
      this._fetchIndex(this.props.categoriesURL)
      this.setState({
        isCategoryURL:true,
        loading:false,
      })
    } else {
      this._fetchIndex(this.props.storiesURL)
      this.setState({
        isStoryURL:true,
        loading:false,
      })
    }
  }

  _renderRow(story) {
    return (
      <TouchableOpacity
        onPress={() => this._openStory(story)}
        style={indexStyles.storyCell}>
          <Image
            source={{uri:story.cover}}
            style={indexStyles.storyPic}
          />
          <Text style={indexStyles.storyTitle}>
            {story.title.toUpperCase()}
          </Text>
          <View style={indexStyles.separator} />
          <Text style={indexStyles.storySynopsis}>
            {story.synopsis}
          </Text>
          <View style={indexStyles.storyCellBg} />
          <View style={indexStyles.storyCellBorders} />

          <TouchableOpacity
            style={indexStyles.storyAuthor}
            onPress={() => this._showAuthor(story.author_url)}>
            <Image style={styles.avatar}
              source={{uri: story.author.avatar_url}}/>
            <Text style={indexStyles.authorName}>
              {story.author.name}
            </Text>
          </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  _notificationBadgeForStory(story) {
    return(
      <View style={indexStyles.notificationBadge}>
        <Text style={indexStyles.badgeText}>
          4 new + more
        </Text>
      </View>
    )
  }

  _openStory(story) {
    this.tracker.trackEvent('Story', 'open', { label: story.title })
    this.props.navigator.push({
         id: 'story',
      story: story,
       user: this.props.user
    })
  }

  _openURL(url) {
    _openURL( url , this.props.navigator );
  }

  // - Show the author
  _showAuthor(author_url) {
    this.tracker.trackEvent('Story', 'show-author')
    this.props.navigator.push({
              id: 'author',
      author_url: author_url
    })
  }

  _emptyViewFor(content) {
    return(
      <View style={indexStyles.emptyIndex}>
        <Text style={indexStyles.emptyStateText}>
          Coming Soon!
        </Text>
      </View>
    )
  }

  render() {
    return (
      <Navigator
        ref="navigator"
        navigationBar={this.configureNavigationBar()}
        renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
    )
  }

  configureNavigationBar() {
    var user = this.props.user
    var _navigator = this.props.navigator
    var NavigationBarRouteMapper = {
      LeftButton(route, navigator, index, navState) {
        return null
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
              STORIES
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

  renderHeader(category_description, category_long) {
    return (
      <View style={indexStyles.categoryExplanation}>
        <Text style={indexStyles.explanationText}>
          <Text style={styles.bold}>{category_description}</Text> {category_long}
        </Text>
      </View>
    )
  }


  _showOnboarding() {
    this.props.navigator.push({
      id: 'onboarding',
      user: this.props.user
    })
  }

  renderScene(route, navigator) {
    AsyncStorage.getItem("ONBOARD", (err, result) => {
      if (result == null) {
        AsyncStorage.setItem("ONBOARD", "1")
        this._showOnboarding()
      }
    })
    return (
      <View>
        <View style={styles.scrollMain}>
          {this.renderCategories()}
          {this.renderCategoriesView()}
        </View>
        <View style={[barStyles.footerBar, barStyles.homeFooterBar]}>
          <TouchableOpacity
            onPress={() => this._shareWithFriends()}
            activeOpacity={0.7}
            style={barStyles.actionButton} >
            <Text style={barStyles.actionButtonText}>
              Share
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this._callIntercom()}
            activeOpacity={0.7}
            style={barStyles.storyInfoButton} >
            <Text style={[barStyles.actionButtonText, barStyles.actionSecondaryButtonText]}>
              Help
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
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

  renderCategories () {
      return(
        <View style={indexStyles.categories}>
          <ScrollView
            horizontal={true}
            vertical={false}
            showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style= {[indexStyles.categoryNameCase, (this.state.currentTab === 0 ? indexStyles.currentCategory:null)]}
              onPress={() => {this.refs.navigator.refs.scrollView.scrollTo({x: Dimensions.get('window').width * 0, animated : true})
              this._renderHighlighter (0) }} >
              <Text style={[indexStyles.categoryName, (this.state.currentTab === 0 ? indexStyles.currentCategoryText:null)]}>
                FAV
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style= {[indexStyles.categoryNameCase, (this.state.currentTab === 1 ? indexStyles.currentCategory:null)]}
              onPress={() => {this.refs.navigator.refs.scrollView.scrollTo({x: Dimensions.get('window').width * 1, animated : true})
              this._renderHighlighter (1) }} >
              <Text style={[indexStyles.categoryName, (this.state.currentTab === 1 ? indexStyles.currentCategoryText:null)]}>
                LIVE
              </Text>
            </TouchableOpacity>
            <View
              style={[indexStyles.categoryNameCase, indexStyles.categoryExpCase]}>
              <Text style={[indexStyles.categoryName, indexStyles.categoryExp]}>
                BINGEABLE:
              </Text>
            </View>
            <TouchableOpacity
              style= {[indexStyles.categoryNameCase, (this.state.currentTab === (2) ? indexStyles.currentCategory:null)]}
              onPress={() => {this.refs.navigator.refs.scrollView.scrollTo({x: Dimensions.get('window').width * (2), animated : true})
              this._renderHighlighter (2) }} >
              <Text style={[indexStyles.categoryName, (this.state.currentTab === (2) ? indexStyles.currentCategoryText:null)]}>
                ALL
              </Text>
            </TouchableOpacity>
            {this.state.isCategoryURL ? this.renderCategoryList(this.state.CategoryData):this._renderDummyView()}
          </ScrollView>
          <View style={indexStyles.categoriesBorder} />
        </View>
      )
  }

  renderCategoryList (categoriesList){
    return categoriesList.map((category,categoriesIndex)=>{
      return(
        <TouchableOpacity
          key={categoriesIndex}
          style= {[indexStyles.categoryNameCase, (this.state.currentTab === (categoriesIndex + 3) ? indexStyles.currentCategory:null)]}
          onPress={() => {this.refs.navigator.refs.scrollView.scrollTo({x: Dimensions.get('window').width * (categoriesIndex + 3), animated : true})
          this._renderHighlighter (this.state.categoriesIndex + 3) }}>
          <Text style={[indexStyles.categoryName, (this.state.currentTab === (categoriesIndex + 3) ? indexStyles.currentCategoryText:null)]}>
            {category.name.toUpperCase()}
          </Text>
        </TouchableOpacity>
      )
    })
  }

  handleScroll(event: Object) {
    var currentIndex = currentIndex = parseInt(event.nativeEvent.contentOffset.x / Dimensions.get('window').width)
    this._renderHighlighter (currentIndex)
  }

  renderCategoriesView () {
      return(
          <ScrollView
            horizontal={true}
            vertical={false}
            showsHorizontalScrollIndicator={false}
            bounces={true}
            pagingEnabled={true}
            style={indexStyles.pages}
            onScroll={this.handleScroll.bind(this)}
            ref="scrollView" >
              <View style={indexStyles.categoryList}>
                <View style={indexStyles.section}>
                  <ScrollView>
                    <View style={[styles.tooltip, {opacity: 0, height: 0, top: 20, left: 55}]}>
                      <View style={[styles.tooltipPoint, styles.tooltipPointTop]}/>
                      <View style={styles.tooltipBG}>
                        <Text style={styles.tooltipText}>
                          <Text style={styles.bold}>Tap here</Text> to find a favorite story that is running live or swipe left
                        </Text>
                      </View>
                    </View>
                    <FavoritesBoxView
                      onSelectFavoriteToOpen={
                        (story) => {
                          this._openStory(story)
                          this.tracker.trackEvent('Favorite', 'open', {label: story.title})
                      }}/>
                    <View style={{height: 52}}/>
                  </ScrollView>
                </View>
              </View>
              <View style={indexStyles.categoryList}>
                <ActivityIndicator
                  animating={this.state.loading}
                  style={[styles.centering, {height: this.state.loading? 88 : 0}]}
                  size="large" />
                <ListView
                  dataSource={this.state.updatingStories.getRowCount() > 0 ? this.state.updatingStories : this.state.datasource}
                  renderRow={this.state.updatingStories.getRowCount() > 0 ? (rowData) => this._renderRow(rowData) : () => this._emptyViewFor("current")}
                  enableEmptySections={true}
                  style={indexStyles.storyList}
                  renderHeader={()=>this.renderHeader("Experience these stories in real-time.", "Skim to the latest tweet, then follow along in real-time.")}
                  contentContainerStyle={{paddingBottom: 52}} />
              </View>
              <View style={indexStyles.categoryList}>
                <ListView
                  dataSource={this.state.finishedStories.getRowCount() > 0 ? this.state.finishedStories : this.state.datasource}
                  renderRow={this.state.finishedStories.getRowCount() > 0 ? (rowData) => this._renderRow(rowData) : () => this._emptyViewFor("finished")}
                  enableEmptySections={true}
                  style={styles.storyList}
                  renderHeader={()=>this.renderHeader("Get the whole story now.", "These can be binged, now that they’ve finished running in real-time.")}
                  contentContainerStyle={{paddingBottom: 52}} />
              </View>
              {this.state.isCategoryURL ? this.renderCategoryData(this.state.CategoryData) : this._renderDummyView()}
          </ScrollView>
        )
  }

  _buildCategoryDescriptionView (descriptionText) {
    if (descriptionText) {
      return (
        <View style={indexStyles.categoryExplanation}>
          {descriptionText}
        </View>
      )
    } else {
      return (
        null
      )
    }
  }

  renderCategoryData (CategoryDetail){
    return CategoryDetail.map((storyData,storyDataIndex)=>{

      var categoryDescriptionView = null;
      if (storyData.stories[storyDataIndex]) {
        if (storyData.stories[storyDataIndex].categories.length) {
          categoryDescriptionView = this._buildCategoryDescriptionView(storyData.stories[storyDataIndex].categories[0].description)
        }
      }

      if (storyData.stories.length == 0){
        return (
          <View key = {storyDataIndex} style={indexStyles.categoryPages}>
            <View style={indexStyles.categoryList}>
                {categoryDescriptionView}
                <View>
                  {this._emptyViewFor("finished")}
                </View>
            </View>
          </View>
        )
      } else {
        return (
          <View key = {storyDataIndex} style={indexStyles.categoryPages}>
            <View style={indexStyles.categoryList}>
                {categoryDescriptionView}
                <ScrollView
                  horizontal = { false }
                  vertical = { true }
                  showsVerticalScrollIndicator = { false }
                  contentContainerStyle={{paddingBottom: 52}}>
                  {this.storiesData(storyData, storyDataIndex)}
                </ScrollView>
            </View>
          </View>
        )
      }
    })
  }

  storiesData (storyData , storyDataIndex) {
      return storyData.stories.map((story, storyIndex)=>{
        var _story = new Story(story)
        {_story.finished ? finishedStories.push(story) : <View style = {{flex:0}}></View>  }
        return (
          <TouchableOpacity
            key={storyIndex}
            onPress={() => this._openStory(_story)}
            style={indexStyles.storyCell}>
              <Image
                source={{uri:_story.cover}}
                style={indexStyles.storyPic}
              />
              <Text style={indexStyles.storyTitle}>
                {_story.title.toUpperCase()}
              </Text>
              <View style={indexStyles.separator} />
              <Text style={indexStyles.storySynopsis}>
                {_story.synopsis}
              </Text>
              <View style={indexStyles.storyCellBg} />
              <View style={indexStyles.storyCellBorders} />

              <TouchableOpacity
                style={indexStyles.storyAuthor}
                onPress={() => this._showAuthor(_story.author_url)}>
                <Image style={styles.avatar}
                  source={{uri: _story.author.avatar_url}}/>
                <Text style={indexStyles.authorName}>
                  {_story.author.name}
                </Text>
              </TouchableOpacity>
          </TouchableOpacity>
        )
    })
  }

  _shareWithFriends() {
    Alert.alert(
      'Want to share the LongShorts stories with friends?',
      'You can easily share ReadLongShorts.com from here, a site that tells the app\'s story and has twitter trailers for all the stories too!',
      [
        {
          text: 'Share ReadLongShorts.com',
          onPress: () => {
            this.tracker.trackEvent('Share', 'social_sharing')
            this._socialShare()
          }
        },
        {
          text: 'Open ReadLongShorts.com',
          onPress: () => {
            this.tracker.trackEvent('Share', 'webview')
            this._openURL('http://ReadLongShorts.com')
          }
        },
        {
          text: 'Maybe later…',
          onPress: () => {
            this.tracker.trackEvent('Share', 'Maybe latter...')
          },
          style: 'cancel'
        }
      ]
    )
  }

  _socialShare() {
    ActionSheetIOS.showShareActionSheetWithOptions({
      url: 'http://www.readlongshorts.com',
      message: 'Check out a story in the LongShorts app',
      subject: 'ReadLongShorts',
    },
    (error) => alert(error),
    (success, method) => {
     if (success) {
        this.tracker.trackEvent('Share', 'social_sharing', {label: method})
      } else {
        this.tracker.trackEvent('Share', 'social_sharing', {label: 'cancel'})
      }
    })
  }

  _renderHighlighter (index) {
    this.setState({
      currentTab:index,
    })
  }

  _showHighlighter(){
    return (
      <View style={[indexStyles.categoryHighlight]}></View>
    )
  }

  _noHighlighter (){
    console.log('no highlighter')
  }

  _renderDummyView (){
    return (
      <View style = {{flex:0}}/>
    )
  }

  async _fetchIndex(url){
    CategoryData = []
    finishedStories  = []
    updatingStories = []
    miscStories = []
     var wovenRequestManager = new WovenRequestManager
     wovenRequestManager._get(url).then((response) => {
       var resource = Halson(response)

       if (this.state.isCategoryURL){
         const categories = resource.categories.map((category) => new Category(category))
         categories.map((category) => {
           CategoryData.push(category)
           const stories = category.stories.map((json)=> new Story(json))
             stories.map((story) => {
               if (story.finished) {
                    finishedStories.push(story)
                } else {
                    updatingStories.push(story)
                }
             })
           })
       }

       else if (this.state.isStoryURL) {
         const stories = resource.getEmbeds('stories').map((json) => new Story(json))
         stories.map((story) => {
          if (story.finished) {
            finishedStories.push(story)
          }else{
            updatingStories.push(story)
          }
        })
       }

       if (updatingStories.length < 1) {
            miscStories = miscStories.concat(updatingStories)
            updatingStories = []
       }

       if(finishedStories.length < 3) {
            miscStories = miscStories.concat(finishedStories)
            finishedStories = []
       }

       this.setState({
            CategoryData : CategoryData,
            finishedStories: this.state.finishedStories.cloneWithRows(finishedStories),
            updatingStories: this.state.updatingStories.cloneWithRows(updatingStories),
            miscStories: this.state.miscStories.cloneWithRows(miscStories),
            loading: false
       })
     })
   }

}
