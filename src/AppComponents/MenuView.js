/* @flow */

import React, { Component } from 'react';
import {
  Navigator,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  Modal
} from 'react-native';

import {styles} from '../styles/Styles';

export default class MenuView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible
    }
  }

  componentWillReceiveProps(props) {
    this.setState({visible: props.visible})
  }

  render() {
    const options = this.props.options
    const cancelIndex = this.props.cancelOptionIndex
    let buttons = this._buttonsFromOptions(options, cancelIndex)

    return <Modal
     transparent={true}
     animationType={'fade'}
     visible={this.state.visible}
     style={styles.modalBg}
     >
     <View style={styles.container}>
       <View style={styles.innerContainer}>

         <Text style={styles.modalHeader}>{this.props.title}</Text>

         {buttons}

       </View>
     </View>
    </Modal>
  }

  _buttonsFromOptions(options, dismissOptionIndex) {
    const titles = Object.keys(options)
    const callbacks = Object.values(options)
    var buttons = []

    for (var index = 0; index < titles.length; index++) {
      const title = titles[index]
      const callback = callbacks[index]
      let button

      if (index == dismissOptionIndex) {
        button = this._cancelButton(title, callback)
      } else {
        button  = this._menuButton(title, callback)
      }

      buttons.push(button)
    }

    return buttons
  }

  _menuButton(title, onPress) {
    return <View style={styles.modalButtonCase} key={title}>
      <TouchableOpacity style={styles.modalButton}
      onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </View>
  }

  _cancelButton(title, onPress) {
    return <View style={styles.modalButtonCase} key={title}>
      <TouchableOpacity style={styles.modalButton}
      onPress={onPress}>
        <Text style={[styles.buttonText, styles.closeText]}>{title}</Text>
      </TouchableOpacity>
    </View>
  }
}
