/* @flow */

import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';

import variables from '../styles/StyleVariables'

var detailsStyles = StyleSheet.create({

  tweetDetailsView: {
    backgroundColor: variables.borderColor,
    paddingTop: variables.marginSize,
    paddingBottom: variables.marginSize,
  },
  detailsScroll: {
    overflow: 'hidden',
    height: variables.height - 44,
    paddingTop: 56,
  },
  detailsMainTweet: {
    borderTopWidth: 1,
    borderColor: variables.borderColor,
  },
  storyTweets: {
    backgroundColor: '#CCC',
  },
  comments: {
    paddingBottom: variables.marginSize,
    backgroundColor: '#333',
  },
  commentsHeader: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: variables.marginSize,
    paddingRight: variables.textInset,
    paddingLeft: (variables.textInset * 2) + variables.gutterSize + 6,
    borderColor: variables.borderColor,
  },
    commentsHeaderText: {
      fontSize: 18,
      fontFamily: variables.uiFont,
      color: variables.subTextColor,
    },
  commentsSubHeader: {
    color: variables.borderColor,
  },
  commentsTweet: {
    backgroundColor: '#444',
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 1,
    },
    commentsUsername: {
      color: '#CCC',
      fontWeight: '400',
    },
    commentsTweetText: {
      color: '#EEE',
    },
  commentInput: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: variables.borderColor,
    backgroundColor: '#333',
  },
    detailsCommentInput: {
      flex: 1,
      marginTop: variables.marginSize,
      marginRight: variables.gutterSize,
      marginBottom: variables.marginSize,
      marginLeft: variables.gutterSize,
      paddingLeft: variables.marginSize,
      paddingRight: variables.marginSize,
      borderRadius: variables.marginSize,
      height: 44 - (variables.marginSize * 2),
      backgroundColor: variables.childBorder,
      overflow: 'hidden',
    },

})

export {detailsStyles}
