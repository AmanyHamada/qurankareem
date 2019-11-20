import React, { Component } from 'react'
import { View, StatusBar, AppState } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'

// Styles
import styles from './Styles/RootContainerStyles'

class RootContainer extends Component {

  componentDidMount(){
    AppState.addEventListener('change', this.handleChange);
  }

  handleChange = (change) => {
    console.log(change)
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this.handleChange)
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <ReduxNavigation />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isDayLightSaving: state.startup.isDayLightSaving,
    notifications: state.startup.notifications,
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  // loadAllData: () => dispatch(StartupActions.loadAllDataRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
