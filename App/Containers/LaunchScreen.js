import React, { Component } from 'react'
import { ScrollView, Text, Image, View, WebView } from 'react-native'
import { Images, Metrics } from '../Themes'

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {
  render() {
    let yourAlert = " var e = document.getElementsByTagName('video')[0]; var d = document.createElement('audio'); d.innerHTML = e.innerHTML; e.parentNode.replaceChild(d, e); var att1 = document.createAttribute('controls');att1.value = '';d.setAttributeNode(att1);";
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.launch} style={styles.logo} />
          </View>

          <View style={{ height: 42, width: 42, marginLeft: -5, paddingTop: -20 }}>
            <WebView
              originWhitelist={['*']}
              source={{ html: '<audio controls="" autoplay="" name="media" class="vsc-initialized" data-vscid="n1pc81bla"><source src="http://www.quran-radio.org:8002/i" type="audio/mpeg"></audio>' }}
            />
          </View>

        </ScrollView>
      </View>
    )
  }
}
