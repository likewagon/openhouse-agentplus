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
  Dimensions,
  Platform
} from "react-native";
import normalize from 'react-native-normalize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
Platform.OS === 'ios' ? Icon.loadFont() : '';

import { Colors, Images } from '@constants';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <View style={[
        styles.header,
        this.props.isSticky ?
          {
            backgroundColor: '#fff',
            height: normalize(60, 'height'),
            alignItems: 'center',
            borderColor: Colors.borderColor,
            borderBottomWidth: normalize(0.5, 'height')
          }
          : null]}
      >
        {this.props.leftIcon ?
          <TouchableOpacity style={styles.leftIcon} onPress={this.props.onPressLeftIcon}>
            <Image style={{ width: '50%', height: '60%' }} source={this.props.leftIcon} resizeMode='contain' />
          </TouchableOpacity>
          :
          this.props.noLeftIcon ?
            <View style={styles.leftIcon}>

            </View>
          :
            <TouchableOpacity style={styles.leftIcon} onPress={this.props.onPressBack}>
              <Icon
                name='angle-left'
                size={30}
                color={this.props.titleColor}
              />
            </TouchableOpacity>          
        }
        {
          this.props.rightLeftIcon ?
            <View style={styles.rightIcon}></View>
            : null
        }
        <View style={[styles.title, this.props.rightLeftIcon ? { width: '52%' } : null]}>
          <Text style={[
            styles.titleTxt,
            {
              fontFamily: 'SFProText-Semibold',
              fontSize: 14,
              color: this.props.titleColor
            }
          ]}>
            {this.props.title}
          </Text>
        </View>
        {this.props.rightLeftIcon ?
          <View style={styles.rightIcon}>
            <TouchableOpacity style={{ flex: 1 }} onPress={this.props.onPressRightLeftIcon}>
              <Image style={{ width: '70%', height: '80%', /*borderWidth: 1*/ }} source={this.props.rightLeftIcon} resizeMode='contain' />
            </TouchableOpacity>
          </View>
          : null
        }
        <View style={styles.rightIcon}>
          {this.props.rightIcon ?
            <TouchableOpacity style={{ flex: 1 }} onPress={this.props.onPressRightIcon}>
              <Image style={{ width: '70%', height: '80%', /*borderWidth: 1*/ }} source={this.props.rightIcon} resizeMode='contain' />
            </TouchableOpacity>
            : null
          }
        </View>
      </View>
    );
  }
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  titleColor: PropTypes.string.isRequired,
  leftIcon: PropTypes.number,
  noLeftIcon: PropTypes.any,
  rightLeftIcon: PropTypes.number,
  rightIcon: PropTypes.number,
  isSticky: PropTypes.bool,
  onPressBack: PropTypes.func,
  onPressLeftIcon: PropTypes.func,
  onPressRightLeftIcon: PropTypes.func,
  onPressRightIcon: PropTypes.func
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: normalize(50, 'height'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    //borderWidth: 2
  },
  leftIcon: {
    width: '12%',
    height: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    //borderWidth: 1
  },
  title: {
    width: '76%',
    height: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    //borderWidth: 2
  },
  titleTxt: {
    fontSize: RFPercentage(2),
  },
  rightIcon: {
    width: '12%',
    height: '60%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    //borderWidth: 1
  }
});