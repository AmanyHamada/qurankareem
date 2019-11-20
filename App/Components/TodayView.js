import React, { Component } from 'react'
import { View, Text } from 'react-native'
import SubTodayView from './SubTodayView';
import { Metrics } from '../Themes';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default TodayView = ({ hijri, miladi, today, hijriMonthName, miladiMonthName, calendar, fontSizeFactor }) => {
  const { hijriDay, hijriMonth, hijriYear, day, month, year } = hijri;
  const { selectedDay, selectedMonth, selectedYear } = miladi;
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', height: responsiveHeight(7) }}>
      <SubTodayView fontSizeFactor={fontSizeFactor} day={selectedDay} month={(Number(selectedMonth)).toString()} year={selectedYear} monthName={miladiMonthName}/>
      <SubTodayView fontSizeFactor={fontSizeFactor} h day={day || hijriDay} year={year || hijriYear} monthName={hijriMonthName} />
    </View>
  )
}
