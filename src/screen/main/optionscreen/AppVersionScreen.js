import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
} from 'react-native';

export default class ContentScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.appVersionImage} source={require('/assets/ic_bible_version.png')} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: '6%',
    paddingRight: '6%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },

  appVersionImage: {
    resizeMode: 'contain',
    width: '60%',
    marginBottom: '15%',
  }
});
