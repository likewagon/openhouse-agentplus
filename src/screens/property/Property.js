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
import { getContentByAction, postData, getLiveInfo } from '../../api/rest';

export default class PropertyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      property: {},
      propertyPhotoData: [],
      propertyPhotoDetailData: [],
      agentCard: '',
      sticky: false,
      spinner: false,
      isImageViewVisible: false,
      imageIndex: 0
    }
  }

  componentDidMount() {
    this.getProperty();
  }

  getProperty = () => {
    var propertyParam = {
      action: 'property_detail',
      account_no: LoginInfo.user_account,
      property_recordno: RouteParam.propertyRecordNo
    };

    this.setState({ spinner: true });
    getContentByAction(propertyParam)
      .then((res) => {
        //console.log(res);
        if (res.length == 0 || res[0].error) {
          this.setState({ spinner: false });
          return;
        }
        this.setState({
          property: res[0],
          spinner: false
        });

        RouteParam.propertyMainPhotoUrl = res[0].property_main_photo_url;
        RouteParam.propertyAgentFullname = res[0].property_listing_agent_fullname;
      })
      .catch((err) => {
        console.log('get property error', err);
        this.setState({ spinner: false });
      })
  }

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  handleScroll = (event) => {
    let y = event.nativeEvent.contentOffset.y;

    if (!this.state.sticky && y > 60) {
      this.setState({
        sticky: true,
      })
    }
    else if (this.state.sticky && y < 60) {
      this.setState({
        sticky: false,
      })
    }
  }
  
  onVideoMessage = async () => {
    let bodyFormData = new FormData();
    bodyFormData.append('action', 'start_live_stream');
    bodyFormData.append('account_no', LoginInfo.user_account);
    bodyFormData.append('property_no', RouteParam.propertyRecordNo);    

    await postData(bodyFormData)
      .then((res) => {
        console.log('create live call success', res);
        Alert.alert('You can have live call for this property!');
      })
      .catch((err) => {
        console.log('create live call error', err)
        Alert.alert('Live call is not applied');
      })
  }

  onEnterRoom = () => {
    var param = {
      user_account: LoginInfo.user_account,
      user_fullname: LoginInfo.fullname,
      user_latitude: LoginInfo.latitude,
      user_longitude: LoginInfo.longitude,
      property_recordno: RouteParam.propertyRecordNo
    };
    //console.log('live info param', param);

    getLiveInfo(param)
      .then((res) => {
        console.log('live info', res);
        RouteParam.liveInfo = res[0];
        if (RouteParam.liveInfo.error === undefined) {
          this.props.navigation.navigate('Main', { screen: 'LiveCall' });
        }
      })
      .catch((err) => {
        console.log('get live info error', err);
      })
  }

  render() {
    return (
      <ScrollView
        ref={ref => this.scrollRef = ref}
        style={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        onScroll={this.handleScroll}
        scrollEventThrottle={16}
      >
        {
          this.state.sticky ? (
            <View style={{ width: '100%' }}>
              <Header title={this.state.property.property_mlsnumber} titleColor={Colors.blackColor} isSticky={true} onPressBack={() => this.props.navigation.goBack(null)} />
            </View>
          )
            : <View></View>
        }
        <Spinner visible={this.state.spinner} />
        <ImageBackground style={styles.propertyImgBack} source={{ uri: this.state.property.property_main_photo_url }}>
          {
            this.state.sticky ? <View></View> :
              (
                <View style={{ width: '100%' }}>
                  <Header title={this.state.property.property_mlsnumber} titleColor={Colors.whiteColor} onPressBack={() => this.props.navigation.goBack(null)} />
                </View>
              )
          }

          {
            !this.state.spinner &&
            <View style={[styles.labelTagLine, this.state.sticky ? { marginTop: normalize(465, 'height') } : { marginTop: normalize(415, 'height') }]}>
              <LabelTag tagTxt={this.state.property.property_listing_type === 'R' ? 'For Rent' : 'For Sale'} tagStyle={{ width: normalize(85), height: normalize(25, 'height') }} />
            </View>
          }
        </ImageBackground>

        <View style={styles.featurePart}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode={'tail'}>{this.state.property.property_address1}</Text>
          {
            this.state.property.property_amount &&
            <Text style={styles.price}>{this.formatter.format(this.state.property.property_amount).split(".")[0]}</Text>
          }
          <View style={styles.tagLine}>
            <View style={styles.eachTagContainer}>
              <Image style={styles.tagImg} resizeMode='contain' source={Images.iconBlackBed} />
              <Text style={styles.tagTxt}>{this.state.property.property_bedrooms}</Text>
              <Text style={styles.tagTxt}>Beds</Text>
            </View>
            <View style={{ width: normalize(40), height: '100%', alignItems: 'center' }}>
              <Image style={{ width: '15%', height: '100%' }} source={Images.markDot} resizeMode='contain' />
            </View>
            <View style={styles.eachTagContainer}>
              <Image style={styles.tagImg} resizeMode='contain' source={Images.iconBlackBath} />
              <Text style={styles.tagTxt}>{this.state.property.property_bathrooms}</Text>
              <Text style={styles.tagTxt}>Baths</Text>
            </View>
          </View>
        </View>

        <View style={styles.btnsContainer}>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('PropertyWithClient', {property: this.state.property})}>
            <Image style={styles.eachBtn} source={Images.iconConference}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.onEnterRoom()}>
            <Image style={styles.eachBtn} source={Images.iconVideoMessage}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('OpenHouseStack')}>
            <Image style={styles.eachBtn} source={Images.iconOpen}></Image>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={()=>this.onEnterRoom()}>
            <Image style={styles.eachBtn} source={Images.iconEnterRoom}></Image>
          </TouchableOpacity> */}
          <TouchableOpacity>
            <Image style={styles.eachBtn} source={Images.iconFacebook}></Image>
          </TouchableOpacity>
        </View>

        <View style={styles.descContainer}>
          <Text style={styles.descTitle}>DESCRIPTION</Text>
          {/* <Text style={styles.descTxt}>{this.state.property.property_desc}</Text> */}
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>ADDRESS</Text>
          <Text style={styles.addressTxt}>{this.state.property.property_address1}</Text>
          <Text style={styles.addressTxt}>{this.state.property.property_city}, {this.state.property.property_state} {this.state.property.property_recordno}</Text>
        </View>

        <View style={styles.agentCardContainer}>
          <AgentCard
            title='Listed By:'
            agentName={this.state.property.property_listing_agent_fullname}
            //agentTitle={this.state.property.property_listing_agent_title}
            agentCompany={this.state.property.property_listing_agent_companyname}
            agentImg={{ uri: this.state.property.property_listing_agent_photo }}
          />
        </View>

        <View style={styles.photoContainer}>
          <Text style={styles.photoTitle}>PHOTOS</Text>
          <FlatList
            keyExtractor={item => item.property_photourl}
            data={this.state.propertyPhotoData}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={{ width: width * 0.3, height: 100, marginTop: normalize(7, 'height'), marginRight: normalize(7), borderRadius: normalize(8) }}
                  onPress={() => this.setState({
                    isImageViewVisible: true,
                    imageIndex: this.state.propertyPhotoData.indexOf(item)
                  })}
                >
                  <Image style={{ width: width * 0.3, height: 100, borderRadius: normalize(8) }} source={{ uri: item.property_photourl }} resizeMode='stretch' />
                </TouchableOpacity>
              )
            }}
          />
        </View>

        {
          this.state.isImageViewVisible &&
          <ImageView
            images={this.state.propertyPhotoDetailData}
            imageIndex={this.state.imageIndex}
            isVisible={this.state.isImageViewVisible}
            onClose={() => this.setState({ isImageViewVisible: false })}
          />
        }

        <View style={styles.mapContainer}>
          <MapView
            region={{
              latitude: this.state.property.property_latitude,
              longitude: this.state.property.property_longitude,
              latitudeDelta: 0.0922 / 5,
              longitudeDelta: 0.0421 / 5,
            }}
            style={{ flex: 1 }}
            showsUserLocation={true}
            showsCompass={true}
            showsPointsOfInterest={false}
            zoomControlEnabled={true}
          >
            <Marker
              coordinate={{
                latitude: this.state.property.property_latitude,
                longitude: this.state.property.property_longitude
              }}
              title={this.state.property.property_address1}
            >
              <View style={{ width: normalize(30), height: normalize(30, 'height') }}>
                <Image style={{ width: '100%', height: '100%' }} source={Images.marker} />
              </View>
            </Marker>
          </MapView>
        </View>

      </ScrollView>
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
    height: height * 0.75,
    //borderWidth: 1
  },
  labelTagLine: {
    width: '88%',
    height: normalize(30, 'height'),
    alignSelf: 'center',
    //borderWidth: 1
  },
  featurePart: {
    width: '100%',
    height: height * 0.24,
    justifyContent: 'space-around',
    paddingLeft: normalize(20),
    paddingRight: normalize(20),
    paddingTop: normalize(5, 'height'),
    paddingBottom: normalize(5, 'height'),
    //borderWidth: 1,
  },
  name: {
    fontFamily: 'SFProText-Bold',
    fontSize: RFPercentage(4),
    color: Colors.blackColor
  },
  price: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(3.5),
    color: Colors.passiveTxtColor
  },
  tagLine: {
    width: '100%',
    height: '15%',
    flexDirection: 'row',
    //borderWidth: 1
  },
  eachTagContainer: {
    // width: '35%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    //borderWidth: 1
  },
  tagImg: {
    width: normalize(30),
    height: normalize(30)
  },
  tagTxt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(2.5),
    color: Colors.blackColor,
    marginLeft: normalize(7)
  },
  btnsContainer: {
    width: '90%',
    height: height * 0.1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
    // marginTop: normalize(10, 'height'),
    borderColor: Colors.borderColor,
    borderTopWidth: normalize(1, 'height'),
    borderBottomWidth: normalize(1, 'height')
  },
  eachBtn: {
    width: normalize(40),
    height: normalize(40)
  },
  descContainer: {
    width: '90%',
    //height: '10%',
    alignSelf: 'center',
    marginTop: normalize(15, 'height'),
    //borderWidth: 1
  },
  descTitle: {
    fontFamily: 'SFProText-Semibold',
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
    // marginTop: normalize(7, 'height'), 
    marginBottom: normalize(7, 'height')
  },
  descTxt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.7),
    color: Colors.passiveTxtColor,
    lineHeight: normalize(20, 'height')
  },
  addressContainer: {
    width: '90%',
    //height: normalize(80, 'height'),
    alignSelf: 'center',
    borderColor: Colors.borderColor,
    borderTopWidth: normalize(0.5, 'height'),
    marginTop: normalize(15, 'height'),
    //borderWidth: 1
  },
  addressTitle: {
    fontFamily: 'SFProText-Semibold',
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
    marginTop: normalize(15, 'height')
  },
  addressTxt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.7),
    color: Colors.passiveTxtColor,
    marginTop: normalize(7, 'height')
  },
  agentCardContainer: {
    width: width * 0.9,
    height: normalize(90),
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: normalize(15, 'height'),
    //borderWidth: 1
  },
  photoContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: normalize(15, 'height'),
    //borderWidth: 1
  },
  photoTitle: {
    fontFamily: 'SFProText-Semibold',
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
  },
  mapContainer: {
    width: width,
    height: normalize(300, 'height'),
    marginTop: normalize(10, 'height'),
    borderColor: Colors.borderColor,
    borderTopWidth: normalize(0.5, 'height'),
  },
});

