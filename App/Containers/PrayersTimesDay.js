import { ImageBackground, ScrollView, TouchableOpacity, Image, AsyncStorage, Platform, UIManager, LayoutAnimation, } from 'react-native'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import moment, { min } from 'moment';
import momentH from 'moment-hijri';

import { Metrics } from '../Themes/index.js';
import PrayerCard from '../Components/PrayerCard'
import { View, Text } from 'native-base';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
//import store from '../Redux';
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

export default class PrayersTimesScreen extends Component {
  salahMoment = null
  constructor(props) {
    super(props)
    const check = moment();
    const checkH = momentH();
    this.state = {
      check,
      checkH,
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
  const {currentMiladiDay}  = this.props
    const salah = salawat[currentMiladiDay.selectedMonth].find(salah => salah.day == currentMiladiDay.selectedDay);
    this.salahMoment = this.salahTimeToMoment(salah)
    this.setState({ salah });

   
  
  }

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

  isNextPrayer = (nextPrayer, prayer = []) => {
    return prayer.some(p => nextPrayer == p)
  }
  increaseMonth = ()=>{
    LayoutAnimation.configureNext(CustomLayoutAnimation);
  }
  decreaseMonth = ()=>{
    LayoutAnimation.configureNext(CustomLayoutAnimation);
  }
  render() {
//const { isDayLightSaving,fontSizeFactor } = store().getState().startup
const isDayLightSaving = false;
      const fontSizeFactor = 1
const {currentMiladiDay} = this.props
    const { today, currentHijriDay,  salah, currentTime } = this.state;
    const { fajer, sunrise, dhuhur, asr, maghreb, Ishaa } = this.makeSalawatDayLightSaving(isDayLightSaving, salah);
    const salahName = this.getNextSalahName(currentTime, salah && { ...salah, fajer, sunrise, dhuhur, asr, maghreb, Ishaa });
    return (
    <View>


      
          {salah && <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-evenly',/* width: Metrics.screenWidth - 20, borderWidth: 1, borderColor: 'lightgrey', borderRadius: 5, alignSelf: 'center', height: responsiveHeight(10) + 10, marginTop: 20 */}}>
       
            {fajer && <PrayerCard prayerName="الفجر" time={fajer} timeMoment={this.salahMoment.fajer} nextSalahName={salahName} isNextPrayer={this.isNextPrayer(salahName, [salwatNames[0]])} fontSizeFactor={fontSizeFactor} />}
            {sunrise && <PrayerCard prayerName="الشروق" time={sunrise} timeMoment={this.salahMoment.sunrise} nextSalahName={salahName} fontSizeFactor={fontSizeFactor} />}
            {dhuhur && <PrayerCard prayerName="الظهر" time={dhuhur} timeMoment={this.salahMoment.dhuhur} nextSalahName={salahName} isNextPrayer={this.isNextPrayer(salahName, [salwatNames[1], salwatNames[2]])} fontSizeFactor={fontSizeFactor} />}
            {asr && <PrayerCard prayerName="العصر" time={asr} timeMoment={this.salahMoment.asr}  nextSalahName={salahName} isNextPrayer={this.isNextPrayer(salahName, [salwatNames[3]])} fontSizeFactor={fontSizeFactor} />}
            {maghreb && <PrayerCard prayerName="المغرب" time={maghreb} timeMoment={this.salahMoment.maghreb}  nextSalahName={salahName} isNextPrayer={this.isNextPrayer(salahName, [salwatNames[4]])} fontSizeFactor={fontSizeFactor} />}
            {Ishaa && <PrayerCard prayerName="العشاء" time={Ishaa} timeMoment={this.salahMoment.Ishaa} nextSalahName={salahName} isNextPrayer={this.isNextPrayer(salahName, [salwatNames[5]])} fontSizeFactor={fontSizeFactor} />}
         
          </View>}
    
       
    </View>
    )
  }
}

// const mapStateToProps = (state) => {
//   return {
//     isDayLightSaving: state.startup.isDayLightSaving,
//     fontSizeFactor: state.startup.fontSizeFactor
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//   }
// }

//export default connect(mapStateToProps, mapDispatchToProps)(PrayersTimesScreen)
