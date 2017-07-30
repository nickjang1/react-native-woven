/* @flow */

import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
  WebView
} from 'react-native';
import Lightbox from 'react-native-lightbox'
let device = Dimensions.get('window');

import variables from '../styles/StyleVariables'

import {styles}       from '../styles/Styles';
import {statusStyles} from '../styles/StatusStyles';

import { _openURL } from '../helpers'

import {
  TweetHeaderView,
  TweetstormHeaderView,
  TweetTextView,
  TweetFooterView
} from './TweetComponents';
import Panel from './../panels';
import AutoLink from 'react-native-autolink';
import Video from 'react-native-video';
import Moment from 'moment';
import Hyperlink from 'react-native-hyperlink';
import SafariView from 'react-native-safari-view';
import {
  GoogleAnalyticsTracker
} from 'react-native-google-analytics-bridge'

export default class TweetView extends Component {

  constructor(props) {
    super(props)
    this._defaultTransition  = 700;

    this.state = {
      isInlinePreview: false,
      previewURL: '',
      isMetadataAvailable: false,
      metadataDescription: '',
      metadataTitle: '',
      metadataImage: '',
      metadataURL: ''
    }

    this.tracker = new GoogleAnalyticsTracker('UA-60734393-4')
  }

  _openURL(url) {
    _openURL( url, this.props.navigator )
  }

  render() {

    let inReplyTo
    let replyPreviewProps = {}

    if (this.props.status.kind === 'twitter_reply') {
      const relatedStatus = this.props.status.related_statuses[0]
      if (relatedStatus) {
        inReplyTo = relatedStatus.character
        replyPreviewProps = {
          replyPreviewCharacter: relatedStatus.character,
          replyPreviewMessage: relatedStatus.message
        }
      }
    }

    let isTweetStorm = false
    let isNextInConversation = false
    const currentStatusIndex = this.props.statuses.indexOf(this.props.status)
    if (currentStatusIndex > 0) {
      const previousStatus = this.props.statuses[currentStatusIndex - 1]
      isTweetStorm = (previousStatus.character.name === this.props.status.character.name)

      if (this.props.status.kind === 'twitter_reply') {
        const relatedStatus = this.props.status.related_statuses[0]
        if (relatedStatus) {
          isNextInConversation = (relatedStatus.status_id === previousStatus.status_id)
        }
      }
    }

    let rtPreviewProps = {}

    if (this.props.status.kind === 'twitter_rt') {
      const relatedStatus = this.props.status.related_statuses[0]
      if (relatedStatus) {
        rtPreviewProps = {
          rtPreviewCharacter: relatedStatus.character,
          rtPreviewMessage: relatedStatus.message
        }
      }
    }

    let statusIndex = this.props.statuses.indexOf(this.props.status)

    let previousStatusProps = {}
    if (statusIndex > 0) {
      const previousStatus = this.props.statuses[statusIndex - 1]
      previousStatusProps = {
        previousStatusTime: previousStatus.timestamp,
        previousStatusKind: previousStatus.kind,
        previousStatusCharacter: previousStatus.character,
      }
    }

    var changeInNestingBigger =
    this.props.status.kind != 'twitter_reply' &&
    previousStatusProps.previousStatusKind == 'twitter_reply'

    var changeInNestingSmaller =
    this.props.status.kind == 'twitter_reply' &&
    previousStatusProps.previousStatusKind != 'twitter_reply'

    var changeInNesting =
      changeInNestingBigger
      || changeInNestingSmaller

    var isLateReply =
      this.props.status.kind == 'twitter_reply'
      && !isNextInConversation

    // VARIABLES FOR NESTED TWEETS
    var nested = this.props.status.kind == 'twitter_reply'
    || this.props.status.kind == 'twitter_rt'?
      statusStyles.nested : null

    var nestedNoPadding =
      nested ? statusStyles.nestedNoPadding : null

    var firstNestedReply =
    this.props.status.kind == 'twitter_reply'
    && isNextInConversation == true
    && (
      previousStatusProps.previousStatusKind == 'twitter_post'
      || previousStatusProps.previousStatusKind == 'twitter_rt_quote'
    ) ?
      <View style={statusStyles.firstNested}>
        <View style={statusStyles.highlight} />
      </View> : null // Changes the indentation of the tweet

    // Retweet Specific Things
    var messageType = this.props.status.kind == 'twitter_rt' ?
      rtPreviewProps.rtPreviewMessage : this.props.status.message

    var rtSpacing = this.props.status.kind == 'twitter_rt' ?
      <View style={{height: 6}} /> : null

    // Time since last stuff
    var previousTweet = Moment(previousStatusProps.previousStatusTime);
    var thisTweet = Moment(this.props.status.timestamp);
    var timeDifference = thisTweet.diff(previousTweet, 'minutes');
    var longTime = timeDifference > 55;
    var timeNumbers =
      !longTime ?
        thisTweet.diff(previousTweet, 'minutes')
        :
        thisTweet.diff(previousTweet, 'hours')

    var timeText =
      timeDifference < 5 ? <Text>a few minutes later</Text> :
      timeDifference < 55 ? <Text>{timeNumbers} minutes later</Text> :
      timeDifference < 120 ? <Text>an hour later</Text> : <Text>{timeNumbers} hours later</Text>

    var shortTimeBG =
      !longTime && (
        (isTweetStorm && !changeInNestingBigger)
        || isNextInConversation
      ) ?
            statusStyles.shortTimeBG : null

    var shortTimeText =
      !longTime ? statusStyles.shortTimeText : null

    var nestedShortTime =
      nested
      && !longTime ?
        statusStyles.nestedShortTime : null

    var timeLead = timeDifference > 2 ?
      <View>
        <View style={[statusStyles.timeSinceLast, shortTimeBG, nestedShortTime]}>
          <Text style={[statusStyles.timeSinceLastText, shortTimeText]}>
            {timeText}
          </Text>
          <View style={statusStyles.timeBorder}>
            <View style={[statusStyles.timePassed, {flex: (timeDifference)}]} />
            <View style={{flex: 2 - timeDifference}} />
          </View>
        </View>
      </View>
      :
      null
      // END

    var retweetHeader = this.props.status.kind == 'twitter_rt' ?
      <TouchableOpacity onPress={() => this._showCharacterPage(this.props.character)}>
        <View style={statusStyles.retweetHeader}>
          <View style={statusStyles.tweetAvatar}>
            <Image style={statusStyles.avatarImage}
              source={{uri: this.props.status.character.avatar}}
            />
          </View>
          <View style={[statusStyles.user, {justifyContent: 'flex-start'}]}>
            <Text style={[statusStyles.tweetUsername]}>
              {this.props.status.character.name} retweeted at {Moment(this.props.status.timestamp).format("M/D • HH:mm")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      :
      null

    var retweetFooter = this.props.status.kind == 'twitter_rt' ?
      <View style={statusStyles.retweetFooter} /> : null

    // Tweetstorm Stuff
    var previousTweetNested = previousStatusProps.previousStatusKind == ('twitter_reply'||'twitter_rt')
    && !nested /* This makes the tweetstorm behavior work for reply threads */

    var tweetHeader = isTweetStorm
    && !previousTweetNested
    && !changeInNesting
    && !longTime
    && !isLateReply ?
      <TweetstormHeaderView
        isComment={this.props.isComment}
        navigator={this.props.navigator}
        headerType={this.props.status.kind}
        character={this.props.status.character}
        inReplyToCharacter={inReplyTo}
        timeLead={timeLead}
        rtPreviewCharacter={rtPreviewProps.rtPreviewCharacter}
        timestamp={this.props.status.timestamp} />
      :
      <TweetHeaderView
        isComment={this.props.isComment}
        navigator={this.props.navigator}
        headerType={this.props.status.kind}
        character={this.props.status.character}
        inReplyToCharacter={inReplyTo}
        rtPreviewCharacter={rtPreviewProps.rtPreviewCharacter}
        timestamp={this.props.status.timestamp} />

    var theQuote = null
    if (this.props.status.kind == 'twitter_rt_quote') {
      theQuote = this._buildQuoteView(this.props.status.related_statuses[0])
    }

    var cardPreview = null
    if (this.state.isInlinePreview == true) {
      cardPreview = this._inlinePreview(this.state.previewURL)
    } else {
      cardPreview = this._inlineCard(messageType)
    }
    var theTweet = <View>
      <TouchableOpacity onPress={() => this._openConversation(this.props.status)}>
        <AutoLink text={this._removeYoutubeLinkFromMessage(messageType)}
          webFallback={true}
          style={statusStyles.tweetText}
          hashtag="twitter"
          mention="twitter"
          onPress={(url) => this._handleCharacterTwitter(url)}
          linkStyle={{color: variables.tappableColor}}
          truncate={40}
        />
      </TouchableOpacity>
      {this._youtubeEmbed(messageType)}
      {cardPreview}
      {this._mediaSectionForStatus(this.props.status)}
      {theQuote}
      <TweetFooterView
        characters_link={this.props.characters_link}
        isComment={this.props.isComment}
        navigator={this.props.navigator}
        status={this.props.status}
        statuses={this.props.statuses}
        readingPoint={this.props.statuses[this.props.statuses.length - 1].timestamp}
      />
      {rtSpacing}
    </View>

    // Card top and bottom
    var nestedCardBottom =
      previousStatusProps.previousStatusKind == ('twitter_reply' || 'twitter_rt' || 'twitter_rt_quote') ?
        statusStyles.nestedCardBottom : null

    var cardBottom =
      (isTweetStorm && !longTime && !changeInNestingBigger) // to break a tweetstorm if it there is 1hr between tweets
      || isNextInConversation
      || firstNestedReply
      || previousStatusProps.previousStatusKind == undefined // for the first tweet
      || (!longTime
          && !changeInNesting
          && previousStatusProps.previousStatusCharacter == this.props.status.character
        ) ?
        null
        :
        <View style={[statusStyles.cardBottom, nestedCardBottom]}>
          <View style={statusStyles.tweet} />
        </View>

    var cardTop =
      (isTweetStorm && !longTime && !changeInNestingBigger)
      || isNextInConversation
      || isLateReply
      || firstNestedReply
      || (!longTime && !changeInNesting
          && previousStatusProps.previousStatusCharacter == this.props.status.character) ?
        null : <View style={statusStyles.cardTop} />

    var replyLead = isLateReply ?
      <View>
        <View style={statusStyles.repliedPreviewTweetHeader}>
          <TouchableOpacity onPress={() => this._showCharacterPage(replyPreviewProps.replyPreviewCharacter)}>
            <Image style={statusStyles.tweetAvatar}
              source={{uri: replyPreviewProps.replyPreviewCharacter.avatar}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._openConversation(this.props.status.related_statuses[0])}>
            <Text style={[statusStyles.repliedTweet]}>
              {replyPreviewProps.replyPreviewCharacter.name} wrote,
              &ldquo;{replyPreviewProps.replyPreviewMessage}&ldquo;
              {/* at {Moment(this.props.status.timestamp).format("HH:mm on M/D")}. */}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[
          statusStyles.cardTop,
          statusStyles.noTopPadding,
          statusStyles.noTopMargin
        ]}>
          <View style={statusStyles.cardTopExtended} />
        </View>
      </View> : null

    // Real Tweet stuff
    var finalTweet =
      <View style={this.props.invertedStyle}>
        {firstNestedReply}
        {cardBottom}
        {timeLead}
        {cardTop}
        <View style={nested}>
          {replyLead}
          {retweetHeader}
          <View style={[statusStyles.cardBorder, nestedNoPadding]}>
            <View style={[statusStyles.tweet]}>
              {tweetHeader}
              {this._buildTheMainTweetView(this.props.status.priority, theTweet)}
            </View>
          </View>
          {retweetFooter}
        </View>
      </View>

    // ACTUAL TWEET
    return <View>
      {finalTweet}
    </View>
  }

  _buildQuoteView(quoted) {
    return(
      <View>
        <View style={[statusStyles.tweet, statusStyles.quoted]}>
          <View style={[statusStyles.tweetHeader, {borderBottomWidth: 0, marginBottom: 0}]}>
            <View style={statusStyles.user}>
              <Image style={statusStyles.tweetAvatar}
                source={{uri: quoted.character.avatar}} />
              <View style={statusStyles.user}>
                <View>
                  <Text style={[statusStyles.tweetUsername]}>
                    {quoted.character.name}
                  </Text>
                </View>
                <View>
                  <Text style={statusStyles.tweetHandle}>
                    {'@' + quoted.character.profiles.twitter}
                  </Text>
                </View>
              </View>
            </View>
        </View>
          <TouchableOpacity onPress={() => this._openConversation(quoted)}>
            <AutoLink text={this._removeYoutubeLinkFromMessage(quoted.message)}
              webFallback={true}
              style={statusStyles.tweetText}
              hashtag="twitter"
              mention="twitter"
              onPress={(url) => this._openURL(url)}
              linkStyle={{color: variables.tappableColor}}
            />
          </TouchableOpacity>
          {this._youtubeEmbed(quoted.message)}
          {this._mediaSectionForStatus(quoted, "twitter_rt_quote")}
        </View>
    </View>
  )
}

  _buildTheMainTweetView(priority, tweet) {
    if (priority == "collapsed") {
      return(
        <Panel title={'expand ' + this.props.status.character.name + '’s side tweet…'}>
          {tweet}
        </Panel>
      )
    } else {
      return(tweet)
    }
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
              {/* <Image style={statusStyles.embedFavicon}
                source={require('./../../img/avatar-example.png')}/> Add in later */}
              <Text>
                (some videos only play on YouTube)
              </Text>
            </View>
            <Text style={statusStyles.linkIcon}>
              ⇢
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  _fetchMetadata(url) {
    let imagePattern = /<meta property="og:image" content\s*=\s*['\"]([^'\"]*?)['\"][^>]*?>/i
    let titlePattern = /<meta property="og:title" content\s*=\s*['\"]([^<]+)*?['\"]\/>/i
    let descriptionPattern = /<meta property="og:description" content\s*=\s*['\"]([^<]+)*?['\"]\/>/i
    let urlPattern = /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/

    let image = '';
    let title = url;
    let description = url;

    var matchedUrl = urlPattern.exec(url)
    if (matchedUrl.length > 2) {
      title = matchedUrl[2];
    }

    //Hardcoded fix for error - Unhandled JS Exception: Invalid character in header field name
    //Looks like the header in "inspiyr.com" has a invlaid character
    //and the code fails on calling the url - so avoiding the call for metadata temporarily
    //NEED TO FIX PROPERLY LATER
    if (url.indexOf('inspiyr.com') !== -1) {
      return
    }

    try {
      return fetch(url)
      .then((responseData) => {
        var body = responseData._bodyInit;
        //Image
        if (body.match(imagePattern)) {
          image = body.match(imagePattern)[1];
        }
        //Title
        if (body.match(titlePattern)) {
          title = body.match(titlePattern)[1];
        } else {
          var matchedUrl = urlPattern.exec(url)
          if (matchedUrl.length > 2) {
            title = matchedUrl[2];
          }
        }
        //Description
        if (body.match(descriptionPattern)) {
          description = body.match(descriptionPattern)[1];
        } else {
          description = url;
        }

        var responseJson = JSON.stringify({url:url,title:title,image:image,description:description});
        var metaData = JSON.parse(responseJson);

        this.setState({
          metadataImage: metaData.image,
          metadataTitle: metaData.title,
          metadataDescription: metaData.description,
          metadataURL: metaData.url,
          isMetadataAvailable: true
        })
      })
      .catch((error) => {
        console.error(error);
        this.setState({isMetadataAvailable: false})
      });
    } catch(error) {
      console.error(error);
      this.setState({isMetadataAvailable: false})
    }
  }

  _closePreview() {
    this.setState({
      isInlinePreview: false,
      previewURL: ''
    })
  }

  _navFullScreen(url) {
    //Navigate to full screen web
    // this._openURL(url)

    //Navigato to internal web browser
    this.props.navigator.push({
      id: 'full-webview',
      url: url,
    })
  }

  _inlinePreview(message, previewURL) {
    return (
      <View>
        <View style={statusStyles.cardStyle}>
          <View style={statusStyles.previewCase}>
            <WebView
              source={{uri: this.state.previewURL}}
              style={statusStyles.previewArea} />
          </View>
          <View style={statusStyles.previewOptions}>
            <TouchableOpacity
              onPress={() => this._closePreview()}
              style={statusStyles.actionButton}>
              <Image
                style={statusStyles.actionButtonImg}
                source={require('../../img/close-button.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this._openURL(this.state.previewURL)}
              style={[statusStyles.actionButton, {flexDirection: 'row'}]}>
              <Image
                style={[statusStyles.actionButtonImg, {marginLeft: variables.marginSize}]}
                resizeMode={'stretch'}
                source={require('../../img/open-button.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  _openPreview(url) {
    this.setState({
      isInlinePreview: true,
      previewURL: url
    })
  }

  _inlineCard(message) {
    //List of ignored sites
    let ignoredSites = ['youtube.com', 'youtu.be','twitter.com'];

    //Remove any youtube URL from the message
    var youtubeRegex = /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.)?youtube\.com\/watch(?:\.php)?\?.*v=)([a-zA-Z0-9\_-]+)/
    var updatedMessage = message.replace(youtubeRegex, "");

    //Check if any URL present in the message - not null
    //ALSO check if more than one (handle only 1st)
    //Check if the URL is valid
    var urlPattern = /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/
    var matchedUrl = urlPattern.exec(updatedMessage)

    if (matchedUrl != null) {
      //Check if the URL is NOT youtube OR twitter URL
      for (var index in ignoredSites)
      {
        //url not in the list of ignored sites
        if (matchedUrl[0].search(ignoredSites[index]) == -1) {

          //fetch site MetaData
          if (!this.state.isMetadataAvailable) {
            this._fetchMetadata(matchedUrl[0])
          }

          //create view accordingly
          var imageComponent = null;
          if (this.state.metadataImage == '' || typeof this.state.metadataImage == 'undefined') {
            imageComponent = <Image
            source={require('./../../img/no-image-found.png')}
            resizeMode={'stretch'}
            style={statusStyles.imageArea} />
          } else {
            imageComponent = <Image
              source={{uri: this.state.metadataImage}}
              style={statusStyles.imageArea} />
          }

          return (
            <View>
              <TouchableOpacity onPress={() => this._openPreview(matchedUrl[0])}>
                <View style={statusStyles.cardStyle}>
                  {imageComponent}
                  <View style={statusStyles.cardText}>
                    <Text style={statusStyles.nameText}>
                      {this.state.metadataTitle}
                    </Text>
                    <Text style={statusStyles.titleText}>
                      {this.state.metadataDescription}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )
        }
      }
    }
    else {
      return (
        null
      )
    }
  }

  _buildEmbedForUrl(url) {
    return "<iframe width='100%' height='" + variables.width * .64 + "' src='" + url + "?origin=http://96problems.com?enablejsapi=1' frameborder='0' allowfullscreen></iframe>"
  }

  _mediaSectionForStatus(status, nested) {
    var mediaHeight = status.media_width > status.media_height ?
      (status.media_height / status.media_width) * (variables.width - 40) : variables.width - 40

    if (status.media_attachement) {
      if (status.media_type == 'animated_gif') {
        return <Lightbox
          activeProps={{width: device.width, height:device.height}}>
            <Video
              source={{uri: status.media_attachement}}
              rate={1.0}
              volume={1.0}
              muted={false}
              paused={false}
              resizeMode="contain"
              repeat={true}
              style={[statusStyles.gif, {height: mediaHeight}]} />
          </Lightbox>
      }else{
      return <View style={[statusStyles.picContainer, {height: mediaHeight}]}>
          <Image
            style={statusStyles.picBackground}
            blurRadius={10}
            source={{uri: status.media_attachement}} />
          <Lightbox
            style={statusStyles.pic}
            activeProps={{width: device.width, height:device.height}}>
            <Image
              style={statusStyles.pic}
              resizeMode={'contain'}
              source={{uri: status.media_attachement}} />
          </Lightbox>
          <View style={[statusStyles.picBorders, this.props.status.kind == 'twitter_reply' ? statusStyles.picBorderRightNested : statusStyles.picBorderRight]} />
          <View style={[statusStyles.picBorders, this.props.status.kind == 'twitter_reply' ? statusStyles.picBorderLeftNested : statusStyles.picBorderLeft]} />
        </View>
      }
    }
  }

  // - Conversation
  _openConversation(status) {
    if(this.props.fromStatusDetailView) {
      this._openURL(this.props.status.social_network_url)
    } else if (this.props.isComment) {
        this._openURL(status.social_network_url)
    } else {
      this.tracker.trackEvent('Status', 'open-conversation', { label: status.message })

      this.props.navigator.push({
        id: 'status-detail',
        status: status,
        statuses: this.props.statuses,
        user: this.props.user
      })
    }
  }


  // - Handle character twitter View
  _handleCharacterTwitter(url) {
    var isCharInStatus = false;
    var selectedRelatedStatus
    this.props.status.related_statuses.map((statusText, index) => {
    if (url.indexOf(statusText.character.profiles.twitter) !== -1){
       selectedRelatedStatus = statusText;
       isCharInStatus = true
     }
   })
   if (isCharInStatus){
       this._showCharacterPage(selectedRelatedStatus.character)
     }
   else {
     this._openURL(url)
   }
  }

  // - Open character Page View
  _showCharacterPage(character) {
    this.tracker.trackEvent('Story', 'show-character', { label: character.name })
    this.props.navigator.push({
      id: 'character',
      character: character,
      user: this.props.user
    })
  }

}
