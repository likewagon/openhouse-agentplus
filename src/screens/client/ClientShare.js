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
  ActivityIndicator,
  Dimensions,
  Platform,
  ImageBackground,
} from "react-native";
import normalize from "react-native-normalize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Spinner from 'react-native-loading-spinner-overlay';
import Share from 'react-native-share';

import {
  Button,
  AgentCard,
  Header,
  LabelTag,
  PropertyCard,
  SearchBox,
  SideMenu,
  SignModal,
} from '@components';
import { Colors, Images, LoginInfo, RouteParam } from '@constants';
import { getContentByAction, postData } from '../../api/rest';

export default class ClientShareScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      shareOption: {
        title: 'Agent Plus™',
        message: this.props.route.params.clientFullname + ' was invited by ' + LoginInfo.fullname,
        url: 'https://apps.apple.com/us/app/open-houses-and-virtual-tours/id1517663733',
        social: '',
        subject: 'Agent Plus™',
        email: this.props.route.params.clientEmail
      }
    }
  }

  componentDidMount() {

  }

  onShare = (socialKind) => {
    //supported: facebook, whatsapp, instagram, email, pinterest, snapchat, messenger, linkedin, 
    //not supported: youtube, twitter, tiktok
    if (socialKind == 'youtube' || socialKind == 'twitter' || socialKind == 'tiktok') {
      this.unSupportedShare(socialKind);
    }
    else {
      this.supportedShare(socialKind);
    }
  }

  supportedShare = (socialKind) => {
    var { shareOption } = this.state;
    shareOption.social = socialKind;
    setTimeout(() => {
      Share.shareSingle(shareOption);
    }, 500);
  }

  unSupportedShare = (socialKind) => {

  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <View style={styles.headerContainer}>
          <Header title={'CLIENT REGISTERED'} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.navigate('ClientList')} />
        </View>
        <View style={styles.txtContainer}>
          <Text style={styles.txt}>
            Congratulations! Your Client Was Successfully
            {'\n'}
            Registered With Open House Plus™
            {'\n'}{'\n'}
            Please Share Open House Plus™ With Your Client.
            {'\n'}
            Once They Download The Application,
            {'\n'}
            You Will Be Notified.
          </Text>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.lineContainer}>
            <TouchableOpacity onPress={() => this.onShare('messenger')}>
              <Image style={styles.shareImg} source={Images.btnMessenger} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onShare('facebook')}>
              <Image style={styles.shareImg} source={Images.btnFacebook} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onShare('email')}>
              <Image style={styles.shareImg} source={Images.btnEmail} resizeMode='cover' />
            </TouchableOpacity>
          </View>

          <View style={styles.lineContainer}>
            <TouchableOpacity onPress={() => this.onShare('instagram')}>
              <Image style={styles.shareImg} source={Images.btnInstagram} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onShare('linkedin')}>
              <Image style={styles.shareImg} source={Images.btnLinkedin} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onShare('youtube')}>
              <Image style={styles.shareImg} source={Images.btnYoutube} resizeMode='cover' />
            </TouchableOpacity>
          </View>

          <View style={styles.lineContainer}>
            <TouchableOpacity onPress={() => this.onShare('twitter')}>
              <Image style={styles.shareImg} source={Images.btnTwitter} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onShare('snapchat')}>
              <Image style={styles.shareImg} source={Images.btnSnapchat} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onShare('pinterest')}>
              <Image style={styles.shareImg} source={Images.btnPinterest} resizeMode='cover' />
            </TouchableOpacity>
          </View>

          <View style={styles.lineContainer}>
            <TouchableOpacity onPress={() => this.onShare('tiktok')}>
              <Image style={styles.shareImg} source={Images.btnTiktok} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onShare('whatsapp')}>
              <Image style={styles.shareImg} source={Images.btnWhatsapp} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }}>
              <Image style={styles.shareImg} /*source={Images.btn}*/ resizeMode='cover' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,1)",
    flex: 1,
    width: width,
    height: height
  },
  headerContainer: {
    width: '100%',
    height: normalize(70, 'height'),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
  },
  txtContainer: {
    width: '93%',
    height: '22%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
  },
  txt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.9),
    color: Colors.blackColor,
    textAlign: 'center',
    lineHeight: 22
  },
  mainContainer: {
    width: '100%',
    height: '68%',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderTopWidth: normalize(0.5, 'height'),
    paddingTop: normalize(35, 'height'),
    // borderColor: '#ff0000',
    // borderWidth: 5
  },
  lineContainer: {
    width: '75%',
    height: '20%',//normalize(85, 'height'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //borderWidth: 1
  },
  shareImg: {
    width: normalize(65),
    height: normalize(65),
    //borderWidth: 1
  },
});