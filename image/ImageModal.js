import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableHighlight,
  CameraRoll
} from 'react-native';
import Animation from './Animation';

const winWidth = Dimensions.get('window').width;
const winHeight = Dimensions.get('window').height;
const menuHeight = 110; // 50 50 5 5

export default class ImageModal extends Component {
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
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder.bind(this),
      onStartShouldSetPanResponderCapture: (evt, gestureState) => this.props.startCapture,
        onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder.bind(this),
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.props.moveCapture,
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderGrant: this._handlePanResponderGrant.bind(this),
        onPanResponderMove: this._handlePanResponderMove.bind(this),
        onPanResponderRelease: this._handlePanResponderEnd.bind(this),
        onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
        onShouldBlockNativeResponder: (evt, gestureState) => true
  });
  }

  // 是否成为事件响应者
  _handleStartShouldSetPanResponder (evt, gestureState) {
    // Should we become active when the user presses down on the View
    if (this._inAnimation || this.props.disabled) return true;
    return false;
  }

  // 触摸进行过程中是否成为事件响应者
  _handleMoveShouldSetPanResponder (evt, gestureState) {
    // Should we become active when the user moves a touch over the View?
    if (this._inAnimation || this.props.disabled) return false;
    if (this.props.responderNegotiate && this.props.responderNegotiate(evt, gestureState) === false) return false;
    if (this._touchPositionCheck(gestureState)) {
      return true;
    }
    return false;
  }

  // 开始手势操作
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
  <TouchableWithoutFeedback
    onPress={this._closeModalByTap}
    onLongPress={()=>{
      this.menu.setNativeProps({bottom: 0});
    }}
  >
  <Image ref={img => {this.img = img;}} source={source} style={[size]}/>
    </TouchableWithoutFeedback>

    </View>
    </TouchableWithoutFeedback>
    </View>
    {this.saveMenu(source.uri)}
  </Modal>
  );
  }

  /**
   * 点击关闭modal
   * @returns {boolean}
   * @private
   */
  _closeModalByTap() {
    if (this._inAnimation) {
      return false;
    }
    this._closeModal(true);
  }

  /**
   * 是否保存图片menu
   * @returns {*}
   */
  saveMenu(uri){
    return (
        <View style={styles.menuContainer} ref={menu => {this.menu = menu}}>
  <TouchableHighlight underlayColor="#F2F2F2"
    onPress={this.saveToLocal.bind(this,uri)}
    style={styles.operateContainer}>
  <Text style={styles.operateText}>保存到手机相册</Text>
    </TouchableHighlight>
    <TouchableHighlight underlayColor="#F2F2F2"
    onPress={this.leaveMenu.bind(this)}
    style={styles.operateContainer}>
  <Text style={styles.operateText}>取消</Text>
    </TouchableHighlight>
    </View>
  )
  }

  /**
   * 关闭保存图片menu
   */
  leaveMenu(){
    this.menu.setNativeProps({bottom: -menuHeight});
  }
  /**
   * 图片保存到本地相册
   */
  saveToLocal(uri){

    var promise = CameraRoll.saveToCameraRoll(uri);
    promise.then(function(result) {
      alert('保存成功！地址如下：\n' + result);
    }).catch(function(error) {
      alert('保存失败！\n' + error);
    });

    this.menu.setNativeProps({bottom: -menuHeight});
  }
}

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
  },
  menuContainer: {
    position: 'absolute',
    width: winWidth,
    height: menuHeight,
    left: 0,
    bottom: -menuHeight,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
  },
  operateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: winWidth-20,
    height: 50,
    borderRadius: 5,
    marginBottom: 5
  },
  operateText: {
    color: '#1087ff'
  }
});