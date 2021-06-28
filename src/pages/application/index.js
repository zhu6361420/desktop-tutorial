import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import UiGap from '../../components/UiGap';
import {UiHeader, IconFont, ApplicationIcon} from '../../global.components';
import {$ajax, api, $ui, $source} from '../../global.utils';
import {$fns} from '../../utils/fns';
import {isCustomAdmins, isYWAdmin, appsName} from '../../utils/data';
const {getMinProgram} = api;
export default class App extends React.Component {
  state = {
    mode: 'small',
    industryApps: [],
    manageApps: [],
    otherApps: [],
    apps: [],
    minProgram: [],
  };
  // constructor(props){
  //     super(props);
  // // this._navListener=null
  // }
  componentDidMount() {
    // this._navListener = this.props.navigation.addListener('focus', () => {
      this.getApp();
      this.getXiao();
    // });
    //    this.getApp();
  }
  getXiao = () => {
    $ajax({
      url: getMinProgram,
      data: {},
      _this: this,
      hasLoading: false,
    }).then((value) => {
      if (value.code == 200) {
        let minProgram=value.data.filter((item,index)=>(
          item.type==0
        )
        );
        this.setState({
          minProgram: minProgram,
        });
      }
    });
  };
  getApp = () => {
    let apps = JSON.parse(sto.getValue('loginData')).userData.apps || [];
    if (apps.length != 0) {
      let industryApps = [];
      let manageApps = [];
      let otherApps = [];
      apps.forEach((item) => {
        if (
          item.name == '设备管理'
           ||
           item.name == '远程服务'
           ||
          // item.name == '设备健康' ||
          item.name == '能耗管理'
        ) {
          industryApps.push(item);
        }
        // if (
        //   item.name == '远程运维' ||
        // item.name == '远程服务') {
        //   manageApps.push(item);
        // }
        if (item.name == '权限管理' && (isYWAdmin() || isCustomAdmins())) {
          manageApps.push(item);
        }
        if (
          item.name == '配件商城' ||
          item.name == '应用市场' ||
          item.name == '在线工艺'
        ) {
          otherApps.push(item);
        }
      });
      // apps||[].map(item=>{
      //   if(item.id==1||item.id==2||item.id==13){
      //     industryApps.push(item);
      //   }
      //   if(item.id==14||item.id==15){
      //     manageApps.push(item)
      //   }
      //   if(item.id==5||item.id==7||item.id==10){
      //     otherApps.push(item)
      //   }
      // })
      this.setState({
        industryApps: industryApps,
        manageApps: manageApps,
        otherApps: otherApps,
        apps: apps,
      });
    }
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
    }
    else if (item.name == '能耗管理') {
      $fns.route({
        context: this,
        routeName: 'energe',
      });
    }
    else if (item.name == '设备健康') {
      $fns.route({
        context: this,
        routeName: 'health',
      });
    }
    else if (item.name == '远程服务') {
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
  render() {
    let {mode, industryApps, manageApps, minProgram} = this.state;
    console.log(industryApps);
    let borderStyle = {
      backgroundColor: '#f0f0f0',
      borderRadius: 35 / 2,
      width: 35,
      height: 35,
      justifyContent: 'center',
      alignItems: 'center',
    };
    return (
      <>
        <UiHeader title="应用管理" hasBack={false} />

        <ScrollView style={{backgroundColor: '#fafafa'}}>
          <View
            style={{
              paddingTop: 20,
              paddingBottom: 20,
              backgroundColor: '#fff',
              paddingLeft: 12,
              paddingRight: 12,
            }}>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 18}}>我的应用</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              {this.state.apps.map(
                (item, index) =>
                  appsName[item.name] && (
                    <ApplicationIcon
                      title={item.name}
                      imgWidth={this.state.mode == 'small' ? 20 : 34}
                      imgHeight={this.state.mode == 'small' ? 20 : 34}
                      sizeMode={mode}
                      icon={`${$source.url}/api/auth${item.iconUrl}`}
                      onPress={() => this.next({name: item.name})}
                      style={{marginRight: 5}}
                    />
                  ),
              )}
              
              {/* {(isCustomAdmins() || isYWAdmin()) && (
                <ApplicationIcon
                  title="权限管理"
                  onPress={() => this.next({name: '权限管理'})}
                  sizeMode={mode}
                />
              )} */}

              <TouchableOpacity
                style={[
                  {
                    alignItems: 'center',
                    width: this.state.mode == 'small' ? 35 : 70,
                    justifyContent: 'center',
                    marginRight: 6,
                  },
                  this.state.mode == 'small' ? borderStyle : null,
                ]}
                onPress={() => {
                  this.setState({
                    mode: this.state.mode == 'small' ? 'default' : 'small',
                  });
                }}>
                <IconFont
                  icon={'\ue744'}
                  color="#999"
                  size={this.state.mode == 'small' ? 22 : 45}
                />
                {/* {<Text style={{marginTop: 6, fontSize: 13}}>更多</Text>} */}
              </TouchableOpacity>
              {/* <ApplicationIcon
                  title="更多"
                  sizeMode={mode}
                  onPress={() => {
                    this.setState({
                      mode: this.state.mode=='small'?'default':'small',
                    });
                  }}
                /> */}
            </View>

            <View
              style={{
                height: 30,
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{flex: 1, height: 1, backgroundColor: '#eee'}}></View>
              <Text style={{color: '#aaa', fontSize: 16}}>
                以上应用在首页展示
              </Text>
              <View
                style={{flex: 1, height: 1, backgroundColor: '#eee'}}></View>
            </View>
          </View>

          <UiGap />

          <View
            style={{
              paddingBottom: 20,
              paddingLeft: 15,
              paddingRight: 15,
              backgroundColor: '#fff',
            }}>
            <View
              style={{alignItems: 'center', paddingTop: 20, paddingBottom: 20}}>
              <Text style={{fontSize: 18}}>全部应用</Text>
            </View>

            {industryApps.length != 0 && (
              <View style={[ss.secBox]}>
                <Text style={[ss.cmTitle]}>工业应用</Text>
                <View style={{flexDirection: 'row', paddingBottom: 15}}>
                  {industryApps.map((item, index) => (
                    <View
                      style={{marginRight: 12, flexDirection: 'row'}}
                      key={index}>
                      <ApplicationIcon
                        title={item.name}
                        onPress={() => this.next(item)}
                        icon={`${$source.url}/api/auth${item.iconUrl}`}
                      />
                    </View>
                  ))}
                      {isYWAdmin()&&(
                  <View style={{marginRight: 12, flexDirection: 'row'}} >
                  <ApplicationIcon
                    title="设备健康"
                    icon={`${$source.url}/api/auth/attachments/app/2021042609094241698762642.png`}
                    onPress={() => this.next({name: '设备健康'})}
                  />
                </View>
                )}
                </View>
              </View>
            )}

            {manageApps.length != 0 && (
              <View style={[ss.secBox]}>
                <Text style={[ss.cmTitle]}>管理应用</Text>
                <View style={{flexDirection: 'row', paddingBottom: 15}}>
                  {manageApps.map((item, index) => (
                    <View
                      style={{marginRight: 12, flexDirection: 'row'}}
                      key={index}>
                      <ApplicationIcon
                        title={item.name}
                        onPress={() => this.next(item)}
                        icon={`${$source.url}/api/auth${item.iconUrl}`}
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
            {minProgram.length != 0 && (
              <View style={[ss.secBox]}>
                <Text style={[ss.cmTitle]}>微信小程序</Text>
                <View style={{flexDirection: 'row', paddingBottom: 15}}>
                  {minProgram.map((item, index) => (
                    <View
                      style={{marginRight: 12, flexDirection: 'row'}}
                      key={index}>
                      <ApplicationIcon
                        title={item.description}
                        onPress={() => this.next(item)}
                        icon={item.imgUrl}
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </>
    );
  }
}

let ss = StyleSheet.create({
  secBox: {marginBottom: 20},
  cmTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 14},
  cellItem: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    marginRight: 26,
  },
  cellTxt: {fontSize: 13, marginTop: 10},
});
