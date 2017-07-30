
import {
  Platform
} from 'react-native';
import SafariView from 'react-native-safari-view';

export const _openURL = (url, navigator) => {
  if(Platform.OS === 'ios'){
    SafariView.isAvailable()
    .then(SafariView.show({
      url: url
    }))
    .catch(error => {
      // Fallback WebView code for iOS 8 and Android
    })
  }
  else{
    navigator.push({
      id: 'full-webview',
      url: url,
    })
  }  
  
};
