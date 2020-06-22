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
import MapView, { Marker } from 'react-native-maps';

import {
  Button,
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

export default class PropertyWithClientMapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      clientData: this.props.route.params.clientData,
      markerIdentifierData: [],
    }
  }

  componentDidMount() {
    this.makeMarkerIdentifier();
  }

  makeMarkerIdentifier = () => {
    var markerIdentifierData = [];
    this.state.clientData.forEach((each) => {
      var identifier = each.client_latitude + ',' + each.client_longitude;
      markerIdentifierData.push(identifier);
    });
    this.setState({ markerIdentifierData: markerIdentifierData });
  }

  onPressMarker = (clientAccount) => {
    RouteParam.clientAccount = clientAccount;
    //this.props.navigation.navigate('ClientView');    
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.headerContainer, { zIndex: 1, borderBottomWidth: 0 }]}>
          <Header title={'MAP OF CLIENTS'} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.goBack(null)} />
        </View>
        <View style={styles.mapContainer}>
          <MapView
            ref={map => { this.map = map }}
            region={{
              latitude: this.state.clientData[0].client_latitude,
              longitude: this.state.clientData[0].client_longitude,
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
              this.state.clientData.map((each) => (
                <Marker
                  key={each.client_account}
                  coordinate={{
                    latitude: each.client_latitude,
                    longitude: each.client_longitude
                  }}
                  title={each.client_fullname}
                  identifier={each.client_latitude + ',' + each.client_longitude}
                  onPress={() => this.onPressMarker(each.client_account)}
                >
                  <View style={{ width: normalize(20), height: normalize(25, 'height') }}>
                    <Image style={{ width: '100%', height: '100%' }} source={Images.marker} resizeMode='stretch' />
                  </View>
                </Marker>
              ))
            }
          </MapView>
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
  mapContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    //borderWidth: 4
  },

});