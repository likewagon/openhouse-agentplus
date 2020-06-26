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
  Dimensions
} from "react-native";
import normalize from 'react-native-normalize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import PropTypes from 'prop-types';
import { Colors, Images } from '@constants';

export default class ClientCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{
        width: this.props.cardStyle.width,
        height: normalize(85),
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.borderColor,
        borderRadius: normalize(5),
        borderWidth: normalize(0.5),
        padding: normalize(10)
      }}>
        <Image style={{ width: normalize(60), height: normalize(60), borderRadius: normalize(30), borderColor: Colors.borderColor, borderWidth: normalize(0.5) }} resizeMode='stretch' source={this.props.clientImg} />
        <View style={{ justifyContent: 'space-between', paddingLeft: normalize(10) }}>
          <Text style={{ fontFamily: 'SFProText-Regular', fontSize: RFPercentage(2), color: Colors.blackColor }}>{this.props.clientName}</Text>
          {
            this.props.clientEmail &&
            <Text style={{ fontFamily: 'SFProText-Regular', fontSize: RFPercentage(1.8), color: Colors.passiveTxtColor }}>{this.props.clientEmail}</Text>
          }
          {
            this.props.clientTelephone &&
            <Text style={{ fontFamily: 'SFProText-Regular', fontSize: RFPercentage(1.8), color: Colors.passiveTxtColor }}>{this.props.clientTelephone}</Text>
          }
          <Text style={{ fontFamily: 'SFProText-Regular', fontSize: RFPercentage(1.5), color: Colors.passiveTxtColor }} numberOfLines={1} ellipsizeMode={'tail'}>Active on: {this.props.clientLastActivity}</Text>
        </View>
      </View>
    );
  }
}

ClientCard.propTypes = {
  cardStyle: PropTypes.object.isRequired, 
  clientName: PropTypes.string.isRequired,
  clientEmail: PropTypes.string,
  clientTelephone: PropTypes.string,
  clientImg: PropTypes.object.isRequired,
  clientLastActivity: PropTypes.string.isRequired,
};