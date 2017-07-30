/* @flow */

import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';

import variables from '../styles/StyleVariables'

var replyStyles = StyleSheet.create({
  replyModal: {
    height: variables.height - 108,
  },
  case: {
    flex: 1,
    paddingTop: 44,
    backgroundColor: 'white',
    alignItems: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  tweetTextField: {
    flex: 1,
    paddingTop: 26,
    paddingRight: 8,
    paddingBottom: 6,
    paddingLeft: 8,
    borderColor: 'gray',
    backgroundColor: '#FFFFFF',
    fontSize: 24,
  },
  keyboardToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    paddingLeft: 8,
    paddingRight: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: 'white',
  },
    toolbarRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
      count: {
        marginRight: 6,
      },
      toolbarButton: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 28,
        paddingRight: 6,
        paddingLeft: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#333',
      },
        buttonText: {
          color: '#333',
        },
});

export {replyStyles};
