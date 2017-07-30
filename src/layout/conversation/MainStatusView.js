/* @flow */

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ListView,
  Image,
  TouchableOpacity,
  WebView
} from 'react-native';

import variables from '../../styles/StyleVariables'
import {styles} from '../../styles/Styles';
import {statusStyles} from '../../styles/StatusStyles';

import Halson     from 'halson'
import SafariView from 'react-native-safari-view';
import AutoLink   from 'react-native-autolink';
import Moment     from 'moment';
import Video      from 'react-native-video';

import { _openURL } from '../helpers'

export default class MainStatusView extends Component {

constructor(props) {
  super(props)
  this.state = {
    favorited: false
  }
  this._checkIfFavorite()
}

async _checkIfFavorite() {
  const authenticated = await this.props.socialNetworkManager.authenticated('twitter');

  if (authenticated) {

  this.props.socialNetworkManager.getFavoriteStatus(this.props.status.social_id)
    .then((favorited) => {
      this.setState({favorited: favorited})
    })
  }
}

_openURL(url) {
  _openURL( url, this.props.navigator )
}

render() {
  let viewStyle = [statusStyles.tweet, statusStyles.nested, {borderBottomWidth: 0}]
  if (this.props.isMain) {
    viewStyle = [statusStyles.tweet, styles.detailsMainTweet]
  }
  return (this._mainSectionForStatus(this.props.status, viewStyle))
}

_mainSectionForStatus(status,viewStyle, related=false) {
  return(
    <View style={viewStyle}>
      {this._headerForStatus(status)}
      <TouchableOpacity
        onPress={
                  this.props.isMain ?
                  () => console.log("dont open") :
                  () => this.props.onSelectStatus()
                }>
        <AutoLink
          text={this._removeYoutubeLinkFromMessage(status.message)}
          webFallback={true}
          style={statusStyles.tweetText}
          hashtag="twitter"
          mention="twitter"
          onPress={(url) => this._openURL(url)}
          linkStyle={{color: variables.tappableColor}}
        />
      </TouchableOpacity>
      {this._youtubeEmbed(status.message)}
      {this._mediaSectionForStatus(status)}
      {this._quotedSectionForStatus(status)}
      {related ? <View/> : this._footerForStatus(status)}
    </View>
  )
}

_quotedSectionForStatus(status) {
  if (status.kind == "twitter_rt_quote") {
    let viewStyle = [statusStyles.tweet, statusStyles.nested, {marginTop: 6}]
    return(this._mainSectionForStatus(status.related_statuses[0], viewStyle, true))
  }
}

_headerForStatus(status) {
  return(
    <TouchableOpacity onPress={() => this.props.onPressCharacter()}>
      <View style={statusStyles.tweetHeader}>
        <View style={statusStyles.tweetAvatar}>
          <Image style={statusStyles.avatarImage}
            source={{uri: status.character.avatar}}
          />
        </View>
        <View style={statusStyles.user}>
          <View>
            <Text style={[statusStyles.tweetUsername]}>
              {status.character.name}
            </Text>
          </View>
          <View>
            <Text style={statusStyles.tweetHandle}>
              {'@' + status.character.profiles.twitter}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

_footerForStatus(status) {
  const favoriteIcon = this.state.favorited ?
  require('./../../../img/favorite-post.png') :
  require('./../../../img/favorite.png')
  return(
    <View style={statusStyles.tweetFooter}>
      <View style={statusStyles.actionButtons}>
        <TouchableOpacity
          style={statusStyles.tweetFooterButtons}
          onPress={() => {
              this.props.onLike()
              this.setState({favorited: !this.state.favorited})
            }
          }
        >
          <Image style={statusStyles.buttonActions}
            source={favoriteIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={statusStyles.tweetFooterButtons}
          onPress={() => this.props.onReply()}
        >
          <Image style={statusStyles.buttonActions}
            source={require('./../../../img/reply.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={statusStyles.tweetFooterButtons}
          onPress={() => this.props.onRetweet()}
        >
          <Image style={statusStyles.buttonActions}
            source={require('./../../../img/retweet.png')}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
                        this.props.isMain ?
                        () => console.log("dont open") :
                        this.props.onSelectStatus()
      }}>
        <Text style={statusStyles.timestamp}>
          {Moment(this.props.status.timestamp).format("M/D • HH:mm")}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

_removeYoutubeLinkFromMessage(message) {
  var regex = /\s(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.)?youtube\.com\/watch(?:\.php)?\?.*v=)([a-zA-Z0-9\_]+)$/
  return message.replace(regex, "")
}

_youtubeEmbed(message) {
  var videoCode = message.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
  if (videoCode) {
    var url = "https://www.youtube.com/embed/" + videoCode[1];
    var linkUrl = "https://www.youtube.com/" + videoCode[0];
    var embed = this._buildEmbedForUrl(url);
    return(
      <View>
        <View style={statusStyles.embedFrame}>
          <WebView
            javaScriptEnabled={true}
            scrollEnabled={false}
            source={{html: embed}}
            style={statusStyles.videoFrame}/>
        </View>
        <TouchableOpacity
          onPress={() => this._openURL(linkUrl)}
          style={statusStyles.embedCredits}>
          <View style={statusStyles.siteStuff}>
            {/* <Image style={styles.embedFavicon}
              source={require('./../../img/avatar-example.png')}/> Add in later */}
            <Text>
              (some videos only play on YouTube)
            </Text>
          </View>
          <Text style={styles.linkIcon}>
            ⇢
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

_buildEmbedForUrl(url) {
   return "<iframe width='100%' height='" + variables.width * .64 + "' src='" + url + "?origin=http://96problems.com?enablejsapi=1' frameborder='0' allowfullscreen></iframe>"
}

_mediaSectionForStatus(status) {
  var mediaHeight = status.media_width > status.media_height ?
    (status.media_height / status.media_width) * (variables.width - 40) : variables.width - 40

  var mediaMargins = this.props.status.kind == 'twitter_rt_quote' ? statusStyles.mediaNested : statusStyles.mediaRegular

  if (status.media_attachement) {
    if (status.media_type == 'animated_gif') {
      return <Video
        source={{uri: status.media_attachement}}
        rate={1.0}
        volume={1.0}
        muted={false}
        paused={false}
        resizeMode="contain"
        repeat={true}
        style={[statusStyles.gif, mediaMargins, {height: mediaHeight}]}
      />
    }else{
    return <View style={[styles.tweetPicContainer, mediaMargins, {height: mediaHeight}]}>
        <Image
          style={statusStyles.tweetPicBackground}
          blurRadius={10}
          source={{uri: status.media_attachement}}/>
        <Image
          style={statusStyles.tweetPic}
          resizeMode={'contain'}
          source={{uri: status.media_attachement}}/>
      </View>
    }
  }
}
}
