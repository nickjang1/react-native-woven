/* @flow */

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {styles}   from '../../styles/Styles';
import {barStyles} from '../../styles/BarStyles';

import SafariView from 'react-native-safari-view';

import { _openURL } from '../../helpers'

export default class BottombarView extends Component {

  _openURL(url) {
    _openURL( url, this.props.navigator )
  }

  render() {
    return (
      <View style={[barStyles.footerBar, {
            justifyContent: 'flex-start',
            alignItems: 'center',
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => this.props.onFollowCharacter()}
          style={[barStyles.followButton, this.props.following ? styles.buttonActive : ""]}
        >
          <Text style={[barStyles.followButtonText, this.props.following ? styles.buttonActiveText : ""]}>
            {this.props.following ? "Following" : "Follow" } @{this.props.status.character.profiles.twitter}
            {/* when active make it 'Following' and add the buttonActive* classes to it's <TouchableOpacity> and <Text> */}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this._openURL(this.props.status.social_network_url)}
          style={barStyles.followButton}
        >
          <Text style={barStyles.followButtonText}>
            Open on twitter
          </Text>
        </TouchableOpacity>
      </View>
    )
  };
}
