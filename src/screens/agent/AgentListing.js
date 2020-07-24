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
  Header,
  LabelTag,
  PropertyCard,
  SearchBox,
  SideMenu,
  SignModal,
} from '@components';
import { Colors, Images, LoginInfo, RouteParam } from '@constants';
import { getContentByAction, postData } from '../../api/rest';

export default class AgentListingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      tab: 'active',
      listingData: [],
      activeData: [],
      inactiveData: [],
      withclientsData: []
    }
  }

  async componentDidMount() {
    this.setState({spinner: true});
    await this.getActiveListing();
    await this.getInactiveListing();
    await this.getWithClientsListing();
    this.setState({spinner: false});
  }

  getActiveListing = () => {
    return new Promise((resolve, reject) => {
      var activeParam = {
        action: 'my_active_listings',
        account_no: LoginInfo.user_account
      };
      //console.log('activeParam', activeParam);
      
      getContentByAction(activeParam)
        .then((res) => {
          //console.log('active data', res);
          if (res.length == 0 || res[0].error) {            
            resolve();
            return;
          }
          var sortedRes = res.sort((a, b) => { return a.displayorder - b.displayorder });
          this.setState({
            activeData: sortedRes,
            listingData: sortedRes,          
          });
          resolve();
        })
        .catch((err) => {
          //console.log('get active listing error', err);        
          reject();
        })
    })
  }

  getInactiveListing = () => {
    return new Promise((resolve, reject) => {
      var inactiveParam = {
        action: 'my_inactive_listings',
        account_no: LoginInfo.user_account
      };
      //console.log('inactiveParam', inactiveParam);  
      getContentByAction(inactiveParam)
        .then((res) => {
          //console.log('inactive data', res);
          if (res.length == 0 || res[0].error) {
            resolve();
            return;
          }
          var sortedRes = res.sort((a, b) => { return a.displayorder - b.displayorder });
          this.setState({
            inactiveData: sortedRes,
          });
          resolve();
        })
        .catch((err) => {
          //console.log('get inactive listing error', err);
          reject();
        })
    })
  }

  getWithClientsListing = () => {
    return new Promise((resolve, reject) => {
      var withclientsParam = {
        action: 'my_listings_with_clients',
        account_no: LoginInfo.user_account
      };
      //console.log('withclientsParam', withclientsParam);  
  
      getContentByAction(withclientsParam)
        .then((res) => {
          //console.log('withclients data', res);
          if (res.length == 0 || res[0].error) {
            resolve();
            return;
          }
          var sortedRes = res.sort((a, b) => { return a.displayorder - b.displayorder });
          this.setState({
            withclientsData: sortedRes,
          });
          resolve();
        })
        .catch((err) => {
          //console.log('get withclients listing error', err);
          reject();
        })
    })
  }

  onTab = (kind) => {
    this.setState({
      listingData: kind === 'active' ? this.state.activeData
        : kind === 'inactive' ? this.state.inactiveData
          : kind === 'withclients' ? this.state.withclientsData
            : [],
      tab: kind
    });
  }

  onPropertyPress = (propertyRecordNo) => {
    RouteParam.propertyRecordNo = propertyRecordNo;
    this.props.navigation.navigate('PropertyStack');
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <View style={styles.headerContainer}>
          <Header title={this.state.tab === 'withclients' ? 'LISTINGS WITH CLIENTS' : this.state.tab.toUpperCase() + ' LISTINGS'} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.goBack(null)} rightIcon={Images.iconLocation} onPressRightIcon={() => this.props.navigation.navigate('AgentListingMap', { tab: this.state.tab, listingData: this.state.listingData })} />
        </View>
        <View style={styles.btnsContainer}>
          <Button btnTxt='ACTIVE' btnStyle={{ width: width * 0.28, height: normalize(40, 'height'), color: this.state.tab === 'active' ? 'white' : 'blue', fontSize: RFPercentage(1.6) }} onPress={() => this.onTab('active')} />
          <Button btnTxt='INACTIVE' btnStyle={{ width: width * 0.28, height: normalize(40, 'height'), color: this.state.tab === 'inactive' ? 'white' : 'blue', fontSize: RFPercentage(1.6) }} onPress={() => this.onTab('inactive')} />
          <Button btnTxt='WITH CLIENTS' btnStyle={{ width: width * 0.28, height: normalize(40, 'height'), color: this.state.tab === 'withclients' ? 'white' : 'blue', fontSize: RFPercentage(1.6) }} onPress={() => this.onTab('withclients')} />
        </View>
        <View style={styles.mainContainer}>
          <View style={{ width: '100%', height: '100%' }}>
            {
              this.state.listingData.length == 0 && this.state.spinner == false ?
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTxt}>No Result Data</Text>
                </View>
                :
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.listingData}
                  renderItem={({ item }) => <PropertyCard cardStyle={{ width: width * 0.94, height: normalize(245, 'height'), marginBottom: normalize(10, 'height'), marginRight: 0 }} item={item} inactive={this.state.tab == 'inactive' ? true : false} onPress={() => this.onPropertyPress(item.property_recordno)} />}
                  keyExtractor={item => item.displayorder.toString()}
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
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
  },
  btnsContainer: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
    padding: normalize(7)
  },
  mainContainer: {
    width: '100%',
    height: '78%',
    alignItems: 'center',
    padding: normalize(10),
    //borderWidth: 3
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