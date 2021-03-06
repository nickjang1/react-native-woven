/* @flow */

import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';

import variables from '../styles/StyleVariables'

var indexStyles = StyleSheet.create({

  section: {
    backgroundColor: variables.bgColor,
  },
  sectionHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: variables.marginSize,
    paddingBottom: variables.marginSize,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontFamily: variables.uiFont,
    fontStyle: 'italic',
    color: variables.uiColor,
    backgroundColor: 'transparent',
  },
  sectionTitleHelp: {
    overflow: 'hidden',
    justifyContent: 'center',
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: variables.uiColor,
    color: variables.bgColor,
    fontStyle: 'normal',
    textAlign: 'center',
  },

  // Story card
  storyCell: {
    alignItems: 'center',
    margin: variables.marginSize,
    marginRight: variables.textInset,
    marginLeft: variables.textInset,
    paddingTop: variables.marginSize * 2,
    paddingBottom: variables.marginSize * 2,
    borderWidth: 1,
    borderColor: variables.childBorder,
  },
    storyCellBg: {
      position: 'absolute',
      zIndex: -1,
      top: variables.marginSize,
      left: variables.textInset,
      bottom: variables.marginSize,
      right: variables.textInset,
      backgroundColor: '#FFF',
    },
    storyCellBorders: {
      position: 'absolute',
      top: -1,
      right: -1,
      bottom: -1,
      left: -1,
      borderWidth: 1,
      borderColor: variables.borderColor,
    },
  storyPic: {
    width: variables.width,
    height: variables.width * (150/320),
    overflow: 'visible',
  },
    addFavorite: {
      top: -(variables.width * .04),
      fontSize: variables.width / 2,
      color: 'white',
      backgroundColor: 'transparent',
    },
  notificationBadge: {
    justifyContent: 'center',
    position: 'absolute',
    top: (variables.marginSize) - 4,
    right: variables.textInset - 12,
    zIndex: 10,
    height: 24,
    paddingRight: variables.marginSize,
    paddingLeft: variables.marginSize,
    borderRadius: 12,
    backgroundColor: variables.tappableColor,
    overflow: 'hidden',
  },
    badgeText: {
      fontWeight: '600',
      fontFamily: variables.uiFont,
      color: 'white',
    },
  storyTitle: {
    marginTop: variables.marginSize * 2,
    marginRight: variables.textInset + variables.marginSize,
    marginBottom: variables.marginSize * 2,
    marginLeft: variables.textInset + variables.marginSize,
    fontSize: variables.h2,
    letterSpacing: 5,
    fontWeight: '700',
    fontFamily: variables.uiFont,
    textAlign: 'center',
    color: variables.textColor,
    backgroundColor: 'transparent',
  },
  separator: {
    width: 40,
    height: 4,
    backgroundColor: variables.textColor,
  },
  storySynopsis: {
    marginTop: variables.marginSize * 2,
    marginRight: variables.textInset + variables.marginSize,
    marginBottom: variables.marginSize,
    marginLeft: variables.textInset + variables.marginSize,
    fontSize: variables.h3,
    lineHeight: variables.h3 * 2,
    fontFamily: variables.uiFont,
    textAlign: 'center',
    color: variables.textColor,
    backgroundColor: 'transparent',
  },
  storyAuthor: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: variables.marginSize,
    marginBottom: variables.marginSize,
  },
    authorName: {
      marginLeft: variables.marginSize,
      fontFamily: variables.uiFont,
      color: variables.tappableColor,
      backgroundColor: 'transparent',
    },
  categories: {
    height: 44,
    borderTopWidth: 1,
    borderColor: variables.childBorder,
    flexDirection: 'row',
    paddingLeft: 2,
    width: variables.width,
    alignItems: 'stretch',
  },
  categoryNameCase: {
    marginRight: variables.marginSize * .5,
    marginLeft: variables.marginSize * .5,
    justifyContent: 'center',
  },
    categoryExpCase: {
      marginTop: variables.marginSize,
      marginRight: -variables.marginSize,
      marginBottom: variables.marginSize,
      paddingLeft: variables.marginSize * .5,
      paddingRight: 0,
      borderLeftWidth: 1,
      borderColor: variables.childBorder,
    },
  categoryName: {
    alignItems: 'center',
    marginRight: variables.marginSize * .5,
    marginLeft: variables.marginSize,
    fontFamily: variables.uiFont,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 4,
    color: variables.tappableColor,
  },
    categoryExp: {
      fontWeight: '500',
      color: variables.subTextColor,
    },
  currentCategory: {
    paddingTop: 1,
    borderBottomWidth: 1,
    borderColor: variables.tappableColor,
  },
  categoriesBorder: {
    position: 'absolute',
    zIndex: -1,
    right: 0,
    bottom: 0,
    left: 0,
    width: variables.width,
    height: 1,
    backgroundColor: variables.childBorder,
  },
  pages: {
    height: variables.height - (64 + 32 + 28),
    backgroundColor: variables.bgColor,
  },
  categoryPages: {
    flexDirection: 'row',
  },
  categoryHighlight: {
    marginTop: 12,
    height: 2,
    borderColor: variables.tappableColor,
    backgroundColor: variables.tappableColor,
  },
    categoryList: {
      minHeight: 200,
      width: variables.width,
    },
      categoryExplanation: {
        paddingTop: variables.marginSize * 2,
        paddingRight: variables.textInset,
        paddingBottom: variables.marginSize,
        paddingLeft: variables.textInset,
        borderColor: variables.childBorder,
      },
        explanationText: {
          fontFamily: variables.uiFont,
          fontStyle: 'italic',
          color: '#666',
        },
      storyList: {
        height: variables.height - (64 + 28 + 32),
      },
  emptyIndex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: variables.marginSize,
    marginRight: variables.textInset,
    marginLeft: variables.textInset,
    minHeight: variables.height - (64 + 88 + 28 + 32 + 44),
  },
    emptyStateText: {
      fontSize: 24,
      fontWeight: '600',
      fontFamily: variables.uiFont,
      color: variables.childBorder,
      textAlign: 'center',
    },
});

export {indexStyles};
