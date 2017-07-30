/* @flow */

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ListView,
  Image,
  TouchableOpacity,
  Navigator
} from 'react-native';

import {styles}        from '../../styles/Styles'
import {statusStyles}  from '../../styles/StatusStyles'
import {detailsStyles} from '../../styles/DetailsStyles'
import AutoLink        from 'react-native-autolink'
import Moment          from 'moment'
import SafariView      from 'react-native-safari-view'
import Twitter         from '../.././models/Twitter'
import {
  GoogleAnalyticsTracker
} from 'react-native-google-analytics-bridge'

import {
  TweetHeaderView,
  TweetTextView,
  TweetFooterView
} from '../.././tweets/TweetComponents'
export default class CommentCellView extends Component {

constructor(props) {
  super(props)

  this.tracker = new GoogleAnalyticsTracker('UA-60734393-4');

}

_openURL(url) {

  _openURL( url, this.props.navigator )
}

render() {
  var tweetType = this.props.comment.in_reply_to_status_id == this.props.status.social_id ?
    null : statusStyles.nested

  var replyLead = this.props.comment.in_reply_to_status_id == 'this.props.previous_status_id' ?
    null :
    <View style={statusStyles.repliedPreviewTweetHeader}>
      <View style={statusStyles.tweetAvatar}>
        <Image style={statusStyles.avatarImage}
          source={{uri: replyPreviewProps.replyPreviewCharacter.avatar}} /*Replace with the tweet it is replying to character avatar*/
        />
      </View>
      <Text style={[statusStyles.repliedTweet]}>
        {replyPreviewProps.replyPreviewCharacter.name} wrote, /*Replace with the character name it is replying to*/
        &ldquo;{replyPreviewProps.replyPreviewMessage}&ldquo; /*Replace with the tweet it is replying to*/
        {/* at {Moment(this.props.status.timestamp).format("HH:mm on M/D")}. */}
      </Text>
    </View>

  return (
    <View>
      <View
        style={[statusStyles.tweet, detailsStyles.commentsTweet, tweetType]}>
        <View
          style={statusStyles.tweetHeader}>
          <View
            style={statusStyles.tweetAvatar}>
            <Image
              style={statusStyles.avatarImage}
              source={{uri: this.props.comment.avatar_url}}
            />
          </View>
          <View
            style={statusStyles.user}>
            <View>
              <Text
                style={[statusStyles.tweetUsername, {color: '#EEE'}]}>
                {this.props.comment.name}
              </Text>
            </View>
            <View>
              <Text
                style={statusStyles.tweetHandle}>
                {'@' + this.props.comment.username}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => this._openURL("https://twitter.com/" + this.props.comment.username + "/status/" + this.props.comment.social_id)}>
          <AutoLink
            text={this.props.comment.message}
            webFallback={true}
            style={[statusStyles.tweetText, detailsStyles.commentsTweetText]}
            hashtag="twitter"
            mention="twitter"
            onPress={(url) => this._openURL(url)}
            linkStyle={{color: variables.tappableColor}} />
        </TouchableOpacity>
        <TweetFooterView
          navigator={this.props.navigator}
          status={this.props.comment}/>
      </View>
    </View>
  )}
}
