import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Platform,
  Modal,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking
} from 'react-native';

import {
  upgrade,
  versionName,
  versionCode,
  openAPPStore,
  checkIOSUpdate,
  addDownLoadListener,
} from 'rn-app-upgrade';

import * as Progress from 'react-native-progress';

function App(props) {
  let {
    // 填入下载地址
    apkUrl = '',

    content = '',
    version = '',
    status=0,
  } = props.newVersion;
  content=content.length==0?[]:content.split(";");
  let {isShow = false, onClose = () => {}} = props;
  let [pgVal, setPgVal] = useState(0);
  
  let [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    return () => {
      addDownLoadListener((progress) => {
        let _val = (progress / 100).toFixed(2);

        if (isNaN(_val)) {
          setPgVal(0);
        } else {
          _val = parseFloat(_val);
          setPgVal(_val);
        }
      });
    };
  });

  let appUpgrade = useCallback(() => {
    if (Platform.OS == 'android') {
      // ===== ajax 获取服务器最新版本 =====
      // 在线更新
      upgrade(apkUrl);

      // let currentVersion = "2.0.1";
      // if(currentVersion > versionCode) {
      //     // upgrade(apkUrl);
      // }
    } else {
      // IOS更新
      Linking.openURL(apkUrl).catch(err => console.error('An error occurred', err));
      /*
                const IOSUpdateInfo = await checkIOSUpdate(appid, 当前版本号);
                IOSUpdateInfo.code // -1: 未查询到该App 或 网络错误 1: 有最新版本 0: 没有新版本
                IOSUpdateInfo.msg
                IOSUpdateInfo.version
            */
    }
  });

  return (
    <Modal transparent visible={isShow} animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{width: Dimensions.get('screen').width * 0.8}}>
          <View style={{flexDirection: 'column'}}>
            <View style={{height: 40}}></View>
            <View
              style={{
                height: 60,
                backgroundColor: '#1c84c6',
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              }}></View>
            <Image
              source={require('.././../../assets/imgs/icon_upgrade.png')}
              style={{
                width: 70,
                height: 70,
                position: 'absolute',
                top: 10,
                left: '50%',
                marginLeft: -30,
              }}
              resizeMode={'contain'}
            />
          </View>

          <View
            style={{
              paddingHorizontal: 12,
              backgroundColor: '#fff',
              paddingVertical: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}>
              <Text style={{fontSize: 18}}>发现新版本</Text>
              <View
                style={{
                  backgroundColor: '#1c84c6',
                  borderRadius: 3,
                  paddingHorizontal: 5,
                  paddingVertical: 2,
                  marginLeft: 8,
                }}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>{version}</Text>
              </View>
            </View>
            <Text style={{fontSize: 15, fontWeight: 'bold',marginBottom:7}}>更新内容</Text>
            {content.length==0?
            ( <Text style={{fontSize: 14,marginBottom:3,paddingLeft:4, color:"grey"}} numberOfLines={8}>
              暂无更新描述
             </Text>)
             :(
              content.map((item,index)=>(
                <Text key={index} style={{fontSize: 14,marginBottom:3,paddingLeft:4, color:"grey"}} numberOfLines={8}>
                {item}
               </Text>
               ))
             )
             }  

           
          </View>

          {/** 进度条 */}
          {isUpdate && (
            <View
              style={{
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
              }}>
              <View style={{flex: 1}}>
                <Progress.Bar
                  borderRadius={2}
                  unfilledColor="#ebeef5"
                  color="#409eff"
                  borderWidth={0}
                  height={10}
                  progress={pgVal}
                  width={null}
                />
              </View>
              <Text style={{paddingLeft: 10}}>{parseInt(pgVal * 100)} %</Text>
            </View>
          )}

          {/** 更新按钮 */}
          {!isUpdate && (
            <View
              style={{
                backgroundColor: '#fff',
                paddingBottom: 18,
                borderBottomLeftRadius: 3,
                borderBottomRightRadius: 3,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS == 'android') {
                      setIsUpdate(true);
                    }
                    appUpgrade();
                  }}
                  style={{
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 200,
                    borderRadius: 20,
                    backgroundColor: '#1c84c6',
                    fontSize: 18,
                    color: '#fff',
                  }}>
                  <Text
                    style={{color: '#fff', fontSize: 17, fontWeight: 'bold'}}>
                    立即更新
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

      {status==0&&(
        <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 15,
        }}
        onPress={() => {
          onClose();
        }}>
        <Image
          source={require('../../../assets/imgs/icon_close.png')}
          style={{width: 40, height: 40}}
        />
      </TouchableOpacity>
      )}  
      </View>
    </Modal>
  );
}

export default App;
