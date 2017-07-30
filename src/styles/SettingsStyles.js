/* @flow */

import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';

import variables from '../styles/StyleVariables'

var settingsStyles = StyleSheet.create({
  settingsBg: {
    minHeight: 400,
    flex: 1,
    marginTop: 64,
    backgroundColor: variables.bgColor,
  },
  settingsLead: {
    paddingTop: variables.marginSize * 2,
    paddingRight: variables.gutterSize,
    paddingBottom: variables.marginSize * 2,
    paddingLeft: variables.gutterSize,
    color: '#222',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
    height: 44,
    paddingRight: variables.gutterSize,
    paddingLeft: variables.gutterSize,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: variables.borderColor,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  childRow: {
    borderTopWidth: 0,
  },
  disturbTime: {
    color: '#333333',
  },
  datePicker: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: variables.borderColor,
  },
})

export {settingsStyles}
