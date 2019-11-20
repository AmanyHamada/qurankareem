import React from 'react'
// import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/NavigateMonthsStyle'
import Entypo from 'react-native-vector-icons/Entypo'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default NavigateMonths = ({ increaseMonth, decreaseMonth, month, year, monthNumber, secondMonth, firstMonth, fontSizeFactor }) => {
    return (
        <View style={{ width: responsiveWidth(150), display: 'flex', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center', bottom: responsiveHeight(14), position: 'absolute' }}>
            <Entypo onPress={increaseMonth} style={{ fontSize: fontSizeFactor * responsiveFontSize(4.5), alignSelf: 'center', }} name="chevron-thin-left" />
            <View style={{ flexDirection: "column", alignItems: 'center' }}>
                <Text style={{ alignSelf: 'center', fontFamily: 'Al-Jazeera-Arabic-Regular', color: 'red', fontSize: fontSizeFactor * responsiveFontSize(2), width: responsiveWidth(60), textAlign: 'center', marginBottom: -5 }}>{firstMonth} - {secondMonth}</Text>
                <Text style={{ fontFamily: 'Al-Jazeera-Arabic-Regular', color: 'black', textAlign: 'center', width: 120, fontSize: fontSizeFactor * responsiveFontSize(2), marginBottom: -5 }}>{month || "Dec"} ({Number(monthNumber) + 1}) </Text>
                <Text style={{ fontFamily: 'Al-Jazeera-Arabic-Regular', color: 'black', textAlign: 'center', fontSize: fontSizeFactor * responsiveFontSize(2) }}>{year || 2019}</Text>
            </View>
            <Entypo onPress={decreaseMonth} style={{ fontSize: fontSizeFactor * responsiveFontSize(4.5), alignSelf: 'center' }} name="chevron-thin-right" />
        </View>
    )
}
