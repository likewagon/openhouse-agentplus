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

import { activateKeepAwake, deactivateKeepAwake} from "@sayem314/react-native-keep-awake";
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo
} from "react-native-twilio-video-webrtc";

import {
  Button,
  ClientCard,
  Header,
  LabelTag,
  PropertyCard,
  SearchBox,
  SideMenu,
  SignModal,
} from '@components';
import { Colors, Images, LoginInfo, RouteParam } from '@constants';

export default class LiveCallScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mute: false,      
      status: "disconnected",
      participants: new Map(),
      videoTracks: new Map(),
    }
  }

  componentDidMount() {
    activateKeepAwake();
    this._onConnectButtonPress();
  }

  componentWillUnmount(){
    deactivateKeepAwake();
  }

  _onConnectButtonPress = () => {
    try {
      this.twilioRef.connect({
        roomName: RouteParam.liveInfo.roomname,
        accessToken: RouteParam.liveInfo.token
      });
    } catch (error) {
      //console.log('live connect error', error);
    }
    this.setState({ status: "connecting" });
  };

  _onEndButtonPress = () => {
    this.twilioRef.disconnect();
    if(RouteParam.liveCallFromClosed){
      RouteParam.liveCallFromClosed = false;
      this.props.navigation.navigate('Splash');
    }
    else{
      this.props.navigation.goBack(null);
    }
  };

  _onMuteButtonPress = () => {
    this.twilioRef
      .setLocalAudioEnabled(!this.state.mute)
      .then(isEnabled => this.setState({ mute: isEnabled }));
  };

  _onFlipButtonPress = () => {
    this.twilioRef.flipCamera();
  };

  _onRoomDidConnect = () => {
    //console.log("LiveCall :: connected")
    this.setState({ status: "connected" });
  };

  _onRoomDidDisconnect = ({ roomName, error }) => {
    //console.log("_onRoomDidDisconnect: ", error);
    this.setState({ status: "disconnected" });
  };

  _onRoomDidFailToConnect = error => {
    //console.log("_onRoomDidFailToConnect: ", error);
    this.setState({ status: "disconnected" });
  };

  _onParticipantAddedVideoTrack = ({ participant, track }) => {
    //console.log("onParticipantAddedVideoTrack: ", participant, track);

    this.setState({
      videoTracks: new Map([
        ...this.state.videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid }
        ]
      ])
    });
  };

  _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    //console.log("onParticipantRemovedVideoTrack: ", participant, track);

    const videoTracks = this.state.videoTracks;
    videoTracks.delete(track.trackSid);

    this.setState({ videoTracks: new Map([...videoTracks]) });
  };

  setTwilioRef = ref => {
    this.twilioRef = ref;
  };


  render() {
    return (
      <ImageBackground style={styles.container} source={{ uri: RouteParam.property.property_main_photo_url }}>
        {/* <View style={styles.headerContainer}>
          <Header title={'LIVE CALL'} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.goBack(null)} />
        </View> */}
        {this.state.status === "connected" && (
          <View style={styles.remoteSmallVideoContainer}>            
            {Array.from(
              this.state.videoTracks,
              ([trackSid, trackIdentifier]) => {
                return (
                  <TwilioVideoParticipantView
                    style={styles.remoteSmallVideo}
                    key={trackSid}
                    trackIdentifier={trackIdentifier}
                  />
                );
              }
            )}
          </View>
        )}
        <View style={styles.localBigVideoContainer}>
          <TwilioVideoLocalView enabled={true} style={styles.localBigVideo} />
        </View>
        <View style={styles.btnsContainer}>
          <TouchableOpacity onPress={() => {
            this._onMuteButtonPress();
            this.setState({ mute: !this.state.mute });
          }}>
            <Image style={styles.btnImg} source={this.state.mute ? Images.btnMute : Images.btnUnmute} resizeMode='cover' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._onFlipButtonPress()}>
            <Image style={styles.btnImg} source={Images.btnFlipCam} resizeMode='cover' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._onEndButtonPress()}>
            <Image style={styles.btnImg} source={Images.btnCallOff} resizeMode='cover' />
          </TouchableOpacity>
        </View>

        <TwilioVideo
          ref={this.setTwilioRef}
          onRoomDidConnect={this._onRoomDidConnect}
          onRoomDidDisconnect={this._onRoomDidDisconnect}
          onRoomDidFailToConnect={this._onRoomDidFailToConnect}
          onParticipantAddedVideoTrack={this._onParticipantAddedVideoTrack}
          onParticipantRemovedVideoTrack={this._onParticipantRemovedVideoTrack}
        />
      </ImageBackground>
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
    height: height,
  },
  headerContainer: {
    width: '100%',
    height: normalize(70, 'height'),
    justifyContent: 'center',
    alignItems: 'center',
    //borderColor: Colors.borderColor,
    //borderBottomWidth: normalize(0.5, 'height'),
  },  
  localBigVideoContainer: {
    flex: 1,
    //flexDirection: "row",
    //flexWrap: "wrap"
  },
  localBigVideo: {
    width: '100%',
    height: '100%',
    //borderWidth: 2,
    //borderColor: '#ff0000'
  },
  remoteSmallVideoContainer: {
    position: 'absolute',
    top: normalize(40, 'height'),        
    width: '95%',
    height: normalize(100),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center'
  },
  remoteSmallVideo: {    
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(5),
    //borderWidth: normalize(2),
    //borderColor: '#4e4e4e'
  },  
  btnsContainer: {
    position: 'absolute',
    bottom: normalize(15, 'height'),
    width: '75%',
    height: '17%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    //borderWidth: 2
  },
  btnImg: {
    width: normalize(60),
    height: normalize(60),
  },
});