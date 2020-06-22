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
          desc: 'Required that attendees that enter your in-person open house signs the department of state agency disclosure form',
          value: 1
        },
        {
          id: 1,
          title: 'VIRTUAL TOUR SETTINGS',
          desc: 'Required that attendees that enter your online virtual tour signs the department of state agency disclosure',
          value: 1
        },
        {
          id: 2,
          title: 'LIVE STREAM SETTINGS',
          desc: 'Required that attendees that enter your LIVE STREAM Open House signs the department of state agency',
          value: 1
        }
      ]
    }
  }

  componentDidMount() {

  }

  updatePreference = () => {
    console.log(this.state.preferenceData);
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
    height: normalize(120),
    alignSelf: 'center',
    marginTop: normalize(17, 'height'),
    borderColor: Colors.borderColor,
    borderWidth: normalize(0.5, 'height'),
    padding: normalize(10)
  },
  topPart: {
    width: '100%',
    height: '45%',
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
  desc: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
  },
  bottomPart: {
    width: '100%',
    height: '55%',
    //borderWidth: 1
  },
});