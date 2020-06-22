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
import Spinner from 'react-native-loading-spinner-overlay';

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
import { Colors, Images, LoginInfo, RouteParam } from '@constants';
import { getContentByAction, postData } from '../../api/rest';

export default class PropertyWithClientScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      property: this.props.route.params.property,
      clientData: [
        {
          "client_account": "39",
          "client_fullname": "Danielle Reese",
          "client_email": "123closings@gmail.com",
          "client_telephone": "(914) 497-2987",
          "client_photo_url": "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
          "client_latitude": "41.027098180204625",
          "client_longitude": "-73.75875773254012",
          "client_last_activity": "Wednesday, June 17th at 12:48PM",
          "displayorder": 1
        },
        {
          "client_account": "38",
          "client_fullname": "Anthony Robinson",
          "client_email": "kelloggsx@gmail.com",
          "client_telephone": "(305) 900-7270",
          "client_photo_url": "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
          "client_latitude": "42.776859703442035",
          "client_longitude": "-73.3456412478709",
          "client_last_activity": "Monday, June 17th at 12:46PM",
          "displayorder": 2
        },
        {
          "client_account": "37",
          "client_fullname": "Anthony Robinson",
          "client_email": "kelloggsx@gmail.com",
          "client_telephone": "(305) 900-7270",
          "client_photo_url": "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
          "client_latitude": "40.876859703442035",
          "client_longitude": "-75.3456412478709",
          "client_last_activity": "Friday, Oct 17th at 12:46PM",
          "displayorder": 3
        },
        {
          "client_account": "36",
          "client_fullname": "Anthony Robinson",
          "client_email": "kelloggsx@gmail.com",
          "client_telephone": "(305) 900-7270",
          "client_photo_url": "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
          "client_latitude": "39.776859703442035",
          "client_longitude": "-69.3456412478709",
          "client_last_activity": "Tuesday, June 5th at 12:46PM",
          "displayorder": 4
        },
      ],
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <View style={styles.headerContainer}>
          <Header title={'MLS. ' + this.state.property.property_mlsnumber} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.goBack(null)} rightIcon={Images.iconLocation} onPressRightIcon={() => this.props.navigation.navigate('PropertyWithClientMap', { clientData: this.state.clientData })} />
        </View>
        <View style={styles.propertyContainer}>
          <PropertyCard cardStyle={{ width: width * 0.94, height: normalize(245, 'height'), marginBottom: normalize(0, 'height'), marginRight: 0 }} item={this.state.property} />
        </View>
        <ScrollView style={{ width: '100%', height: '100%' }} showsVerticalScrollIndicator={false}>
          {
            this.state.clientData.length == 0 ?
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTxt}>No Result Data</Text>
              </View>
              :
              this.state.clientData.map((each, index) => {
                return (
                  <TouchableOpacity key={index} style={styles.eachContainer}
                    onPress={() => this.onClickClient(each)}>
                    <ClientCard
                      cardStyle={{width: wp(94)}}
                      clientName={each.client_fullname}                      
                      clientImg={{ uri: each.client_photo_url }}
                      clientLastActivity={each.client_last_activity}
                    />
                  </TouchableOpacity>
                )
              })
          }
        </ScrollView>
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
  propertyContainer: {
    width: '100%',
    alignItems: 'center',
    padding: normalize(10),
  },
  eachContainer: {
    width: '100%',
    height: normalize(95),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // borderColor: Colors.borderColor,
    // borderWidth: normalize(0.5, 'height'),        
  },
  emptyContainer: {
    width: '100%',
    height: height * 0.47,
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