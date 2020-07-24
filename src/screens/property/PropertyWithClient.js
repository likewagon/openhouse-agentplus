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
      clientData: [],
    }
  }

  componentDidMount() {
    this.getClient();
  }

  getClient = () => {
    var clientParam = {
      action: 'clients_by_property',
      account_no: LoginInfo.user_account,
      property_recordno: this.state.property.property_recordno
    };
    //console.log('client Param', clientParam);
    this.setState({
      clientData: [],
      spinner: true
    });

    getContentByAction(clientParam)
      .then((res) => {
        //console.log('clent by property data', res);
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
        //console.log('get client by prperty error', err);
        this.setState({ spinner: false })
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <View style={styles.headerContainer}>
          <Header title={'MLS. ' + this.state.property.property_mlsnumber} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.goBack(null)} rightIcon={Images.iconLocation} onPressRightIcon={() => this.props.navigation.navigate('ClientStack', { screen: 'ClientMap', params:{ clientData: this.state.clientData } })} />
        </View>
        <View style={styles.propertyContainer}>
          <PropertyCard cardStyle={{ width: width * 0.94, height: normalize(245, 'height'), marginBottom: normalize(0, 'height'), marginRight: 0 }} item={this.state.property} onPress={() => this.props.navigation.goBack(null)}/>
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
                    onPress={() => {
                      this.props.navigation.navigate('ClientStack', { screen: 'ClientView', params:{client: each} });
                    }}>
                    <ClientCard
                      cardStyle={{ width: wp(94) }}
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
    //borderColor: Colors.borderColor,
    //borderWidth: normalize(0.5, 'height'),        
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