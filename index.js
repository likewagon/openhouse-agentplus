import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';
var PushNotification = require("react-native-push-notification");
import PushNotificationIOS from "@react-native-community/push-notification-ios";

messaging().setBackgroundMessageHandler(async remoteMessage => {
  //console.log('Message handled in the background!', remoteMessage);  

  // PushNotification.localNotification({
  //   title: 'Open House Notification',
  //   message: remoteMessage.data.body,
  // });

  PushNotificationIOS.presentLocalNotification({
    alertTitle: 'Open House Notification',
    alertBody: remoteMessage.data.body
  })
});

//AppRegistry.registerComponent(appName, () => App);

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}
AppRegistry.registerComponent(appName, () => HeadlessCheck);