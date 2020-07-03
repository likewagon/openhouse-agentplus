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
import { Colors, Images, LoginInfo } from '@constants';

import { firebaseInit } from '../api/Firebase';
import { postData, getReviewGeoForApple } from '../api/rest';

import messaging from '@react-native-firebase/messaging';
messaging().onMessage(async remoteMessage => {
  //console.log('remotemessage', remoteMessage);
  Alert.alert('Open House Plus Notification!', remoteMessage.data.body);
});

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoTxt: 'In-Person & Virtual \n Digital Sign-in Platform',
      geoSettingVisible: false
    }

    this.keyboardManager();
    //firebaseInit();
  }

  async componentDidMount() {
    // let res = await getReviewGeoForApple();    
    // if(res){
    //   if(res[0].under_review_by_apple){
    //     LoginInfo.latitude = res[0].user_latitude;
    //     LoginInfo.longitude = res[0].user_longitude;
    //     this.isLoggedInProc();
    //   }
    //   else{
    //     this.initialGetLocation();
    //   }
    // }    

    this.requestUserMessagingPermission();
  }

  async requestUserMessagingPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      //console.log('Authorization status:', authStatus);

      messaging()
        .getToken()
        .then(token => {
          console.log('my token', token);
          LoginInfo.fcmToken = token;

          // skip
          this.submit();
        });
    }
    else {
      console.log('Authorization status: disabled');
      LoginInfo.fcmToken = '';

      // skip
      this.submit();
    }
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
      KeyboardManager.setShouldShowTextFieldPlaceholder(true); // deprecated, use setShouldShowToolbarPlaceholder
      KeyboardManager.setShouldShowToolbarPlaceholder(true);
      KeyboardManager.setOverrideKeyboardAppearance(false);
      KeyboardManager.setShouldResignOnTouchOutside(true);
      KeyboardManager.resignFirstResponder();
      KeyboardManager.isKeyboardShowing()
        .then((isShowing) => {
        });
    }
  }

  initialGetLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 150000,
    })
      .then(location => {
        LoginInfo.latitude = location.latitude;
        LoginInfo.longitude = location.longitude;

        this.isLoggedInProc();
      })
      .catch(ex => {
        this.setState({ geoSettingVisible: true })
      });
  }

  _requestLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 150000,
    })
      .then(location => {
        LoginInfo.latitude = location.latitude;
        LoginInfo.longitude = location.longitude;
                
        this.isLoggedInProc();
      })
      .catch(ex => {
        GetLocation.openAppSettings();
      });
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
          LoginInfo.email_verified = info.email_verified;
          LoginInfo.phone_verified = info.phone_verified;
          LoginInfo.fcmToken = info.fcmToken;
          LoginInfo.user_account = info.user_account;          
          LoginInfo.user_photourl = info.user_photourl;
          
          this.submit();          
        }
        else {
          setTimeout(() => { this.props.navigation.navigate('Auth') }, 2000);
        }
      })
      .catch((err) => {
        console.log('get login info error', err);
        setTimeout(() => { this.props.navigation.navigate('Auth') }, 2000);
      })
  }

  submit = async () => {
    // skip
    LoginInfo.uniqueid = 'askdfjasdjflasdjflk';
    LoginInfo.fullname = 'Danielle Reese';
    LoginInfo.email = 'danielle@daniellereesegroup.com';
    LoginInfo.telephone = '+19144972987';
    LoginInfo.providerid = 'apple';
    LoginInfo.title = 'Licensed Real Estate Salesperson';
    LoginInfo.company = 'Keller Williams';
    // LoginInfo.email_verified = 1;
    // LoginInfo.phone_verified = 1;
    // LoginInfo.latitude = 40.776611;
    // LoginInfo.longitude = -73.345718;
    LoginInfo.user_account = 2;
    LoginInfo.user_photourl = '';        
    // ///////////////

    let bodyFormData = new FormData();
    bodyFormData.append('action', 'login');
    bodyFormData.append('uniqueid', LoginInfo.uniqueid);
    bodyFormData.append('fullname', LoginInfo.fullname);
    bodyFormData.append('email', LoginInfo.email);
    bodyFormData.append('telephone', LoginInfo.telephone);
    //bodyFormData.append('photourl', LoginInfo.photourl);
    bodyFormData.append('providerid', LoginInfo.providerid);
    // bodyFormData.append('email_verified', LoginInfo.email_verified);
    // bodyFormData.append('phone_verified', LoginInfo.phone_verified);
    bodyFormData.append('fcmToken', LoginInfo.fcmToken);
    // bodyFormData.append('user_latitude', LoginInfo.latitude);
    // bodyFormData.append('user_longitude', LoginInfo.longitude);
    bodyFormData.append('appid', 'com.ecaptureinc.agentplus');
    bodyFormData.append('title', 'CEO');
    bodyFormData.append('companyname', 'ecapture,inc.');    
    
    await postData(bodyFormData)
      .then((res) => {
        //console.log('post login info success', res);
        LoginInfo.user_account = res[0].user_account;        
        LoginInfo.user_photourl = res[0].user_photourl;
        LoginInfo.fcmToken = res[0].fcmToken;
        
        setTimeout(() => { this.props.navigation.navigate('Welcome') }, 2000);
      })
      .catch((err) => {
        console.log('post login info error', err)
      })
  }

  render() {
    return (
      <ImageBackground style={styles.container} source={Images.splashBackground}>
        {
          !this.state.geoSettingVisible ?
            (
              <View style={styles.modalBack}>
                <View style={{ width: '100%', height: '9%', /*borderWidth: 1*/ }}></View>
                <View style={styles.logoImgContainer}>
                  <Image style={{ width: '90%', height: '90%' }} source={Images.logo} resizeMode='contain' />
                </View>
                <View style={{ width: '100%', height: '2%', /*borderWidth: 1*/ }}></View>
                <View style={styles.logoNameContainer}>
                  <Text style={styles.logoName}>Open House</Text>
                  <Text style={styles.logoPlusLabel}>+</Text>
                </View>
                <View style={{ width: '100%', height: '5%', /*borderWidth: 1*/ }}></View>
                <View style={styles.logoTxtContainer}>
                  <Text style={styles.logoTxt}>{this.state.logoTxt}</Text>
                </View>
                <View style={{ width: '100%', height: '7%', /*borderWidth: 1*/ }}></View>
              </View>
            )
            :
            (
              <View style={styles.modalBackGeo}>
                <View style={{ width: '100%', height: '5%', /*borderWidth: 1*/ }}></View>
                <View style={styles.logoImgContainerGeo}>
                  <Image style={{ width: '90%', height: '90%' }} source={Images.logo} resizeMode='contain' />
                </View>
                <View style={{ width: '100%', height: '1%', /*borderWidth: 1*/ }}></View>
                <View style={styles.logoNameContainerGeo}>
                  <Text style={styles.logoName}>Open House</Text>
                  <Text style={styles.logoPlusLabel}>+</Text>
                </View>

                <View style={styles.geoSettingContainer}>
                  <View style={styles.settingTxtContainer}>
                    <Text style={{ fontFamily: 'SFProText-Regular', fontSize: RFPercentage(1.7), color: Colors.passiveTxtColor, textAlign: 'center' }}>
                      Open™
                      requires access to your geo location to operate.
                      This will enhance our ability to display properties in your area.</Text>
                  </View>
                  <View style={styles.btnContainer}>
                    <TouchableOpacity onPress={() => this._requestLocation()}>
                      <Text style={{ fontFamily: 'SFProText-Bold', fontSize: RFPercentage(1.7), color: Colors.blueColor, textAlign: 'center' }}>Allow Geo Location / Go To Settings</Text>
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

  /////////////////////////////////////////////////
  modalBackGeo: {
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
  logoImgContainerGeo: {
    width: '88%',
    height: '46%',
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1
  },
  logoNameContainerGeo: {
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
  geoSettingContainer: {
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