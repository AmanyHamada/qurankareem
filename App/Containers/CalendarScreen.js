import React, { Component } from 'react'
import { ImageBackground, View, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment';
import momentH from 'moment-hijri';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import PrayersTimesDay from './PrayersTimesDay';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/CalendarScreenStyle'
import DaysTopView from '../Components/DaysTopView';
import Api from '../Services/Api';
import { Metrics } from '../Themes';
import MonthView from '../Components/MonthView';
import NavigateMonths from '../Components/NavigateMonths';
import TodayView from '../Components/TodayView';
import QkHeader from '../Components/QkHeader';

const EnglishDaysNames = ['Fri', 'Thu', 'Wed', 'Tue', 'Mon', 'Sun', 'Sat'];
const ArabicDaysNames = [' جمعة', 'خميس', ' أربعاء', ' ثلاثاء', ' اثنين', ' أحد', ' سبت'];
const miladiMonthsNames = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'];
const hijriMonthsNames = 'محرم_صفر_ربيع الأول_ربيع الثاني_جمادى الأولى_جمادى الآخرة_رجب_شعبان_رمضان_شوال_ذو القعدة_ذو الحجة'.split('_');

const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'السبت']

const sideLength = responsiveWidth(9);
class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    const check = moment();
    const checkH = momentH();

    const endOfMonth = check.endOf('month').format('DD');

    this.state = {
      endOfMonth,
      check,
      checkH,
      today: days[moment().format('e')],
      viewdMonth: check.format('M'),
      selectedItem: {
        selectedDay: moment().format('DD'),
        selectedMonth: moment().format('MM'),
        selectedYear: moment().format('YYYY'),
      },
      hijriMonthsStartingDays: {},
      hijriDropDowns: {
        hijriDay: "01",
        hijriMonth: "01",
        hijriYear: Number(checkH.format('iYYYY')),
      },
      virtue: '',
      chosenDatesForHijriMonths: {},
      alignment: 'miladi',
    }
  }

  async componentDidMount() {
    const api = Api.create();

    const allData = await AsyncStorage.getItem('allData');
    if (allData) {
      this.setState({ allData: JSON.parse(allData) }, () => {
        const endOfMonth = this.state.check.endOf('month').format('DD');
        const aHijriMonth = safeGet(this.state.allData, this.state.check.year(), this.pad(this.state.check.month() + 1), 1)
        const bHijriMonth = safeGet(this.state.allData, this.state.check.year(), this.pad(this.state.check.month() + 1), endOfMonth)
        this.setState({
          firstMonth: hijriMonthsNames[Number(aHijriMonth && aHijriMonth.hijri && aHijriMonth.hijri.month) - 1],
          secondMonth: hijriMonthsNames[Number(bHijriMonth && bHijriMonth.hijri && bHijriMonth.hijri.month) - 1]
        }, () => {
          this.selectDay(moment().date(), { hijriInfo: safeGet(this.state.allData, this.state.check.year(), this.pad(this.state.check.month() + 1), moment().date()) })
        });
      });
    }
    api.getAllData((snapshot) => {
      this.setState({ allData: snapshot.val() }, () => {
        const endOfMonth = this.state.check.endOf('month').format('DD');
        const aHijriMonth = safeGet(this.state.allData, this.state.check.year(), this.pad(this.state.check.month() + 1), 1)
        const bHijriMonth = safeGet(this.state.allData, this.state.check.year(), this.pad(this.state.check.month() + 1), endOfMonth)
        this.setState({
          firstMonth: hijriMonthsNames[Number(aHijriMonth && aHijriMonth.hijri && aHijriMonth.hijri.month) - 1],
          secondMonth: hijriMonthsNames[Number(bHijriMonth && bHijriMonth.hijri && bHijriMonth.hijri.month) - 1]
        }, () => {
          AsyncStorage.setItem('allData', JSON.stringify(snapshot.val()));
          this.selectDay(moment().date(), { hijriInfo: safeGet(this.state.allData, this.state.check.year(), this.pad(this.state.check.month() + 1), moment().date()) })
        });
      })
    });
  }

  increaseMonth = () => {
    const { check } = this.state;
    const modifiedCheck = check.add(1, 'M');
    const endOfMonth = check.endOf('month').format('DD');
    const aHijriMonth = safeGet(this.state.allData, this.state.check.year(), this.pad(this.state.check.month() + 1), 1)
    const bHijriMonth = safeGet(this.state.allData, this.state.check.year(), this.pad(this.state.check.month() + 1), endOfMonth)

    this.setState({
      check: modifiedCheck,
      firstMonth: hijriMonthsNames[Number(aHijriMonth && aHijriMonth.hijri && aHijriMonth.hijri.month) - 1],
      secondMonth: hijriMonthsNames[Number(bHijriMonth && bHijriMonth.hijri && bHijriMonth.hijri.month) - 1]
    });
  }

  decreaseMonth = () => {
    const { check } = this.state;
    const modifiedCheck = check.add(-1, 'M');
    const endOfMonth = check.endOf('month').format('DD');
    const aHijriMonth = safeGet(this.state.allData, this.state.check.year(), this.pad(this.state.check.month() + 1), 1)
    const bHijriMonth = safeGet(this.state.allData, this.state.check.year(), this.pad(this.state.check.month() + 1), endOfMonth)

    this.setState({
      check: modifiedCheck,
      firstMonth: hijriMonthsNames[Number(aHijriMonth && aHijriMonth.hijri && aHijriMonth.hijri.month) - 1],
      secondMonth: hijriMonthsNames[Number(bHijriMonth && bHijriMonth.hijri && bHijriMonth.hijri.month) - 1]
    });
  }

  selectDay = (selectedDay, { hijriInfo }) => {
    this.setState({
      selectedItem: {
        selectedDay,
        selectedMonth: this.state.check.month(),
        selectedYear: this.state.check.year(),
      }
    }, () => {
      hijriInfo &&
        this.setState({
          hijriDropDowns: {
            ...this.state.hijriDropDowns,
            hijriDay: hijriInfo && hijriInfo.hijri && hijriInfo.hijri.day,
            hijriMonth: hijriInfo && hijriInfo.hijri && hijriInfo.hijri.month,
            hijriYear: hijriInfo && hijriInfo.hijri && hijriInfo.hijri.year,
          },
          virtue: hijriInfo && hijriInfo.virtue
        })
    }
    );
  }

  pad = x => x < 10 ? ("0" + x) : x

  render() {
    const { today, hijriDropDowns, selectedItem } = this.state;
    const { hijriDay, hijriMonth, hijriYear } = hijriDropDowns;
    const { selectedDay, selectedMonth, selectedYear } = selectedItem;
    return (
      <ImageBackground
        style={{
          flex: 1,
          position: 'absolute',
          width: Metrics.screenWidth,
          height: Metrics.screenHeight,
          justifyContent: 'space-evenly',
          alignSelf: 'center',
        }}
        resizeMode='stretch'
        source={this.props.image}
      >
        <QkHeader title={"المذكرة"} />
        <View style={{ flex: 5, marginTop: 20 }}>
          <DaysTopView
            fontSizeFactor={this.props.fontSizeFactor}
            arabicDays={ArabicDaysNames}
            daysNames={EnglishDaysNames}
            sideLength={sideLength}
          />
          <MonthView
            fontSizeFactor={this.props.fontSizeFactor}
            allData={this.state.allData}
            selectDay={this.selectDay}
            selectedItem={this.state.selectedItem}
            check={this.state.check}
            daysNames={EnglishDaysNames}
            sideLength={sideLength}
          />
          
            <PrayersTimesDay key={`${this.state.selectedItem.selectedDay}`} currentMiladiDay={this.state.selectedItem} />
          
          <NavigateMonths
            fontSizeFactor={this.props.fontSizeFactor}
            month={miladiMonthsNames[Number(this.state.check.month())]}
            year={Number(this.state.check.year())}
            monthNumber={this.state.check.month()}
            increaseMonth={this.increaseMonth}
            decreaseMonth={this.decreaseMonth}
            secondMonth={this.state.secondMonth}
            firstMonth={this.state.firstMonth}
          />
        </View>
      </ImageBackground>
    )
  }
}

const safeGet = (item, view1, view2, view3) => {
  return item && item[view1] && item[view1][view2] && item[view1][view2][view3]
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

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen)
