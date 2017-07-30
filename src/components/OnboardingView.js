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
  Alert,
  Navigator
} from 'react-native'
import Lightbox from 'react-native-lightbox'
let device = Dimensions.get('window');

import {styles}           from '../styles/Styles'
import variables          from '../styles/StyleVariables'
import AppIntro           from './AppIntro'
import {
  GoogleAnalyticsTracker
} from 'react-native-google-analytics-bridge'

export default class OnboardingView extends Component {

  onSkipBtnHandle = (index) => {
    this.props.navigator.pop()
    console.log(index);
  }
  doneBtnHandle = () => {
    this.props.navigator.pop()
  }
  nextBtnHandle = (index) => {

  }
  onSlideChangeHandle = (index, total) => {
    console.log(index, total);
  }

  render() {
    return (
      <Navigator
        renderScene  ={(route, navigator) => this.renderScene(route, navigator)} />
    )
  }

  configureNavigationBar() {
    var NavigationBarRouteMapper = {
      LeftButton(route, navigator, index, navState) {
        return null
      },
      RightButton(route, navigator, index, navState) {
        return null
      },
      Title(route, navigator, index, navState) {
        return null
      }
    }

    return (
      <Navigator.NavigationBar
        style={[barStyles.navBar, {opacity: 0}]}
        routeMapper={NavigationBarRouteMapper}
        hidden={true} />
    )
  }

  renderScene() {
    const pageArray = [{
      title: 'LongShorts is Stories',
      description: 'They might be called fiction or fake, we just call them fun!',
      img: require('../../img/onboarding-0.png'),
      imgStyle: {
        top: 70,
        height: 145,
        width: 145,
      },
      backgroundColor: '#EBE5E5',
      fontColor: '#666',
      level: 10,
    }, {
      title: 'Stories for Moments',
      description: 'We love the engaging stories in 📚+📺, but live on the go.\n\nLongShorts are \"long\" stories told in \"short\" statuses that fit in a moment.',
      img: require('../../img/onboarding-1.png'),
      imgStyle: {
        top: 20,
        height: 270,
        width: 270,
      },
      backgroundColor: '#D8D3D3',
      fontColor: '#666',
      level: 10,
    }, {
      title: 'Stories on Social',
      description: 'LongShorts stories and characters fit on Twitter.\n\nFollow, laugh, and react to the characters with friends on Twitter, all from LongShorts.',
      img: require('../../img/onboarding-3.png'),
      imgStyle: {
        top: 20,
        height: 270,
        width: 270,
      },
      backgroundColor: '#D8D3D3',
      fontColor: '#666',
      level: 10,
    }, {
      title: '\"Real\"time Stories',
      description: 'The characters aren‘t real, but their time is!\n\nAs you move through a day characters do too and post updates to their \"stories.\"',
      img: require('../../img/onboarding-2.png'),
      imgStyle: {
        top: 20,
        height: 270,
        width: 270,
      },
      backgroundColor: '#EBE5E5',
      fontColor: '#666',
      level: 10,
    }, {
      title: 'Find a Favorite',
      description: '\"Fav\" a story now, get notifed of 🔑tweets in real-time.',
      img: require('../../img/onboarding-4.gif'),
      imgStyle: {
        top: 70,
        height: 145,
        width: 160,
      },
      backgroundColor: '#EBE5E5',
      fontColor: '#666',
      level: 10,
    }];
    return (
      <AppIntro
        onNextBtnClick={this.nextBtnHandle}
        onDoneBtnClick={this.doneBtnHandle}
        onSkipBtnClick={this.onSkipBtnHandle}
        onSlideChange={this.onSlideChangeHandle}
        dotColor={'rgba(0,0,0,0.2)'}
        activeDotColor={'rgba(0,0,0,0.75)'}
        rightTextColor={variables.tappableColor}
        leftTextColor={'#CCC'}
        doneBtnLabel={'start'}
        showSkipButton={false}
        pageArray={pageArray}
      />
    );
  }
}
