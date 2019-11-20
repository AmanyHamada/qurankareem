import React, { Component } from 'react'
import { WebView, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/QiblaScreenStyle'
import QkHeader from '../Components/QkHeader';
import { Metrics } from '../Themes';
// import Compass from '../Components/Compass';
// <WebView
//   javaScriptEnabled={true}
//   domStorageEnabled={true}
//   source={{ uri:'https://qiblafinder.withgoogle.com/intl/en/onboarding'}}
//   />    

class QiblaScreen extends Component {
  render() {
    return (
      <ImageBackground
        style={{
          flex: 1,
          position: 'absolute',
          width: Metrics.screenWidth,
          height: Metrics.screenHeight,
          alignSelf: 'center',
        }}
        resizeMode='stretch'
        source={this.props.image}
      >

        <QkHeader title={"القبلة"} />
      </ImageBackground>
      // <Compass/>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QiblaScreen)
