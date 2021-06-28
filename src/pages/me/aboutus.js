import React from 'react';
import {View, Text, Image, Modal, ScrollView, Platform} from 'react-native';
import {
  IconFont,
  UiHeader,
  FormItem,
  UiGap,
  LinkItem,
} from '../../global.components';
import {$myTheme, $source, api} from '../../global.utils';
import {$fns} from '../../utils/fns';
import * as CacheManager from '@yz1311/react-native-http-cache';
import {$ajax, $ui} from '../../global.utils';
import CodePush from 'react-native-code-push';
import DeviceInfo from 'react-native-device-info';
import UpdateComp from '../../components/UpdateComp';
import Notice from './update/Notice';
import Upgrade from './update/Upgrade';
const key = 'CYBey_-_Y8Kh1Lqct3RKaqTfTjTHIG9RdFcf-';
const {getVersion,iosUpdateUrl} = api;
export default class App extends React.Component {
  state = {
    isShow: true,
    cacheSize: '10M',
    receivedBytes: 0,
    versionState:'',
    totalBytes: 0,
    showProcess: false,
    showIndicator: false,
    modalVisible: false,
    isShowNotice: false,
    isShow: false,
    newVersion: {
      apkUrl: '',
      comment: '',
      version: '',
    },
    isUpdate:false
  };
  componentDidMount() {
    const {isUpdate} = this.props.route.params;
    CacheManager.getCacheSize().then((value) => {
      let size = Math.round((value / 1024 / 1024) * 100) / 100 + 'M';
      this.setState({
        cacheSize: size,
        isUpdate:isUpdate,
        versionState:isUpdate?"有新版本":"已经是最新版本"
      });
    });
    
    //   alert(size)
  }
  remove = () => {
    CacheManager.clearCache().then(
      this.setState(
        {
          cacheSize: '0M',
        },
        () => {
          $ui.toast('清除缓存成功');
        },
      ),
    );
  };
  handleUpdate = () => {
    if (Platform.OS == 'android') {
      $ajax({
        url: getVersion,
        data: {},
        _this: this,
      }).then((value) => {
        if (value.code == 200) {
          const data = value.data;
          if (data.version > DeviceInfo.getVersion()) {
            let newVersion = {
              apkUrl: data.url,
              content: data.comment,
              version: data.version,
              status:data.status
            };
            this.setState({
              isShow: true,
              newVersion: newVersion,
            });
          } else {
            $ui.toast('已经是最新版本啦');
          }
        }
      });
    }else{
      this._getVersion()
    }
  };

  _getVersion(){
    return fetch(`${iosUpdateUrl}${$source.bundleId}`)
    .then((response) => response.json())
    .then((responseJson) => {
          if (responseJson.resultCount === 1 && responseJson.results[0].bundleId === $source.bundleId) {
            let local_version = DeviceInfo.getVersion();
            let pro_version = responseJson.results[0].version;
            if(local_version === pro_version){
              this.setState({
                versionState:'当前为最新版本!'
              });
              $ui.toast('已经是最新版本啦');
            }else{
              let newVersion = {
                apkUrl: responseJson.results[0].trackViewUrl,
                content: responseJson.results[0].releaseNotes,
                version: pro_version,
                status: $source.checkVersion
              };
              this.setState({
                versionState:'有最新版本',
                isShow: true,
                newVersion: newVersion,
              });
            }
          }
    })
    .catch((error) => {
        $ui.toast('检测版本失败,请稍后再试!');
    });
};

  render() {
    const {cacheSize, isUpdate,newVersion, isShow, isShowNotice,versionState} = this.state;
    return (
      <>
        <UiHeader
          title="关于我们"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />
        <Upgrade
          isShow={isShow}
          newVersion={newVersion}
          onClose={() => {
            this.setState({
              isShow: false,
            });
          }}
        />
        <Notice
          isShow={isShowNotice}
          onClose={() => {
            this.setState({
              isShowNotice: false,
            });
          }}
        />
        <ScrollView style={{backgroundColor: $myTheme.mainBgGray, flex: 1}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 50,
            }}>
            <Image
              source={require('./../../assets/imgs/icon_logo_box.jpg')}
              style={{
                width: 100,
                height: 100,
                borderRadius: 8,
                marginBottom: 20,
              }}
            />
            <Text style={{fontSize: 14}}>
              当前版本号:{DeviceInfo.getVersion()}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: '#fff',
              marginTop: 20,
              marginBottom: 10,
              borderTopWidth: 0.5,
              borderTopColor: '#ddd',
            }}>
            <LinkItem
              title="版本更新"
              more={versionState}
              dot={isUpdate}
              onPress={this.handleUpdate}
            />

            <LinkItem title="清除缓存" more={cacheSize} onPress={this.remove} />
          </View>

          <View
            style={{
              backgroundColor: '#fff',
              borderTopWidth: 0.5,
              borderTopColor: '#ddd',
            }}>
            <LinkItem
              title="隐私政策"
              onPress={() => {
                $fns.route({
                  context: this,
                  routeName: 'privacy',
                });
              }}
            />
            <LinkItem
              title="服务协议"
              onPress={() => {
                $fns.route({
                  context: this,
                  routeName: 'userservice',
                });
              }}
            />
            <LinkItem
              title="版权归属"
              arrow={false}
              more="江苏亚威机床股份有限公司"
            />
          </View>
          <UpdateComp ref="update" modalVisible={this.state.modalVisible} />
        </ScrollView>
      </>
    );
  }
}
