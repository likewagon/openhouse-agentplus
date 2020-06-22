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
  Dimensions,
  Platform,
  ImageBackground,
} from "react-native";
import normalize from "react-native-normalize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

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

export default class MlsSettingLinkScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: -1,
      agentData: []
    }
  }

  componentDidMount() {
    this.getAgent();
  }

  getAgent = () => {
    var agentParam = {
      action: 'list_of_linked_mls_accounts',
      account_no: LoginInfo.user_account
    };
    //console.log('agent Param', agentParam);
    getContentByAction(agentParam)
      .then((res) => {
        console.log('agent data', res);
        var sortedRes = res.sort((a, b) => { return a.displayorder - b.displayorder });
        this.setState({
          agentData: sortedRes,
        });
      })
      .catch((err) => {
        console.log('get agent error', err);
      })
  }

  onClickAgent = (index) => {
    this.setState({ selectedIndex: index });
    let desc = 'Are you sure you want to select ' +
      this.state.agentData[index].realtor_full_name +
      ' from ' +
      this.state.agentData[index].realtor_company +
      ' as your preferred real estate agent?';

    Alert.alert(
      'Please confirm',
      desc,
      [
        { text: 'Yes', onPress: () => this.onYes() },
        { text: 'No', onPress: () => { } },
      ],
      {
        cancelable: true
      }
    );
  }

  onYes = async () => {
    // let userAssignedAgent = this.state.agentData[this.state.selectedIndex].realtor_account;
    // LoginInfo.user_assigned_agent = userAssignedAgent;
    // await AsyncStorage.setItem('UserAssignedAgent', userAssignedAgent.toString());
    // await AsyncStorage.setItem('LoginInfo', JSON.stringify(LoginInfo));
    // this.props.navigation.navigate('Main');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title={'MLS SETTINGS'} titleColor={Colors.blackColor} rightIcon={Images.iconAddAgent} onPressBack={() => this.props.navigation.goBack(null)} onPressRightIcon={() => { this.props.navigation.navigate('MlsSettingSearch') }} />
        </View>
        <View style={styles.txtContainer}>
          <Text style={styles.txt}>
            Your Open™ is currently linked to the
          </Text>
        </View>
        <ScrollView style={{ marginTop: normalize(10, 'height') }}>
          {
            this.state.agentData.length == 0 &&
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTxt}>No Result Data</Text>
            </View>
          }
          {
            this.state.agentData.map((each, index) => {
              return (
                <TouchableOpacity key={index} style={styles.eachContainer}
                  onPress={() => this.onClickAgent(index)}>
                  <AgentCard
                    agentName={each.agent_fullname}
                    //agentTitle={each.agent_title}
                    agentCompany={each.agent_companyname}
                    agentImg={{ uri: each.agent_photourl }}
                    isSelected={index == this.state.selectedIndex}
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
  eachContainer: {
    width: '95%',
    height: normalize(100),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: normalize(5, 'height'),
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