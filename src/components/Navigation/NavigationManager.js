import React, { Component } from 'react'
import {
  Navigator,
  Text
} from 'react-native'

import Routes                   from './Routes'
import SettingsButton           from './SettingsButton'
import BackButton               from './BackButton'
import IndexView                from '../IndexView'
import AuthorView               from '../AuthorView'
import StatusDetailView         from '../StatusDetailView'
import CharacterView            from '../CharacterView'
import StoryView                from '../StoryView'
import ReplyView                from '../ReplyView'
import OnboardingView           from '../OnboardingView'
import NotificationSettingsView from '../NotificationSettingsView'
import FullWebView              from '../FullWebView'
import {barStyles}              from '../../styles/BarStyles'

export default class NavigationManager extends Component{
  render() {
    return (
      <Navigator
        initialRoute={Routes.index}
        renderScene={(route, navigator) => this.renderScene(route, navigator)}
        navigationBar={this.configureNavigationBar()}
        configureScene={(route) => this.configureScene(route)}
      />
    )
  }

  configureNavigationBar() {
    return (
      <Navigator.NavigationBar
        style={barStyles.navBar}
        routeMapper={NavigationBarRouteMapper}
      />
    )
  }

  configureScene(route) {
    if (route.sceneConfig) {
      return route.sceneConfig
    }
    return Navigator.SceneConfigs.PushFromRight
  }

  renderScene(route, navigator) {
    switch (route.id) {
      case 'story':
        return (
          <StoryView
            story={route.story}
            user={route.user}
            navigator={navigator}
          />
        )
      case 'status-detail':
        return (
          <StatusDetailView
            user={route.user}
            status={route.status}
            statuses={route.statuses}
            comment={route.comment}
            navigator={navigator}
          />
        )
      case 'author':
        return (
          <AuthorView
            user={route.user}
            author_url={route.author_url}
            navigator={navigator}
          />
        )
      case 'character':
        return (
          <CharacterView
            user={route.user}
            character={route.character}
            navigator={navigator} />
        )
      case 'reply':
        return (
          <ReplyView
            callDetailsView={(comment) => route.callDetailsView(comment)}
            story={route.story}
            user={route.user}
            status={route.status}
            kind={route.kind}
            navigator={navigator} />
        )
      case 'notification-settings':
        return (
          <NotificationSettingsView
            user={route.user}
            navigator={navigator}/>
        )
      case 'onboarding':
        return (
          <OnboardingView
            user={route.user}
            navigator={navigator}/>
        )
      case 'full-webview':
        return (
          <FullWebView
            url={route.url}
            navigator={navigator} 
          />
        )

      default:
        return (
          <IndexView
            user={route.user}
            storiesURL={this.props.storiesURL}
            categoriesURL={this.props.categoriesURL}
            navigator={navigator} />
        )
    }
  }
}

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if (route.index == 0 || route.index == 5) {
      return null
    }
    return (
      <BackButton
        navigator={navigator}/>
    )
  },
  RightButton(route, navigator, index, navState) {
    return (
      <SettingsButton
        user={route.user}
        navigator={navigator}/>
    )
  },
  Title(route, navigator, index, navState) {
    switch(route.id) {
      case 'index':
        return (
            <Text>x</Text>
        )
      case 'story':
        return (
          <Text
            style={[barStyles.navBarText, barStyles.navBarTitleText]}
            numberOfLines={1}>
            {route.story.title.toUpperCase()}
          </Text>
        )
      case 'author':
        return (
          <Text
            style={[barStyles.navBarText, barStyles.navBarTitleText]}
            numberOfLines={1}>
            AUTHOR
          </Text>
        )
      case 'character':
        return (
          <Text
            style={[barStyles.navBarText, barStyles.navBarTitleText]}
            numberOfLines={1}>
            {route.character.name}
          </Text>
        )
      default:
        return null
    }
  }
}
