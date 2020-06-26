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

export default class MlsSettingSearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: -1,
      agentData: [],
      spinner: false
    }
  }

  componentDidMount() {
    
  }

  getAgent = (agentName) => {
    var agentParam = {
      action: 'search_for_agent_in_mls',
      account_no: LoginInfo.user_account,
      agentname: agentName
    };
    //console.log('agent Param', agentParam);
    this.setState({
      agentData: [],
      spinner: true
    });

    getContentByAction(agentParam)
      .then((res) => {
        //console.log('agent search data', res);
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
        console.log('get agent search error', err);
        this.setState({ spinner: false })
      })
  }

  onClickAgent = (index) => {
    this.setState({ selectedIndex: index });
    let desc = 'Are you sure you want to link ' +
      this.state.agentData[index].agent_fullname +
      ' from ' +
      this.state.agentData[index].agent_companyname +
      ' to your Agent Plus™ account?';

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
    bodyFormData.append('action', 'link_to_mls');
    bodyFormData.append('account_no', LoginInfo.user_account);
    bodyFormData.append('agent_fullname', this.state.agentData[index].agent_fullname);
    bodyFormData.append('mls_organization_id', this.state.agentData[index].mls_organization_id);
    bodyFormData.append('agent_mls_id', this.state.agentData[index].mls_agent_id);
    bodyFormData.append('agent_companyid', this.state.agentData[index].agent_companyid);
    bodyFormData.append('agent_companyname', this.state.agentData[index].agent_companyname);
    bodyFormData.append('agent_photourl', this.state.agentData[index].agent_photourl);
        
    await postData(bodyFormData)
      .then((res) => {
        if (res.length == 0 || res[0].error) {
          Alert.alert(
            'Link is failed. \n Please Try Again',
            '',
            [
              { text: 'OK', onPress: () => {} }
            ],
          );
          return;
        }
        //console.log('mls link success', res);                
        
        this.props.navigation.navigate('MlsSettingLink');
      })
      .catch((err) => {
        console.log('mls link error', err);        
      })        
  }

  onSearch = (query) => {
    if (query == '') return;
    this.getAgent(query);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title={'MLS SETTINGS'} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.goBack(null)} />
        </View>
        <View style={styles.txtContainer}>
          <Text style={styles.txt}>
            To link your Agent Plus™ to your
            {'\n'}
            MLS and Board of Realtors™
            {'\n'}
            Please enter Agent's Full Name
          </Text>
        </View>
        <View style={styles.searchContainer}>
          <SearchBox boxStyle={{ width: width * 0.9, height: normalize(35, 'height'), backgroundColor: Colors.searchBackColor, borderColor: Colors.blueColor, btnColor: Colors.blueColor }} placeholderTxt={'Enter Agent Full Name'} onSearch={this.onSearch} />
        </View>
        <ScrollView style={{ marginTop: normalize(10, 'height') }}>
          {
            this.state.spinner &&
            <View style={{ width: '100%', height: height * 0.65, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator style={{ position: 'absolute' }} animating={this.state.spinner} />
            </View>
          }
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
    height: '14%',
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
    marginBottom: normalize(5, 'height'),
    // borderColor: Colors.borderColor,
    // borderWidth: normalize(0.5, 'height'),        
  },
  emptyContainer: {
    width: '100%',
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyTxt: {
    fontFamily: 'SFProText-Semibold',
    fontSize: RFPercentage(2),
    color: Colors.blackColor
  },
});