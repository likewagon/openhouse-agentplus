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
        console.log('agent search data', res);
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
    // let desc = 'Are you sure you want to select ' +
    //   this.state.agentData[index].realtor_full_name +
    //   ' from ' +
    //   this.state.agentData[index].realtor_company +
    //   ' as your preferred real estate agent?';

    // Alert.alert(
    //   'Please confirm',
    //   desc,
    //   [
    //     { text: 'Yes', onPress: () => this.onYes() },
    //     { text: 'No', onPress: () => { } },
    //   ],
    //   {
    //     cancelable: true
    //   }
    // );
  }

  onYes = async () => {
    // let userAssignedAgent = this.state.agentData[this.state.selectedIndex].realtor_account;
    // LoginInfo.user_assigned_agent = userAssignedAgent;
    // await AsyncStorage.setItem('UserAssignedAgent', userAssignedAgent.toString());
    // await AsyncStorage.setItem('LoginInfo', JSON.stringify(LoginInfo));
    // this.props.navigation.navigate('Main');
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
            To link your Open™ to your
            {'\n'}
            MLS and Board of Realtors™?
          </Text>
        </View>
        <View style={styles.searchContainer}>
          <SearchBox boxStyle={{ width: width * 0.9, height: normalize(35, 'height'), backgroundColor: Colors.searchBackColor, borderColor: Colors.blueColor, btnColor: Colors.blueColor }} placeholderTxt={'Enter agent full name'} onSearch={this.onSearch} />
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