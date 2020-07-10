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
import { FlatGrid } from "react-native-super-grid";

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
      // items: [
      //   { name: 'Room1', property: '6021761' },
      //   { name: 'Room2', property: '2165932' },
      //   { name: 'Room3', property: '1234567' },
      //   { name: 'Room4', property: '2342422' },
      //   { name: 'Room5', property: '9393746' },
      //   { name: 'Room6', property: '7592957' },
      //   { name: 'Room7', property: '1200998' },
      //   { name: 'Room8', property: '7572774' },
      //   { name: 'Room9', property: '4834848' },
      //   { name: 'Room10', property: '4433234' },
      //   { name: 'Room11', property: '9882983' },
      //   { name: 'Room12', property: '2536472' },
      //   { name: 'Room13', property: '7467444' },
      // ],
      mute: true,
      mic: true,
      call: true,
      isVideoEnabled: true,
      status: "disconnected",
      participants: new Map(),
      videoTracks: new Map(),
    }
  }

  componentDidMount() {
    this._onConnectButtonPress();
  }

  _onConnectButtonPress = () => {
    try {
      console.log(this.state.roomName, this.state.token,
        RouteParam.liveInfo.roomname, RouteParam.liveInfo.token);

      this.twilioRef.connect({
        // roomName: this.state.roomName,
        // accessToken: this.state.token
        roomName: RouteParam.liveInfo.roomname,
        accessToken: RouteParam.liveInfo.token
      });
    } catch (error) {
      console.log('live connect error', error);
    }
    this.setState({ status: "connecting" });
  };

  _onEndButtonPress = () => {
    this.twilioRef.disconnect();
    this.props.navigation.navigate('Property');
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
    console.log("LiveCall :: connected")
    this.setState({ status: "connected" });
  };

  _onRoomDidDisconnect = ({ roomName, error }) => {
    console.log("_onRoomDidDisconnect: ", error);
    this.setState({ status: "disconnected" });
  };

  _onRoomDidFailToConnect = error => {
    console.log("_onRoomDidFailToConnect: ", error);
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
    console.log("onParticipantRemovedVideoTrack: ", participant, track);

    const videoTracks = this.state.videoTracks;
    videoTracks.delete(track.trackSid);

    this.setState({ videoTracks: new Map([...videoTracks]) });
  };

  setTwilioRef = ref => {
    this.twilioRef = ref;
  };


  render() {
    return (
      <ImageBackground style={styles.container} source={{ uri: RouteParam.propertyMainPhotoUrl }}>
        <View style={styles.headerContainer}>
          <Header title={'LIVE CALL'} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.goBack(null)} />
        </View>
        {/* <View style={styles.listContainer}>
          <FlatGrid
            itemDimension={normalize(80)}
            data={this.state.items}
            style={styles.gridView}
            // staticDimension={300}
            // fixed
            spacing={10}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemProperty}>{item.property}</Text>
              </View>
            )}
          />
        </View> */}
        {this.state.status === "connected" && (
          <View style={styles.remoteGrid}>
            {Array.from(
              this.state.videoTracks,
              ([trackSid, trackIdentifier]) => {
                return (
                  <TwilioVideoParticipantView
                    style={styles.remoteVideo}
                    key={trackSid}
                    trackIdentifier={trackIdentifier}
                  />
                );
              }
            )}
          </View>
        )}
        <View style={styles.btnsContainer}>
          <TouchableOpacity onPress={() => {
            this.setState({ mute: !this.state.mute });
            this._onMuteButtonPress();
          }}>
            <Image style={styles.btnImg} source={this.state.mute ? Images.btnUnmute : Images.btnMute} resizeMode='cover' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.setState({ mic: !this.state.mic });
            this._onEndButtonPress();
          }}>
            <Image style={styles.btnImg} source={this.state.mic ? Images.btnMicOn : Images.btnMicOff} resizeMode='cover' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.setState({ call: !this.state.call });
            this._onFlipButtonPress();
          }}>
            <Image style={styles.btnImg} source={this.state.call ? Images.btnCallOn : Images.btnCallOff} resizeMode='cover' />
          </TouchableOpacity>
          <TwilioVideoLocalView enabled={true} style={styles.localVideo} />
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
    // borderColor: Colors.borderColor,
    // borderBottomWidth: normalize(0.5, 'height'),
  },
  listContainer: {
    width: '100%',
    height: '70%',
    marginTop: normalize(10, 'height'),
    alignItems: 'center',
    //borderWidth: 2
  },
  gridView: {
    flex: 1,
  },
  itemContainer: {
    height: normalize(80),
    backgroundColor: Colors.whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(5),
    padding: 10,
    borderColor: Colors.blueColor,
    borderWidth: normalize(1)
  },
  itemName: {
    fontSize: 16,
    color: Colors.blackColor,
    fontWeight: '600',
  },
  itemProperty: {
    fontWeight: '600',
    fontSize: 12,
    color: Colors.blueColor,
  },
  btnsContainer: {
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
  localVideo: {
    flex: 1,
    width: 125,
    height: 200,
    position: "absolute",
    right: 10,
    bottom: 400,
    borderRadius: 2,
    borderColor: '#4e4e4e'
  },
  remoteGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  remoteVideo: {
    width: '100%',
    height: '100%'
  },
});