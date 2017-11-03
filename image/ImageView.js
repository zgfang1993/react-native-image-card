import React, {Component} from 'react';
import {
  View,
  Image,
  Modal,
  Easing,
  StyleSheet,
  PanResponder,
  UIManager,
  NativeModules,
  findNodeHandle,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';

import Animation from './Animation';

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
      maskOpacity
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

class ImageModal extends Component {
  constructor(props) {
    super(props);

    this._setNativeProps = this._setNativeProps.bind(this);
    this._closeModalByTap = this._closeModalByTap.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this._rebounce = this._rebounce.bind(this);
    this._touchPositionCheck = this._touchPositionCheck.bind(this);
    this._updateNativeStyles = this._updateNativeStyles.bind(this);
  }

  componentWillMount(){

    // 初始化modal样式 start
    this._initModalStyle = {
      style: {
        backgroundColor: `rgba(0, 0, 0, ${this.props.maskOpacity})`
      }
    };

    this._initContentStyle = {
      style: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    };

    this._initImgSize = {
      style: this.props.size
    };

    this._modalStyle = JSON.parse(JSON.stringify(this._initModalStyle));
    this._contentStyle = JSON.parse(JSON.stringify(this._initContentStyle));
    this._imgSize = JSON.parse(JSON.stringify(this._initImgSize));
    // 初始化modal样式 end

    this._inAnimation = false;

    // 创建一个PanResponder 实例 通过{...this._pan.panHandlers} 将对象设置为View属性
    this._pan = PanResponder.create({
      onStartShouldSetPanResponder: this._onStartShouldSetPanResponder.bind(this),
      onStartShouldSetPanResponderCapture: (evt, gestureState) => this.props.startCapture,
        onMoveShouldSetPanResponder: this._onMoveShouldSetPanResponder.bind(this),
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.props.moveCapture,
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderGrant: this._handlePanResponderGrant.bind(this),
        onPanResponderMove: this._handlePanResponderMove.bind(this),
        onPanResponderRelease: this._handlePanResponderEnd.bind(this),
        onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
        onShouldBlockNativeResponder: (evt, gestureState) => true
  });
  }

  //是否成为事件响应者
  _onStartShouldSetPanResponder (evt, gestureState) {
    if (this._inAnimation || this.props.disabled) return true;
    return false;
  }

  // 触摸是进行过程中，RN 询问组件是否要成为响应者，返回 true 表示是。
  _onMoveShouldSetPanResponder (evt, gestureState) {
    if (this._inAnimation || this.props.disabled) return;
    if (this.props.responderNegotiate && this.props.responderNegotiate(evt, gestureState) === false) return false;
    if (this._touchPositionCheck(gestureState)) {
      return true;
    }
    return false;
  }

  // 表示申请成功，组件成为了事件处理响应者，这时组件就开始接收后序的触摸事件输入。
  // 一般情况下，这时开始，组件进入了激活状态，并进行一些事件处理或者手势识别的初始化。
  _handlePanResponderGrant(evt, gestureState) {
  }

  // 移动距离
  _handlePanResponderMove (evt, gestureState) {
    const {dy} = gestureState; // 往上滑是负值,往下滑是正值
    this._updateNativeStyles(dy);
  }

  //手势完成
  _handlePanResponderEnd (evt, gestureState) {
    const {dy} = gestureState;

    if (dy > 0.4 * winHeight) {         //往下滑 isDown true
      this._closeModal(true);

    } else if (-dy > 0.4 * winHeight) { // 往上滑 isDown false
      this._closeModal(false);

    } else {
      this._rebounce(); // 滑动距离太小，反弹回原来的位置

    }
  }

  _touchPositionCheck(gestureState) {
    const {dx, dy} = gestureState;
    if (Math.abs(dy) <= Math.abs(dx)) {
      return false;
    }
    return true;
  }

  _closeModal(isDown) {
    const {
      easingFunc,
      onClose,
      closeDuration
    } = this.props;
    let current = this._contentStyle.style.top;

    this._inAnimation = true;
    new Animation({
      start: current,
      end: isDown ? winHeight : -winHeight,
      duration: closeDuration,
      easingFunc,
      onAnimationFrame: (val) => {
      this._updateNativeStyles(val);
  },
    onAnimationEnd: () => {
      this._inAnimation = false;
      onClose();
      this._setNativeProps(true); //重置
    }
  }).start();
  }

  // 点击关闭modal
  _closeModalByTap() {
    if (this._inAnimation) {
      return false;
    }
    this._closeModal(true);
  }

  // 反弹动画
  _rebounce(isDown) {
    const {rebounceDuration, easingFunc} = this.props;
    let current = this._contentStyle.style.top;

    this._inAnimation = true;

    new Animation({
      start: current,
      end: 0, // 0 回到初始位置
      duration: Math.abs(current / winHeight) * rebounceDuration, //反弹时长
      easingFunc,
      onAnimationFrame: (val) => {
      this._updateNativeStyles(val);
  },
    onAnimationEnd: () => {
      this._inAnimation = false;
    }
  }).start(1000);
  }

  _updateNativeStyles(dy) {
    const {
      width,
      height
    } = this.props.size;

    //this._contentStyle.style.left = dx; // 往左消失
    //this._contentStyle.style.right = -dx;

    this._contentStyle.style = { // top  正值 距离原来的位置往下移
      top: dy,
      //bottom: -dy
    }

    this._modalStyle.style = {
      backgroundColor: `rgba(0, 0, 0, ${ this.props.maskOpacity- Math.abs(dy) / winHeight * 0.8})`
    };

    if (this.props.enableScaling) {
      this._imgSize.style = {
        width: width * (1 - Math.abs(dy / winHeight) * 0.6),
        height: height * (1 - Math.abs(dy / winHeight) * 0.6)
      }
    } else {
      this._imgSize.style = {
        width: width,
        height: height
      }
    }
    this._setNativeProps();
  }

  _setNativeProps(isReset) {
    //初始化
    if (isReset) {
      this._contentStyle = JSON.parse(JSON.stringify(this._initContentStyle));
      this._modalStyle = JSON.parse(JSON.stringify(this._initModalStyle));
      this._imgSize = JSON.parse(JSON.stringify(this._initImgSize));
    }
    // 直接操作DOM 赋值样式
    this.content && this.content.setNativeProps(this._contentStyle);
    this.mask && this.mask.setNativeProps(this._modalStyle);
    this.img && this.img.setNativeProps(this._imgSize);
  }

  componentDidUpdate () {
    const {showDuration, easingFunc} = this.props;

    new Animation({
      start: 0,
      end: 1,
      duration: showDuration,
      easingFunc: easingFunc,
      onAnimationFrame: (val) => {
      this.mask && this.mask.setNativeProps({style: {
      opacity: val
    }});
  },
    onAnimationEnd: () => {
      this._inAnimation = false;
    }
  }).start();
  }

  render () {
    const {
      visible,
      onClose,
      source,
      size,  // 适应屏幕的最大尺寸
      maskOpacity
    } = this.props;
    const maskBack = {backgroundColor: `rgba(0, 0, 0, ${maskOpacity})`};

    if (visible) { this._inAnimation = true; }
    this._initImgSize.style = size;

    return (
        <Modal
    visible={visible}
    transparent={true}
    onRequestClose={onClose}
        >
        <View style={[styles.mask, maskBack]} ref={mask => {this.mask = mask;}} {...this._pan.panHandlers}>
  <TouchableWithoutFeedback
    ref={ref => {this.imgContainer = ref;}}
    onPress={this._closeModalByTap}>
  <View
    ref={ref => {this.content = ref;}}
    style={styles.content}>
  <Image ref={img => {this.img = img;}} source={source} style={[size]}/>
    </View>
    </TouchableWithoutFeedback>
    </View>

    </Modal>
  );
  }
}

ImageView.ImageModal = ImageModal;

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0
  },
  content: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
});
