import React from 'react';
import {Animated,Text} from 'react-native';
import moment from 'moment';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

function timeDiff(t){
  return moment().diff(moment(t,'HH:mm'), 'seconds')
}

function formatTime(seconds){
  return   '-'+ Math.abs(Math.floor(moment.duration(seconds,'seconds').asHours())) + ':' + Math.abs(moment.duration(seconds,'seconds').minutes()) /*+ ':' + Math.abs(moment.duration(seconds,'seconds').seconds())*/ ;
}


export default class NextPrayerCountdown extends React.PureComponent{

constructor(props){
  super(props)
  this.state={
    formatedTime:formatTime(timeDiff(props.time))
  }
}
  componentDidMount(){
    const time = this.props.timeMoment
    this.setState({ formatedTime:formatTime(timeDiff(time))})
    this.INTERVALID = setInterval(()=>{
this.setState({ formatedTime:formatTime(timeDiff(time))})

  },1000)
  }

  componentWillUnmount(){
    this.INTERVALID && clearInterval(this.INTERVALID)
  }


  render(){
    const {time,fontSizeFactor} = this.props

    return (<Text style={{fontFamily: 'Al-Jazeera-Arabic-Regular', color: '#D32F2F', fontSize: fontSizeFactor * responsiveFontSize(2.1)}}>{this.state.formatedTime}</Text>)

  }
}
