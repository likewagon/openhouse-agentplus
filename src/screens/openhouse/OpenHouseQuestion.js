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
import TextInputMask from 'react-native-text-input-mask';
import Spinner from 'react-native-loading-spinner-overlay';

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

export default class OpenHouseQuestionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
    }
  }

  componentDidMount() {

  }

  onNo = () => {
    this.props.navigation.navigate('OpenHouseSignin');
  }

  onYes = () => {
    this.props.navigation.navigate('OpenHouseSignature');
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <View style={styles.headerContainer}>
          <Header title={''} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.goBack(null)} />
        </View>
        <View style={styles.txtContainer}>
          <Text style={styles.txt}>
            ARE YOU CURRENTLY
            {'\n'}
            WORKING EXCLUSIVELY
            {'\n'}
            WITH A LICENSED
            {'\n'}
            REAL ESTATE AGENT?
          </Text>
          <TouchableOpacity>
            <Text style={styles.txtLink}>
              Do you have a sign contract with a Realtor?
          </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnContainer}>
          <Button btnTxt='NO' btnStyle={{ width: '100%', height: '100%', color: 'blue', fontSize: RFPercentage(1.8) }} onPress={() => this.onNo()} />
        </View>
        <View style={styles.btnContainer}>
          <Button btnTxt='YES' btnStyle={{ width: '100%', height: '100%', color: 'blue', fontSize: RFPercentage(1.8) }} onPress={() => this.onYes()} />
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
    // borderColor: Colors.borderColor,
    // borderBottomWidth: normalize(0.5, 'height'),
  },
  txtContainer: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: Colors.borderColor,
    // borderBottomWidth: normalize(0.5, 'height'),
  },
  txt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(3),
    color: Colors.blackColor,
    textAlign: 'center',
  },
  txtLink: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(2),
    color: Colors.blueColor,
    textAlign: 'center'
  },
  btnContainer: {
    width: '85%',
    height: normalize(50, 'height'),
    alignSelf: 'center',
    marginTop: normalize(25, 'height')
  }
});