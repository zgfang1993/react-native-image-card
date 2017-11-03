import React, {Component} from 'react';

import {
  StyleSheet,
  View
} from 'react-native';
import ImageView from './../image/ImageView';

export default class MultiMode extends Component{
  constructor(props){
    super(props);
    this.renderImg = this.renderImg.bind(this);
  }

  render(){
    const {
      style,
      source
    } = this.props;

    return (
        <View style={[style]}>
        {
          source.length === 1 &&
        <View style={[styles.flex_row, style]}>
    {
      this.renderImg(source[0])
    }
  </View>
  }
    {
      source.length === 2 &&
      <View style={[styles.flex_row, style]}>
      {
        this.renderImg(source[0])
      }
      {
        this.renderImg(source[1])
      }
    </View>
    }
    {
      source.length === 3 &&
      <View style={[style, styles.flex_cloumn]}>
      {
        this.renderImg(source[0])
      }
    <View style={[styles.flex_row, styles.flex_1]}>
      {
        this.renderImg(source[1])
      }
      {
        this.renderImg(source[2])
      }
    </View>

    </View>
    }
    {
      source.length === 4 &&
      <View style={[style, styles.flex_cloumn]}>
    <View style={[styles.flex_row, styles.flex_1]}>
      {
        this.renderImg(source[0])
      }
      {
        this.renderImg(source[1])
      }
    </View>
    <View style={[styles.flex_row, styles.flex_1]}>
      {
        this.renderImg(source[2])
      }
      {
        this.renderImg(source[3])
      }
    </View>
    </View>
    }
    {
      source.length === 5 &&
      <View style={[style, styles.flex_cloumn]}>
    <View style={[styles.flex_row, styles.flex_1]}>
      {
        this.renderImg(source[0])
      }
      {
        this.renderImg(source[1])
      }
    </View>
    <View style={[styles.flex_row, styles.flex_1]}>
      {
        this.renderImg(source[2])
      }
      {
        this.renderImg(source[3])
      }
      {
        this.renderImg(source[4])
      }
    </View>
    </View>
    }

  </View>
  )
  }

  renderImg(uri){
    const {
      maskOpacity,
      easingFunc,
      rebounceDuration,
      showDuration,
      closeDuration,
      enableScaling,
      disabled
    } = this.props;

    return (
        <ImageView
    source={{uri: uri}}
    imgStyle={styles.flex_1}
    style={styles.flex_1}
    enableScaling={enableScaling}
    easingFunc={easingFunc}
    maskOpacity={maskOpacity}
    rebounceDuration={rebounceDuration}
    showDuration={showDuration}
    closeDuration={closeDuration}
    disabled={disabled}
    />
  )
  }
}

const styles = StyleSheet.create({
  flex_row:{
    flexDirection: 'row'
  },
  flex_cloumn: {
    flexDirection: 'column'
  },
  flex_1: {
    flex: 1
  }
})