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
import Spinner from 'react-native-loading-spinner-overlay';

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

export default class ClientListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientData: [],
      spinner: false
    }
  }

  componentDidMount() {
    this.getClient();    
  }

  getClient = () => {
    var clientParam = {
      action: 'client_list',
      account_no: LoginInfo.user_account
    };
    //console.log('client Param', clientParam);
    this.setState({
      clientData: [],
      spinner: true
    });

    getContentByAction(clientParam)
      .then((res) => {
        //console.log('clent data', res);
        if (res.length == 0 || res[0].error) {
          this.setState({ spinner: false });
          return;
        }
        var sortedRes = res.sort((a, b) => { return a.displayorder - b.displayorder });
        this.setState({
          clientData: sortedRes,
          spinner: false
        });        
      })
      .catch((err) => {
        console.log('get client error', err);
        this.setState({ spinner: false })
      })
  }

  onClickClient = (client) => {    
    this.props.navigation.navigate('ClientView', {client: client});
  }

  onSearch = (query) => {
    if (query == '') return;
  }

  onFastSearch = (query) => {
    var filteredRes = this.state.clientData.filter((each) => each.client_fullname.toLowerCase().includes(query.toLowerCase()));
    this.setState({ clientData: filteredRes });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title={'CLIENTS'} titleColor={Colors.blackColor} rightLeftIcon={Images.iconAddPerson} rightIcon={Images.iconLocation} onPressBack={() => this.props.navigation.goBack(null)} onPressRightLeftIcon={() => { this.props.navigation.navigate('ClientShare') }} onPressRightIcon={() => { this.props.navigation.navigate('ClientMap', {clientData: this.state.clientData}) }} />
        </View>
        <View style={styles.searchContainer}>
          <SearchBox boxStyle={{ width: width * 0.9, height: normalize(35, 'height'), backgroundColor: Colors.searchBackColor, borderColor: Colors.blueColor, btnColor: Colors.blueColor }} onSearch={this.onSearch} onFastSearch={this.onFastSearch} />
        </View>
        <ScrollView style={{ marginTop: normalize(10, 'height') }}>
          <Spinner visible={this.state.spinner} />
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
                      cardStyle={{width: wp(90)}}
                      clientName={each.client_fullname}
                      clientEmail={each.client_email}
                      clientTelephone={each.client_telephone}
                      clientImg={{ uri: each.client_photo_url }}
                      clientLastActivity={each.client_last_activity}
                    />
                  </TouchableOpacity>
                )
              })
          }
        </ScrollView>
        <View style={{ width: '100%', height: normalize(10, 'height') }}></View>
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
  txtContainer: {
    width: '100%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
  },
  txt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
    textAlign: 'center',
  },
  searchContainer: {
    width: '100%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
  },
  eachContainer: {
    width: '95%',
    height: normalize(100),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // borderColor: Colors.borderColor,
    // borderWidth: normalize(0.5, 'height'),        
  },
  emptyContainer: {
    width: '100%',
    height: height * 0.65,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyTxt: {
    fontFamily: 'SFProText-Semibold',
    fontSize: RFPercentage(2),
    color: Colors.blackColor
  },
});