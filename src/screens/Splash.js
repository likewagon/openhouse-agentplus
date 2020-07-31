import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
  Text,
  Image,
  TextInput,
  Alert,
  Linking,
  TouchableOpacity,
  Dimensions,
  Platform,
  ImageBackground,
} from "react-native";
import normalize from "react-native-normalize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import GetLocation from 'react-native-get-location';
import AsyncStorage from '@react-native-community/async-storage';
import KeyboardManager from 'react-native-keyboard-manager';

import {
  request, requestMultiple,
  check, checkMultiple,
  checkNotifications, requestNotifications,
  PERMISSIONS, RESULTS
} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
var PushNotification = require("react-native-push-notification");
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import BackgroundFetch from 'react-native-background-fetch';

import {
  BrowseCard,
  Button,
  CallCard,
  Header,
  LabelTag,
  PropertyCard,
  SearchBox,
  SideMenu,
  SignModal,
} from '@components';
import { Colors, Images, LoginInfo, RouteParam } from '@constants';
import { watchdogTimer } from '@constants';

import { postData, getReviewGeoForApple, getLiveInfo } from '../api/rest';

BackgroundFetch.configure({
  minimumFetchInterval: 15,
  stopOnTerminate: false,
  startOnBoot: true
}, () => {
  //console.log("[js] Received background-fetch event");
  BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
}, (error) => {
  //console.log("[js] RNBackgroundFetch failed to start");
});

BackgroundFetch.status((status) => {
  switch (status) {
    case BackgroundFetch.STATUS_RESTRICTED:
      //console.log("BackgroundFetch restricted");
      break;
    case BackgroundFetch.STATUS_DENIED:
      //console.log("BackgroundFetch denied");
      break;
    case BackgroundFetch.STATUS_AVAILABLE:
      //console.log("BackgroundFetch is enabled");
      break;
  }
});

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoTxt: 'In-Person & Virtual \n Digital Sign-in Platform',
      geoSettingVisible: false,
      pnSettingVisible: false
    }

    this.keyboardManager();
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', this.componentDidFocus.bind(this));
  }

  async componentDidFocus() {
    let res = await getReviewGeoForApple();
    if (res) {
      RouteParam.isOnAppleReview = res[0].under_review_by_apple;
      if (RouteParam.isOnAppleReview) {
        LoginInfo.latitude = res[0].user_latitude;
        LoginInfo.longitude = res[0].user_longitude;        
        this.isLoggedInProc();
      }
      else {
        this.requestCameraMicroPhonePermission()
          .then(() => {
            //this.requestLocation();

            // remove later
            this.requestNotification();
          })
          .catch((err) => {
            //console.log('request camera and microphone error', err);
          })
      }
    };
  }

  componentWillMount() {
    //if (this.focusListener) this.focusListener.remove();
  }

  keyboardManager = () => {
    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
      KeyboardManager.setEnableDebugging(false);
      KeyboardManager.setKeyboardDistanceFromTextField(10);
      KeyboardManager.setPreventShowingBottomBlankSpace(true);
      KeyboardManager.setEnableAutoToolbar(true);
      KeyboardManager.setToolbarDoneBarButtonItemText("Done");
      KeyboardManager.setToolbarManageBehaviour(0);
      KeyboardManager.setToolbarPreviousNextButtonEnable(false);
      KeyboardManager.setShouldToolbarUsesTextFieldTintColor(false);
      KeyboardManager.setShouldShowTextFieldPlaceholder(true);
      KeyboardManager.setShouldShowToolbarPlaceholder(true);
      KeyboardManager.setOverrideKeyboardAppearance(false);
      KeyboardManager.setShouldResignOnTouchOutside(true);
      KeyboardManager.resignFirstResponder();
      KeyboardManager.isKeyboardShowing()
        .then((isShowing) => {
        });
    }
  }

  requestCameraMicroPhonePermission = () => {
    return new Promise((resolve, reject) => {
      requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]).then(
        (statuses) => {
          //console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
          //console.log('Microphone', statuses[PERMISSIONS.IOS.MICROPHONE]);
          resolve();
        },
      ).catch((err) => {
        reject(err);
      })
    })
  }

  requestLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 150000,
    })
      .then(location => {
        LoginInfo.latitude = location.latitude;
        LoginInfo.longitude = location.longitude;

        this.requestNotification();
      })
      .catch(ex => {
        this.setState({ geoSettingVisible: true });
        GetLocation.openAppSettings();
      });
  }

  async requestNotification() {
    const authStatus = await messaging().requestPermission({
      alert: true,
      badge: true,
      sound: true
    });
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;   

    if (enabled) {
      var fcmToken = await messaging().getToken();
      LoginInfo.fcmToken = fcmToken;
      //console.log('fcmToken', fcmToken);

      messaging().onMessage(async remoteMessage => {
        //console.log('notification arrived:', remoteMessage);
        if(remoteMessage.data == null || remoteMessage.data == undefined) return;         
        if (Platform.OS === 'android') {
          PushNotification.localNotification({
            title: remoteMessage.data.title,
            message: remoteMessage.data.body
          });
        }
        else {
          PushNotificationIOS.presentLocalNotification({
            alertTitle: remoteMessage.data.title,
            alertBody: remoteMessage.data.body
          })
        }

        if (remoteMessage.data.propertyNo) {
          //console.log('livecall notification on foreground');
          setTimeout(() => {
            Alert.alert(
              remoteMessage.data.alertTitle,
              remoteMessage.data.alertBody,
              [
                { text: 'Yes', onPress: () => this.onLiveCallYes(remoteMessage.data.propertyNo) },
                { text: 'No', onPress: () => { } },
              ],
              {
                cancelable: true
              }
            )
          }, 1500);
        }
      });

      messaging().onNotificationOpenedApp(remoteMessage => {
        //console.log('notification caused app to open from background state:', remoteMessage.data);
        if(remoteMessage.data == null || remoteMessage.data == undefined) return;
        if (remoteMessage.data.propertyNo) {
          //console.log('livecall notification on background');          
          this.onLiveCallYes(remoteMessage.data.propertyNo);
        }
      });      

      this.isLoggedInProc();

      try {
        watchdogTimer();
      }
      catch (err) {
        //console.log('permission watchdog error', err);
      }
    }
    else {
      //console.log('Authorization status: disabled');
      this.setState({ pnSettingVisible: true });
      Linking.openSettings();
    }
  }

  onLiveCallYes = (propertyNo) => {
    var param = {
      user_account: LoginInfo.user_account,
      user_fullname: LoginInfo.fullname,
      user_latitude: LoginInfo.latitude,
      user_longitude: LoginInfo.longitude,
      property_recordno: propertyNo
    };
    //console.log('live info param', param);

    getLiveInfo(param)
      .then((res) => {
        //console.log('live info', res);
        RouteParam.liveInfo = res[0];
        if (RouteParam.liveInfo.error === undefined) {
          this.props.navigation.navigate('Main', { screen: 'LiveCall' });
        }
      })
      .catch((err) => {
        //console.log('get live info error', err);
      })
  }

  isLoggedInProc = () => {
    AsyncStorage.getItem('LoginInfo')
      .then(async (loginInfo) => {
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
          LoginInfo.user_status = info.user_status;

          this.submit();
        }
        else {
          //console.log('no login info saved');
          // setTimeout(() => { this.props.navigation.navigate('Auth') }, 2000);
          // remove later
          this.submit();
        }
      })
      .catch((err) => {
        //console.log('get login info error', err);
        setTimeout(() => { this.props.navigation.navigate('Auth') }, 2000);
      })
  }

  submit = async () => {
    // remove later
    LoginInfo.uniqueid = 'askdfjasdjflasdjflk';
    LoginInfo.fullname = 'Anthony Robinson';
    LoginInfo.email = 'kelloggsx@gmail.com';
    LoginInfo.telephone = '+13059007270';
    LoginInfo.photourl = '';
    LoginInfo.providerid = 'google';
    LoginInfo.title = 'Licensed Real Estate Salesperson';
    LoginInfo.company = 'Keller Williams';
    // LoginInfo.email_verified = 1;
    // LoginInfo.phone_verified = 1;
    LoginInfo.latitude = 40.776611;
    LoginInfo.longitude = -73.345718;
    LoginInfo.user_account = 1;
    /////////////////

    let bodyFormData = new FormData();
    bodyFormData.append('action', 'login');
    bodyFormData.append('uniqueid', LoginInfo.uniqueid);
    bodyFormData.append('fullname', LoginInfo.fullname);
    bodyFormData.append('email', LoginInfo.email);
    bodyFormData.append('telephone', LoginInfo.telephone);
    bodyFormData.append('photourl', LoginInfo.photourl);
    bodyFormData.append('providerid', LoginInfo.providerid);
    // bodyFormData.append('email_verified', LoginInfo.email_verified);
    // bodyFormData.append('phone_verified', LoginInfo.phone_verified);
    bodyFormData.append('fcmToken', LoginInfo.fcmToken);
    bodyFormData.append('user_latitude', LoginInfo.latitude);
    bodyFormData.append('user_longitude', LoginInfo.longitude);
    bodyFormData.append('appid', 'com.ecaptureinc.agentplus');
    bodyFormData.append('title', 'CEO');
    bodyFormData.append('user_companyname', 'ecapture,inc.');

    await postData(bodyFormData)
      .then((res) => {
        //console.log('post login info success', res);
        LoginInfo.user_account = res[0].user_account;
        LoginInfo.photourl = res[0].user_photourl;
        LoginInfo.fcmToken = res[0].fcmToken;
        LoginInfo.user_status = res[0].user_status;       
        
        if (LoginInfo.user_status || RouteParam.isOnAppleReview) {
          setTimeout(() => { this.props.navigation.navigate('Main') }, 2000);      
        }
        else {
          setTimeout(() => { this.props.navigation.navigate('IAP') }, 2000);
        }    
      })
      .catch((err) => {
        //console.log('post login info error', err)
      })
  }

  render() {
    return (
      <ImageBackground style={styles.container} source={Images.splashBackground}>
        {
          !this.state.geoSettingVisible && !this.state.pnSettingVisible ?
            (
              <View style={styles.modalBack}>
                <View style={{ width: '100%', height: '9%' }}></View>
                <View style={styles.logoImgContainer}>
                  <Image style={{ width: '90%', height: '90%' }} source={Images.logo} resizeMode='contain' />
                </View>
                <View style={{ width: '100%', height: '2%' }}></View>
                <View style={styles.logoNameContainer}>
                  <Text style={styles.logoName}>Open House</Text>
                  <Text style={styles.logoPlusLabel}>+</Text>
                </View>
                <View style={{ width: '100%', height: '5%' }}></View>
                <View style={styles.logoTxtContainer}>
                  <Text style={styles.logoTxt}>{this.state.logoTxt}</Text>
                </View>
                <View style={{ width: '100%', height: '7%' }}></View>
              </View>
            )
            :
            this.state.geoSettingVisible ?
              (
                <View style={styles.modalBackSetting}>
                  <View style={{ width: '100%', height: '5%' }}></View>
                  <View style={styles.logoImgContainerSetting}>
                    <Image style={{ width: '90%', height: '90%' }} source={Images.logo} resizeMode='contain' />
                  </View>
                  <View style={{ width: '100%', height: '1%' }}></View>
                  <View style={styles.logoNameContainerSetting}>
                    <Text style={styles.logoName}>Open House</Text>
                    <Text style={styles.logoPlusLabel}>+</Text>
                  </View>

                  <View style={styles.settingContainer}>
                    <View style={styles.settingTxtContainer}>
                      <Text style={{ fontFamily: 'SFProText-Regular', fontSize: RFPercentage(1.7), color: Colors.passiveTxtColor, textAlign: 'center' }}>
                        Open™
                        requires access to your geo location to operate.
                      This will enhance our ability to display properties in your area.</Text>
                    </View>
                    <View style={styles.btnContainer}>
                      <TouchableOpacity onPress={() => this.requestLocation()}>
                        <Text style={{ fontFamily: 'SFProText-Bold', fontSize: RFPercentage(1.7), color: Colors.blueColor, textAlign: 'center' }}>Allow Geo Location / Go To Settings</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
              :
              (
                <View style={styles.modalBackSetting}>
                  <View style={{ width: '100%', height: '5%' }}></View>
                  <View style={styles.logoImgContainerSetting}>
                    <Image style={{ width: '90%', height: '90%' }} source={Images.logo} resizeMode='contain' />
                  </View>
                  <View style={{ width: '100%', height: '1%' }}></View>
                  <View style={styles.logoNameContainerSetting}>
                    <Text style={styles.logoName}>Open House</Text>
                    <Text style={styles.logoPlusLabel}>+</Text>
                  </View>

                  <View style={styles.settingContainer}>
                    <View style={styles.settingTxtContainer}>
                      <Text style={{ fontFamily: 'SFProText-Regular', fontSize: RFPercentage(1.7), color: Colors.passiveTxtColor, textAlign: 'center' }}>
                        Agent Plus™
                        requires notification setting.
                        This will help you contact with client.</Text>
                    </View>
                    <View style={styles.btnContainer}>
                      <TouchableOpacity onPress={() => this.requestNotification()}>
                        <Text style={{ fontFamily: 'SFProText-Bold', fontSize: RFPercentage(1.7), color: Colors.blueColor, textAlign: 'center' }}>Allow Notification / Go To Settings</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
        }
      </ImageBackground>
    );
  }
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBack: {
    backgroundColor: 'rgba(255,255,255,1)',
    width: wp(75),
    height: hp(50),
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
  },
  logoImgContainer: {
    width: '88%',
    height: '46%',
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1
  },
  logoNameContainer: {
    width: '88%',
    height: '15%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    //borderWidth: 1
  },
  logoName: {
    fontFamily: 'Billabong',
    fontSize: RFPercentage(7.4),
    color: Colors.blackColor,
    //borderWidth: 1
  },
  logoPlusLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    color: '#E02020',
    alignSelf: 'center',
    marginBottom: normalize(10, 'height'),
    //borderWidth: 1
  },
  logoTxtContainer: {
    width: '88%',
    height: '11%',
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1
  },
  logoTxt: {
    fontFamily: 'SFProText-Semibold',
    fontSize: RFPercentage(2),
    color: Colors.passiveTxtColor,
    textAlign: 'center'
  },

  modalBackSetting: {
    backgroundColor: 'rgba(255,255,255,1)',
    width: wp(75),
    height: hp(60),
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
  },
  logoImgContainerSetting: {
    width: '88%',
    height: '46%',
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1
  },
  logoNameContainerSetting: {
    width: '88%',
    height: '15%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    //borderWidth: 1
  },
  logoNameGeo: {
    fontFamily: 'Billabong',
    fontSize: RFPercentage(7.4),
    color: Colors.blackColor,
    //borderWidth: 1
  },
  logoPlusLabelGeo: {
    fontFamily: 'Helvetica-Bold',
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    color: '#E02020',
    alignSelf: 'center',
    marginBottom: normalize(10, 'height'),
    //borderWidth: 1
  },
  settingContainer: {
    width: '83%',
    height: '50%',
    //borderWidth: 1
  },
  settingTxtContainer: {
    width: '100%',
    height: '37%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    //borderWidth: 1
  },
  btnContainer: {
    width: '100%',
    height: '20%',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
    //borderWidth: 1
  },
});