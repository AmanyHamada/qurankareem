import { ImageBackground, ScrollView, TouchableOpacity, Image, AsyncStorage, Platform, UIManager, LayoutAnimation, } from 'react-native'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import moment, { min } from 'moment';
import momentH from 'moment-hijri';
import Api from '../Services/Api';
import { Metrics } from '../Themes/index.js';
import PrayerCard from '../Components/PrayerCard'
import { View, Text } from 'native-base';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import * as Notification from '../Services/Notification';
import PrayersTimesDay from './PrayersTimesDay';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CustomLayoutAnimation = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.scaleXY,
  },
  update: {
    duration: 200,
    property: LayoutAnimation.Properties.opacity,

    type: LayoutAnimation.Types.curveEaseInEaseOut,
  },
  delete:{
    duration: 100,
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.scaleXY,
  },
};

const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', ' السبت']
const salwatNames = ['الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'العشاء']
const miladiMonthsNames = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'];
const hijriMonthsNames = 'محرم_صفر_ربيع الأول_ربيع الثاني_جمادى الأولى_جمادى الآخرة_رجب_شعبان_رمضان_شوال_ذو القعدة_ذو الحجة'.split('_');
const QKLogoBW = require('../Images/QKLogoBW.png')
const taqweem = require('../Images/taqweem.png')
const salawat = require("../Fixtures/FormattedSalawat.json");

class PrayersTimesScreen extends Component {
  constructor(props) {
    super(props)
    const check = moment();
    const checkH = momentH();
    
    this.state = {
      check,
      checkH,
      selectedDay:moment(),
      today: days[moment().format('e')],
      currentMiladiDay: {
        selectedDay: moment().format('DD'),
        selectedMonth: moment().format('MM'),
        selectedYear: moment().format('YYYY'),
      },
      currentTime: moment().format("HH:mm"),
      currentHijriDay: {
        hijriDay: "01",
        hijriMonth: "01",
        hijriYear: Number(checkH.format('iYYYY')),
      }
    }

  }

  async componentDidMount() {
   try{
    const salah = salawat[this.state.currentMiladiDay.selectedMonth].find(salah => salah.day == this.state.currentMiladiDay.selectedDay);
    this.setState({ salah });
    await Notification.createNotification(this.salahTimeToMoment(salah))
  
    const api = Api.create();
    // const currentHijriDay = await AsyncStorage.getItem('currentHijriDay');
    // if (currentHijriDay) {
    //   this.setState({ currentHijriDay: JSON.parse(currentHijriDay) });
    // }
    // api.getTodaysInfoOffset((snapshot)=>{
      
    // console.error(snapshot.val())
    //  this.setState({ hijiriOffset:snapshot.val()})
    // })

  const [todaySnapshot,offsetSnapShot] =  await  api.getTodayAndOffsetPromise(moment().year(), moment().format("MM"), moment().date())
      alert('done')
      const offset = offsetSnapShot.val()
      const currentHijriDay= todaySnapshot.val()
    
      const appliedDate = this.applyHijriOffset(currentHijriDay,offset)
   
      this.setState({ currentHijriDay: appliedDate}, () => {
       AsyncStorage.setItem('currentHijriDay', JSON.stringify(appliedDate));
      })
 
    alert('done api call')
    // api.getTodaysInfo(moment().year(), moment().format("MM"), moment().date(),
    //   snapshot => {
    //     console.warn('here')
    //     this.setState({ currentHijriDay: snapshot.val() }, () => {
    //       AsyncStorage.setItem('currentHijriDay', JSON.stringify(snapshot.val()));
    //     })
    //   }
    // );
  }catch(e){
   alert(JSON.stringify(e))
  }
  }

  applyHijriOffset = (date,offset)=>{
    let {hijri:{hijriDay, hijriMonth, hijriYear, day, month, year}} = date
  
    let m = momentH(`${year||hijriYear}/${month||hijriMonth}/${day||hijriDay}`, 'iYYYY/iM/iD').add(offset,'iDate');

    return {hijri:{hijriDay:m.iDate(),
       hijriMonth:Number(m.iMonth())+1,
        hijriYear:m.iYear(),
         day:m.iDate(),
          month:Number(m.iMonth())+1,
           year:m.iYear()}
  }}


  salahTimeToMoment =(salah)=>{
    
    const momentFajer = salah.fajer && moment(salah.fajer, "h:mm");
    const momentSunrise = salah.sunrise && moment(salah.sunrise, "h:mm");
    let momentDhuhur = salah.dhuhur && moment(salah.dhuhur, "h:mm");
    const momentAsr = salah.asr && moment(`${salah.asr} pm`, "h:mm a");
    const momentMaghreb = salah.maghreb && moment(`${salah.maghreb} pm`, "h:mm a");
    const momentIshaa = salah.Ishaa && moment(`${salah.Ishaa} pm`, "h:mm a");

    const hoursOfDhuhur = momentDhuhur.format("hh");
    if (hoursOfDhuhur < 5 && hoursOfDhuhur >= 1) {
      //pm
      momentDhuhur = salah.dhuhur && moment(`${salah.dhuhur} pm`, "h:mm");
    } else {
      // hoursOfDhuur > 9 && <= 12
      // am
      momentDhuhur = salah.dhuhur && moment(`${salah.dhuhur} am`, "h:mm");
    }
    return {
      fajer: momentFajer,
      sunrise: momentSunrise,
      dhuhur: momentDhuhur,
      asr: momentAsr,
      maghreb: momentMaghreb,
      Ishaa: momentIshaa
    }
}


  getNextSalahName = (currentTime, salah) => {
    const timeMoment = moment(`${currentTime}`, "hh:mm");
    if (salah) {
      const momentFajer = salah.fajer && moment(salah.fajer, "h:mm");
      const momentSunrise = salah.sunrise && moment(salah.sunrise, "h:mm");
      let momentDhuhur = salah.dhuhur && moment(salah.dhuhur, "h:mm");
      const momentAsr = salah.asr && moment(`${salah.asr} pm`, "h:mm a");
      const momentMaghreb = salah.maghreb && moment(`${salah.maghreb} pm`, "h:mm a");
      const momentIshaa = salah.Ishaa && moment(`${salah.Ishaa} pm`, "h:mm a");

      const hoursOfDhuhur = momentDhuhur.format("hh");
      if (hoursOfDhuhur < 5 && hoursOfDhuhur >= 1) {
        //pm
        momentDhuhur = salah.dhuhur && moment(`${salah.dhuhur} pm`, "h:mm");
      } else {
        // hoursOfDhuur > 9 && <= 12
        // am
        momentDhuhur = salah.dhuhur && moment(`${salah.dhuhur} am`, "h:mm");
      }

      const arr = [
        timeMoment.diff(momentFajer),
        timeMoment.diff(momentSunrise),
        timeMoment.diff(momentDhuhur),
        timeMoment.diff(momentAsr),
        timeMoment.diff(momentMaghreb),
        timeMoment.diff(momentIshaa)
      ]

      const leastDiff = Math.max(...arr.filter(x => x < 0).map(x => x / 1000));
      const indexOfClosest = arr.indexOf(leastDiff * 1000);

      return salwatNames[indexOfClosest];

    }
  }

  makeSalawatDayLightSaving = (isDayLightSaving, salawat) => {
    if (salawat) {
      const momentFajer = salawat.fajer && moment(salawat.fajer, "h:mm");
      const momentSunrise = salawat.sunrise && moment(salawat.sunrise, "h:mm");
      const momentDhuhur = salawat.dhuhur && moment(salawat.dhuhur, "h:mm");
      const momentAsr = salawat.asr && moment(`${salawat.asr} pm`, "h:mm a");
      const momentMaghreb = salawat.maghreb && moment(`${salawat.maghreb} pm`, "h:mm a");
      const momentIshaa = salawat.Ishaa && moment(`${salawat.Ishaa} pm`, "h:mm a");
      if (isDayLightSaving) {
        return {
          fajer: momentFajer.add(1, 'h').format("h:mm"),
          sunrise: momentSunrise.add(1, 'h').format("h:mm"),
          dhuhur: momentDhuhur.add(1, 'h').format("h:mm"),
          asr: momentAsr.add(1, 'h').format("h:mm"),
          maghreb: momentMaghreb.add(1, 'h').format("h:mm"),
          Ishaa: momentIshaa.add(1, 'h').format("h:mm")
        }
      }
      else {
        return {
          fajer: momentFajer.format("h:mm"),
          sunrise: momentSunrise.format("h:mm"),
          dhuhur: momentDhuhur.format("h:mm"),
          asr: momentAsr.format("h:mm"),
          maghreb: momentMaghreb.format("h:mm"),
          Ishaa: momentIshaa.format("h:mm")
        }
      }
    }
    else {
      return {};
    }
  }

  createDate = (day)=>(
   {
      selectedDay: day.format('DD'),
      selectedMonth: day.format('MM'),
      selectedYear: day.format('YYYY'),
    }
  )
  isNextPrayer = (nextPrayer, prayer = []) => {
    return prayer.some(p => nextPrayer == p)
  }
  increaseMonth = ()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      const {selectedDay} = this.state
      const newDay = selectedDay.add(1,'day')
      this.setState({
        currentMiladiDay:this.createDate(newDay)
      })
  }
  decreaseMonth = ()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const {selectedDay} = this.state
    const newDay = selectedDay.subtract(1,'day')
    this.setState({
      currentMiladiDay:this.createDate(newDay)
    })
  }
  render() {
    const {  isDayLightSaving,fontSizeFactor} = this.props
    const { today, currentHijriDay, currentMiladiDay, salah, currentTime } = this.state;
    const { fajer, sunrise, dhuhur, asr, maghreb, Ishaa } = this.makeSalawatDayLightSaving(this.props.isDayLightSaving, salah);
    const salahName = this.getNextSalahName(currentTime, salah && { ...salah, fajer, sunrise, dhuhur, asr, maghreb, Ishaa });
    return (
      <ImageBackground
        style={{
          flex: 1,
          position: 'absolute',
          alignSelf: 'center',
          width: Metrics.screenWidth,
          height: Metrics.screenHeight,
        }}
        resizeMode="stretch"
        source={this.props.image}
      >
        <Text style={{
          fontFamily: 'Al-Jazeera-Arabic-Regular',
          fontSize: this.props.fontSizeFactor * responsiveFontSize(7),
          textAlign: 'center',
          position: 'absolute',
          alignSelf: 'center',
          color: 'black',
          top: Metrics.screenHeight / 6 - 10,
        }}>{today}</Text>
        <View style={{
          position: 'absolute',
          alignSelf: 'center',
          top: responsiveHeight(27),
          flexDirection:'row',
          alignItems:'center',
        }}>

          {
            currentHijriDay && currentHijriDay.hijri &&
            <TodayView
              hijriMonthName={hijriMonthsNames[Number(currentHijriDay && currentHijriDay.hijri && currentHijriDay.hijri.month || currentHijriDay && currentHijriDay.hijriMonth) - 1]}
              miladiMonthName={miladiMonthsNames[Number(currentMiladiDay.selectedMonth) - 1]}
              today={today}
              hijri={currentHijriDay && currentHijriDay.hijri}
              miladi={currentMiladiDay}
              fontSizeFactor={this.props.fontSizeFactor}
            />
          }

        </View>
        <ImageBackground
          style={{
            zIndex: 1,
            position: 'absolute',
            alignSelf: 'center',
            bottom: responsiveHeight(2),
            width: Metrics.screenWidth,
            height: responsiveHeight(50)
          }}
          resizeMode="contain"
        >
          {salah && <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-evenly',alignItems:'center', width: Metrics.screenWidth - 20, borderWidth: 1, borderColor: 'lightgrey', borderRadius: 5, alignSelf: 'center', height: responsiveHeight(10) + 10, marginTop: 20 }}>
          <Entypo onPress={this.decreaseMonth} style={{ fontSize: this.props.fontSizeFactor * responsiveFontSize(4.5), alignSelf: 'center' }} name="chevron-thin-right" />
            
            <PrayersTimesDay key={`${currentMiladiDay.selectedDay}`} 
            currentMiladiDay={currentMiladiDay}
            isDayLightSaving={isDayLightSaving} fontSizeFactor={fontSizeFactor}
            />
            
            <Entypo onPress={this.increaseMonth} style={{ fontSize: this.props.fontSizeFactor * responsiveFontSize(4.5), alignSelf: 'center', }} name="chevron-thin-left" />

          </View>}
          <Text style={{ fontFamily: 'Al-Jazeera-Arabic-Regular', color: 'black', textAlign: 'center', fontSize: this.props.fontSizeFactor * responsiveFontSize(1.5) }}>حسب توقيت المسجد الاقصى</Text>
          <TouchableOpacity style={{ marginTop: 5, alignSelf: 'center', zIndex: 10 }} onPress={() => this.props.navigation.navigate('رسالة اليوم')}>
            <View style={{ width: Metrics.screenWidth / 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'grey', borderRadius: 5, paddingHorizontal: 10 }}>
              <Text style={{ fontFamily: 'Al-Jazeera-Arabic-Regular', color: 'black', textAlign: 'center', padding: 3, fontSize: this.props.fontSizeFactor * responsiveFontSize(1.8) }}>رسالة اليوم</Text>
              <EvilIcons style={{ fontSize: this.props.fontSizeFactor * responsiveFontSize(4) }} name="chevron-right" />
            </View>
          </TouchableOpacity>
          <View style={{ zIndex: 2, position: 'absolute', bottom: responsiveHeight(13), justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
            <Image source={taqweem} resizeMode={"contain"} style={{ width: Metrics.screenWidth * 2 / 3, height: Metrics.screenHeight / 15, alignSelf: 'center' }} />
            <Text style={{ fontFamily: 'Al-Jazeera-Arabic-Regular', color: 'black', fontSize: this.props.fontSizeFactor * responsiveFontSize(1.8) }}>نابلس - فلسطين</Text>
          </View>
        </ImageBackground>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isDayLightSaving: state.startup.isDayLightSaving,
    fontSizeFactor: state.startup.fontSizeFactor
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrayersTimesScreen)
