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

export default class OpenHouseSigninScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      fullname: '',
      email: '',
      telephone: ''
    }
  }

  componentDidMount() {

  }

  validateEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(this.state.email);
  }

  formatTelephone = () => {
    var { telephone } = this.state;
    var formatTelephone = '(';
    formatTelephone += telephone.substr(0, 3);
    formatTelephone += ') ';
    formatTelephone += telephone.substr(3, 3);
    formatTelephone += ' - ';
    formatTelephone += telephone.substr(6, 4);

    return formatTelephone; //(305) 900 - 7270
  }

  onContinue = async () => {
    if (this.state.fullname == '') {
      Alert.alert('Please Enter Your First and Last Name');
      return;
    }
    if(!this.state.fullname.includes(' ')){
      Alert.alert('Please Enter Your First and Last Name');
      return;
    }
    if (this.state.email == '') {
      Alert.alert('Please Enter Your Email');
      return;
    }
    if (!this.validateEmail()) {
      Alert.alert('Please Enter A Valid Email Address');
      return;
    }
    if (this.state.telephone == '') {
      Alert.alert('Please Enter Your Telephone Number');
      return;
    }
    if (this.state.telephone.length < 10) {
      Alert.alert('Please Enter A Valid Telephone Number');
      return;
    }

    // let bodyFormData = new FormData();
    // bodyFormData.append('action', '');
    // bodyFormData.append('account_no', LoginInfo.user_account);
    // bodyFormData.append('fullname', this.state.fullname);
    // bodyFormData.append('email', this.state.email);
    // bodyFormData.append('telephone', this.formatTelephone());

    // this.setState({ spinner: true });
    // await postData(bodyFormData)
    //   .then((res) => {
    //     if (res.length == 0 || res[0].error) {
    //       Alert.alert(
    //         'Signin is failed. \n Please Try Again',
    //         '',
    //         [
    //           { text: 'OK', onPress: () => this.setState({ spinner: false }) }
    //         ],
    //       );
    //       return;
    //     }
    //     console.log('attendee signin success', res);
    //     this.setState({ spinner: false });
         this.props.navigation.navigate('OpenHouseSignature');
    //   })
    //   .catch((err) => {
    //     console.log('attendee signin error', err);
    //     Alert.alert(
    //       'Signin is failed. \n Please Try Again',
    //       '',
    //       [
    //         { text: 'OK', onPress: () => this.setState({ spinner: false }) }
    //       ],
    //     );
    //   })
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <View style={styles.headerContainer}>
          <Header title={'TELL US ABOUT YOU'} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.goBack(null)} />
        </View>

        <View style={styles.mainContainer}>
          <TextInput
            style={styles.inputBox}
            autoFocus={true}
            autoCapitalize='none'
            placeholder={'Your First and Last Name'}
            placeholderTextColor={Colors.passiveTxtColor}
            value={this.state.fullname}
            onChangeText={(text) => this.setState({ fullname: text })}
          />
          <TextInput
            style={styles.inputBox}
            autoCapitalize='none'
            placeholder={'Your Email Address'}
            placeholderTextColor={Colors.passiveTxtColor}
            value={this.state.email}
            onChangeText={(text) => this.setState({ email: text })}
          />
          {/* <TextInput
            style={styles.inputBox}
            autoCapitalize='none'
            keyboardType={'numeric'}
            placeholder={'Your Telephone Number'}
            placeholderTextColor={Colors.passiveTxtColor}
            value={this.state.telephone}
            onChangeText={(text) => this.setState({ telephone: text })}
          /> */}
          <TextInputMask
            refInput={ref => { this.input = ref }}
            style={styles.inputBox}
            keyboardType={'numeric'}
            placeholder='Your Telephone Number'
            placeholderTextColor={Colors.passiveTxtColor}
            value={this.state.telephone}
            onChangeText={(formatted, extracted) => {
              this.setState({ telephone: extracted });
            }}
            mask={"+1 ([000]) [000] - [0000]"}
          />

          <View style={styles.txtContainer}>
            <Text style={styles.txt}>
              I understand that by pressing "continue", I am agreeing 
              {'\n'}
              and granting permission to be contacted via text, 
              {'\n'}
              email or phone calls by {RouteParam.propertyAgentFullname}
              {'\n'}
              any of his/her affiliates.
            </Text>
          </View>

          <View style={styles.btnContainer}>
            <Button btnTxt='CONTINUE' btnStyle={{ width: '100%', height: '100%', color: 'blue', fontSize: RFPercentage(2.7) }} onPress={() => this.onContinue()} />
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
    // borderColor: Colors.borderColor,
    // borderBottomWidth: normalize(0.5, 'height'),
  },  
  mainContainer: {
    width: '100%',
    height: '87%',
    alignItems: 'center',
    // borderColor: Colors.borderColor,
    // borderTopWidth: normalize(0.5, 'height'),
    //borderWidth: 3
  },
  inputBox: {
    width: '85%',
    height: normalize(35, 'height'),
    marginTop: normalize(25, 'height'),
    borderColor: Colors.blueColor,
    borderRadius: normalize(5),
    borderWidth: normalize(1),
    paddingLeft: normalize(10),
    color: Colors.blackColor,
    fontSize: RFPercentage(2)
  },
  txtContainer: {
    width: '100%',
    height: '18%',
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: normalize(25, 'height'),
    // borderColor: Colors.borderColor,
    // borderBottomWidth: normalize(0.5, 'height'),
    padding: normalize(18),
    //borderWidth: 1
  },
  txt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.7),
    color: Colors.blackColor,
    textAlign: 'center',
    lineHeight: 22,
    //borderWidth: 1
  },
  btnContainer: {
    width: '85%',
    height: normalize(50, 'height'),
    marginTop: normalize(25, 'height')
  }
});