# react-native-image-card

[![npm](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://www.npmjs.com/package/react-native-image-card)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/zgfang1993/react-native-image-card/blob/master/LICENSE)

### 功能
- [X] 两种图片展示方式（多图无缝拼接模式，九宫格模式）
- [X] 单张图点击放大预览，支持背景色透明度配置，图片点开关闭时长配置，上下滑动或单击关闭预览
- [ ] 预览图可双击放大，双指缩放
- [ ] 预览图可左滑右滑
- [X] 长按保存到本地

### 效果图

![cardpic](https://user-images.githubusercontent.com/14739234/32446771-93cc79e6-c2cf-11e7-892c-f2775faebc91.gif)

### 使用

install from npm

```
npm install --save react-native-image-card
```

```
import CardPic from 'react-native-image-card';
import {Easing} from 'react-native';

const path = 'https://user-images.githubusercontent.com/14739234/';
const pic4 = [
  `${path}32308676-1cc7c1c0-bf55-11e7-9d81-562eeec45ad4.jpeg`,
  `${path}32309008-bd7baeb4-bf56-11e7-8a87-15217db54f8b.jpeg`,
  `${path}32308770-93f321c2-bf55-11e7-859f-fd4e9cc372ed.jpeg`,
  `${path}32308812-c3e69292-bf55-11e7-90d3-dcd143fbcb76.jpeg`,
];

<CardPic
  style={{height:200}}     // 容器样式
  source={pic4}            // 图片URL数组
  mode="multi"             // 图片展示模式
  maskOpacity={1}          // 预览图背景透明度0-1
  easingFunc={Easing.ease} // 动画函数
  rebounceDuration={500}   // 反弹时间
  showDuration={100}       // 打开时间
  closeDuration={150}      // 关闭时间
  enableScaling={false}    // 预览图上下滑动时图片是否会缩放
  disabled={false}         // 是否禁止图片预览
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
