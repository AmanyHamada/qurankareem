import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native'
import styles from './Styles/QkHeaderStyle'
import { Metrics } from '../Themes';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default QKHeader = ({title, bg}) => {
  return (
    <View style={{paddingTop: responsiveHeight(15), alignSelf: 'center', flex: 1}}>
      <Image style={{alignSelf: 'center', position: 'absolute', width: responsiveWidth(50), opacity: 0.5}} resizeMode="contain" source={bg} />
      <Image style={{alignSelf: 'center'}} source={require('../Images/GroupUp.png')} />
      <Text style={{ fontFamily: 'Al-Jazeera-Arabic-Bold', width: Metrics.screenWidth - 150, color: 'rgb(290,90,60)', textAlign: 'center', fontSize: responsiveFontSize(3), padding: 10}}>{title}</Text>
      <Image style={{alignSelf: 'center'}} source={require('../Images/Group.png')} />
    </View>
  )
}
