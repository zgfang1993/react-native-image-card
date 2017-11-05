import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Modal,
  TouchableWithoutFeedback

} from 'react-native';

import CardPic from 'react-native-image-card'
import {Easing} from 'react-native';


const path = 'https://user-images.githubusercontent.com/14739234/';

const pic1 = [
  `${path}32308575-90578388-bf54-11e7-8d5f-dc8cca02e2e6.jpeg`,
];

const pic2 = [
  `${path}32308598-b8a56058-bf54-11e7-9f50-4023bc99edf3.jpeg`,
  `${path}32308630-de653e80-bf54-11e7-886d-2f2ec7b78d3d.jpeg`,
];

const pic3 = [
  `${path}32308630-de653e80-bf54-11e7-886d-2f2ec7b78d3d.jpeg`,
  `${path}32308598-b8a56058-bf54-11e7-9f50-4023bc99edf3.jpeg`,
  `${path}32308630-de653e80-bf54-11e7-886d-2f2ec7b78d3d.jpeg`,
];

const pic4 = [
  `${path}32308676-1cc7c1c0-bf55-11e7-9d81-562eeec45ad4.jpeg`,
  `${path}32309008-bd7baeb4-bf56-11e7-8a87-15217db54f8b.jpeg`,
  `${path}32308770-93f321c2-bf55-11e7-859f-fd4e9cc372ed.jpeg`,
  `${path}32308812-c3e69292-bf55-11e7-90d3-dcd143fbcb76.jpeg`,
];

const pic5 = [
  `${path}32308676-1cc7c1c0-bf55-11e7-9d81-562eeec45ad4.jpeg`,
  `${path}32309008-bd7baeb4-bf56-11e7-8a87-15217db54f8b.jpeg`,
  `${path}32308770-93f321c2-bf55-11e7-859f-fd4e9cc372ed.jpeg`,
  `${path}32308812-c3e69292-bf55-11e7-90d3-dcd143fbcb76.jpeg`,
  `${path}32308598-b8a56058-bf54-11e7-9f50-4023bc99edf3.jpeg`,
];
const pic8 = [
  `${path}32308598-b8a56058-bf54-11e7-9f50-4023bc99edf3.jpeg`,
  `${path}32308630-de653e80-bf54-11e7-886d-2f2ec7b78d3d.jpeg`,
  `${path}32308676-1cc7c1c0-bf55-11e7-9d81-562eeec45ad4.jpeg`,
  `${path}32309008-bd7baeb4-bf56-11e7-8a87-15217db54f8b.jpeg`,
  `${path}32308770-93f321c2-bf55-11e7-859f-fd4e9cc372ed.jpeg`,
  `${path}32308812-c3e69292-bf55-11e7-90d3-dcd143fbcb76.jpeg`,
  `${path}32308598-b8a56058-bf54-11e7-9f50-4023bc99edf3.jpeg`,
  `${path}32308598-b8a56058-bf54-11e7-9f50-4023bc99edf3.jpeg`,
];

const winWidth = Dimensions.get('window').width;

export default class CardPicDemo extends Component<{}> {
  constructor(props){
    super(props)
    this.state = {
      usageVisible: false
    }
  }
  render() {
    const imageConwi = winWidth - 15*2 - 10*2; // 计算图片容器宽度（第一张图到第三张图的距离，包括两个间隙宽度）

    return (
        <ScrollView style={styles.container}>
  <Modal
    visible={this.state.usageVisible}
    transparent={true}
    animationType={"none"}
        >
        <View style={styles.mask}>

  <View style={styles.content}>
  <View>
    <Text style={styles.modalTitle}>使用说明</Text>
    <Text style={styles.close}
    onPress={()=> {
      this.setState({
        usageVisible: false
      })
    }}>关闭</Text>
    </View>
    <ScrollView style={{flex: 1}}>
  <Text style={styles.usageTitle}>功能：</Text>
    <Text>该图片展示插件支持两种模式，多图无缝拼接模式和九宫格模式。可以点击全屏预览图片，退出预览支持三种手势（点击，上滑，下滑）。
                    预览背景可自定义透明度。可配置打开关闭图片的时间，滑动图片的反弹时间。</Text>
    <Text style={styles.usageTitle}>注意：</Text>
    <Text>九宫格模式：一定要设置图片容器的宽度和space图片间距值</Text>
    <Text>无缝拼接模式：一定要设置图片容器的高度</Text>

    <Text style={styles.usageTitle}>多图无缝拼接模式</Text>
    <Text style={styles.usageTxt}>mode： "multi" 多图无缝凭借模式</Text>
    <Text style={styles.usageTxt}>style：无缝拼接模式必须设置图片容器高度*</Text>
    <Text style={styles.usageTxt}>source：图片URL数组</Text>
    <Text style={styles.usageTxt}>maskOpacity： 点开图片预览是背景的不透明度(0-1)</Text>
    <Text style={styles.usageTxt}>easingFunc: 动画函数</Text>
    <Text style={styles.usageTxt}>space: 九宫格模式图片间距</Text>
    <Text style={styles.usageTxt}>disabled: 是否禁用点击查看预览图 默认false</Text>

    <Text style={styles.usageTitle}>动画相关配置</Text>
    <Text style={styles.usageTxt}>rebounceDuration: 反弹时间ms</Text>
    <Text style={styles.usageTxt}>showDuration： 打开预览图时长</Text>
    <Text style={styles.usageTxt}>closeDuration： 关闭预览图时长</Text>
    <Text style={styles.usageTxt}>startCapture: 是否劫持</Text>
    <Text style={styles.usageTxt}>moveCapture: 是否劫持</Text>


    </ScrollView>
    </View>




    </View>
    </Modal>

    <View style={[styles.mode, styles.mutilWrapper]}>
  <View style={styles.cardHeader}>
  <Text style={styles.title}>多图无缝拼接模式</Text>
    <Text>我是一条朋友圈</Text>
    <Text
    style={styles.usage}
    onPress={()=> {
      this.setState({
        usageVisible: true
      })
    }}
  >使用说明</Text>
    </View>
    <CardPic
    style={{height:200}} //容器样式
    source={pic4}
    mode="multi"
    maskOpacity={1}
    easingFunc={Easing.ease}
    rebounceDuration={500}
    showDuration={100}
    closeDuration={150}
    enableScaling={false}
    disabled={false}
    />
    </View>

    <View style={styles.mode}>
  <View style={styles.cardHeader}>
  <Text style={styles.title}>九宫格模式</Text>
    <Text>我是一条朋友圈</Text>
    </View>
    <CardPic
    style={{width:imageConwid}}
    source={pic8}
    mode="nineGrid"
    space={10}
    maskOpacity={0.8}
    easingFunc={Easing.ease}
    rebounceDuration={500}
    showDuration={100}
    closeDuration={150}
    enableScaling={true}
    disabled={false}
    />
    </View>

    </ScrollView>
  );
  }

}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#eee'
  },
  mode: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginHorizontal: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  cardHeader: {
    marginBottom: 10
  },
  title: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Medium',
  },
  usage: {
    position: "absolute",
    right: 0,
    top: 15,
    color: "#00bbff"
  },
  mask: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  content: {
    width: 300,
    height: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  usageTxt: {
    marginVertical: 2
  },
  usageTitle: {
    fontSize: 18,
    marginVertical: 15,
    color: '#9c9c9c'
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Medium',
    textAlign: 'center'
  },
  close: {
    position: 'absolute',
    color: "#00bbff",
    right: 0,
    top: 5
  }

});
