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
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Platform
} from "react-native";
import normalize from 'react-native-normalize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome';
Platform.OS === 'ios' ? Icon.loadFont() : '';

import {
  BrowseCard,
  Button,
  CallCard,
  Header,
  LabelTag,
  PropertyCard,
  SearchBox,
  SideMenu,
  SignModal,
} from '@components';
import { Colors, Images, LoginInfo, RouteParam } from '@constants';
import { signOut } from '../api/Firebase';
import { getContentByAction, postData } from '../api/rest';

export default class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recentClientData: [
        {
          client_account: 23,
          client_fullname: 'Anthony Rot',
          client_photourl: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
          displayorder: 1
        },
        {
          client_account: 24,
          client_fullname: 'Danielle Ree',
          client_photourl: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
          displayorder: 2
        },
        {
          client_account: 25,
          client_fullname: 'asfwesfjjk',
          client_photourl: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
          displayorder: 3
        },
        {
          client_account: 26,
          client_fullname: 'ajjk',
          client_photourl: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
          displayorder: 4
        },
        {
          client_account: 27,
          client_fullname: 'ajjk',
          client_photourl: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
          displayorder: 5
        },
      ],
      recentActivityData: [
        {
          "client_account": "37",
          "query_text": "Anthony Robinson viewed 2 Wallace Drive in Plainview, NY on: Tuesday, June 16,2020 at 11:54pm",
          "displayorder": 1
        },
        {
          "client_account": "37",
          "query_text": "Anthony Robinson viewed 12 Marilyn Boulevard in Plainview, NY on: Tuesday, June 16,2020 at 11:53pm",
          "displayorder": 2
        },
        {
          "client_account": "37",
          "query_text": "Anthony Robinson searched for a Single Family Home in Plainview, ny from $1 to $100,000,000 with 1+ bedrooms and 1+ bathrooms on: Tuesday, June 16,2020 at 11:52pm",
          "displayorder": 3
        },
        {
          "client_account": "37",
          "query_text": "Anthony Robinson viewed 46 Clarendon Street in Dix Hills, NY on: Tuesday, June 16,2020 at 11:51pm",
          "displayorder": 4
        },
        {
          "client_account": "37",
          "query_text": "Anthony Robinson viewed 5 Lenisue Court in Dix Hills, NY on: Tuesday, June 16,2020 at 11:51pm",
          "displayorder": 5
        }
      ],
      mostPopularPropertyData: [
        {
          "property_recordno": "10472",
          "property_mlsnumber": "3215991",
          "property_amount": "489999",
          "property_bedrooms": "4",
          "property_bathrooms": "2",
          "property_address1": "46 Clarendon Street",
          "property_city": "Dix Hills",
          "property_state": "NY",
          "property_listing_date": "2020-05-18",
          "property_listing_by": "Douglas Elliman Real Estate",
          "property_listing_type": "S",
          "properties_category_id": "1",
          "property_status": "Active",
          "property_active": true,
          "property_main_photo_url": "https://res.cloudinary.com/membio/image/fetch/http%3A%2F%2Fphotos.v3.mlsstratus.com%2FLive%2Fphotos%2Ffull%2F1%2F991%2F3215991.jpg",
          "property_latitude": "40.7763242",
          "property_longitude": "-73.3414639",
          "displayorder": 1
        },
        {
          "property_recordno": "13164",
          "property_mlsnumber": "6032040",
          "property_amount": "429000",
          "property_bedrooms": "2",
          "property_bathrooms": "3",
          "property_address1": "50 Dekalb Avenue",
          "property_city": "White Plains",
          "property_state": "NY",
          "property_listing_date": "2020-04-06",
          "property_listing_by": "Shaw Properties",
          "property_listing_type": "S",
          "properties_category_id": "3",
          "property_status": "Active",
          "property_active": true,
          "property_main_photo_url": "https://cdn.listingphotos.sierrastatic.com/pics3x/v1569381497/112/112_6032040_01.jpg",
          "property_latitude": "41.0261655",
          "property_longitude": "-73.7598321",
          "displayorder": 2
        },
        {
          "property_recordno": "15549",
          "property_mlsnumber": "3204165",
          "property_amount": "550000",
          "property_bedrooms": "4",
          "property_bathrooms": "3",
          "property_address1": "127 Truxton",
          "property_city": "Dix Hills",
          "property_state": "NY",
          "property_listing_date": "2020-03-01",
          "property_listing_by": "Keller Williams Points North",
          "property_listing_type": "S",
          "properties_category_id": "1",
          "property_status": "Active",
          "property_active": true,
          "property_main_photo_url": "https://res.cloudinary.com/membio/image/fetch/http%3A%2F%2Fphotos.v3.mlsstratus.com%2FLive%2Fphotos%2Ffull%2F1%2F165%2F3204165.jpg",
          "property_latitude": "40.7785146",
          "property_longitude": "-73.3476816",
          "displayorder": 3
        },
        {
          "property_recordno": "17572",
          "property_mlsnumber": "3214934",
          "property_amount": "499000",
          "property_bedrooms": "3",
          "property_bathrooms": "1",
          "property_address1": "2 Wallace Drive",
          "property_city": "Plainview",
          "property_state": "NY",
          "property_listing_date": "2020-05-11",
          "property_listing_by": "Douglas Elliman Real Estate",
          "property_listing_type": "S",
          "properties_category_id": "1",
          "property_status": "Active",
          "property_active": true,
          "property_main_photo_url": "https://res.cloudinary.com/membio/image/fetch/http%3A%2F%2Fphotos.v3.mlsstratus.com%2FLive%2Fphotos%2Ffull%2F1%2F934%2F3214934.jpg",
          "property_latitude": "40.7819762",
          "property_longitude": "-73.4842948",
          "displayorder": 4
        },
        {
          "property_recordno": "143384",
          "property_mlsnumber": "3167381",
          "property_amount": "599000",
          "property_bedrooms": "4",
          "property_bathrooms": "3",
          "property_address1": "6 Pinehill Lane",
          "property_city": "Dix Hills",
          "property_state": "NY",
          "property_listing_date": "2019-09-24",
          "property_listing_by": "Realty Assoc USA",
          "property_listing_type": "S",
          "properties_category_id": "1",
          "property_status": "Active",
          "property_active": true,
          "property_main_photo_url": "https://res.cloudinary.com/membio/image/fetch/http%3A%2F%2Fphotos.v3.mlsstratus.com%2FLive%2Fphotos%2Ffull%2F1%2F381%2F3167381.jpg",
          "property_latitude": "40.795834",
          "property_longitude": "-73.2985801",
          "displayorder": 5
        },
        {
          "property_recordno": "165787",
          "property_mlsnumber": "6010370",
          "property_amount": "400000",
          "property_bedrooms": "2",
          "property_bathrooms": "2",
          "property_address1": "9 Randolph Road",
          "property_city": "Greenburgh",
          "property_state": "NY",
          "property_listing_date": "2020-02-03",
          "property_listing_by": "Keller Williams NY Realty",
          "property_listing_type": "S",
          "properties_category_id": "1",
          "property_status": "Active",
          "property_active": true,
          "property_main_photo_url": "https://cdn.listingphotos.sierrastatic.com/pics3x/v1569381497/112/112_6010370_01.jpg",
          "property_latitude": "41.0417078",
          "property_longitude": "-73.7799723",
          "displayorder": 6
        },
        {
          "property_recordno": "168094",
          "property_mlsnumber": "3185945",
          "property_amount": "453900",
          "property_bedrooms": "3",
          "property_bathrooms": "2",
          "property_address1": "12 Marilyn Boulevard",
          "property_city": "Plainview",
          "property_state": "NY",
          "property_listing_date": "2019-12-12",
          "property_listing_by": "Century 21 American Homes",
          "property_listing_type": "S",
          "properties_category_id": "1",
          "property_status": "Active",
          "property_active": true,
          "property_main_photo_url": "https://res.cloudinary.com/membio/image/fetch/http%3A%2F%2Fphotos.v3.mlsstratus.com%2FLive%2Fphotos%2Ffull%2F1%2F945%2F3185945.jpg",
          "property_latitude": "40.7898079",
          "property_longitude": "-73.4926179",
          "displayorder": 7
        },
        {
          "property_recordno": "296931",
          "property_mlsnumber": "6040136",
          "property_amount": "349000",
          "property_bedrooms": "1",
          "property_bathrooms": "2",
          "property_address1": "24 Carhart Avenue",
          "property_city": "White Plains",
          "property_state": "NY",
          "property_listing_date": "2020-05-29",
          "property_listing_by": "Houlihan Lawrence Inc",
          "property_listing_type": "S",
          "properties_category_id": "3",
          "property_status": "Inactive",
          "property_active": false,
          "property_main_photo_url": "https://cdn.listingphotos.sierrastatic.com/pics3x/v1569381497/112/112_6040136_01.jpg",
          "property_latitude": "41.0270344",
          "property_longitude": "-73.7614677",
          "displayorder": 8
        },
        {
          "property_recordno": "299720",
          "property_mlsnumber": "6042922",
          "property_amount": "595000",
          "property_bedrooms": "4",
          "property_bathrooms": "3",
          "property_address1": "48 Lincoln Avenue",
          "property_city": "White Plains",
          "property_state": "NY",
          "property_listing_date": "2020-06-05",
          "property_listing_by": "Houlihan Lawrence Inc",
          "property_listing_type": "S",
          "properties_category_id": "1",
          "property_status": "Active",
          "property_active": true,
          "property_main_photo_url": "https://cdn.listingphotos.sierrastatic.com/pics3x/v1569381497/112/112_6042922_01.jpg",
          "property_latitude": "41.0318031",
          "property_longitude": "-73.7810869",
          "displayorder": 9
        },
        {
          "property_recordno": "300954",
          "property_mlsnumber": "3220540",
          "property_amount": "1850000",
          "property_bedrooms": "4",
          "property_bathrooms": "5",
          "property_address1": "146-06 Rockaway Beach Blvd",
          "property_city": "Rockaway Park",
          "property_state": "NY",
          "property_listing_date": "2020-06-08",
          "property_listing_by": "Rockaway Properties",
          "property_listing_type": "S",
          "properties_category_id": "1",
          "property_status": "Active",
          "property_active": true,
          "property_main_photo_url": "https://res.cloudinary.com/membio/image/fetch/http%3A%2F%2Fphotos.v3.mlsstratus.com%2FLive%2Fphotos%2Ffull%2F1%2F540%2F3220540.jpg",
          "property_latitude": "40.5705167",
          "property_longitude": "-73.8619997",
          "displayorder": 10
        }
      ],
      toggleMenuVisible: false,
      spinner: false
    }

    this.listener = this.props.navigation.addListener('focus', this.componentDidFocus.bind(this));
  }

  componentDidMount() {
  }

  componentDidFocus() {
    // this.getRecentClient();
    // this.getRecentActivity();
    // this.getMostPupularProperty();
  }

  componentWillUnmount() {
    //if (this.listener) this.listener.remove();
  }

  getRecentClient = () => {
    var recentClientParam = {
      action: 'dashboard_recent_clients',
      account_no: LoginInfo.user_account
    };
    //console.log('recentClient Param', recentClientParam);
    getContentByAction(recentClientParam)
      .then((res) => {
        //console.log('recent client data', res);
        var sortedRes = res.sort((a, b) => { return a.displayorder - b.displayorder });
        this.setState({ recentClientData: sortedRes });
      })
      .catch((err) => {
        console.log('get recent client error', err);
      })
  }

  getRecentActivity = () => {
    var recentActivityParam = {
      action: 'dashboard_recent_activies',
      account_no: LoginInfo.user_account
    };
    //console.log('recentActivity Param', recentActivityParam);
    getContentByAction(recentActivityParam)
      .then((res) => {
        console.log('recent activity data', res);
        var sortedRes = res.sort((a, b) => { return a.displayorder - b.displayorder });
        this.setState({ recentActivityData: sortedRes });
      })
      .catch((err) => {
        console.log('get recent activity error', err);
      })
  }

  getMostPupularProperty = () => {
    var mostPopularPropertyParam = {
      action: 'dashboard_most_popular_properties',
      account_no: LoginInfo.user_account
    };
    //console.log('mostPopularProperty Param', mostPopularPropertyParam);
    this.setState({ spinner: true });
    getContentByAction(mostPopularPropertyParam)
      .then((res) => {
        console.log('most popular property data', res);
        var sortedRes = res.sort((a, b) => { return a.displayorder - b.displayorder });
        this.setState({
          mostPopularPropertyData: sortedRes,
          spinner: false
        });
      })
      .catch((err) => {
        console.log('get most popular property error', err);
        this.setState({ spinner: false })
      })
  }

  onPropertyPress = (propertyRecordNo) => {
    RouteParam.propertyRecordNo = propertyRecordNo;
    this.props.navigation.navigate('PropertyStack');
  }

  onToggleMenu = () => {
    this.setState({ toggleMenuVisible: !this.state.toggleMenuVisible });
  }

  onLogout = () => {
    signOut();

    this.setState({ toggleMenuVisible: !this.state.toggleMenuVisible });

    AsyncStorage.removeItem('LoginInfo');
    this.props.navigation.navigate('Auth', { screen: 'SocialLogin' });
  }

  onTouchEvent = (e) => {
    var locationX = e.nativeEvent.locationX;
    if (this.state.toggleMenuVisible && locationX > width * 0.8) {
      this.setState({ toggleMenuVisible: false });
    }
  }

  render() {
    return (
      <View style={styles.container} onTouchStart={(e) => this.onTouchEvent(e)}>
        {this.state.toggleMenuVisible ?
          <SideMenu navigation={this.props.navigation} onToggleMenu={this.onToggleMenu} onLogout={this.onLogout} />
          : null
        }
        <View style={styles.headerContainer}>
          <Header title={'OPEN™ FOR AGENTS'} titleColor={Colors.blackColor} leftIcon={Images.iconMenu} onPressBack={() => this.props.navigation.goBack(null)} onPressLeftIcon={() => this.onToggleMenu()} /*rightIcon={Images.iconSearch} onPressRightIcon={() => { }}*/ />
        </View>
        <View style={styles.recentClientContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>RECENT CLIENTS</Text>
          </View>
          <View style={styles.imgsContainer}>
            <FlatList
              keyExtractor={item => item.displayorder.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={this.state.recentClientData}
              renderItem={({ item }) =>
                <View style={styles.clientItemContainer}>
                  <View style={styles.clientImgContainer}>
                    <Image style={styles.clientImg} source={{ uri: item.client_photourl }} />
                  </View>
                  <View style={styles.clientNameContainer}>
                    <Text style={styles.clientName}>{item.client_fullname}</Text>
                  </View>
                </View>
              }
            />
          </View>
        </View>
        <View style={styles.recentActivityContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>RECENT ACTIVITIES</Text>
          </View>
          <View style={styles.cardsContainer}>
            <FlatList
              keyExtractor={item => item.displayorder.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={this.state.recentActivityData}
              renderItem={({ item }) =>
                <View style={styles.activityContainer}>
                  <View style={styles.activityTxtContainer}>
                    <Text style={styles.activityTxt}>{item.query_text}</Text>
                  </View>
                  <View style={styles.activityDetailContainer}>
                    <Text style={styles.detailTag}>{'>'} Details</Text>
                  </View>
                </View>
              }
            />
          </View>
        </View>

        <View style={styles.mostPopularPropertyContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>MOST PUPULAR PROPERTIES</Text>
          </View>
          <View style={styles.propertiesContainer}>
            <ActivityIndicator style={{ position: 'absolute' }} animating={this.state.spinner} />
            {
              this.state.mostPopularPropertyData.length == 0 && this.state.spinner == false ?
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTxt}>No Result Data</Text>
                </View>
                :
                <FlatList
                  keyExtractor={item => item.property_recordno}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={this.state.mostPopularPropertyData}
                  renderItem={({ item }) => <PropertyCard cardStyle={{ width: normalize(325), height: normalize(245, 'height'), marginTop: normalize(3, 'height'), marginRight: normalize(10) }} item={item} onPress={() => this.onPropertyPress(item.property_recordno)} />}
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
    height: height,
  },
  headerContainer: {
    width: '100%',
    height: normalize(70, 'height'),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
  },
  recentClientContainer: {
    width: '100%',
    height: '20%',
    justifyContent: 'space-between',
    marginTop: normalize(10, 'height'),
    //borderWidth: 1
  },
  labelContainer: {
    height: normalize(25, 'height'),
    justifyContent: 'flex-end',
    //borderWidth: 1
  },
  label: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
    marginLeft: normalize(10)
  },
  imgsContainer: {
    width: '95%',
    height: '78%',
    alignSelf: 'center',
    //borderWidth: 1
  },
  clientItemContainer: {
    width: normalize(width / 5),
    height: normalize(100, 'height'),
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1
  },
  clientImgContainer: {
    width: normalize(70),
    height: normalize(70),
    alignSelf: 'center',
    //borderWidth: 1
  },
  clientImg: {
    width: '100%',
    height: '100%',
    borderRadius: normalize(35),
    borderColor: Colors.borderColor,
    borderWidth: normalize(2)
  },
  clientNameContainer: {
    width: '95%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(5, 'height'),
    //borderWidth: 1
  },
  clientName: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.5),
    color: Colors.passiveTxtColor,
  },
  recentActivityContainer: {
    width: '100%',
    height: '22%',
    justifyContent: 'space-between',
    //borderWidth: 1
  },
  cardsContainer: {
    width: '95%',
    height: '75%',
    alignSelf: 'center',
    //borderWidth: 1
  },
  activityContainer: {
    width: normalize(width * 0.7),
    height: '95%',
    marginRight: normalize(10),
    borderColor: Colors.borderColor,
    borderWidth: normalize(2)
  },
  activityTxtContainer: {
    width: '100%',
    height: '75%',
    //borderWidth: 1
  },
  activityDetailContainer: {
    width: '100%',
    height: '25%',
    //borderWidth: 1
  },
  activityTxt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(2),
    color: Colors.passiveTxtColor,
    padding: normalize(7)
  },
  detailTag: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(2),
    color: Colors.passiveTxtColor,
    paddingLeft: normalize(7)
  },
  mostPopularPropertyContainer: {
    width: '100%',
    height: '50%',
    justifyContent: 'space-between',
    marginTop: normalize(10, 'height'),
    //borderWidth: 1
  },
  propertiesContainer: {
    width: '95%',
    height: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    //borderWidth: 1
  },
  emptyContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1
  },
  emptyTxt: {
    fontFamily: 'SFProText-Semibold',
    fontSize: RFPercentage(2),
    color: Colors.blackColor
  },
});