/* @flow */

import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Navigator,
  Alert
} from 'react-native'

import {styles}       from '../styles/Styles'
import {replyStyles}  from '../styles/ReplyStyles'
import {statusStyles} from '../styles/StatusStyles'
import Twitter        from '../models/Twitter'
import TwitterComment from '../models/TwitterComment'

export default class ReplyView extends Component {
  constructor(props) {
    super(props)

    const presetText = this.props.kind == 'vote' ?
                      `Would love another episode of ${this.props.story.title} @readLongShorts 🙏` :
                      (this.props.kind == 'quote' ? '' : '@' + props.status.character.profiles.twitter + ' ')
    this.state = {
      presetText: presetText,
      text: presetText
    }
  }

  render() {
    return (
      <Navigator
        renderScene={
          (route, navigator) => this.renderScene(route, navigator)
        }/>
    )
  }

  additionalMessageLength() {
    let extractedMessageArray = this.state.text.split(' ');
    let additionalMessageLength = 0;
    
    extractedMessageArray.forEach((word) => {
      word.startsWith('#') ? additionalMessageLength = additionalMessageLength + word.length : '';
    });

    return additionalMessageLength;
  }

  validateTextLength() {
    return this.state.text.length > 140;
  }

  renderScene(route, navigator) {
    const maxLength = 140; 
    return (
      <KeyboardAvoidingView
        behavior={'padding'}
        style={replyStyles.case}>
        <TextInput
          style={replyStyles.tweetTextField}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          multiline = {true}
          numberOfLines = {3}
          autoFocus={true}/>
        {
          this.props.kind == "quote" ?
          this._quotedTweetView(this.props.status) :
           console.log("reply")
        }
        <View
          style={replyStyles.keyboardToolbar}>
          <TouchableOpacity
            style={replyStyles.toolbarButton}
            onPress={() => this.props.navigator.pop()}>
            <Text
              style={replyStyles.buttonText}>
              Cancel
            </Text>
          </TouchableOpacity>
          <View
            style={replyStyles.toolbarRight}>
            <Text
              style={[replyStyles.count, this.validateTextLength() && {color: 'red'}]}>
              {maxLength - this.state.text.length}
            </Text>
            <View style={[replyStyles.toolbarButton, {backgroundColor: '#333'}, this.validateTextLength() && {opacity: .5}]}>
              <TouchableOpacity onPress={() => {
                this._tweet(this.state.text, this.props.status, this.props.kind)
              }}>
              <Text
                style={replyStyles.buttonText, {color: 'white'}}>
                Tweet
              </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

  _tweet(text, status, kind) {
    if(this.validateTextLength()) {
      Alert.alert(
        'Your Tweet is Too Long…',
        `Tweets can only be 140 characters. Please remove ${this.state.text.length - 140} characters`
      );
      return;
    }

    var twitter = new Twitter()
    twitter.reply(status, text, kind).then((result) => {
      if (result) {
        if (kind == "reply") {
          var comment = new TwitterComment(result[0])
          this.props.callDetailsView(comment)
        }else{
          this.props.navigator.pop()
        }
      }else{

        Alert.alert(
          'Error',
          'Failt to publish status on Twitter',
          [
            {
            text: 'Ok',
            onPress: () => {console.log("fail tweet")}
            }
          ]
        )
      }
    })
  }

  _quotedTweetView(quoted) {
    if (quoted) {
     return(
       <View style={[statusStyles.tweet, statusStyles.quoted]}>
         <View style={[statusStyles.tweetHeader, {borderBottomWidth: 0, marginBottom: 0}]}>
           <View style={statusStyles.tweetAvatar}>
             <Image style={statusStyles.avatarImage}
               source={{uri: this.props.status.character.avatar}}/>
           </View>
           <View style={statusStyles.user}>
             <Text style={statusStyles.tweetUsername}>
               {this.props.status.character.name}
             </Text>
             <Text style={statusStyles.tweetHandle}>
               {'@' + this.props.status.character.profiles.twitter}
             </Text>
           </View>
         </View>
         <Text style={[statusStyles.tweetText, {fontSize: 18, lineHeight: 22, paddingTop: 0, paddingBottom: 6}]}>
           {this.props.status.message}
         </Text>
       </View>
     )
    }
  }
}
