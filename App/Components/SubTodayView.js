import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import { Metrics } from '../Themes';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default SubTodayView = ({ day, month, year, monthName, h, fontSizeFactor }) => (
  <View style={{ height: responsiveHeight(10), marginBottom: -10 }}>

    <View style={{ margin: 5, backgroundColor: '#fafafa88', flexDirection: 'column', width: Metrics.screenWidth / 3 + 10, height: responsiveHeight(16), justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'lightgrey', borderRadius: 3, marginBottom: 1 }}>
      <Text style={{ fontFamily: 'Al-Jazeera-Arabic-Regular', color: 'black', fontSize: fontSizeFactor * responsiveFontSize(5), fontWeight: 'bold', marginBottom: -5 }}>{day}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        {month && <Text style={{ fontFamily: 'Al-Jazeera-Arabic-Regular', color: 'black' }}> ({Number(month)})</Text>}
        <Text style={{ fontSize: fontSizeFactor * responsiveFontSize(2.5), fontFamily: 'Al-Jazeera-Arabic-Regular', color: 'black' }}>{monthName}</Text>
      </View>
    </View>
    <Text style={{ fontSize: fontSizeFactor * responsiveFontSize(2.5), textAlign: 'center', fontFamily: 'Al-Jazeera-Arabic-Regular', color: 'black', marginBottom: -10, }}>{year} {h ? 'هـ' : 'م'}</Text>
  </View>
)
