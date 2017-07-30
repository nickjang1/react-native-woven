/* @flow */

import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import {barStyles} from '../../styles/BarStyles'

export default class BackButton extends Component {

  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigator.pop()}
          style={barStyles.navBarLeftButton}>
        <Text
          style={barStyles.backButton}>
          ◀︎
        </Text>
      </TouchableOpacity>
    )
  }

}
