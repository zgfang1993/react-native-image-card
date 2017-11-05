import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  FlatList
} from 'react-native';
import ImageView from './../image/ImageView';

export default class NineMode extends Component {

  render(){
    const {
      style,
      source,
      space,
      maskOpacity,
      easingFunc,
      rebounceDuration,
      enableScaling,
      showDuration,
      closeDuration,
      disabled
    } = this.props;

    const imgWidth = (style.width - space*2)/3;
    const imgStyle = {width: imgWidth, height: imgWidth, marginRight:space};

    return (
        <View style={[style]}>
        {
          source.length === 1 &&
        <View style={[styles.flex_row, style]}>
  <ImageView
    source={{uri: `${source[0]}`}}
    imgStyle={styles.flex_1}
    style={styles.flex_1}
    duration={200}
    enableScaling={enableScaling}
    easingFunc={easingFunc}
    maskOpacity={maskOpacity}
    rebounceDuration={rebounceDuration}
    showDuration={showDuration}
    closeDuration={closeDuration}
    disabled={disabled}
    />
    </View>
  }
    {
      source.length > 1 &&
      <FlatList
      data={source}
      renderItem={this._renderItem.bind(this,imgStyle)}
      keyExtractor={this._keyExtractor}
      numColumns = {3}
      columnWrapperStyle={{}}
      style={{}}
      />
    }

  </View>
  )
  }

  _keyExtractor = (item, index) => index;

  _renderItem(imgStyle,{item,index}){
    const {rebounceDuration, easingFunc, maskOpacity, enableScaling, showDuration, closeDuration, disabled} = this.props;
    let style = imgStyle;

    if(index > 5){
      style = Object.assign({},style,{marginBottom: 0})
    }

    return (
        <ImageView
    source={{uri: item}}
    imgStyle={style}
    style={style}
    rebounceDuration={rebounceDuration}
    showDuration={showDuration}
    closeDuration={closeDuration}
    enableScaling={enableScaling}
    easingFunc={easingFunc}
    maskOpacity={maskOpacity}
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
  },
  spaceAround: {
    justifyContent:"space-around"
  }

})