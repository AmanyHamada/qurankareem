import React, { Component } from "react";
import { Image, ImageBackground, View, Animated, Platform } from "react-native";
import { ReactNativeAudioStreaming } from "react-native-audio-stream";
import MusicControl from "react-native-music-control";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { connect } from "react-redux";
import QkHeader from "../Components/QkHeader";
import { Button } from "../Components/Button";
import { Images, Metrics } from "../Themes";
import {
  MAIN_BUTTON_STYLES,
  STOP_BUTTON_STYLES,
  BUTTON_ACTIVE_COLOR,
  styles
} from "./StreamingScreenStyles";

const PLAY_ICON = { name: "play", color: "black", size: 36 };
const PAUSE_ICON = { name: "pause", color: "black", size: 36 };
const STOP_ICON = { name: "stop", color: "black", size: 36 };

const STREAM_INFO = {
  title: "إذاعة القرآن الكريم",
  source: "quran-radio.org",
  url: "http://www.quran-radio.org:8080/i"
};

class StreamingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "STOPPED"
    };
    this.handleMainButton = this.handleMainButton.bind(this);
    this.handleStopButton = this.handleStopButton.bind(this);
    this.playerStart = this.playerStart.bind(this);
    this.playerPause = this.playerPause.bind(this);
    this.playerResume = this.playerResume.bind(this);
    this.playerStop = this.playerStop.bind(this);
    this.backgroundColor = new Animated.Value(-1); // -1 Stopped, 0 Paused, 1 Playing
  }

  componentDidMount() {
    this.initialiseMusicControl();
  }

  componentDidUpdate(prevProps, prevState) {
    const { status } = this.state;
    if (prevState.status !== status) {
      this.updateMusicControlState();
      if (status === "PLAYING") {
        Animated.timing(this.backgroundColor, {
          toValue: 1,
          duration: 500
        }).start();
      } else if (status === "PAUSED") {
        Animated.timing(this.backgroundColor, {
          toValue: 0,
          duration: 500
        }).start();
      } else {
        Animated.timing(this.backgroundColor, {
          toValue: -1,
          duration: 500
        }).start();
      }
    }
  }

  componentWillUnmount() {
    MusicControl.resetNowPlaying();
    this.playerStop();
  }

  initialiseMusicControl() {
    MusicControl.enableBackgroundMode(true);
    if (Platform.OS === "ios") {
      MusicControl.handleAudioInterruptions(true);
    }
    MusicControl.on("play", this.playerStart);
    MusicControl.on("pause", this.playerPause);
    MusicControl.on("stop", this.playerStop);
    this.updateMusicControlState();
  }

  updateMusicControlState() {
    const newState = this.musicControlState();
    switch (newState) {
      case MusicControl.STATE_PLAYING:
      case MusicControl.STATE_BUFFERING:
        MusicControl.enableControl("play", false);
        MusicControl.enableControl("pause", true);
        break;
      case MusicControl.STATE_PAUSED:
        MusicControl.enableControl("play", true);
        MusicControl.enableControl("pause", false);
        break;
      default:
        MusicControl.enableControl("play", true);
        MusicControl.enableControl("pause", false);
    }
    if (Platform.OS === "android") {
      MusicControl.enableControl("closeNotification", true, { when: "always" });
    }
    MusicControl.updatePlayback({ state: newState, elapsedTime: 100 });
  }

  musicControlState() {
    const { status } = this.state;
    switch (status) {
      case "PLAYING":
      case "BUFFERING":
        return MusicControl.STATE_PLAYING;
      case "PAUSED":
        return MusicControl.STATE_PAUSED;
      default:
        return MusicControl.STATE_STOPPED;
    }
  }

  playerStart() {
    const { status } = this.state;
    if (status) {
      MusicControl.setNowPlaying({
        artist: STREAM_INFO.source,
        title: STREAM_INFO.title
      });
    }
    ReactNativeAudioStreaming.play(STREAM_INFO.url, {
      showIniOSMediaCenter: false,
      showInAndroidNotifications: false
    });
    this.updateStatus("PLAYING");
  }

  playerPause() {
    ReactNativeAudioStreaming.pause();
    this.updateStatus("PAUSED");
  }

  playerResume() {
    ReactNativeAudioStreaming.resume();
    this.updateStatus("PLAYING");
  }

  playerStop() {
    ReactNativeAudioStreaming.stop();
    this.updateStatus("STOPPED");
  }

  updateStatus(status) {
    this.setState({ status });
  }

  handleMainButton() {
    const { status } = this.state;
    switch (status) {
      case "PAUSED":
        this.playerResume();
        break;
      case "PLAYING":
      case "BUFFERING":
        this.playerPause();
        break;
      default:
        this.playerStart();
        break;
    }
  }

  handleStopButton() {
    this.playerStop();
  }

  render() {
    const { status } = this.state;
    const currentMainIcon = status === "PLAYING" ? PAUSE_ICON : PLAY_ICON;
    return (
      <ImageBackground
        style={{
          flex: 1,
          position: "absolute",
          alignSelf: "center",
          width: Metrics.screenWidth,
          height: Metrics.screenHeight
        }}
        resizeMode="stretch"
        source={this.props.image}
      >
        <QkHeader title={"البث الإذاعي"} />
        <View style={styles.view}>
          <Image
            source={Images.rszQuranKareemLogo}
            style={{
              marginTop: -20,
              width: (6 * Metrics.screenWidth) / 7,
              height: responsiveHeight(50),
              alignSelf: "center"
            }}
          />
          <View style={styles.panel}>
            <Button
              type="highlight"
              icon={currentMainIcon}
              buttonStyles={MAIN_BUTTON_STYLES}
              activeColor={BUTTON_ACTIVE_COLOR}
              onPress={this.handleMainButton}
            />
            <View style={styles.stopButtonContainer}>
              <Button
                type="opacity"
                icon={STOP_ICON}
                buttonStyles={STOP_BUTTON_STYLES}
                activeColor={BUTTON_ACTIVE_COLOR}
                onPress={this.handleStopButton}
                disabled={status === "STOPPED"}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StreamingScreen);
