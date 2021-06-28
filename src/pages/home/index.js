import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  Modal,
  Linking,
} from 'react-native';
import {
  IconFont,
  UiHeader,
  MsgPane,
  ApplicationIcon,
  MsgRow,
  MsgTag,
} from './../../global.components';
import {$fns, api, $myTheme} from '../../global.utils';
import MarqueeVertical from '../../components/page/MarqueeVertical';
import Swiper from 'react-native-swiper';
import {$ajax, $ui, $source} from '../../global.utils';
import moment from 'moment';
import UiScan from '../../components/UiScan';
import CodeScan from '../../components/CodeScan';
import {CommonActions} from '@react-navigation/native';
import Upgrade from '../me/update/Upgrade';
import Notice from '../me/update/Notice';
import DeviceInfo from 'react-native-device-info';
import {isCustomAdmins, isYWAdmin, appsName} from '../../utils/data';
import LinearGradient from 'react-native-linear-gradient';
import JPush from 'jpush-react-native';
let cellWidth = $fns.getWindowWidth() / 5;
const {
  findMsgByPage,
  countUnReadMsg,
  login,
  getVersion,
  iosUpdateUrl,
  getMinProgram,
  readAllMsg,
  getDeviceTag,
  updateTag,
} = api;

let itemMessage = [
  {
    label: 1,
    time: moment().format('YYYY-MM-DD'),
    value: '暂无消息和公告',
  },
];
function Confirm(props) {
  let {
    isShow = false,
    onClose = () => {},
    OK = () => {},
    showTel = () => {},
  } = props;
  let telCol = [
    '0514-86880518',
    '86880528',
    '86519118',
    '0514-86880538',
    '86519128',
    '86519158',
  ];
  return (
    <Modal
      visible={isShow}
      transparent={true}
      statusBarTranslucent
      animationType="slide">
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: $fns.getWindowWidth() - 60,
            backgroundColor: '#1c83c6',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 20,
            // borderRadius: 4,
            borderRadius: 25,
            borderColor: '#1c83c6',
            borderWidth: 0.5,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              borderRadius: 25,
            }}>
            <MsgPane
              title="联系我们"
              style={{
                marginBottom: 0,
                backgroundColor: '#e6e9ef',
                borderRadius: 0,
                justifyContent: 'center',
                alignItems: 'center',
                width: '99%',
              }}>
              <MsgRow
                title="销售电话："
                align="left"
                border={false}
                rowHeight={20}
                padding={10}
              />
              {telCol.slice(0, 3).map((item, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}
                  key={index}>
                  <TouchableOpacity
                    onPress={() => {
                      showTel(item);
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#1c83c6',
                        marginRight: 15,
                        fontSize: 16,
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
              <MsgRow
                title="售后服务："
                align="left"
                border={false}
                rowHeight={20}
                padding={10}
              />
              {telCol.slice(3, 6).map((item, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}
                  key={index}>
                  <TouchableOpacity
                    onPress={() => {
                      showTel(item);
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#1c83c6',
                        marginRight: 15,
                        fontSize: 16,
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

              <MsgRow
                title="电子邮箱："
                // msg="sales1@yawei.cc"
                align="left"
                border={false}
                rowHeight={20}
                padding={10}
              />
              <Text style={{textAlign: 'center', marginBottom: 5}}>
                sales1@yawei.cc
              </Text>
              <MsgRow
                title="公司地址"
                // msg="sales1@yawei.cc"
                align="left"
                border={false}
                rowHeight={30}
                padding={10}
              />
              <Text style={{textAlign: 'center', marginBottom: 5}}>
                江苏扬州市江都区黄海南路仙城工业园
              </Text>
            </MsgPane>
          </View>

          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#1c83c6',
              borderRadius: 25,
            }}>
            <TouchableOpacity
              style={{
                height: 40,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                onClose();
              }}>
              <Text style={{fontSize: 15, color: '#fff'}}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
function Tooltop(props) {
  let {
    isShow = false,
    onClose = () => {},
    selectItem = {title: '', content: ''},
  } = props;
  return (
    <Modal
      visible={isShow}
      transparent={true}
      statusBarTranslucent
      animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            // justifyContent: 'center',
            // alignItems: 'center',
            // marginTop: 3,
            position: 'relative',
            right: -130,
            // left:105,
            top: 20,
            zIndex: 999,
          }}
          onPress={() => {
            onClose();
          }}>
          <Image
            source={require('../../assets/imgs/icon_close.png')}
            style={{width: 40, height: 40}}
          />
        </TouchableOpacity>
        <ImageBackground
          source={require('../../assets/imgs/tooltip.png')}
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 20,
            paddingBottom: 20,
            width: 250,
            height: 220,
          }}>
          <View style={{width: '100%', marginTop: 20}}>
            <Text style={{color: '#fff', textAlign: 'center', fontSize: 16}}>
              {selectItem.title}
            </Text>
          </View>
          <View style={{marginTop: 20, width: '100%'}}>
            <Text style={{color: '#fff', fontSize: 16}}>
              {selectItem.content}
            </Text>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
}
export default class App extends React.Component {
  state = {
    banners: [
      {pic: require('../../assets/imgs/banner1.png')},
      {pic: require('../../assets/imgs/banner2.png')},
    ],
    messageList: [],
    firmId: 0,
    isShow: false,
    newVersion: {
      apkUrl: '',
      comment: '',
      version: '',
    },
    consultModal: false,
    text: '',
    width: 70,
    apps: this.initAPP(),
    // allApps: this.initAllAPP(),
    modalList: [],
    isHave: false,
    selectItem: {},
    minProgram: JSON.parse(sto.getValue('minProgram'))
      ? JSON.parse(sto.getValue('minProgram'))
      : [],
    ability: JSON.parse(sto.getValue('ability'))
      ? JSON.parse(sto.getValue('ability'))
      : [],
    // animating:true
  };
  async componentDidMount() {
    // const routes = state.routes.filter(r => r.name !== 'Home');
    let data = JSON.parse(sto.getValue('loginData'));
    if (data != null && data.username != null && data.password != null) {
      this.setState({
        firmId: data.userData.firmId,
      });
      const success = await this.login(data.username, data.password);
      if (success) {
        //通知回调

        this.notificationListener = (result) => {
          // console.log('notificationListener:' + JSON.stringify(result));

          if (result.notificationEventType == 'notificationOpened') {
            $fns.route({
              context: this,
              routeName: 'weekly',
              type: 'navigate',
            });
          }
        };

        JPush.addNotificationListener(this.notificationListener);
        window.setTimeout(() => {
          this.getDeviceTag();
        }, 1000);
        this.getApp();
        this.getXiao();
        this.countUnReadMsg(data.userData.userId);
        this.getmessage(data.userData.userId, 0); //0:公告 1：消息
      }
      // this.getXiao();
      this._navListener = this.props.navigation.addListener('focus', () => {
        // if(a=='200'){

        this.countUnReadMsg(data.userData.userId);
        this.getmessage(data.userData.userId, 0); //0:公告 1：消息
        // }
      });
      this.requestMultiplePermission();
    } else {
      let {navigation} = this.props;
      // navigation.push('login');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'login'}],
        }),
      );
    }
  }

  getDeviceTag = () => {
    if (isCustomAdmins()) {
      JPush.getRegistrationID((result) => {
        if (result.registerID != '') {
          $ajax({
            url: updateTag,
            data: {
              addFlag: 0,
              registrationId: result.registerID,
              tagName: '企管',
            },
            _this: this,
            hasLoading: false,
          });
        }
      });
    } else {
      JPush.getRegistrationID((result) => {
        if (result.registerID != '') {
          $ajax({
            url: updateTag,
            data: {
              addFlag: 1,
              registrationId: result.registerID,
              tagName: '企管',
            },
            _this: this,
            hasLoading: false,
          });
        }
      });
    }
  };

  initAPP() {
    let apps = [];
    let loginData = JSON.parse(sto.getValue('loginData'));
    if (loginData) {
      apps = loginData.userData.apps || [];
    }
    return apps;
  }
  // initAllAPP() {
  //   let allApps = [];
  //   let loginData = JSON.parse(sto.getValue('loginData'));
  //   if (loginData) {
  //     allApps = loginData.userData.appallAppss || [];
  //   }
  //   return allApps;
  // }
  getXiao = () => {
    $ajax({
      url: getMinProgram,
      data: {},
      _this: this,
      hasLoading: false,
    }).then((value) => {
      if (value.code == 200) {
        // console.log(value.data);
        let minProgram = value.data.filter((item, index) => item.type == 0);
        let ability = value.data.filter((item, index) => {
          return item.type == 2;
        });
        sto.setValue('ability', JSON.stringify(ability));
        sto.setValue('minProgram', JSON.stringify(minProgram));
        // console.log(ability);
        this.setState({
          minProgram: minProgram,
          ability: ability,
          // animating:false
        });
      }
    });
    var car = {brand: 'BMW', price: '368000', length: '3米'};
  };
  getApp = () => {
    let apps = JSON.parse(sto.getValue('loginData')).userData.apps || [];
    // let allApps = JSON.parse(sto.getValue('loginData')).userData.allApps || [];
    this.setState({
      // apps: apps.slice(0, 4),
      apps: apps,
      // allApps: allApps,
    });
  };
  showMessage(data) {
    $ui.toast(data);
  }
  async requestMultiplePermission() {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        // PermissionsAndroid.PERMISSIONS.CAMERA
      ];
      //返回得是对象类型
      const granteds = await PermissionsAndroid.requestMultiple(permissions);
    } catch (err) {
      this.showMessage(err.toString());
    }
  }
  async login(account, password) {
    let params = {
      url: login,
      data: {
        username: account,
        password: password,
      },
      // type: 'post',
      hasLoading: false,
      _this: this,
    };
    return $ajax(params).then((value) => {
      if (value.code == 200) {
        const resData = value.data;
        if (resData instanceof Object) {
          const user = resData.user || {};
          const roleId = (user.role || {}).id || null;
          let apps = resData.apps || [];
          console.log(apps)
          // let allApps = resData.allApps || [];
          apps = apps.filter((app) => (app.menus || []).length > 0);
          const userId = user.id || null;
          const username = user.username;
          const email = user.email;
          const phoneNumber = account;
          const firmId = (user.firm || {}).id || null;
          const firmName = (user.firm || {}).name || null;
          const roleName = (user.role || {}).name || null;
          const industry = (user.firm || {}).industry || null;
          const userData = {
            userId,
            roleId,
            firmId,
            firmName,
            industry,
            roleName,
            username,
            phoneNumber,
            email,
            apps,
            // allApps,
          };
          sto.setValue(
            'loginData',
            JSON.stringify({
              username: account,
              password: password,
              userData: userData,
            }),
          );
          sto.setValue('token', JSON.stringify(value.token));
          // let {navigation} = this.props;
          // console.log(navigation)
          // navigation.dispatch(state => {
          //   // Remove the home route from the stack
          //   const routes = state.routes
          //   console.log(routes)
          // });
        }
        if (Platform.OS == 'android') {
          $ajax({
            url: getVersion,
            data: {},
            _this: this,
            hasLoading: false,
          }).then((value) => {
            if (value.code == 200) {
              const data = value.data;
              if (data.version > DeviceInfo.getVersion()) {
                sto.setValue('isUpdate', JSON.stringify(true));
                let newVersion = {
                  apkUrl: data.url,
                  content: data.comment,
                  version: data.version,
                  status: data.status,
                };
                this.setState({
                  isShow: true,
                  newVersion: newVersion,
                });
              } else {
                sto.setValue('isUpdate', JSON.stringify(false));
              }
            }
          });
        } else {
          this._getVersion();
        }
        return new Promise((resolve, reject) => {
          resolve(true);
        });
      } else if (value.code == 400) {
        let {navigation} = this.props;
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'login'}],
          }),
        );
        return new Promise((resolve, reject) => {
          reject(false);
        });
      }
    });
  }
  _getVersion() {
    return fetch(`${iosUpdateUrl}${$source.bundleId}`)
      .then((response) => response.json())
      .then((responseJson) => {
        if (
          responseJson.resultCount === 1 &&
          responseJson.results[0].bundleId === $source.bundleId
        ) {
          let local_version = DeviceInfo.getVersion();
          let pro_version = responseJson.results[0].version;
          if (local_version === pro_version) {
            sto.setValue('isUpdate', JSON.stringify(false));
          } else {
            let newVersion = {
              apkUrl: responseJson.results[0].trackViewUrl,
              content: responseJson.results[0].releaseNotes,
              version: pro_version,
              status: $source.checkVersion,
            };
            sto.setValue('isUpdate', JSON.stringify(true));
            this.setState({
              isShow: true,
              newVersion: newVersion,
            });
          }
        }
      })
      .catch((error) => {
        $ui.toast('检测版本失败,请稍后再试!');
      });
  }
  countUnReadMsg(userId) {
    $ajax({
      url: countUnReadMsg,
      data: {
        userId: userId,
        flag: 1,
        readStatus: 0,
      },
      _this: this,
      hasLoading: false,
    }).then((value) => {
      this.setState({
        isHave: value.data != 0,
      });
    });
  }
  getmessage(userId, flag) {
    $ajax({
      url: findMsgByPage,
      data: {
        args: {
          userId: userId,
          flag: null,
          readStatus: null,
        },
        pageNum: 1,
        pageSize: 20,
      },
      hasLoading: false,
      _this: this,
    }).then((value) => {
      let {list} = value.data;
      if (list.length != 0) {
        let messageList = [];
        let modalList = [];
        list.map((item, index) => {
          let itemMessage = {};
          itemMessage.label = index + 1;
          itemMessage.time = moment(item.createTime).format('YYYY-MM-DD');
          if (item.messageCategoryCode == '004') {
            itemMessage.value =
              item.messageCategoryDesc +
              ':' +
              JSON.parse(item.messageContent).content;
          } else {
            itemMessage.value =
              item.messageCategoryDesc + ':' + item.messageContent;
          }
          if (item.messageCategoryCode == '000' && item.readStatus == 0) {
            modalList.push(item);
          }
          messageList.push(itemMessage);
        });
        this.setState({
          messageList: messageList,
          modalList: modalList,
        });
      }
    });
  }
  // 轮播图
  _uiBanner() {
    return this.state.banners.length > 0 ? (
      <View style={{padding: 4}}>
        <Swiper
          style={{height: 180, backgroundColor: 'none', borderRadius: 6}}
          showsButtons={false}
          loop={true}
          activeDotColor="red"
          paginationStyle={{bottom: 10}}
          showsPagination={true}
          autoplay={true}
          autoplayTimeout={5}>
          {this.state.banners.map((item, index) => {
            return (
              <Image
                source={item.pic}
                key={index}
                style={{
                  width: '100%',
                  height: 180,
                  borderRadius: 3,
                }}
                // resizeMode="stretch"
              />
            );
          })}
        </Swiper>
      </View>
    ) : (
      <View style={{height: 180, backgroundColor: '#fafafa'}}></View>
    );
  }
  showTel = (telnumber) => {
    Linking.openURL(`tel:${telnumber}`);
  };
  next = (item) => {
    if (item.name == '设备管理') {
      $fns.route({
        context: this,
        routeName: 'dmIndex',
      });
    } else if (item.name == '权限管理') {
      $fns.route({
        context: this,
        routeName: isYWAdmin() ? 'dm_CompanyManage' : 'dm_PersonManage',
      });
    } else if (item.name == '能耗管理') {
      $fns.route({
        context: this,
        routeName: 'energe',
      });
    } else if (item.name == '设备健康') {
      $fns.route({
        context: this,
        routeName: 'health',
      });
    } else if (item.name == '远程服务') {
      $fns.route({
        context: this,
        routeName: 'remote',
      });
    } else {
      Linking.openURL(`${item.pageUrl}`).catch((err) => {
        alert('无法打开此应用!');
      });
    }
    // else {
    //   // $ui.toast('暂未开放,敬请期待!');
    // }
  };
  readAll = () => {
    let data = JSON.parse(sto.getValue('loginData'));
    $ajax({
      url: readAllMsg,
      data: {
        type: 0,
        id: data.userData.userId,
      },
      hasLoading: false,
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        this.setState({
          modalList: [],
        });
      }
    });
  };
  showabilityDetail = (item) => {
    if (item.pageUrl != '' && item.pageUrl) {
      $fns.route({
        context: this,
        routeName: 'solution',
        params: {
          title: item.description,
          url: item.pageUrl,
        },
      });
    }
  };
  render() {
    const {
      messageList,
      isShow,
      newVersion,
      consultModal,
      modalList,
      apps,
      selectItem,
      minProgram,
      ability,
      // allApps,
      // animating
    } = this.state;
    // console.log(apps);
    return (
      <>
        <UiHeader
          hasBack={false}
          main={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: $myTheme.mainBlue,
                justifyContent: 'center',
              }}>
              <Image
                source={require('./../../assets/imgs/icon_logo_w.png')}
                style={{width: 64, height: 24, marginRight: 10}}
              />
              <View
                style={{
                  flexDirection: 'row',
                  height: 30,
                  alignItems: 'flex-end',
                }}>
                <Text style={{fontSize: 16, color: '#fff'}}>亚威智维云</Text>
              </View>
            </View>
          }
          right={
            <View style={{width: 20, marginTop: 6}}>
              <TouchableOpacity
                onPress={() => {
                  // ==== 新增加 ====

                  if (Platform.OS == 'ios') {
                    this.refs.scanRef.show();
                  } else {
                    let that = this;
                    const granted = PermissionsAndroid.request(
                      PermissionsAndroid.PERMISSIONS.CAMERA,
                      {
                        title: '权限申请',
                        message: '扫码需要访问你的摄像头',
                      },
                    )
                      .then((res) => {
                        if (res === 'granted') {
                          that.refs.scanRef.show();
                        } else {
                          $ui.toast('您拒绝了访问摄像头授权！');
                        }
                      })
                      .catch((err) => {
                        $ui.toast('您拒绝了访问摄像头授权！');
                      });
                  }
                }}>
                <IconFont icon={'\ue646'} size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          }
        />
        <Confirm
          isShow={consultModal}
          onClose={() => {
            this.setState({
              consultModal: false,
            });
          }}
          showTel={(res) => this.showTel(res)}
          OK={(res) => this.consume(res)}
        />
        <CodeScan
          ref="scanRef"
          onDone={(url) => {
            $fns.route({
              context: this,
              routeName: 'home_Webview',
              params: {
                web_url: encodeURIComponent(url),
              },
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
          isShow={modalList.length != 0}
          messageList={modalList}
          onClose={this.readAll}
        />
        <ScrollView style={{flex: 1, backgroundColor: '#f0f0f0'}}>
          {this._uiBanner()}
          <View
            style={{
              height: 30,
              // backgroundColor: '#fff',
              flexDirection: 'row',
              paddingLeft: 12,
              paddingRight: 12,
              alignItems: 'center',
            }}>
            <LinearGradient
              colors={['#80c0fe', '#288efc']}
              useAngle={true}
              angle={-45}
              style={{width: 5, height: 20, marginRight: 6}}></LinearGradient>
            <Text>我的应用</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 0,
              paddingBottom: 0,
              minHeight: 75,
              padding: 12,
              // backgroundColor: 'blue',
              // flexWrap: 'wrap',
              // justifyContent: 'center',
              // borderColor:'red',
              // borderWidth:1
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                paddingTop: 15,
              }}>
              {apps.length != 0 &&
                apps.map((item, index) =>
                  item.name != '权限管理' &&
                  item.terminations &&
                  item.terminations.indexOf('app') != -1 ? (
                    <View style={[ss.cellItem]} key={index}>
                      <ApplicationIcon
                        title={item.name}
                        width={cellWidth}
                        icon={`${$source.url}/api/auth${item.iconUrl}`}
                        onPress={() => this.next({name: item.name})}
                      />
                    </View>
                  ) : null,
                )}
              {isYWAdmin() && (
                <View style={[ss.cellItem]}>
                  <ApplicationIcon
                    title="设备健康"
                    width={cellWidth}
                    icon={`${$source.url}/api/auth/attachments/app/2021042609094241698762642.png`}
                    onPress={() => this.next({name: '设备健康'})}
                  />
                </View>
              )}
              {minProgram.length != 0 &&
                minProgram.map((item, index) => (
                  <View style={[ss.cellItem]} key={index}>
                    <ApplicationIcon
                      title={item.description}
                      onPress={() => this.next(item)}
                      icon={item.imgUrl}
                    />
                  </View>
                ))}
            </View>
          </View>

          <View style={{padding: 12, paddingBottom: 12}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
                paddingLeft: 12,
                paddingRight: 4,
                borderRadius: 4,
              }}>
              <Image
                source={require('./../../assets/icons/index/icon_gg.png')}
                style={{width: 70, height: 30}}
                resizeMode="contain"
              />
              <View
                style={{
                  flex: 1,
                  height: 60,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}>
                <MarqueeVertical
                  textList={messageList.length == 0 ? itemMessage : messageList}
                  width={$fns.getWindowWidth() - 160}
                  height={60}
                  direction={'up'}
                  delay={3000}
                  numberOfLines={1}
                  bgContainerStyle={{backgroundColor: '#fff'}}
                  textStyle={{fontSize: 15, color: '#000'}}
                  onTextClick={(item) => {
                    $fns.route({
                      context: this,
                      routeName: 'home_Modalinfo',
                    });
                  }}
                />
              </View>
              <IconFont
                icon={'\ue643'}
                color="#777"
                size={20}
                style={{marginLeft: 10}}
              />
              {this.state.isHave && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 5,
                    backgroundColor: 'red',
                    position: 'absolute',
                    top: 27,
                    right: 20,
                  }}></View>
              )}
            </View>
          </View>
          {/** 滚动区域 */}

          <View style={{padding: 12, paddingTop: 0}}>
            <View
              style={{
                height: 30,
                // backgroundColor: '#fff',
                flexDirection: 'row',
                paddingRight: 12,
                alignItems: 'center',
              }}>
              <LinearGradient
                colors={['#80c0fe', '#288efc']}
                useAngle={true}
                angle={-45}
                style={{width: 5, height: 20, marginRight: 6}}></LinearGradient>
              <Text>互动精选</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                // maxHeight: 268,
                // minHeight: 268,
                justifyContent: 'space-between',
                // width: '100%',
              }}>
              {ability.map((item, key) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => this.showabilityDetail(item)}>
                  <MsgTag
                    title={item.description}
                    image={item.imgUrl}
                    info={item.memo}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{paddingLeft: 12, paddingRight: 12, paddingBottom: 20}}>
            <Text style={[ss.cmTitle, {fontSize: 16, marginBottom: 10}]}>
              服务中心
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={[ss.svsItem]}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      consultModal: true,
                    });
                  }}>
                  <IconFont icon={'\ue6b3'} size={50} style={{color: '#333'}} />
                </TouchableOpacity>
                <Text style={[ss.svsTxt]}>售前咨询</Text>
                <Text style={[ss.svsTxt]}>专业顾问一对一解答</Text>
              </View>

              <View style={[ss.svsItem]}>
                <TouchableOpacity
                  onPress={() => {
                    $fns.route({
                      context: this,
                      routeName: 'my_Feeback',
                    });
                  }}>
                  <IconFont icon={'\ue62b'} size={50} style={{color: '#333'}} />
                </TouchableOpacity>

                <Text style={[ss.svsTxt]}>接受反馈</Text>
                <Text style={[ss.svsTxt]}>认真接受您的反馈</Text>
              </View>

              <View style={[ss.svsItem]}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      consultModal: true,
                    });
                  }}>
                  <IconFont icon={'\ue62f'} size={50} style={{color: '#333'}} />
                </TouchableOpacity>
                <Text style={[ss.svsTxt]}>售后服务</Text>
                <Text style={[ss.svsTxt]}>售后服务立即咨询</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </>
    );
  }
}

let ss = StyleSheet.create({
  cmTitle: {fontSize: 16, marginTop: 5, marginBottom: 5},
  svsItem: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    marginRight: 20,
  },
  svsTxt: {fontSize: 11, marginTop: 6},
  cellItem: {
    width: '25%',
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
