/* @flow */

import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';

import variables from '../styles/StyleVariables'

var storyStyles = StyleSheet.create({
  storyFeed: {
    top: 63,
    minHeight: variables.height - 64,
    backgroundColor: variables.bgColor,
    transform: [
      { scaleY: -1,
        scaleX: 1 },
    ],
  },
  twitterCredits: {
    top: 64,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: variables.borderColor,
  },
    twitterLogo: {
      top: -1,
      width: 12,
      height: 12,
      opacity: .5,
    },
    creditsText: {
      fontWeight: '700',

      fontFamily: variables.uiFont,
      color: '#FFF',
    },
  footerFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    width: variables.width,
    height: 10,
    transform: [
      { scaleY: -1,
        scaleX: 1 },
    ],
  },
});

export {storyStyles};
