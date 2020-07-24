import React from 'react';
import { AppRegistry, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';
var PushNotification = require("react-native-push-notification");
import PushNotificationIOS from "@react-native-community/push-notification-ios";

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);

  if (Platform.OS === 'android') {
    PushNotification.localNotification({
      title: remoteMessage.data.title,
      message: remoteMessage.data.body,
      actions: '["Yes", "No"]',
      invokeApp: true,
    });
  }
  else {
    PushNotificationIOS.presentLocalNotification({
      alertTitle: remoteMessage.data.title,
      alertBody: remoteMessage.data.body
    });
  }
});

messaging()
  .getInitialNotification()
  .then(async (remoteMessage) => {
    console.log('Notification caused app to open from quit state at messaging:', remoteMessage);
    if (remoteMessage.data && typeof remoteMessage.data.propertyNo != undefined) {
      console.log('livecall notification on quit');

      var loginInfo = await AsyncStorage.getItem('LoginInfo');
      if (loginInfo) {
        var info = JSON.parse(loginInfo);

        LoginInfo.uniqueid = info.uniqueid;
        LoginInfo.fullname = info.fullname;
        LoginInfo.email = info.email;
        LoginInfo.telephone = info.telephone;
        LoginInfo.providerid = info.providerid;
        LoginInfo.photourl = info.photourl;
        LoginInfo.email_verified = info.email_verified;
        LoginInfo.phone_verified = info.phone_verified;
        LoginInfo.fcmToken = info.fcmToken;
        LoginInfo.user_account = info.user_account;
      }

      Alert.alert('This is waking notification for live call from closed');
    }
  })
  .catch((err) => {
    console.log('get initial notification error at messaging', err);
  })

// AppRegistry.registerComponent(appName, () => App);

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}
AppRegistry.registerComponent(appName, () => HeadlessCheck);