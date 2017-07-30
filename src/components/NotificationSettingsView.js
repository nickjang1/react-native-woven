import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Alert,
  DatePickerIOS,
  ActionSheetIOS,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  PushNotificationIOS,
  Linking,
  AppState,
  Navigator
} from 'react-native'

import Moment           from 'moment'
import userDefaults     from 'react-native-user-defaults'
import {settingsStyles} from '../styles/SettingsStyles'
import variables        from '../styles/StyleVariables'
import {barStyles}          from '../styles/BarStyles'
import SettingsButton       from './Navigation/SettingsButton'
import BackButton           from './Navigation/BackButton'
import {
  GoogleAnalyticsTracker
} from 'react-native-google-analytics-bridge'

class CollapsableComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {toggled: props.toggled}
  }

  componentWillReceiveProps(props){
    this.setState({toggled: props.toggled})
  }

  render() {

    const child = this.state.toggled ? this.props.childComponent : null
    return <View>
      <View style={settingsStyles.row}>
        <Text>
          {this.props.title}
        </Text>
        <Switch
          onValueChange={(value) => this.props.onToggle(value)}
          value={this.state.toggled}
          onTintColor={variables.tappableColor}
          tintColor={'rgba(255,0,0,0.3)'}
        />
      </View>
      {child}
    </View>
  }
}

class TogglableComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {toggled: props.toggled}
  }

  componentWillReceiveProps(props){
    this.setState({toggled: props.toggled})
  }

   render() {
    return <View style={settingsStyles.row}>
      <Text style={settingsStyles.settingsLabel}>
        {this.props.title}
      </Text>
      <Switch
      onValueChange={(value) => {
        this.props.onToggle(value)
      }}
      value={this.state.toggled}
      style={settingsStyles.settingsToggle}
      onTintColor={variables.tappableColor}
      tintColor={'rgba(255,0,0,0.3)'} />
    </View>
  }

}

dateTime = function(hours, minutes) {
  const date = new Date()
  date.setHours(hours)
  date.setMinutes(minutes)
  return date
}

futureDate = function(hours, minutes) {
  const date = new Date()
  const currentTimeInMilliSec = date.getTime()
  const hoursInMillisSec = hours * 60 * 60 * 1000
  const minutesInMilliSec = minutes * 60 * 1000

  return new Date(currentTimeInMilliSec + hoursInMillisSec + minutesInMilliSec)
}

class TimeIntervalMenu extends Component {
  state = {
    fromSelected: false,
    fromDate: this.props.fromDate,
    toSelected: false,
    toDate: this.props.toDate,
    timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
  }

  componentWillReceiveProps(props){
    this.setState({
      fromDate: props.fromDate,
      toDate: props.toDate
    })
  }

  render() {

    const fromDatePicker = this.state.fromSelected? this._datePicker(this.state.fromDate) : null
    const toDatePicker = this.state.toSelected? this._datePicker(this.state.toDate) : null

    return <View>
      <TouchableOpacity
       onPress={ () => this.setState({ fromSelected: !this.state.fromSelected, toSelected: false})}>
       <View style={[settingsStyles.row, settingsStyles.childRow]}>
       <Text style={settingsStyles.settingsLabel}>
        From
      </Text>
       <Text style={settingsStyles.disturbTime}>
        {Moment(this.state.fromDate).format("hh:mm A")}
      </Text>
      </View>
      </TouchableOpacity>

      {fromDatePicker}

      <TouchableOpacity
       onPress={ () => this.setState({ fromSelected: false, toSelected: !this.state.toSelected})}
      >
        <View style={[settingsStyles.row, settingsStyles.childRow]}>
          <Text style={settingsStyles.settingsLabel}>
            To
          </Text>
          <Text style={settingsStyles.disturbTime}>
            {Moment(this.state.toDate).format("hh:mm A")}
          </Text>
        </View>
      </TouchableOpacity>

      {toDatePicker}

    </View>
  }


  _datePicker(intialDate) {
    return <DatePickerIOS
          date={new Date(intialDate)}
          mode="time"
          timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
          onDateChange={this._onDateChange}
          minuteInterval={1}
          style={settingsStyles.datePicker}
        />
  }

  _onDateChange = (date) => {
    if (this.state.fromSelected) {
      // this.setState({fromDate: date})
      this.props.onChangeFromDate(date)

    } else {
      // this.setState({toDate: date})
      this.props.onChangeToDate(date)
    }
  }

}


export default class NotificationSettingsView extends Component {
  snoozeOptions = {
    '20 minutes'  : 20,
    '1 Hour'      : 60,
    '2 Hours'     : 120,
    '4 Hours'     : 240,
    '8 Hours'     : 480,
    '24 Hours'    : 1440,
    'Cancel'      : -1,
  }

  state = {
    notificationsEnabled: false,
    notificationsSnoozed: false,
    snoozedUntil: null,
    donotdisturbEnabled: false,
    donotdisturbFrom: dateTime(22, 0).toISOString(),
    donotdisturbTo: dateTime(8, 0).toISOString()
  }

  constructor() {
    super()
    this.tracker = new GoogleAnalyticsTracker('UA-60734393-4')
    this._checkNotificationPermissions()
  }

  componentWillMount() {
    PushNotificationIOS.addEventListener(
      'register',
      this._onRegistered
    )

    AppState.addEventListener(
      'change',
      this._handleAppStateChange
    )
  }

  _onRegistered(deviceToken) {
    AlertIOS.alert(
      `Registered For Remote Push`,
      `Device Token: ${deviceToken}`,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    )
  }

  componentWillUnmount() {
    AppState.removeEventListener(
      'change',
      this._handleAppStateChange
    )

    PushNotificationIOS.removeEventListener(
      'register',
      this._onRegistered
    )
  }

  _handleAppStateChange = (appState) => {
    console.log(appState)
    if (appState == 'active') {
      this._checkNotificationPermissions()
    }
  }

  render() {
    return (
      <Navigator
        ref="navigator"
        navigationBar={this.configureNavigationBar()}
        renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
    )
  }

  configureNavigationBar() {
    var user = this.props.user
    var _navigator = this.props.navigator
    var NavigationBarRouteMapper = {
      LeftButton(route, navigator, index, navState) {
        return <BackButton
                  navigator= {_navigator} />
      },
      RightButton(route, navigator, index, navState) {
        return null
      },
      Title(route, navigator, index, navState) {
        return (
          <Text
            style={[barStyles.navBarText, barStyles.navBarTitleText]}
            numberOfLines={1}>
              NOTIFICATIONS
          </Text>
        )
      }
    }
    return (
      <Navigator.NavigationBar
        style={barStyles.navBar}
        routeMapper={NavigationBarRouteMapper} />
    )
  }


  renderScene(route, navigator) {
    const notificationsEnabled = this.state.notificationsEnabled

    /*
    ** Do not disturb component
    */
    const doNotDisturbSection = notificationsEnabled? this._doNotDisturbComponent() : null

    /*
    ** Snooze component
    */
    const snoozeSection = notificationsEnabled? this._snoozeComponent() : null

    /*
    ** Render
    */
    return <ScrollView style={settingsStyles.settingsBg}>
      <View>
      <Text style={settingsStyles.settingsLead}>
        Customize notifications to match your rhythms.
      </Text>
      <TogglableComponent title={'Enable Notifications'}
        toggled={this.state.notificationsEnabled}
        onToggle={(value) => this._showAlertForGetNotifications(value)}
      />

      { doNotDisturbSection }

      { snoozeSection }

      </View>
    </ScrollView>

  }

  async _showAlertForGetNotifications(enabled) {
    await AsyncStorage.getItem("ALREADY_REQUESTED", (err, result) => {
      console.log(result)
      if (JSON.parse(result) == true) {
        this._enableNotifications(enabled)
      }else{
        AsyncStorage.setItem("ALREADY_REQUESTED", JSON.stringify(true))
        if (enabled) {
          Alert.alert(
          'Get the latest key tweets?',
          'Turn on notifications to experience the story in real time, by being notified of the latest key tweets.',
          [
            {
              text: 'Turn on Notifications',
              onPress: () => {
                this.tracker.trackEvent('notification', 'custom-alert', { label: 'Accept' })
                this._enableNotifications(enabled)
              }
            },
            {
              text: 'Maybe later…',
              onPress: () =>  {
                this.tracker.trackEvent('notification', 'custom-alert', { label: 'Cancel' })
                this._enableNotifications(false)
              },
              style: 'cancel'
            }
          ])
        }else{
          this._enableNotifications(false)
        }
      }
    })
  }

  _enableNotifications(enabled) {
    this.setState({
      notificationsEnabled: enabled
    })
    if (enabled) {
      PushNotificationIOS.requestPermissions()
    }
  }

  async _checkNotificationPermissions() {
    await AsyncStorage.getItem("ALREADY_REQUESTED", (err, result) => {
      if (JSON.parse(result) == true) {
        PushNotificationIOS.checkPermissions((permissions) => {
          if (permissions.alert == 0) {
            Alert.alert(
            'Great! Let us show you how! 😄',
            'Tap "Bring me to settings…" then you just have to tap "Notifications" and then turn on "Allow Notifications"\n\nThen we’ll you up to date!',
            [
              {
                text: 'Take me to settings…',
                onPress: () => Linking.openURL('app-settings:')
              },
              {
                text: 'Maybe later…',
                onPress: () =>  {
                  this._enableNotifications(false)
                  this.tracker.trackEvent('notification-off', '')
                },
                style: 'cancel'
              }
            ]
            )
          }else{
            this.setState({
              notificationsEnabled: true
            })
          }
        })
      }
    })
  }

  _doNotDisturbSettingsChanged(previousState) {
    if (!previousState) {
      return true
    }

    const previouslyEnabled = previousState.donotdisturbEnabled
    const previousDonodisturbFrom = previousState.donotdisturbFrom
    const previousDonodisturbTo = previousState.donotdisturbTo

    return (this.state.donotdisturbEnabled !== previouslyEnabled
      || this.state.donotdisturbFrom !== previousDonodisturbFrom
      || this.state.donotdisturbTo !== previousDonodisturbTo)
  }

  _snoozeSettingsChanged(previousState) {
    if (!previousState) {
      return true
    }

    const previouslyEnabled = previousState.notificationsSnoozed
    const previouslySnoozedUntil = previousState.previouslySnoozedUntil

    return (this.state.notificationsSnoozed !== previouslyEnabled
    || (this.state.snoozedUntil !== null && this.state.snoozedUntil !== previouslySnoozedUntil))
  }

  _doNotDisturbComponent() {
    return(
      <View>
      <Text style={settingsStyles.settingsLead}>
        Set a daily repeating "Do Not Disturb" period.
      </Text>

      <CollapsableComponent
        title={'Do Not Disturb'}
        toggled={this.state.donotdisturbEnabled}
        onToggle={(value) => this.setState({donotdisturbEnabled: value})}
        childComponent={
          <View>
            <TimeIntervalMenu
            fromDate={this.state.donotdisturbFrom}
            onChangeFromDate={(fromDate) => {
              this.setState({donotdisturbFrom: fromDate.toISOString()})
            }}
            toDate={this.state.donotdisturbTo}
            onChangeToDate={(toDate) => {
              this.setState({donotdisturbTo: toDate.toISOString()})
            }}/>
          </View>
      }/>

      </View>
    )
  }

  _snoozeComponent() {
    const snoozeTitle = this.state.notificationsSnoozed? "Notifications Snoozed": "Snooze Notifications"

    return(
      <View>
        <Text style={settingsStyles.settingsLead}>
          Want to pause notifications for a bit?
        </Text>
        <TogglableComponent
          title={snoozeTitle}
          toggled={this.state.notificationsSnoozed}
          style={settingsStyles.row, {height: 44}}
          onToggle={(value) => {
            if (value === true) {

              this._showSnoozeSheet((minutes) => {
                const snoozed = (minutes > 0)
                var state = { notificationsSnoozed: snoozed }
                if (snoozed) {
                  state.snoozedUntil = futureDate(0, minutes).toISOString()
                }

                this.setState({...state})
              })
            } else {
              this.setState({notificationsSnoozed: false})
            }
          }}/>
      </View>
    )
  }

  _showSnoozeSheet(onComplete) {
    const options = Object.keys(this.snoozeOptions)

    ActionSheetIOS.showActionSheetWithOptions({
      options: options,
      cancelButtonIndex: options.length - 1,
    },
    (buttonIndex) => onComplete(Object.values(this.snoozeOptions)[buttonIndex]) )

  }

}
