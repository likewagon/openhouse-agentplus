import React, {Component} from 'react';
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
  ImageBackground,
} from 'react-native';
import normalize from 'react-native-normalize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import Spinner from 'react-native-loading-spinner-overlay';

import ImageView from 'react-native-image-view';
import MapView, {Marker} from 'react-native-maps';

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

import {Colors, Images, RouteParam, LoginInfo} from '@constants';
import {getContentByAction, postData} from '../../api/rest';

export default class OpenHouseSignatureEndScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
    };
  }

  componentDidMount() {
    setTimeout(this.goHome, 2000);
  }

  goHome = () => {
    this.props.navigation.navigate('OpenHouseHome');
  };

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <ImageBackground
          style={styles.propertyImgBack}
          source={{uri: RouteParam.property.property_main_photo_url}}>
          <View style={styles.thankyouContainer}>
            <Text style={styles.thankyouTxt}>
              Thank You
              {'\n'}
              For Registering!
            </Text>
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
    backgroundColor: 'rgba(255,255,255,1)',
    flex: 1,
    width: width,
    height: height,
  },
  propertyImgBack: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    //borderWidth: 1
  },
  thankyouContainer: {
    width: '90%',
    height: '20%',
    backgroundColor: Colors.whiteColor,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: Colors.blueColor,
    borderWidth: normalize(1),
  },
  thankyouTxt: {
    fontFamily: 'Billabong',
    fontSize: RFPercentage(5.5),
    color: Colors.blackColor,
    textAlign: 'center',
    //borderWidth: 1,
  },
});
