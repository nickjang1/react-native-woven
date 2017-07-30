
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  WebView,
  Linking
} from 'react-native';
import Share from 'react-native-share';

const BGWASH = 'rgba(255,255,255,0.8)';
const DISABLED_WASH = 'rgba(255,255,255,0.25)';

export default class FullWebView extends PureComponent {

  state = { 
    url: '',
    status: 'No Page Loaded',
    backButtonEnabled: false,
    forwardButtonEnabled: false,
    loading: true,
    scalesPageToFit: true,
  };

  componentWillMount() {
    this.setState({url: this.props.url})
  }

  render() {
    return (
      <View style={styles.container}>
        
        <WebView
          ref={ref => { this.webView = ref; }}
          style={{flex: 1}}
          onNavigationStateChange={this.onNavigationStateChange}
          source={{uri: this.props.url}}
        />
        <View style={[styles.addressBarRow]}>
          <TouchableOpacity
            onPress={this.goBack}
            style={
              this.state.backButtonEnabled 
              ? styles.navButton 
              : styles.disabledButton
            }
          > 
            <Text> {'<'} </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.goForward}
            style={
              this.state.forwardButtonEnabled 
              ? styles.navButton 
              : styles.disabledButton}
            >
              <Text> {'>'} </Text>
            </TouchableOpacity> 
            <TouchableOpacity
              onPress={() => Share.open({url: this.state.url})}
            > 
              <View style={styles.goButton}> 
                <Text> Share! </Text> 
              </View> 
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.openDefaultBrowser}
            > 
              <View style={styles.goButton}> 
                <Text> Open Browser! </Text> 
              </View> 
            </TouchableOpacity>
          </View>
      </View>
    );
  }

  goBack = () => { this.webView.goBack(); };

  goForward = () => { this.webView.goForward(); };

  reload = () => { this.refthis.webView.reload(); };

  openDefaultBrowser = () => {
    Linking.canOpenURL(this.state.url).then(supported => {
      if (supported) {
          Linking.openURL(this.state.url);
      } else {
          console.log('Don\'t know how to open URI: ' + this.state.url);
      }
      return false
    });
   }

  onNavigationStateChange = (navState) => {
    this.setState({
      backButtonEnabled: navState.canGoBack, 
      forwardButtonEnabled: navState.canGoForward,
      url: navState.url,
      status: navState.title,
      loading: navState.loading,
      scalesPageToFit: true
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: 64
  },
  addressBarRow: {
    flexDirection: 'row',
    padding: 8,
    height: 64,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  topbarTextDisabled: {
    color: 'gray'
  },
  navButton: { 
    width: 50,
    height: 50, 
    padding: 3, 
    marginRight: 3, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: BGWASH, 
    borderColor: 'transparent', 
    borderRadius: 3, 
  },
  disabledButton: { 
    width: 50,
    height: 50, 
    padding: 3,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DISABLED_WASH,
    borderColor: 'transparent',
    borderRadius: 3,
  },
});