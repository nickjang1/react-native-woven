/* @flow */

import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';

import variables from '../styles/StyleVariables'

var styles = StyleSheet.create({
  scrollMain: {
    height: variables.height,
    paddingTop: 64,
    backgroundColor: variables.bgColor,
  },
  bottomPadding: {
    height: 44,
  },
  bold: {
    fontWeight: '700',
  },
  buttonActive: {
    borderWidth: 1,
    borderColor: variables.childBorder,
    backgroundColor: 'transparent',
  },
  buttonActiveText: {
    color: variables.childBorder,
  },
 invertedStyle: {
   transform: [
     { scaleY: -1,
       scaleX: 1 },
   ],
 },
  avatar: {
    height: variables.avatarSize,
    width: variables.avatarSize,
    borderRadius: variables.avatarSize / 2,
    backgroundColor: '#999999',
    overflow: 'hidden',
  },
  tooltip: {
    position: 'absolute',
    top: -45,
    zIndex: 2,
  },
    tooltipPoint: {
      position: 'absolute',
      left: 55,
      width: 20,
      borderTopColor: 'rgba(40,30,30,0.8)',
      borderRightWidth: 10,
      borderRightColor: 'transparent',
      borderLeftWidth: 10,
      borderLeftColor: 'transparent',
      borderBottomColor: 'rgba(40,30,30,0.8)',
    },
      tooltipPointTop: {
        top: -15,
        borderBottomWidth: 15,
      },
      tooltipPointBottom: {
        bottom: -15,
        borderTopWidth: 15,
      },
    tooltipBG: {
      width: 245,
      padding: variables.marginSize,
      borderRadius: 2,
      backgroundColor: 'rgba(40,30,30,0.8)',
    },
    tooltipText: {
      fontSize: variables. h3,
      color: 'white',
    },
});

export {styles};
