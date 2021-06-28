import {$fns} from './fns';
import {$ui,$source} from '../global.utils';
import {CommonActions} from '@react-navigation/native';
let LoadingUtil = {
  // 显示Loading
  showLoading(timeOut = 100) {
    global.mLoadingComponentRef && global.mLoadingComponentRef.show();
    // this.timerLoading = setTimeout(() => {
    //   this.dismissLoading();
    // }, timeOut);
  },

  // 取消Loading
  dismissLoading() {
    global.mLoadingComponentRef && global.mLoadingComponentRef.hide();
    this.timerLoading && clearTimeout(this.timerLoading);
  },
};
function _fetch(fetch_promise, timeout) {
  let breaker = new Promise((resolve, reject) => {
    setTimeout(function () {
      LoadingUtil.dismissLoading();
      reject('请求超时，请稍后再试');
    }, timeout);
  });
  var abortable_promise = Promise.race([fetch_promise, breaker]);

  abortable_promise.catch((res) => {
    showMessage(res);
  });
  return abortable_promise;
}
//race任务
function ajax(params) {
  return _fetch(fetchPromise(params), 20000);
}
function fetchPromise(params) {
  let address = `${$source.url}/api`;
  let {url, data = {}, hasLoading = true, fm = false, _this} = params;
  let type = params.type == 'get' ? 'GET' : 'POST';
  url = address + url;
  let authorization;

  if(JSON.parse(sto.getValue('token')))
  {
    
    authorization=JSON.parse(sto.getValue('token'));
  }

  let options = {};
  if (fm) {
    options = {
      method: type,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    };
  } else {
    options = {
      method: type,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };
  }
  if (data && data.__tailPath) {
    const {__tailPath} = data;
    url = `${url}/${__tailPath}`;
  }
  if (hasLoading){
    LoadingUtil.showLoading();
  } 
  if (fm) {
    options.body = data.formData;
  } else {
    if (type == 'GET') {
      let bodyData = [];
      Object.keys(data).forEach((key) => {
        bodyData.push(`${key}=` + encodeURIComponent(data[key]));
      });
      url += '?' + bodyData.join('&');
    } else {
      options.body = JSON.stringify(data);
    }
  }

  if (authorization) {
    options.headers.authorization = authorization;
  }

  return new Promise((resolve, reject) => {
    let token;
    fetch(url, options)
      .then((res) => {
        if (res.headers.map.authorization) {
          sto.setValue('token',JSON.stringify(res.headers.map.authorization) )
          token = res.headers.map.authorization;
        }
        return res.json();
      })
      .then((res) => {
        var jsonData = res;  
        // 错误统一处理
        if (jsonData.code == 400) {
          // $fns.route({
          //   context: _this,
          //   routeName: 'error_400',
          // });
          if(jsonData.data==''||jsonData.data==null){
            showMessage(jsonData.message)
          }
          else{
            showMessage(jsonData.data)
          }
        }

        // 未登录
        if (jsonData.code == 401) {
          // $fns.route({
          //   context: _this,
          //   routeName: 'error_401',
          // });
          let {navigation} = _this.props;
          showMessage('登录过期')
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'login'}],
            }),
          );
        }

        // 未授权
        if (jsonData.code == 403) {
          $fns.route({
            context: _this,
            routeName: 'error_403',
          });
        }
        // 未授权
        if (jsonData.code >= 403 && jsonData.code <= 422) {
          $fns.route({
            context: _this,
            routeName: 'error_404',
          });
        }

        if (res.status >= 500 && res.status <= 504) {
          showMessage('服务器出错了，请稍后再试~');
        }

        // 关闭Loadding

        // if (hasLoading) {
        //   setTimeout(() => {
        //   }, 100);
        // }
        LoadingUtil.dismissLoading();
        if (token) {
          jsonData.token = token;
        }

        return resolve(jsonData);
      })
      .catch((error) => {
        LoadingUtil.dismissLoading();
        showMessage('网络异常，稍后再试');
        reject('网络异常，稍后再试');
      });
  });
}
function showMessage(data) {
  $ui.toast(data)
}
export {ajax as $ajax};
