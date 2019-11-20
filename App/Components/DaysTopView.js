import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/DaysTopViewStyle'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default DaysTopView = ({ daysNames, sideLength, arabicDays, fontSizeFactor }) => {
  return <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginBottom: 5, width: responsiveWidth(80) }}>
    {
      daysNames.map((dayName, index) =>
        (
          <Text numberOfLines={1} ellipsizeMode='tail' key={index} style={{ fontFamily: 'Al-Jazeera-Arabic-Regular', color: 'black', width: sideLength, textAlign: 'center', fontSize: fontSizeFactor * responsiveFontSize(1.4), marginHorizontal: 3, alignSelf: 'center' }}>
            {arabicDays[index]}
          </Text>
        )
      )
    }
  </View>
}
