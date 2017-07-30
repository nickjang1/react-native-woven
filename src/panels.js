import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated
} from 'react-native';

import {statusStyles} from './styles/StatusStyles';

class Panel extends Component{
    constructor(props){
      super(props)

      this.icons = {
        'up'   : '',
        'down' : '⇡'
      }

      this.state = {
        title     : props.title,
        expanded  : false,
        animation : new Animated.Value()
      }

    }

    toggle() {
      let initialValue = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
          finalValue   = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight - 37

      this.setState({
        expanded : !this.state.expanded
      })

      this.state.animation.setValue(initialValue)

      Animated.spring(
        this.state.animation,
          {
            toValue: finalValue
          }
      ).start()
    }

    render(){
      let icon = this.icons['down']

      if(this.state.expanded){
        icon = this.icons['up']
      }

      return (
        <Animated.View
          style={[statusStyles.collapseContainer, {height: this.state.expanded ? this.state.animation : 37}, {backgroundColor: this.state.expanded ? 'transparent' : 'white'}]}>
          <TouchableOpacity
            style={[statusStyles.titleContainer, {height: this.state.expanded ? 0 : 37}, {opacity: this.state.expanded ? 0 : 1}]}
            onPress={this.toggle.bind(this)}
            underlayColor="#f1f1f1"
            onLayout={(event) => this._setMinHeight(event)}>
            <View
              style={statusStyles.icon}>
              <Text
                style={statusStyles.iconText}>
                {icon}
              </Text>
            </View>
            <Text
              style={[statusStyles.title, {opacity: this.state.expanded ? 0 : 1}]}>
              {this.state.title}
            </Text>
          </TouchableOpacity>
          <View
            style={statusStyles.body}
            onLayout={(event) => this._setMaxHeight(event)}>
            {this.props.children}
          </View>
        </Animated.View>
      )
    }

    _setMaxHeight(event) {
      var {x, y, width, height} = event.nativeEvent.layout
      console.log(height)
      this.setState({
        maxHeight : height
      })
    }

    _setMinHeight(event) {
      var {x, y, width, height} = event.nativeEvent.layout
      console.log(height)
      this.setState({
        minHeight : height
      })
    }
}

export default Panel;
