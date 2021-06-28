import {
  Dimensions,
  findNodeHandle,
  UIManager,
  NativeModules,
  StatusBar,
  Platform,
} from 'react-native';
import {scaleSize} from './utils.scaleSize';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {CommonActions} from '@react-navigation/native';
let BaseSize = 750;

class Fns {
  // 获取窗口尺寸
  static getWindowWidth() {
    return Dimensions.get('window').width;
  }

  // 获取窗口尺寸
  static getWindowHeight() {
    return Dimensions.get('window').height;
  }

  // 获取状态栏高度
  static getStatusBarHeight() {
    return getStatusBarHeight();
  }

  // 截取定长字符串
  static subStr(value, num = 15) {
    if (!value) return '';
    return value.length > num ? value.slice(0, num) + '...' : value;
  }

  // dom 操作
  static dom(ref) {
    return new Promise((resolve) => {
      const handle = findNodeHandle(ref);
      UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
        resolve({
          x,
          y,
          width,
          height,
          pageX,
          pageY,
        });
      });
    });
  }

  // 响应式尺寸
  static size(e) {
    if (Number.isNaN(e)) {
      throw new TypeError('传入的必须是数值尺寸');
    }
    return scaleSize.size(e);
  }

  // 路由跳转
  static route(configs) {
    let {
      context, // 上下文
      routeName, // 路由名称
      params = {}, // 路由参数
      type = 'push', // 路由类型
      auth = false, // 鉴权标识
    } = configs;

    // if(type !== "back"){
    //     if( !context || !routeName){
    //         throw new Error("context上下文和routeName 不允许为空");
    //         return;
    //     }
    // }

    let {navigation} = context.props;

    switch (type) {
      case 'back':
        // navigation.dispatch(
        //     CommonActions.reset({
        //       index: 0,
        //       routes: [{name: routeName}],
        //     }),
        //   );
        navigation.goBack();
        break;

      case 'navigate':
        navigation.navigate(routeName, params);
        break;

      case 'replace':
        navigation.replace(routeName, params);
        break;
      case 'popTop':
        navigation.popToTop();
        break;
      case 'push':
        navigation.push(routeName, params);
        break;
      default:
        navigation.push(routeName, params);
    }
  }

  static type(data) {
    if (data === null) {
      return 'null';
    } else if (data === undefined) {
      return 'undefined';
    } else if (data.constructor == Array) {
      return 'array';
    } else {
      var _t = typeof data;

      if (_t != 'object') {
        return _t;
      } else {
        if (data.constructor === Object) {
          return 'object';
        } else if (data.constructor === RegExp) {
          return 'regexp';
        } else if (data.constructor === Date) {
          return 'date';
        } else if (data.constructor === Array) {
          return 'array';
        }
      }
    }
  }
}

export {Fns as $fns};
