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

export default class ClientInviteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      clientFullname: '',
      clientEmail: '',
      clientTelephone: ''
    }
  }

  componentDidMount() {

  }

  validateEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(this.state.clientEmail);
  }

  formatTelephone = () => {
    var { clientTelephone } = this.state;
    var formatTelephone = '(';
    formatTelephone += clientTelephone.substr(0, 3);
    formatTelephone += ') ';
    formatTelephone += clientTelephone.substr(3, 3);
    formatTelephone += ' - ';
    formatTelephone += clientTelephone.substr(6, 4);

    return formatTelephone; //(305) 900 - 7270
  }

  onContinue = async () => {    
    if (this.state.clientFullname == '') {
      Alert.alert('Please Enter Client First and Last Name');
      return;
    }
    if (!this.state.clientFullname.includes(' ')) {
      Alert.alert('Please Enter Client First and Last Name');
      return;
    }
    if (this.state.clientEmail == '') {
      Alert.alert('Please Enter Client Email Address');
      return;
    }
    if (!this.validateEmail()) {
      Alert.alert('Please Enter A Valid Client Email Address');
      return;
    }
    if (this.state.clientTelephone == '') {
      Alert.alert('Please Enter Client Telephone Number');
      return;
    }
    if (this.state.clientTelephone.length < 10) {
      Alert.alert('Please Enter A Valid Client Telephone Number');
      return;
    }

    let bodyFormData = new FormData();
    bodyFormData.append('action', 'new_client_invitation');
    bodyFormData.append('account_no', LoginInfo.user_account);
    bodyFormData.append('fullname', this.state.clientFullname);
    bodyFormData.append('email', this.state.clientEmail);
    bodyFormData.append('telephone', this.formatTelephone());

    this.setState({ spinner: true });
    await postData(bodyFormData)
      .then((res) => {
        if (res.length == 0 || res[0].error) {
          Alert.alert(
            'Invite is failed. \n Please Try Again',
            '',
            [
              { text: 'OK', onPress: () => this.setState({ spinner: false }) }
            ],
          );
          return;
        }
        //console.log('post new client invite success', res);
        this.setState({ spinner: false });
        this.props.navigation.navigate('ClientShare', {clientFullname: this.state.clientFullname, clientEmail: this.state.clientEmail});
      })
      .catch((err) => {
        console.log('post new client invite error', err);
        Alert.alert(
          'Invite is failed. \n Please Try Again',
          '',
          [
            { text: 'OK', onPress: () => this.setState({ spinner: false }) }
          ],
        );
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <View style={styles.headerContainer}>
          <Header title={'NEW CLIENT INVITATION'} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.goBack(null)} />
        </View>
        <View style={styles.txtContainer}>
          <Text style={styles.txt}>
            To Invite Your Clients to Download
            {'\n'}
            Open House Plus™
            {'\n'}
            Please Enter Your Client Information
          </Text>
        </View>
        <View style={styles.mainContainer}>
          <TextInput
            style={styles.inputBox}
            autoFocus={true}
            autoCapitalize='none'
            placeholder={'Client First and Last Name'}
            placeholderTextColor={Colors.passiveTxtColor}
            value={this.state.clientFullname}
            onChangeText={(text) => this.setState({ clientFullname: text })}
          />
          <TextInput
            style={styles.inputBox}
            autoCapitalize='none'
            placeholder={'Client Email Address'}
            placeholderTextColor={Colors.passiveTxtColor}
            value={this.state.clientEmail}
            onChangeText={(text) => this.setState({ clientEmail: text })}
          />
          {/* <TextInput
            style={styles.inputBox}
            autoCapitalize='none'
            keyboardType={'numeric'}
            placeholder={'Client Telephone Number'}
            placeholderTextColor={Colors.passiveTxtColor}
            value={this.state.clientTelephone}
            onChangeText={(text) => this.setState({ clientTelephone: text })}
          /> */}
          <TextInputMask
            refInput={ref => { this.input = ref }}
            style={styles.inputBox}
            keyboardType={'numeric'}
            placeholder='Client Telephone Number'
            placeholderTextColor={Colors.passiveTxtColor}
            value={this.state.clientTelephone}
            onChangeText={(formatted, extracted) => {
              this.setState({ clientTelephone: extracted });
            }}
            mask={"+1 ([000]) [000] - [0000]"}
          />

          <View style={styles.btnContainer}>
            <Button btnTxt='CONTINUE' btnStyle={{ width: '100%', height: '100%', color: 'blue', fontSize: RFPercentage(1.8) }} onPress={() => this.onContinue()} />
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
    width: '90%',
    height: '14%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',    
  },
  txt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
    textAlign: 'center',
    lineHeight: 22
  },
  mainContainer: {
    width: '100%',
    height: '78%',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderTopWidth: normalize(0.5, 'height'),
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
  btnContainer: {
    width: '85%',
    height: normalize(40, 'height'),
    marginTop: normalize(25, 'height')
  }
});