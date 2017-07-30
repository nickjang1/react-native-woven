/* @flow */

import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';

import variables from '../styles/StyleVariables'

var profileStyles = StyleSheet.create({
  profileCase: {
    minHeight: variables.height - 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: variables.bgColor,
  },
    backgroundStripe: {
      position: 'absolute',
      zIndex: -1,
      top: variables.marginSize * 4,
      left: variables.textInset * 2,
      bottom: variables.marginSize * 4,
      right: variables.textInset * 2,
      paddingRight: variables.gutterSize,
      paddingLeft: variables.gutterSize,
      backgroundColor: '#FFFFFF',
    },
  xlAvatar: {
    width: variables.avatarSize * 4,
    height: variables.avatarSize * 4,
    marginBottom: variables.marginSize * 2,
    borderRadius: variables.avatarSize * 2,
    borderColor: '#EFEFEF',
    backgroundColor: 'white',
  },
  bioName: {
    marginTop: variables.marginSize,
    marginBottom: variables.marginSize,
    fontSize: variables.h1,
    fontStyle: 'italic',
    fontFamily: variables.storyFont,
    color: variables.textColor,
    backgroundColor: 'transparent',
  },
  authorTwitter: {
    color: variables.tappableColor,
    fontFamily: variables.storyFont,
    backgroundColor: 'transparent',
  },
  bio: {
    marginTop: variables.marginSize,
    marginRight: variables.textInset,
    marginLeft: variables.textInset,
    fontSize: 24,
    fontWeight: '200',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  xlAvatar: {
    width: variables.avatarSize * 4,
    height: variables.avatarSize * 4,
    marginTop: variables.marginSize * 2,
    marginBottom: variables.marginSize * 2,
    borderRadius: variables.avatarSize * 2,
    backgroundColor: variables.childBorder,
  },
  biography: {
    marginRight: variables.textInset * 3,
    marginLeft: variables.textInset * 3,
    fontSize: variables.h2,
    lineHeight: variables.h2 * 1.5,
    fontFamily: variables.storyFont,
    fontStyle: 'italic',
    color: variables.textColor,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  ellipsis: {
    margin: variables.marginSize,
    color: variables.childBorder,
    backgroundColor: 'transparent',
  },
  bioPoint: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
    bioType: {
      marginTop: variables.marginSize,
      fontSize: 12,
      opacity: .7,
    },
    bioStats: {
      top: -4,
      fontSize: 16,
      backgroundColor: 'transparent',
    },
  followStats: {
    flexDirection: 'row',
    marginTop: variables.marginSize,
    height: 44,
  },
    followStatsText: {
      fontSize: 16,
    },
  authorIndexLead: {
    fontSize: variables.p,
    fontFamily: variables.storyFont,
    fontStyle: 'italic',
    textAlign: 'center',
    color: variables.textColor,
    backgroundColor: 'transparent',
  }
})

export {profileStyles}
