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

export default class MlsSettingLinkScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      selectedIndex: -1,
      agentData: []
    }
  }

  componentDidMount() {    
    this.listener = this.props.navigation.addListener('focus', ()=>this.componentDidFocus());
  }

  componentDidFocus(){    
    this.getAgent();    
  }

  componentWillUnmount() {    
    // if (this.listener) this.listener.remove();  
  }

  getAgent = () => {
    var agentParam = {
      action: 'list_of_linked_mls_accounts',
      account_no: LoginInfo.user_account
    };
    //console.log('agent Param', agentParam);
    this.setState({ spinner: true });

    getContentByAction(agentParam)
      .then((res) => {
        //console.log('agent data', res);
        if (res.length == 0 || res[0].error) {
          this.setState({ spinner: false });
          return;
        }
        var sortedRes = res.sort((a, b) => { return a.displayorder - b.displayorder });
        this.setState({
          agentData: sortedRes,
          spinner: false
        });
      })
      .catch((err) => {
        console.log('get agent error', err);
        this.setState({ spinner: false });
      })
  }

  onClickAgent = (index) => {
    this.setState({ selectedIndex: index });
    let desc = 'Are you sure that you want to unlink ' +
      this.state.agentData[index].agent_fullname +
      ' from ' +
      this.state.agentData[index].agent_companyname +
      ' from your Agent Plus™ account?';

    Alert.alert(
      'Please Confirm',
      desc,
      [
        { text: 'Yes', onPress: () => this.onYes(index) },
        { text: 'No', onPress: () => { } },
      ],
      {
        cancelable: true
      }
    );
  }

  onYes = async (index) => {
    let bodyFormData = new FormData();
    bodyFormData.append('action', 'unlink_link_to_mls');
    bodyFormData.append('account_no', LoginInfo.user_account);
    bodyFormData.append('uniquerecord', this.state.agentData[index].uniquerecord);
            
    await postData(bodyFormData)
      .then((res) => {
        if (res.length == 0 || res[0].error) {
          Alert.alert(
            'Unlink is failed. \n Please Try Again',
            '',
            [
              { text: 'OK', onPress: () => {} }
            ],
          );
          return;
        }
        //console.log('mls unlink success', res);                
        
        this.setState({ selectedIndex: -1 });
        this.getAgent();
      })
      .catch((err) => {
        console.log('mls unlink error', err);        
      })        
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Spinner visible={this.state.spinner} /> */}
        <View style={styles.headerContainer}>
          <Header title={'MLS SETTINGS'} titleColor={Colors.blackColor} rightIcon={Images.iconAddPerson} onPressBack={() => this.props.navigation.goBack(null)} onPressRightIcon={() => { this.props.navigation.navigate('MlsSettingSearch') }} />
        </View>
        <View style={styles.txtContainer}>
          <Text style={styles.txt}>
            Your Agent Plus™ account is currently linked to the following MLS and Board of Realtors™
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
    alignSelf: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
    padding: normalize(10)
  },
  txt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
    textAlign: 'center',
    lineHeight: 22
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