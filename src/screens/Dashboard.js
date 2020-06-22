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
      recentClientData: [],
      recentActivityData: [],
      mostPopularPropertyData: [],
      toggleMenuVisible: false,
      spinner: false
    }

    this.listener = this.props.navigation.addListener('focus', this.componentDidFocus.bind(this));
  }

  componentDidMount() {
  }

  componentDidFocus() {
    this.getRecentClient();
    this.getRecentActivity();
    this.getMostPupularProperty();
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