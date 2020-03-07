import React, {Component} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

export default class BibleNoteMemo extends Component {
  state = {
    isOpenAnswer: false,
  };

  render() {
    return (
      <View style={styles.container}>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    top: 30,
    borderRadius: 5,
    backgroundColor: 'white',
    left: 20,
    right: 20,
    height: 200,
    borderWidth: 1
  },
});