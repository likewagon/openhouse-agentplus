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
  TouchableOpacity,
  TouchableHighlight,
  Linking,
  ImageBackground,
  Dimensions
} from "react-native";
import normalize from "react-native-normalize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/FontAwesome';
Platform.OS === 'ios' ? Icon.loadFont() : '';

import { Colors, Images, LoginInfo, RouteParam } from '@constants';
import { Button } from '@components';

export default class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  componentDidMount = () => {

  }

  onListing = () => {
    this.props.navigation.navigate('AgentStack');
    this.props.onToggleMenu();
  }

  onClient = () => {
    this.props.navigation.navigate('ClientStack');
    this.props.onToggleMenu();
  }

  onMlsSetting = () => {
    this.props.navigation.navigate('SettingStack');
    this.props.onToggleMenu();
  }

  onPreference = () => {
    this.props.navigation.navigate('SettingStack', { screen: 'Preference' });
    this.props.onToggleMenu();
  }

  onTechnicalSupport = () => {
    Linking.openURL('mailto:support@openhousemarketingsystem.com');
  }

  render() {
    return (
      <ImageBackground style={styles.container} source={Images.sideBlurBack}>
        <View style={styles.sideMenuIcon}>
          <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => this.props.onToggleMenu()}>
            <Image style={{ width: '100%', height: '100%' }} source={Images.iconMenu} resizeMode='contain'></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.profileContainer}>
          <View style={styles.profileImgContainer}>
            <Image style={{ width: '100%', height: '100%', borderRadius: normalize(50) }} source={{ uri: LoginInfo.photourl }} resizeMode='stretch' />
          </View>
          <Text style={styles.userName}>{LoginInfo.fullname}</Text>
          <Text style={styles.userTitle}>{LoginInfo.title}</Text>
          <Text style={styles.userCompany}>{LoginInfo.company}</Text>
        </View>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={[styles.menuItemContainer, { marginTop: normalize(10, 'height') }]} onPress={() => this.onListing()}>
            <Text style={styles.menuItemTxt}>LISTINGS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItemContainer} onPress={() => this.onClient()}>
            <Text style={styles.menuItemTxt}>CLIENTS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItemContainer} onPress={() => this.onMlsSetting()}>
            <Text style={styles.menuItemTxt}>MLS SETTINGS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItemContainer} onPress={() => this.onPreference()}>
            <Text style={styles.menuItemTxt}>PREFERENCE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItemContainer} onPress={() => this.onTechnicalSupport()}>
            <Text style={styles.menuItemTxt}>TECHNICAL SUPPORT</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.btnContainer}>
          <Button btnTxt='Log out' btnStyle={{ width: width * 0.7, height: normalize(50, 'height'), color: 'blue', fontSize: RFPercentage(1.8) }} onPress={() => this.props.onLogout()} />
        </View>
      </ImageBackground>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object.isRequired,
  onToggleMenu: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,    
    top: normalize(-25, 'height'),
    width: width * 0.8,
    //height: height,
    height: height + normalize(70, 'height'),    
    zIndex: 1
  },
  sideMenuIcon: {
    width: normalize(22),
    height: normalize(20),
    position: 'absolute',
    top: normalize(67, 'height'),
    left: normalize(12),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1
  },
  profileContainer: {
    width: '80%',
    //height: '20%',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: normalize(80, 'height'),
    //borderWidth: 1,
  },
  profileImgContainer: {
    width: normalize(64),
    height: normalize(64),
    borderRadius: normalize(50),
    borderColor: Colors.borderColor,
    borderWidth: normalize(1)
  },
  userName: {
    fontFamily: 'SFProText-Semibold',
    fontSize: RFPercentage(1.8),
    color: Colors.blackColor,
    marginTop: normalize(10, 'height')
  },
  userTitle: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.blackColor,
    marginTop: normalize(10, 'height')
  },
  userCompany: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.blackColor,
    marginTop: normalize(3, 'height')
  },
  menuContainer: {
    width: '100%',
    height: '43%',
    justifyContent: 'space-around',
    marginTop: normalize(20, 'height'),
    borderColor: Colors.borderColor,
    borderTopWidth: normalize(1, 'height'),
    paddingTop: normalize(20, 'height'),
    //borderWidth: 1
  },
  menuItemContainer: {
    width: '100%',
    height: '11%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(3, 'height'),
    //borderWidth: 1
  },
  menuItemTxt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
    //borderWidth: 1
  },
  btnContainer:{
    width: '100%',
    height: '11%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(10, 'height'),
    //borderWidth: 1    
  },
});