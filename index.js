/**
 * @format
 */

import React from 'react';
import { AppRegistry, Alert } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';
var PushNotification = require("react-native-push-notification");
import PushNotificationIOS from '@react-native-community/push-notification-ios';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  Alert.alert('BACKGROUND', JSON.stringify(remoteMessage));

  // PushNotification.localNotification({
  //   title: 'notification.title',
  //   message: 'notification.body!',
  // });
  PushNotificationIOS.presentLocalNotification({
    alertTitle: 'Open House Notification',
    alertBody: 'Client Picked You As Preferred Agent'
  })
});

messaging().onNotificationOpenedApp(remoteMessage => {
  console.log(
    'Notification caused app to open from background state:',
    remoteMessage.notification,
  );
  Alert.alert(
    'Notification caused app to open from background state:',
    JSON.stringify(remoteMessage),
  );
});

// Check whether an initial notification is available
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage.notification,
      );
      Alert.alert(
        'Notification caused app to open from quit state:',
        JSON.stringify(remoteMessage),
      );
    }
  });


AppRegistry.registerComponent(appName, () => App);