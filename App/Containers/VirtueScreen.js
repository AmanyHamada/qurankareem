import React, { Component } from 'react'
import { ScrollView, Text, ActivityIndicator, Platform, ImageBackground, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import HTML from 'react-native-render-html';
import Entypo from 'react-native-vector-icons/Entypo'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/VirtueScreenStyle'
import Api from '../Services/Api';
import moment from 'moment';
import { Metrics } from '../Themes';
import { View } from 'native-base';
import LoadingIndicator from '../Components/LoadingIndicator';
import QkHeader from '../Components/QkHeader';

const FontsIOS = {
  Thuluth:'A Thuluth',
  AlJazeera:'Al-Jazeera-Arabic-Regular',
  Tahoma:'Tahoma'
}
const FontsAndroid = {
  Thuluth:'althuluth',
  AlJazeera:'Al-Jazeera-Arabic-Regular',
  Tahoma:'tahoma'
}
const fonts = Platform.select({
  ios:FontsIOS,
  android:FontsAndroid
})
function safeFont(font){
return fonts[font] || fonts.AlJazeera
}

const defaultVirtue = `
<p><font face="Arial"><u><i><b><font size="5">كفى بالله ولياً ونصيراً</font></b></i></u><br>
<br>
قال عز وجل:(وَاللَّهُ أَعْلَمُ بِأَعْدَائِكُمْ وَكَفَى&#1648; بِاللَّهِ وَلِيًّا 
وَكَفَى&#1648; بِاللَّهِ نَصِيرًا).(النساء: آية 45).<br>
وقال سبحانه:(وَاعْتَصِمُوا بِاللَّهِ هُوَ مَوْلَاكُمْ فَنِعْمَ الْمَوْلَى&#1648; 
وَنِعْمَ النَّصِيرُ). (الحج: آية 78). <br>
والنّصير: الذي تولّى نصر عباده، وتكفَّلَ بتأييد أوليائه والدّفاع عنهم. واسم الله 
الولي له دلالات منها: التأييد والنّصر على الأعداء، <br>
قال تعالى: (أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ)، 
(البقرة: آية 286)- <br>
وقال سبحانه: (بَلِ اللَّهُ مَوْلَاكُمْ وَهُوَ خَيْرُ النَّاصِرِينَ). (آل عمران: 
آية 150).<br>
&nbsp;</font></p>
`
/*
 customWrapper={(data) => {
                  return <Text selectable style={{ fontFamily:font,fontSize: fontSizeFactor * responsiveFontSize(3.2), textAlign: 'center', width: 8 * Metrics.screenWidth / 10, alignItems: 'center', alignSelf: 'center', paddingTop: 10, marginBottom: 90 }}>{data}</Text>
                }}
*/
const FallbackVirtue = ({html =defaultVirtue,font=fonts.Tahoma,fontSizeFactor})=>(
  <HTML
 
                html={html}

                imagesMaxWidth={Metrics.screenWidth / 7 * 8}
                // containerStyle={{width: 8*Metrics.screenWidth/10, alignItems: 'center', alignSelf: 'center',paddingTop: 10, marginBottom: 90  }}
               
                baseFontStyle={{ fontFamily:font,fontSize: fontSizeFactor * responsiveFontSize(3.2), textAlign: 'center' }}
                ignoredStyles={["font-family",]}
                customWrapper={(data) => {
                  return <Text selectable style={{ letterSpacing:-1,fontFamily:font,fontSize: fontSizeFactor * responsiveFontSize(3.2), textAlign: 'center', width: 8 * Metrics.screenWidth / 10, alignItems: 'center', alignSelf: 'center', paddingTop: 10, marginBottom: 90 }}>{data}</Text>
                }}
                allowFontScaling
                textSelectable
              />
)
class VirtueScreen extends Component {
  state = {
    loading: true,
    today: {},
    selectedDate:moment(),
    key:1
  }
  async componentDidMount() {
   
    const today = await AsyncStorage.getItem('today');
     if (today) {
       this.setState({ today: JSON.parse(today), loading: false });
     }
   try{
    this.getVirtue()
   }catch(e){
     console.warn(e)
   }
     
  }

  getVirtue =   (moment =moment())=>{
    const api = Api.create()
   this.setState({loading:true,selectedDate:moment})
   // console.waren(moment().year(), moment().format("MM"), moment().date())
    api.getTodaysInfo(moment.year(), moment.format("MM"), moment.date(), this.mcb)

  }
  mcb = ss => {
    this.setState( prv =>({...prv, key:prv.key+1,virtue:ss.val().virtue,today: ss.val(),loading: false  }),()=>{
      
    })

    AsyncStorage.setItem('today', JSON.stringify(ss.val()));

  }
  increaseDay =()=>{
    const {selectedDate} = this.state
    const nextDate = selectedDate.add(1,'day')
    this.getVirtue(nextDate)
  }

  decreaseDay = ()=>{
    const {selectedDate} = this.state
    const nextDate = selectedDate.subtract(1,'day')
    this.getVirtue(nextDate)
  }

  render() {
    const { loading } = this.state
    return (
      <ImageBackground
        style={{
          flex: 1,
          position: 'absolute',
          width: Metrics.screenWidth,
          height: Metrics.screenHeight,
          alignSelf: 'center'
        }}
        resizeMode='stretch'
        source={this.props.image}
      >

        <QkHeader title={"رسالة اليوم"} />
        <View style={{ flex: 4 }}>
          {loading &&
            <View style={{ height: Metrics.screenHeight, width: Metrics.screenWidth, justifyContent: 'center', alignItems: 'center' }}>
              {
                Platform.OS == 'ios' ?
                  <ActivityIndicator size={1} color={"#a4a4a4"} />
                  :
                  <ActivityIndicator size={50} color={"#a4a4a4"} />
              }
            </View> }
             <View style={[styles.container,{flexDirection:'row'}]}>
            {!loading && <Entypo onPress={this.increaseDay} style={{ fontSize: this.props.fontSizeFactor * responsiveFontSize(4.5), alignSelf: 'center', }} name="chevron-thin-left" />}


           {!loading && <ScrollView style={[styles.container, { marginVertical: 10 }]}>
              { /*!this.state.today && !this.state.today.virtue  && <FallbackVirtue fontSizeFactor={this.props.fontSizeFactor} /> */}
              {/* this.state.today && this.state.today.virtue  && <Text selectable style={{ color: 'black', textAlign: 'center', marginHorizontal: Metrics.screenWidth / 8,fontFamily:safeFont(this.state.today.font), fontSize: this.props.fontSizeFactor * responsiveFontSize(3.2), paddingTop: 10, marginBottom: 90 }}>
                {this.state.today && this.state.today.virtue  }
            </Text> */}
               <FallbackVirtue  html={this.state.virtue} font={safeFont(this.state.today.font)} fontSizeFactor={this.props.fontSizeFactor}/>
            </ScrollView>}
           {!loading && <Entypo onPress={this.decreaseDay} style={{ fontSize: this.props.fontSizeFactor * responsiveFontSize(4.5), alignSelf: 'center' }} name="chevron-thin-right" />}

            </View>
          
        </View>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fontSizeFactor: state.startup.fontSizeFactor
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VirtueScreen)
