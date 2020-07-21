import { Alert, Linking } from 'react-native';
import RNIap from 'react-native-iap';
import AsyncStorage from '@react-native-community/async-storage';

import {
  request, requestMultiple,
  check, checkMultiple,
  checkNotifications, requestNotifications,
  PERMISSIONS, RESULTS
} from 'react-native-permissions';

export const isUserSubscriptionActive = (subscriptionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await RNIap.initConnection();
      // console.log('result', result);
    } catch (err) {
      console.log('init connection error', err.code, err.message);
      resolve(false);
    }

    try {
      RNIap.getAvailablePurchases()
        .then((res) => {
            console.log('availablePurchases', res);          
            if (res !== null && res.length > 0) {
              const subscription = res.find((element) => subscriptionId === element.productId);
              console.log('subscription', subscription);
              if (subscription) {              
                resolve(true);
              }
              else {
                resolve(false);
              }
            } else {
              resolve(false);
            }
          })
          .catch((err) => {
            console.log('get available purchases error', err)
            resolve(false);
          });
    }
    catch (err) {
      console.log('get available purchase error', err.code, err.message);
      resolve(false);
    }
  })
}

export const watchdogTimer = () => {
  setInterval(() => {
    //console.log('permission checking...')
    check(PERMISSIONS.IOS.CAMERA).then(
      (result) => {
        if (result != RESULTS.GRANTED) {
          console.log('camera permission denied');
          Linking.openSettings().then(() => { }).catch((err) => { console.log('open setting err', err) })
        }
      },
    );
    check(PERMISSIONS.IOS.MICROPHONE).then(
      (result) => {
        if (result != RESULTS.GRANTED) {
          console.log('microphone permission denied');
          Linking.openSettings().then(() => { }).catch((err) => { console.log('open setting err', err) })
        }
      },
    );
    check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(
      (result) => {
        if (result != RESULTS.GRANTED) {
          console.log('location permission denied');
          Linking.openSettings().then(() => { }).catch((err) => { console.log('open setting err', err) })
        }
      },
    );
    checkNotifications().then(({ status, settings }) => {
      if (status != RESULTS.GRANTED) {
        console.log('notification permission denied');
        Linking.openSettings().then(() => { }).catch((err) => { console.log('open setting err', err) })
      }
    });
  }, 2000);
}