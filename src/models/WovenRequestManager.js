/* @flow */

import {
  AsyncStorage
} from 'react-native';
import _ from 'lodash';

import Halson from 'halson'

export default class WovenRequestManager {

  async _buildUrlWithQueryParameters(url, params={}) {

    let queryString = ""
    await AsyncStorage.getItem("user", (err, data) => {
      console.log('userData', data)
      if (data) {
        var user = Halson(JSON.parse(data))
        //queryString = `?user_token=${user.user_token}`
        params['user_token'] = user.user_token;
      }
    })

//    await AsyncStorage.getItem("deviceToken", (err, deviceToken) => {
//      console.log('deviceToken', deviceToken)
//      if (deviceToken) {
//        params['device_token'] = device_token;
//      }
//    })
    
    queryString = _.map(params, (param, key) =>  (key + "=" + param)).join('&');
    
    console.log('_buildUrlWithQueryParameters', queryString)

    var finalUrl = url + '?' + queryString;


    return finalUrl
  }

  async _fetchRequest(url, method, params={}) {
    const requestUrl = await this._buildUrlWithQueryParameters(url, params)

    const requestConfig = {
      method : method,
      headers: {
        'Accept'      : 'application/hal+json',
        'Content-Type': 'application/json'
      },
      mode  : 'cors',
      cache : 'force-cache',
    };

    return await this._execute(requestUrl, requestConfig)
  }

  async _fetchRequestWithBody(url, method, body={}) {

    const requestUrl = await this._buildUrlWithQueryParameters(url)
    
    const requestConfig = {
      method: method,
      headers: {
        'Accept'      : 'application/hal+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }

    return this._execute(requestUrl, requestConfig)
  }

  async _execute(url, config) {
    var request = new Request(url, config)

    const result = await fetch(request)
   .then((response) => { 
      console.log('response_execute', response)
      if(response){
        return response.json();
      }
      else{
        return {'error': 'response empty'}
      }
    })
   .then((responseJson) => { 
      console.log('responseJson', responseJson)
      return responseJson;
    })
   .catch((error) => { 
      console.log('_execute_error', error)
      return {'error' : error.message };
    })

   
   return result;
  }

  async _get(url, params={}) {
    return await this._fetchRequest(url, 'GET', params)
  }

  async _post(url, body={}) {
    const response = await this._fetchRequestWithBody(url, 'POST', body);
    
    console.log('_post', response);
    return response;
  }

  async _delete(url, params={}, body={}) {
    return await this._fetchRequest(url, 'DELETE', params, body)
  }
}
