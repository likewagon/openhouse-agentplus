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
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from "react-native";
import normalize from 'react-native-normalize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Spinner from 'react-native-loading-spinner-overlay';

import ImageView from 'react-native-image-view';
import MapView, { Marker } from 'react-native-maps';

import {
  Button,
  AgentCard,
  ClientCard,
  Header,
  LabelTag,
  PropertyCard,
  SearchBox,
  SideMenu,
  SignModal,
} from '@components';

import { Colors, Images, RouteParam, LoginInfo } from '@constants';
import { getContentByAction, postData } from '../../api/rest';

export default class OpenHouseHomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      spinner: false,
    }
  }

  componentDidMount() {

  } 

  onLock = () => {
    Alert.alert(
      'Please Confirm',
      'Are you sure you want the end this In-Person Open House?',
      [
        { text: 'Yes', onPress: () => this.props.navigation.goBack(null) },
        { text: 'No', onPress: () => { } },
      ],
      {
        cancelable: true
      }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <ImageBackground style={styles.propertyImgBack} source={{ uri: RouteParam.property.property_main_photo_url }}>
          <TouchableOpacity style={styles.lockContainer} onPress={()=>this.onLock()}>
            <Image style={styles.lock} source={Images.btnLock} resizeMode='cover' />
          </TouchableOpacity>
          <View style={styles.btnContainer}>
            <Button btnTxt='PLEASE SIGN IN' btnStyle={{ width: '100%', height: '100%', color: 'blue', fontSize: RFPercentage(2.7) }} onPress={() => this.props.navigation.navigate('OpenHouseQuestion')} />
          </View>
        </ImageBackground>
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
    height: height,
  },
  propertyImgBack: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    //borderWidth: 1
  },
  lockContainer: {
    width: '85%',
    alignItems: 'flex-end',
    alignSelf: 'center',
    marginTop: normalize(40, 'height'),
    //borderWidth: 1
  },
  lock: {
    width: normalize(30),
    height: normalize(30),
    //borderWidth: 1
  },
  btnContainer: {
    width: '80%',
    height: normalize(50, 'height'),
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: normalize(40, 'height'),
    //borderWidth: 1
  }
});

