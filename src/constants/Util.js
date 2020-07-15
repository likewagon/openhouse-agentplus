import { Alert } from 'react-native';
import RNIap from 'react-native-iap';

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
            const subscription = res.find((element) => {
              return subscriptionId === element.productId;
            });
            console.log('subscription', subscription);
            if (subscription) {
              // check for the autoRenewingAndroid flag. If it is false the sub period is over
              resolve(subscription["autoRenewingIOS"] == true);
            }
            else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          console.log('getAvailablePurchases error', err)
          resolve(false);
        });
    }
    catch (err) {
      console.log(err.code, err.message);
      Alert.alert('Available Purchase Error', err.message);
      resolve(false);
    }
  })
}
