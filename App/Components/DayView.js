import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default DayView = ({ day, isToday, selectDay, isSelectedDay, info, sideLength, fontSizeFactor }) => {

  return (
    <TouchableOpacity
      onPress={() => { day && selectDay(day, { hijriInfo: info }) }}
    >
      <View style={{
        marginHorizontal: 3,
        marginVertical: 2,
        backgroundColor: isSelectedDay ? 'gold' : '#f4f4f4',
        borderRadius: 3,
        justifyContent: 'center',
        height: sideLength + 1,
        width: sideLength,
      }}>
        <Text style={{
          borderRadius: 3,
          textAlign: 'center',
          fontWeight: isToday ? 'bold' : null,
          fontSize: fontSizeFactor * responsiveFontSize(1.8),
          paddingTop: 3
        }} >
          {day}
        </Text>
        <Text style={{
          width: 15,
          height: 15,
          fontSize: fontSizeFactor * responsiveFontSize(1.3),
          marginLeft: 3,
        }}>{info && info.hijri && info.hijri.day}</Text>
      </View>
    </TouchableOpacity>
  )
}
