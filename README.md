# react-native-image-card

[![npm](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://www.npmjs.com/package/react-native-image-card)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/zgfang1993/react-native-image-card/blob/master/LICENSE)

### 功能
- [X] 两种图片展示方式（多图无缝拼接模式，九宫格模式）
- [X] 单张图点击放大预览，支持背景色透明度配置，图片点开关闭时长配置，上下滑动或单击关闭预览
- [ ] 预览图可双击放大，双指缩放
- [ ] 预览图可左滑右

### 效果图

![cardpic](https://user-images.githubusercontent.com/14739234/32363899-a1920038-c03f-11e7-91e0-ce47a6b1fdae.gif)

### 使用

install from npm

```
npm install --save react-native-image-card
```

```
import CardPic from 'react-native-image-card';
import {Easing} from 'react-native';
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
```

### 配置

style：整个图片卡的样式，九宫格模式必须设置图片容器宽度

source：图片URL数组

mode： 模式"multi" 多图无缝凭借模式 "nineGrid" 九宫格模式

maskOpacity： 点开图片预览是背景的不透明度，小数

space: 九宫格模式图片间距

easingFunc: 动画函数

rebounceDuration: 反弹时间ms

enableScaling: 图片预览模式上下拖动图片是否伸缩 默认false

disabled: 是否禁用点击查看预览图 默认false

showDuration： 打开预览图时长

closeDuration： 关闭预览图时长

startCapture: 是否劫持

moveCapture: 是否劫持
