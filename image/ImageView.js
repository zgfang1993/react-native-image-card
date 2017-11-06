import React, {Component} from 'react';
import {
  View,
  Image,
  Easing,
  UIManager,
  NativeModules,
  findNodeHandle,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

import ImageModal from './ImageModal'

//const RCTUIManager = NativeModules.UIManager;

const winWidth = Dimensions.get('window').width;
const winHeight = Dimensions.get('window').height;
const winRatio = winWidth / winHeight;

export default class ImageView extends Component {
  constructor(props){
    super(props)
    this.state = {
      maxSize: {
        width: 0,
        height: 0
      },
      isModalVisible: false //控制modal是否可见
    };
    this.enableModal = false; //是否允许弹出modal
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.modalRefBind = this.modalRefBind.bind(this);
    this.getMaxSizeByRatio = this.getMaxSizeByRatio.bind(this);
  }

  static defaultProps = {
    style: {height: 300}, //默认每张图的高度
    disabled: false,      // 该组件是否禁用
    startCapture: false,  // 是否需要劫持
    moveCapture: false,   // 是否需要劫持
    rebounceDuration: 800,
    closeDuration: 150,    //关闭时长
    showDuration: 100,   //打开时长
    easingFunc: Easing.ease,
    enableScaling: false, // 关闭modal时上下拖动的时候图片是否缩小
    maskOpacity: 1
  };

  closeModal(){
    if (this.props.disabled) return;
    // 设置modal未不可见
    this.setState({
      isModalVisible: false
    });
  }

  openModal(){
    if (!this.refs.view || !this.enableModal || this.props.disabled) return;

    // 记录图片初始位置
    UIManager.measure(findNodeHandle(this.refs.view), (x, y, w, h, px, py) => {
      this.originPosition = {x, y, w, h, px, py};
  });

    this.setState({
      isModalVisible: true
    });
  }

  modalRefBind(modal){
    this._modal = modal;
  }

  getMaxSizeByRatio(ratio){
    return {
      width: ratio >= winRatio ? winWidth : winWidth / ratio,
      height: ratio >= winRatio ? winWidth / ratio : winHeight
    };
  }

  render(){
    const {
      source,
      imgStyle,
      style,
      resizeMode,
      disabled,
      rebounceDuration,
      showDuration,
      closeDuration,
      easingFunc,
      enableScaling,
      maskOpacity,
      longPressTime
    } = this.props;

    const {
      isModalVisible,
      maxSize
    } = this.state;

    return (
        <TouchableWithoutFeedback style={imgStyle}
    onPress={this.openModal}
    ref="view">
        <View style={style}>
        <Image
    source={source}
    resizeMode={resizeMode}
    style={imgStyle}
    />
    <ImageModal
    ref={this.modalRefBind}
    disabled={disabled}
    visible={isModalVisible}
    onClose={this.closeModal}
    originPosition={this.originPosition}
    size={maxSize}
    source={source}
    rebounceDuration={rebounceDuration}
    closeDuration={closeDuration}
    showDuration={showDuration}
    easingFunc={easingFunc}
    enableScaling={enableScaling}
    maskOpacity={maskOpacity}
    longPressTime={longPressTime}
    />
    </View>
    </TouchableWithoutFeedback>
  )
  }

  componentDidMount(){
    if (this.props.source.uri) {
      // 在显示图片前获取图片的宽高
      Image.getSize(this.props.source.uri, (w, h) => {
        // 设置图片预览是图片适应屏幕的最大尺寸
        this.setState((state) => {
        state.maxSize = this.getMaxSizeByRatio(w / h);
      this.enableModal = true;
    });
    });
    } else {
      this.setState((state) => {
        state.maxSize = this.getMaxSizeByRatio(this.props.imgStyle.width / this.props.imgStyle.height);
      this.enableModal = true;
    });
    }
  }

}

ImageView.ImageModal = ImageModal;