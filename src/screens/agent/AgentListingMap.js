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
import MapView, { Marker } from 'react-native-maps';

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

export default class AgentListingMapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      tab: 'active',
      title: this.props.route.params.title,
      listingData: this.props.route.params.listingData,
      markerData: [],
      markerIdentifierData: [],
    }
  }

  componentDidMount() {
    this.getMarkerData(this.state.listingData);
  }

  getMarkerData = (res) => {
    var markerData = [];
    var markerIdentifierData = [];
    res.forEach((each) => {
      var title = each.property_address1 + ', ' + each.property_city;
      markerData.push({
        propertyRecordNo: each.property_recordno,
        coordinate: {
          latitude: each.property_latitude,
          longitude: each.property_longitude
        },
        title: title
      });
      markerIdentifierData.push(title);
    });
    this.setState({
      markerData: markerData,
      markerIdentifierData: markerIdentifierData
    });
  }

  onPropertyPress = (propertyRecordNo) => {
    RouteParam.propertyRecordNo = propertyRecordNo;
    this.props.navigation.navigate('PropertyStack');
  }

  onPressMarker = (propertyRecordNo) => {
    var index = this.state.listingData.findIndex((each) => each.property_recordno == propertyRecordNo);

    var param = {
      animated: true,
      index: index,
      viewOffset: 0,
      viewPosition: 0
    }
    this.flatListRef.scrollToIndex(param);
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <View style={styles.headerContainer}>
          <Header title={this.state.title.toUpperCase() + ' LISTINGS'} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.goBack(null)} />
        </View>
        <View style={styles.mapContainer}>
          <MapView
            ref={map => { this.map = map }}
            region={{
              latitude: this.state.listingData.length > 0 ? this.state.listingData[0].property_latitude : LoginInfo.latitude,
              longitude: this.state.listingData.length > 0 ? this.state.listingData[0].property_longitude : LoginInfo.longitude,
              latitudeDelta: 0.0922 / 5,
              longitudeDelta: 0.0421 / 5,
            }}
            style={{ flex: 1 }}
            showsUserLocation={true}
            showsCompass={true}
            showsPointsOfInterest={false}
            zoomControlEnabled={true}
            onMapReady={() => {
              this.map.fitToSuppliedMarkers(this.state.markerIdentifierData, {
                edgePadding:
                {
                  top: 50,
                  right: 50,
                  bottom: 50,
                  left: 50
                }
              })
            }}
          >
            {
              this.state.markerData.map((each) => (
                <Marker
                  key={each.property_recordno}
                  coordinate={each.coordinate}
                  title={each.title}
                  identifier={each.title}
                  onPress={() => this.onPressMarker(each.propertyRecordNo)}
                >
                  <View style={{ width: normalize(20), height: normalize(25, 'height') }}>
                    <Image style={{ width: '100%', height: '100%' }} source={Images.marker} resizeMode='stretch' />
                  </View>
                </Marker>
              ))
            }
          </MapView>
        </View>

        <View style={styles.mainContainer}>
          <View style={{ width: '100%', height: '100%' }}>
            {
              this.state.listingData.length == 0 ?
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTxt}>No Result Data</Text>
                </View>
                :
                <FlatList
                  horizontal={true}
                  ref={(ref) => { this.flatListRef = ref; }}
                  keyExtractor={item => item.displayorder.toString()}
                  showsHorizontalScrollIndicator={false}
                  data={this.state.listingData}
                  getItemLayout={(data, index) => (
                    { length: normalize(335), offset: normalize(335) * index, index }
                  )}
                  renderItem={({ item }) => <PropertyCard cardStyle={{ width: normalize(325), height: normalize(245, 'height'), marginTop: normalize(0, 'height'), marginRight: normalize(10) }} item={item} onPress={() => this.onPropertyPress(item.property_recordno)} />}
                />
            }
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
    zIndex: 1
  },
  mapContainer: {
    width: width,
    height: '60%',
    position: 'absolute',
    top: 0,
    left: 0
  },
  mainContainer: {
    width: '100%',
    height: '40%',
    alignItems: 'center',
    marginTop: normalize(330, 'height'),
    padding: normalize(10),
    //borderWidth: 3
  },
  emptyContainer: {
    width: '100%',
    height: height * 0.35,
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