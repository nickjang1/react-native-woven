/* @flow */

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

export default class AuthenticationView extends Component {

constructor(props) {
  super(props);
}

render() {
  return (
    <View style={{backgroundColor: 'blue', flex: 1, paddingTop: 200}}>
      <TouchableOpacity
        onPress={() => this.props.authenticateWithTwitter()}
      >
        <Text>Authenticate with twitter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.authenticateWithDigits()}
      >
        <Text>Use your phone number</Text>
      </TouchableOpacity>
    </View>
  )};
}
