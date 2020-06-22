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
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import Icon from 'react-native-vector-icons/FontAwesome';
Platform.OS === 'ios' ? Icon.loadFont() : '';

import PropTypes from 'prop-types';
import { Colors, Images } from "../constants";

export default class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',      
    }
  }

  componentDidMount() {
    
  }

  render() {
    const { query } = this.state;
    return (
      <View>
        <View style={{
          backgroundColor: this.props.boxStyle.backgroundColor,
          width: this.props.boxStyle.width,
          height: this.props.boxStyle.height,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          borderRadius: normalize(10),
          borderColor: this.props.boxStyle.borderColor,
          borderWidth: normalize(1),
        }}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.txtInput}
              autoCapitalize='none'
              placeholder={this.props.placeholderTxt ? this.props.placeholderTxt : 'Search'}
              placeholderTextColor={Colors.weakBlackColor}
              value={query}
              onChangeText={(text) => {
                this.setState({ query: text });
                if(this.props.onFastSearch){
                  this.props.onFastSearch(text)
                }
              }}
            />
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity onPress={() => { this.props.onSearch(this.state.query); }}>
              <Icon
                name='search'
                size={20}
                color={this.props.boxStyle.btnColor}
              />
            </TouchableOpacity>
          </View>
        </View>        
      </View>
    );
  }
}

SearchBox.propTypes = {
  boxStyle: PropTypes.object.isRequired,
  placeholderTxt: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  onFastSearch: PropTypes.func,
};

const styles = StyleSheet.create({
  searchContainer: {
    width: '90%',
    height: normalize(30, 'height'),
    justifyContent: 'center',
    // borderColor: '#00ff00',
    // borderWidth: 2
  },
  txtInput: {
    paddingLeft: normalize(10),
    color: Colors.blackColor,
    fontSize: RFPercentage(2)
  },
  btnContainer: {
    width: '20%',
    justifyContent: 'center',
  },  
})