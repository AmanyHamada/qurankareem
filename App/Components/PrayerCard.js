import React, { Component, } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, Animated } from 'react-native'
import styles from './Styles/PrayerCardStyle'
import { Card } from 'native-base';
import { Metrics } from '../Themes';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import NextPrayerCountdown from './NextPrayerCountdown';
export default PrayerCard = ({ time, timeMoment,prayerName, nextSalahName,isNextPrayer, fontSizeFactor }) => {

  return (
    <Animated.View >
    <Card style={{ backgroundColor: nextSalahName === prayerName ? 'gold' : 'rgb(247,247,247)', height: responsiveHeight(10), flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', alignSelf: 'center', width: Metrics.screenWidth / 6 - 10 }}>
      <Text style={{fontFamily: 'Al-Jazeera-Arabic-Regular', color: 'black', fontSize: fontSizeFactor * responsiveFontSize(1.6)}}>{prayerName}</Text>
      <Text style={{fontFamily: 'Al-Jazeera-Arabic-Regular', color: 'black', fontSize: fontSizeFactor * responsiveFontSize(2.1)}}>{time}</Text>
       {isNextPrayer  &&  <NextPrayerCountdown timeMoment={timeMoment} time={time} fontSizeFactor={fontSizeFactor}/>}
    </Card>
    </Animated.View>
  )
}
