const WEBVIEW_REF = "WEBVIEW_REF";
import React, { PureComponent } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  WebView
} from 'react-native';

export default class WebViewApp extends PureComponent {
  state = { canGoBack: false };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.bottombar}>
          <TouchableOpacity
            disabled={!this.state.canGoBack}
            onPress={this.onBack}
            >
            <Text 
              style={
                this.state.canGoBack 
                ? styles.topbarText 
                : styles.topbarTextDisabled
              }
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
        <WebView
          ref={WEBVIEW_REF}
          style={{flex: 1}}
          onNavigationStateChange={this.onNavigationStateChange}
          source={{uri: this.props.url}}
        /> 
      </View>
    );
  }

  onBack = () => {
    this.refs[WEBVIEW_REF].goBack();
  }

  onNavigationStateChange = (navState) => {
    this.setState({
      canGoBack: navState.canGoBack
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15, /* Padding to push below the navigation bar */
    backgroundColor: '#F5FCFF',
  },
  bottombar: {
    height: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  topbarTextDisabled: {
    color: 'gray'
  }
});