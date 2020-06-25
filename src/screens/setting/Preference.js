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
import SwitchSelector from 'react-native-switch-selector';

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

export default class PreferenceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: -1,      
      preferenceData: [
        {
          id: 0,          
          title: 'IN-PERSON OPEN HOUSE AGENCY DISCLOSURE FORMS',
          desc: 'Required that every attendees that enter your In-Person Open House signs the department of state agency disclosure form and any additional disclaimers or documents required by your local Board of Realtors.',
          value: 0
        },        
        {
          id: 1,          
          title: 'LIVE STREAM SETTINGS',
          desc: 'Required that every attendees that enter your LIVE STREAM Open House signs the department of state agency disclosure form and any additional disclaimers or documents required by your local Board of Realtors.',
          value: 0
        }
      ]
    }
  }

  componentDidMount() {
    this.getPreference();
  }

  getPreference = () => {
    var preferenceParam = {
      action: 'my_preference',
      account_no: LoginInfo.user_account,      
    };
    
    getContentByAction(preferenceParam)
      .then((res) => {
        //console.log(res);
        if(res){
          var {preferenceData} = this.state;
          preferenceData[0].value = res[0].in_person;          
          preferenceData[1].value = res[0].live_stream;
                    
          this.setState({
            preferenceData: preferenceData,          
          });        
        }
      })
      .catch((err) => {
        console.log('get preference error', err);        
      })
  }

  updatePreference = async () => {
    let bodyFormData = new FormData();
    bodyFormData.append('action', 'update_preferences');
    bodyFormData.append('account_no', LoginInfo.user_account);
    bodyFormData.append('in_person', this.state.preferenceData[0].value);
    bodyFormData.append('live_stream', this.state.preferenceData[1].value);
        
    await postData(bodyFormData)
      .then((res) => {
        if (res.length == 0 || res[0].error) {
          Alert.alert(
            'Update is failed. \n Please Try Again',
            '',
            [
              { text: 'OK', onPress: () => {} }
            ],
          );
          return;
        }
        console.log('update preference success', res);                
      })
      .catch((err) => {
        console.log('update preference error', err);        
      })    
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title={'MY PREFERENCE'} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.goBack(null)} />
        </View>
        <View style={styles.body}>
          {
            this.state.preferenceData.map((each, index) => {
              return (
                <View key={index} style={styles.itemContainer}>
                  <View style={styles.topPart}>
                    <View style={styles.titlePart}>
                      <Text style={styles.title}>
                        {each.title}
                      </Text>
                    </View>
                    <View style={styles.switchPart}>
                      <SwitchSelector
                        style={{ width: '85%', height: normalize(30) }}
                        height={normalize(30)}
                        backgroundColor={each.value ? Colors.blueColor : Colors.borderColor}
                        selectedColor='#00f'
                        buttonColor={Colors.whiteColor}
                        initial={each.value}
                        //value={each.value}
                        onPress={value => {
                          var { preferenceData } = this.state;
                          preferenceData[index].value = value;
                          this.setState({ preferenceData: preferenceData });
                          this.updatePreference();
                        }}
                        hasPadding
                        options={[
                          { label: "", value: 0 },
                          { label: "", value: 1 }
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.bottomPart}>
                    <Text style={styles.desc}>
                      {each.desc}
                    </Text>
                  </View>
                </View>
              )
            })
          }
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
    height: '90%',
    //borderWidth: 3
  },
  itemContainer: {
    width: '90%',
    height: normalize(180),    
    alignSelf: 'center',
    marginTop: normalize(17, 'height'),
    borderColor: Colors.borderColor,
    borderWidth: normalize(0.5),
    padding: normalize(15)
  },
  topPart: {
    width: '100%',
    height: '25%',
    flexDirection: 'row',
    //borderWidth: 1
  },
  titlePart: {
    width: '80%',
    height: '100%',
    //borderWidth: 1
  },
  switchPart: {
    width: '20%',
    height: '100%',
    alignItems: 'flex-end',
    //borderWidth: 1
  },
  title: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(2),
    color: Colors.blackColor,    
  },
  bottomPart: {
    width: '100%',
    height: '75%',
    justifyContent: 'flex-end',
    //borderWidth: 1
  },
  desc: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
    lineHeight: 22,
    //borderWidth: 1
  },
});