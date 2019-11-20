import React, { Component } from 'react'
import { AsyncStorage, ScrollView, TouchableOpacity, ImageBackground, Linking } from 'react-native'
import { connect } from 'react-redux'
import { Container, Card, CardItem, Text, Right, Switch, Left, View, Picker  } from 'native-base';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'

import Modal from 'react-native-modalbox'
import Actions from '../Redux/StartupRedux';

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/SettingsScreenStyle'
import Api from '../Services/Api';
import { Metrics, Colors } from '../Themes';
import QkHeader from '../Components/QkHeader';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

const cardHeight = 55;
const cardWidth = Metrics.screenWidth - 100;
const smallFontSize = 16;
const bigFontSize = 20;

class SettingsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      generalInfo: {},
      notificationPref:false,
      moazenPref:'Azan naji qazzaz.mp3'
    }
  }

  async componentDidMount() {
    const api = Api.create()
    const generalInfo = await AsyncStorage.getItem('generalInfo');
    if (generalInfo) {
      this.setState({ generalInfo: JSON.parse(generalInfo) });
    }
    await api.getGeneralInfo(this.cb)
    this.getSwitchState()

    this.loadNotificationPref()
    this.loadMoazenPref()
  }

  cb = ss => {
    this.setState({ generalInfo: ss.val() })
    AsyncStorage.setItem('generalInfo', JSON.stringify(ss.val()));
  }

  getSwitchState = async () => {
    let isDayLightSaving = await AsyncStorage.getItem('isDayLightSaving');
    let isNotificationsOn = await AsyncStorage.getItem('isNotificationsOn');

    if (isDayLightSaving !== null) {
      isDayLightSaving = eval(isDayLightSaving)
      this.setState({ isDayLightSaving })
    }
    if (isNotificationsOn !== null) {
      isNotificationsOn = eval(isNotificationsOn)
      this.setState({ isNotificationsOn })
    }
  }

  changeIsDayLightSaving = async (value) => {
    await AsyncStorage.setItem('isDayLightSaving', String(value));
    this.setState({ isDayLightSaving: value }, () => this.props.setIsDayLightSaving(value))
  }
  changeIsNotificationsOn = async (value) => {
    await AsyncStorage.setItem('isNotificationsOn', String(value));
    this.setState({ isNotificationsOn: value }, () => this.props.setNotifications(value))
  }

  shareSocial = (type)=>{
      switch(type){
        case 'live':
            Linking.openURL('https://www.youtube.com/channel/UCKH2zdRW74bzzWr2TWA9jQQ?view_as=subscriber')
          return
          case 'facebook':
              Linking.openURL('https://www.facebook.com/Quranradionablus/')
              return
          case 'instgram':
              Linking.openURL('https://www.instagram.com/qurannablus/')
              return
          case 'youtube':
              Linking.openURL('https://www.youtube.com/channel/UCJaly1DF3Qm11VxXH0jRCog?view_as=subscriber')
              return
          case 'soundcloud':
              Linking.openURL('https://soundcloud.com/quranradionablusfm')
              return
          case 'website':
              Linking.openURL('http://www.quran-radio.com/')
              return
              case 'app':
                  Linking.openURL('https://play.google.com/store/apps/details?id=com.perfectfit.qurankareem')
                  return
      }
  }

  changeNotificationPref = async (value)=>{
    try{
      this.setState({notificationPref:value})
      const result = await AsyncStorage.setItem('notificationPref',String(value))

    }catch(error){
      console.error(error)
    }
    }

  loadNotificationPref = async ()=>{
      const result = await AsyncStorage.getItem('notificationPref')
      this.setState({notificationPref:Boolean(result || false)})
  }
  loadMoazenPref = async ()=>{
    const result = await AsyncStorage.getItem('moazenPref')
    this.setState({moazenPref:result})
  }

  changeMoazen = async(value)=>{
    const result = await AsyncStorage.setItem('moazenPref',value)
    this.setState({moazenPref:value})
  }

  render() {
    return (
      <Container>
        <ImageBackground
          style={{
            flex: 1,
            position: 'absolute',
            width: Metrics.screenWidth,
            height: Metrics.screenHeight,
            alignSelf: 'center',
            justifyContent: 'space-evenly'
          }}
          resizeMode='stretch'
          source={this.props.image}
        >
          <QkHeader title={"المزيد"} />
          <View style={{ flex: 2 }}>
            <ScrollView style={{ marginBottom: 80 }}>
            <Card style={{ borderRadius: 10, width: cardWidth, alignSelf: 'center', justifyContent: 'center' }}>
                <CardItem style={{ backgroundColor: 'rgb(247,247,247)', borderRadius: 10, width: cardWidth, height: cardHeight, justifyContent: 'center', alignItems: 'center' }}>
                  <Left style={{ flex: 1, marginLeft: 20 }}>
                  <Switch  onValueChange={this.changeNotificationPref} value={this.state.notificationPref} />
                  </Left>
                <Right>
                <Text style={{ fontSize: responsiveFontSize(2.8) * this.props.fontSizeFactor}} >التنبيهات</Text>

                </Right>
                </CardItem>
             { this.state.notificationPref &&  <CardItem style={{ backgroundColor: 'rgb(247,247,247)', borderRadius: 10, width: cardWidth, height: cardHeight, justifyContent: 'center', alignItems: 'center' }}>
                  <Left style={{ flex: 1, marginLeft: 20 }}>
                  <Picker
                style={{minWidth:150}}
                        iosHeader="المؤذن"
                        mode="dropdown"
                        selectedValue={this.state.moazenPref}
                        onValueChange={this.changeMoazen}
                        >
                        <Picker.Item label="ناجي القزاز" value="Azan naji qazzaz.mp3" />
                        <Picker.Item label="محمد العزاوي" value="Azan mohamed azzawi.mp3" />
                        <Picker.Item label="معروف الشريف" value="Azan fajr.mp3" />

                   </Picker>
                  </Left>
                <Right>
                <Text style={{ fontSize: responsiveFontSize(2.8) * this.props.fontSizeFactor}} >المؤذن</Text>


                </Right>
                </CardItem>}
              </Card>

              <SwitchCard
                fontSizeFactor={this.props.fontSizeFactor}
                condition={this.state.isDayLightSaving}
                changeCondition={(value) => this.changeIsDayLightSaving(value)}
                leftText={"صيفي"}
                rightText={"شتوي"} />

              <Card style={{ borderRadius: 10, width: cardWidth, alignSelf: 'center', justifyContent: 'center' }}>
                <CardItem style={{ backgroundColor: 'rgb(247,247,247)', borderRadius: 10, width: cardWidth, height: cardHeight, justifyContent: 'center', alignItems: 'center' }}>
                  <Left style={{ flex: 1, marginLeft: 20 }}>
                    <EvilIcons style={{ fontSize: responsiveFontSize(5) }} name="plus" onPress={this.props.increaseFontSizeFactor} />
                  </Left>
                  <Text style={{ fontSize: responsiveFontSize(2.8) * this.props.fontSizeFactor, textAlign: 'center', fontFamily: "Al-Jazeera-Arabic-Regular" }}>حجم الخط</Text>
                  <Right style={{ flex: 1, marginRight: 20 }}>
                    <EvilIcons style={{ fontSize: responsiveFontSize(5) }} name="minus" onPress={this.props.decreaseFontSizeFactor} />
                  </Right>
                </CardItem>
              </Card>
              <TouchableOpacity onPress={() => Linking.openURL('https://qiblafinder.withgoogle.com/intl/ar')}>
                <Card style={{ borderRadius: 10, width: cardWidth, alignSelf: 'center', justifyContent: 'center' }}>
                  <CardItem style={{ backgroundColor: 'rgb(247,247,247)', borderRadius: 10, width: cardWidth, height: cardHeight, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: responsiveFontSize(2.8) * this.props.fontSizeFactor, textAlign: 'center', fontFamily: "Al-Jazeera-Arabic-Regular" }}>القبلة</Text>
                  </CardItem>
                </Card>
              </TouchableOpacity>
              <Card style={{ borderRadius: 10, width: cardWidth, alignSelf: 'center', justifyContent: 'center' }}>
                  <CardItem style={{ backgroundColor: 'rgb(247,247,247)', borderRadius: 10, width: cardWidth, height: cardHeight, justifyContent: 'center', alignItems: 'center' }}>
                  <EvilIcons style={{ fontSize: responsiveFontSize(5) }} color='#4CAF50' type="EvilIcons" name="sc-facebook" onPress={()=>this.shareSocial('facebook')} />
                  <EvilIcons style={{ fontSize: responsiveFontSize(5) }} color='#4CAF50' type="EvilIcons" name="link" onPress={()=>this.shareSocial('website')} />
                  <EvilIcons style={{ fontSize: responsiveFontSize(5) }} color='#4CAF50' type="EvilIcons" name="sc-soundcloud" onPress={()=>this.shareSocial('soundcloud')} />
                  <Entypo style={{ fontSize: responsiveFontSize(3) }} color='#4CAF50' name="instagram" onPress={()=>this.shareSocial('instgram')} />
                  <EvilIcons style={{ fontSize: responsiveFontSize(5) }} color='#4CAF50' name="sc-youtube" onPress={()=>this.shareSocial('youtube')} />
                  <EvilIcons style={{ fontSize: responsiveFontSize(5) }} color='#4CAF50' name="play" onPress={()=>this.shareSocial('live')} />
                  <EvilIcons style={{ fontSize: responsiveFontSize(5) }} color='#4CAF50' name="share-google" onPress={()=>this.shareSocial('app')} />
                  </CardItem>
                </Card>
            </ScrollView>
          </View>
        </ImageBackground>
      </Container>
    )
  }
}

const SwitchCard = ({ condition, changeCondition, leftText, rightText, fontSizeFactor }) => {
  return (
    <Card style={{ borderRadius: 10, width: cardWidth, alignSelf: 'center', justifyContent: 'center' }}>
      <CardItem style={{ backgroundColor: 'rgb(247,247,247)', height: cardHeight, borderRadius: 10, width: cardWidth }}>
        <Left style={{ alignItems: 'flex-start', paddingLeft: 30 }}>
          <Switch value={condition} onValueChange={(value) => changeCondition(value)} />
        </Left>
        <Right style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingRight: 30 }}>
          <Text style={{
            fontFamily: condition ? 'Al-Jazeera-Arabic-Bold' : 'Al-Jazeera-Arabic-Regular',
            fontSize: (condition ? responsiveFontSize(2.8) : smallFontSize) * fontSizeFactor
          }}>{leftText}</Text>
          {rightText && <Text>/</Text>}
          {rightText && <Text style={{
            color: 'black',
            fontFamily: condition ? 'Al-Jazeera-Arabic-Regular' : 'Al-Jazeera-Arabic-Bold',
            fontSize: (condition ? 16 : responsiveFontSize(2.8)) * fontSizeFactor
          }}>{rightText}</Text>}
        </Right>
      </CardItem>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    fontSizeFactor: state.startup.fontSizeFactor
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setIsDayLightSaving: (value) => dispatch(Actions.setIsDayLightSaving(value)),
    setNotifications: (value) => dispatch(Actions.setNotifications(value)),
    decreaseFontSizeFactor: () => dispatch(Actions.decreaseFontSizeFactor()),
    increaseFontSizeFactor: () => dispatch(Actions.increaseFontSizeFactor()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)
