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
      clientData: [],
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
        if (res.length == 0 || res[0].error) {
          this.setState({ spinner: false });
          return;
        }
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
        //console.log('recent activity data', res);
        if (res.length == 0 || res[0].error) {
          this.setState({ spinner: false });
          return;
        }
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
    //console.log('mostPopularPropertyParam', mostPopularPropertyParam);
    this.setState({ spinner: true });

    getContentByAction(mostPopularPropertyParam)
      .then((res) => {
        //console.log('most popular property data', res);
        if (res.length == 0 || res[0].error) {
          this.setState({ spinner: false });
          return;
        }
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

  onGoClientView = (client)=>{    
    this.props.navigation.navigate('ClientStack', {screen: 'ClientView', params:{client: client}});
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
          <Header title={'AGENT PLUS™'} titleColor={Colors.blackColor} leftIcon={Images.iconMenu} onPressBack={() => this.props.navigation.goBack(null)} onPressLeftIcon={() => this.onToggleMenu()} />
        </View>
        <View style={styles.body}>
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
                  <TouchableOpacity style={styles.clientItemContainer} onPress={()=>this.onGoClientView(item)}>
                    <View style={styles.clientImgContainer}>
                      <Image style={styles.clientImg} source={{ uri: item.client_photo_url }} />
                    </View>
                    <View style={styles.clientNameContainer}>
                      <Text style={styles.clientName}>{item.client_fullname}</Text>
                    </View>
                  </TouchableOpacity>
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
                      <Text style={styles.activityTxt} numberOfLines={4} ellipsizeMode='tail'>{item.query_text}</Text>
                    </View>
                    <TouchableOpacity style={styles.activityDetailContainer} onPress={()=>this.onGoClientView(item)}>
                      <Text style={styles.detailTag}>{'>'} Details</Text>
                    </TouchableOpacity>
                  </View>
                }
              />
            </View>
          </View>
          <View style={styles.mostPopularPropertyContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>MOST POPULAR PROPERTIES</Text>
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
                    renderItem={({ item }) => <PropertyCard cardStyle={{ width: normalize(325), height: normalize(245, 'height'), marginRight: normalize(10) }} item={item} onPress={() => this.onPropertyPress(item.property_recordno)} />}
                  />
              }
            </View>
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
  body: {
    width: '100%',
    height: height - normalize(70, 'heihgt'),
    justifyContent: 'space-around',
    //borderWidth: 3
  },
  recentClientContainer: {
    width: '100%',
    height: normalize(145),
    justifyContent: 'space-between',
    marginTop: normalize(10, 'height'),
    //borderWidth: 1
  },
  labelContainer: {
    height: normalize(25),
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
    height: normalize(110),
    alignSelf: 'center',
    //borderWidth: 1
  },
  clientItemContainer: {
    width: normalize(70),
    height: normalize(110),
    justifyContent: 'space-around',
    alignItems: 'center',
    marginRight: normalize(10),
    //borderWidth: 1
  },
  clientImgContainer: {
    width: normalize(62),
    height: normalize(62),
    alignSelf: 'center',
    //borderWidth: 1
  },
  clientImg: {
    width: '100%',
    height: '100%',
    borderRadius: normalize(35),
    borderColor: Colors.borderColor,
    borderWidth: normalize(0.5)
  },
  clientNameContainer: {
    width: '95%',
    height: normalize(30),
    //justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1,
  },
  clientName: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.5),
    color: Colors.passiveTxtColor,
    textAlign: 'center'
  },
  recentActivityContainer: {
    width: '100%',
    height: normalize(150),
    justifyContent: 'space-between',
    marginBottom: normalize(15, 'height'),
    //borderWidth: 1
  },
  cardsContainer: {
    width: '95%',
    height: normalize(110),
    alignSelf: 'center',
    //borderWidth: 1
  },
  activityContainer: {
    width: normalize(width * 0.7),
    height: normalize(110),
    marginRight: normalize(10),
    borderColor: Colors.borderColor,
    borderWidth: normalize(0.5)
  },
  activityTxtContainer: {
    width: '100%',
    height: '75%',
    paddingLeft: normalize(10),
    paddingTop: normalize(10),
    paddingRight: normalize(10),
    //borderWidth: 1
  },
  activityDetailContainer: {
    width: '100%',
    height: '25%',
    //borderWidth: 1
  },
  activityTxt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.blackColor,
  },
  detailTag: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
    paddingLeft: normalize(10)
  },
  mostPopularPropertyContainer: {
    width: '100%',
    height: normalize(280, 'height'),
    justifyContent: 'space-between',
    marginBottom: normalize(10, 'height'),
    //borderWidth: 3
  },
  propertiesContainer: {
    width: '95%',
    height: normalize(245, 'height'),
    justifyContent: 'center',
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