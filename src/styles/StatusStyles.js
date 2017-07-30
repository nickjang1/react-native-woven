/* @flow */

import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';

import variables from '../styles/StyleVariables'

var statusStyles = StyleSheet.create({
  cardBorder: {
    marginRight: variables.textInset,
    marginLeft: variables.textInset,
    paddingRight: variables.marginSize,
    paddingLeft: variables.marginSize,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: variables.borderColor,
  },
    nestedNoPadding: {
      paddingRight: 0,
      paddingLeft: 0,
    },
  tweet: {
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  tweetHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: variables.marginSize,
    paddingLeft: variables.gutterSize,
    paddingBottom: variables.marginSize * 3,
    paddingRight: variables.gutterSize,
    alignItems: 'center',
  },
  tweetHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: variables.marginSize,
    paddingLeft: variables.gutterSize,
    paddingBottom: variables.marginSize,
    paddingRight: variables.gutterSize,
    alignItems: 'center',
  },
    tweetstormHeader: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      borderColor: variables.bgColor,
      paddingTop: variables.marginSize,
      paddingRight: variables.gutterSize,
      paddingBottom: variables.marginSize,
      paddingLeft: variables.textInset,
      alignItems: 'center',
    },
  tweetAvatar: {
    height: variables.avatarSize,
    width: variables.avatarSize,
    borderRadius: variables.avatarSize / 2,
    backgroundColor: '#EEEEEE',
    overflow: 'hidden',
  },
  tweetstormAvatar: {
    top: -1,
    height: variables.avatarSize / 2,
    width: variables.avatarSize/ 2,
    borderRadius: variables.avatarSize / 4,
    backgroundColor: '#EEEEEE',
    opacity: .5,
    overflow: 'hidden',
  },
  user: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    top: 1,
    height: variables.avatarSize,
    marginLeft: variables.marginSize,
  },
    tweetLead: {
      flexDirection: 'row',
    },
    tweetUsername: {
      paddingTop: 2,
      fontFamily: variables.uiFont,
      fontWeight: '700',
      fontSize: 14,
      lineHeight: 14,
      color: variables.tappableColor,
      overflow: 'visible',
      backgroundColor: 'transparent',
    },
    tweetFollow: {
      fontWeight: '400',
      color: variables.subTextColor,
    },
    tweetstormUsername: {
      color: variables.subTextColor,
      fontWeight: '400'
    },
    tweetHandle: {
      paddingTop: 2,
      fontFamily: variables.uiFont,
      fontSize: 14,
      lineHeight: 14,
      fontWeight: '400',
      color: variables.subTextColor,
      backgroundColor: 'transparent',
    },
  tweetText: {
    paddingTop: variables.marginSize * 2,
    paddingRight: variables.textInset,
    paddingBottom: variables.marginSize * 2,
    paddingLeft: variables.textInset,
    fontFamily: variables.storyFont,
    fontSize: 22,
    lineHeight: 32,
    fontWeight: '200',
    color: variables.textColor,
    backgroundColor: 'transparent',
  },
  noTopBorder: {
    borderTopWidth: 0,
  },
  tweetStormTopBorder: {
    marginLeft: variables.textInset,
    marginRight: variables.textInset,
    paddingRight: variables.marginSize,
    paddingLeft: variables.marginSize,
    width: variables.width - (variables.textInset * 2),
    height: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: variables.borderColor,
    backgroundColor: variables.bgColor,
  },
  cardBottom: {
    marginRight: variables.textInset,
    marginBottom: variables.marginSize,
    marginLeft: variables.textInset,
    paddingRight: variables.marginSize,
    paddingBottom: variables.marginSize,
    paddingLeft: variables.marginSize,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: variables.borderColor,
  },
    nestedCardBottom: {
      marginRight: variables.textInset + variables.marginSize,
      marginLeft:  variables.textInset + variables.marginSize,
    },
  cardTop: {
    marginRight: variables.textInset,
    marginTop: variables.marginSize,
    marginLeft: variables.textInset,
    paddingRight: variables.marginSize,
    paddingTop: variables.marginSize,
    paddingLeft: variables.marginSize,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: variables.borderColor,
  },
  noTopPadding: {
    paddingTop: 0,
  },
  noTopMargin: {
    marginTop: 0,
  },
  cardTopHighlight: {
    backgroundColor: '#FFF',
    height: variables.marginSize,
    marginRight: variables.textInset,
    marginLeft: variables.textInset,
  },

  // Media
  picContainer: {
    overflow: 'hidden',
    left: -(variables.marginSize + variables.textInset + 2),
    alignItems: 'center',
    marginTop: variables.marginSize,
    width: variables.width,
    flexDirection: 'row',
    borderColor: 'rgba(0,0,0,.03)',
  },
  pic: {
    width: variables.width,
    height: variables.width,
  },
    picBorders: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: 1,
      backgroundColor: variables.borderColor,
    },
      picBorderRight: {
        right: variables.textInset - 1,
      },
      picBorderRightNested: {
        right: variables.textInset + variables.marginSize - 1,
      },
      picBorderLeft: {
        left: variables.textInset + 1,
      },
      picBorderLeftNested: {
        left: variables.textInset + variables.marginSize + 1,
      },
  picBackground: {
    position: 'absolute',
    top: 0,
    width: variables.width,
    height: variables.width - (variables.textInset * 2),
    opacity: .5,
  },
  gif: {
    width: variables.width - ((variables.textInset + variables.marginSize + 1) * 2),
    height: variables.width - ((variables.textInset + variables.marginSize + 1) * 2),
  },
  embedFrame: {
    height: variables.width * .66,
    flexGrow: 1
  },
  videoFrame: {
    height: variables.width * .66,
  },
  embedCredits: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: variables.marginSize,
    paddingRight: variables.gutterSize,
    paddingBottom: variables.marginSize,
    paddingLeft: variables.gutterSize,
  },
    siteStuff: {
      flexDirection: 'row',
    },
    embedFavicon: {
      height: variables.avatarSize * .66,
      width: variables.avatarSize * .66,
      marginRight: variables.marginSize,
    },

  // Quote, RT, and Nested stuff
  retweetHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: variables.gutterSize,
    paddingTop: variables.marginSize,
    paddingRight: variables.gutterSize,
    paddingBottom: variables.marginSize,
    borderTopWidth: 1,
    borderTopColor: variables.borderColor,
  },
  retweetFooter: {
    height: variables.marginSize,
  },
  quoted: {
    marginTop: variables.marginSize * 2,
    marginLeft: variables.textInset,
    marginBottom: variables.marginSize,
    marginRight: variables.textInset,
    paddingBottom: variables.marginSize,
    borderWidth: 1,
    borderColor: variables.childBorder,
    borderRadius: 2,
  },
  nested: {
    marginLeft: variables.marginSize,
    marginRight: variables.marginSize,
  },

  // Replies
  repliedPreviewTweetHeader: {
    flexDirection: 'row',
    marginTop: variables.marginSize,
    marginRight: variables.textInset + 1,
    marginLeft: variables.textInset + 1,
    paddingTop: variables.marginSize,
    paddingRight: variables.marginSize,
    paddingBottom: variables.marginSize,
    paddingLeft: variables.marginSize,
    alignItems: 'flex-start',
    backgroundColor: '#FFF'
  },
  repliedTweet: {
    flexGrow: 1,
    maxWidth: variables.width - (variables.textInset * 2) - (variables.marginSize * 4) - variables.avatarSize - 2,
    marginTop: 4,
    marginLeft: variables.marginSize,
    color: variables.subTextColor,
    backgroundColor: 'transparent',
  },
  smallPadding: {
    height: variables.marginSize,
    marginBottom: 1,
    width: variables.width,
    backgroundColor: 'transparent',
  },
  firstNested: {
    marginRight: variables.textInset,
    marginLeft: variables.textInset,
    height: variables.marginSize,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: variables.borderColor,
  },
    highlight: {
      flexGrow: 1,
      marginRight: variables.marginSize,
      marginLeft: variables.marginSize,
      height: variables.marginSize,
      borderColor: variables.bgColor,
      backgroundColor: '#FFF',
    },

  // Tweet Footer
  tweetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: variables.gutterSize,
    overflow: 'hidden',
  },
    actionButtons: {
      flexDirection: 'row',
    },
      buttonActions: {
        width: 20,
        height: 17,
      },
      firstButton: {
        paddingLeft: variables.textInset,
      },
  tweetFooterButtons: {
    padding: variables.marginSize * 2,
  },
  timestamp: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: variables.marginSize,
    paddingTop: variables.marginSize * 2,
    fontFamily: variables.uiFont,
    fontWeight: '300',
    fontSize: 14,
    color: variables.subTextColor,
  },

  // Timestamp
  timeSinceLast: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: variables.textInset + variables.marginSize + 1,
    marginLeft: variables.textInset + variables.marginSize + 1,
    paddingRight: variables.gutterSize,
    paddingLeft: variables.gutterSize,
    backgroundColor: 'transparent',

  },
    shortTimeBG: {
      backgroundColor: '#FFF',
    },
    nestedShortTime: {
      marginRight: variables.textInset + variables.marginSize + 1,
      marginLeft: variables.textInset + variables.marginSize + 1,
    },
  timeSinceLastText: {
    fontFamily: variables.uiFont,
    fontSize: variables.h2,
    fontWeight: '200',
    color: variables.borderColor,
  },
    shortTimeText: {
      fontSize: variables.h4,
      fontWeight: '400',
    },
  timeBorder: {
    flexGrow: 1,
    marginLeft: variables.marginSize,
    height: 1,
    backgroundColor: variables.childBorder,
  },
    timePassed: {
      height:1,
      backgroundColor: variables.borderColor,
    },

  // COLLAPSIBLE tweets
  collapseContainer: {
    backgroundColor: 'white',
    overflow: 'scroll',
  },
  titleContainer: {
    height: 37,
    flexDirection: 'row',
    alignItems: 'center',
  },
    title: {
      flexGrow: 1,
      alignItems: 'center',
      fontFamily: variables.uiFont,
      color: variables.tappableColor,
    },
  icon: {
    justifyContent: 'center',
    marginLeft: variables.textInset,
    marginRight: variables.marginSize + ((variables.avatarSize / 2) - 7),
    height: 24,
    width: 14,
    borderRadius: 8,
    backgroundColor: variables.tappableColor,
  },
    iconText: {
      fontSize: 16,
      fontWeight: '700',
      lineHeight: 14,
      color: 'white',
    },
  body: {
    paddingTop  : 0
  },

  // Web preview
  cardStyle: {
    flexGrow: 1,
    left: -variables.marginSize,
    minHeight: variables.width * .66 + 48,
    width: variables.width - ((variables.textInset + variables.gutterSize + 1) * 2),
    backgroundColor: 'white',
    marginRight: variables.gutterSize,
    marginLeft: variables.gutterSize,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 3,
    borderLeftWidth: 1,
    borderColor: variables.childBorder,
    backgroundColor: variables.bgColor,
  },
  imageArea: {
    width: variables.width - ((variables.textInset + variables.gutterSize + 2) * 2),
    height: variables.width / 2,
    resizeMode: 'cover'
  },
  cardText: {
    paddingTop: variables.marginSize,
    paddingRight: (variables.textInset * 2) + 1,
    paddingBottom: variables.marginSize,
    paddingLeft: (variables.textInset * 2) + 1,
  },
    nameText: {
      fontSize: variables.h2,
      color: variables.tappableColor,
      fontWeight: 'bold'
    },
    titleText: {
      color: variables.textColor,
    },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    height: 44,
  },
    actionButtonImg: {
      padding: 7,
      width: 18,
      height: 18,
    },
  previewOptions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: variables.width - ((variables.textInset + variables.gutterSize + 1) * 2),
    paddingRight: variables.marginSize,
    paddingLeft: variables.marginSize,
  },
  previewCase: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: variables.childBorder,
  },
  previewArea: {
    flex: 1,
    flexGrow: 1,
    flexBasis: 1,
    minHeight: variables.width * .66,
    height: variables.width * .66,
  }
});

export {statusStyles};
