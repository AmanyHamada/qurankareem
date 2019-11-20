import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/MonthViewStyle'
import moment from 'moment'
import DayView from './DayView';

export default MonthView = ({ daysNames, check, selectDay, selectedItem, allData, sideLength, fontSizeFactor }) => {
  const firstDay = getFirstDayOfMonth(check);
  // const hijriDays    = getHijriDays(check);
  const offset = getHowManyBlankDays(daysNames, firstDay);
  const currentDay = moment().date()
  const currentMonth = moment().month();
  const currentYear = moment().year();

  const numberOfDays = check.daysInMonth()

  // const currentDayOnView = currentDay + offset - 1;
  const currentDayOnView = currentDay;

  const isToday = check.month() === currentMonth &&
    check.year() === currentYear


  const isSelectedDay = selectedItem.selectedDay;
  const selectedMonthAndYear = check.month() === selectedItem.selectedMonth &&
    check.year() === selectedItem.selectedYear

  const days = createDays(numberOfDays, offset);
  return (
    <View style={{ width: 7 * (sideLength + 7), display: 'flex', flexDirection: 'row-reverse', flexWrap: 'wrap', alignSelf: 'center', height: (sideLength + 5) * 6 }}>
      {
        days.map((day, index) =>
          <DayView
            fontSizeFactor={fontSizeFactor}
            sideLength={sideLength}
            info={safeGet(allData, check.year(), pad(check.month() + 1), day)}
            isToday={day === currentDayOnView && isToday}
            isSelectedDay={day === isSelectedDay && selectedMonthAndYear}
            key={day + index}
            day={day}
            selectDay={selectDay} />
        )
      }
    </View>
  )
}

pad = x => x < 10 ? ("0" + x) : x

const safeGet = (item, view1, view2, view3) => {
  return item && item[view1] && item[view1][view2] && item[view1][view2][view3]
}

function getFirstDayOfMonth(check) {
  const startOfMonth = check.startOf('month').format('ddd');
  return startOfMonth
}

function getHowManyBlankDays(daysNames, firstDay) {
  return daysNames.indexOf(firstDay);
}

function createDays(numberOfDays, offset) {
  const days = [];
  for (let i = 0; i < 6 - offset; i++) {
    days.push('')
  }
  for (let i = 0; i < numberOfDays; i++) {
    days.push(i + 1);
  }
  return days;
}