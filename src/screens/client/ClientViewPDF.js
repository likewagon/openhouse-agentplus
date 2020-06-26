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
  FlatList,
  Dimensions,
  Platform,
  ImageBackground,
} from "react-native";
import normalize from "react-native-normalize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { WebView } from 'react-native-webview';//ios
import PDFView from 'react-native-view-pdf';//android
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

export default class ClientViewPDFScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      client: this.props.route.params.client,
      propertyPDF: this.props.route.params.propertyPDF,
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <View style={styles.headerContainer}>
          <Header title={this.state.client.client_fullname.toUpperCase()} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.goBack(null)} />
        </View>
        <View style={styles.topContainer}>
          <View style={styles.imgContainer}>
            <Image style={styles.img} source={{ uri: this.state.client.client_photo_url }} resizeMode='stretch' />
          </View>
          <View style={styles.txtContainer}>
            <Text style={styles.txt}>Email: {this.state.client.client_email}</Text>
            <Text style={styles.txt}>Telephone: {this.state.client.client_telephone}</Text>
            <Text style={styles.txt}>Activity: {this.state.client.client_last_activity}</Text>
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>AGENCY DISCLOSURE FORM INFORMATION</Text>
          <Text style={styles.titleSubTxt}>{this.state.propertyPDF.property_address}</Text>
          <Text style={styles.titleSubTxt}>Signed on: {this.state.propertyPDF.property_signedon}</Text>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.pdfContainer}>
            <WebView source={{ uri: this.state.propertyPDF.pdf_url }} />
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
  topContainer: {
    width: '100%',
    height: '14%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
  },
  imgContainer: {
    width: '20%',
    height: '73%',
    //borderWidth: 1
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: normalize(15),
    borderColor: Colors.borderColor,
    borderWidth: normalize(0.5)
  },
  txtContainer: {
    width: '72%',
    height: '80%',
    justifyContent: 'center',
    padding: normalize(10),
    paddingTop: normalize(15),
    //borderWidth: 1
  },
  txt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.6),
    color: Colors.blackColor,
    marginBottom: normalize(5, 'height'),
    //borderWidth: 1
  },
  titleContainer: {
    width: '100%',
    height: '12%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
    padding: normalize(10)
  },
  titleTxt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.7),
    color: Colors.blackColor,
  },
  titleSubTxt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.6),
    color: Colors.blackColor,
  },
  mainContainer: {
    width: '100%',
    height: '63%',
    alignItems: 'center',
    padding: normalize(10),
    //borderWidth: 3
  },
  pdfContainer: {
    width: '100%',
    height: '95%',
    borderColor: Colors.borderColor,
    borderWidth: normalize(0.5)
  },
  emptyContainer: {
    width: '100%',
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1
  },
  emptyTxt: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 14,
    color: Colors.blackColor
  },
});