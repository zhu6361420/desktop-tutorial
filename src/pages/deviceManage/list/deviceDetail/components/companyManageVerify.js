import React, {useState} from 'react';
import {Text, View, StyleSheet, Modal} from 'react-native';
import {FlatList, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import {
  UiHeader,
  IconFont,
  MsgRow,
  StepIndicator,
  MyButton,
  FormItem,
  UiPicker,
  UiDateTimePicker,
} from '../../../../../global.components';
import {$fns, $myTheme, $source, $ajax, api} from '../../../../../global.utils';
import {$ui} from '../../../../../utils/utils.ui';
import {CheckBox} from 'react-native-elements';
import moment from 'moment';
import {default as CityPicker} from '../../../../../components/picker/index';
const {
  updateCompany,
  getFirmMenu,
  updateApp,
  getMenus,
  getRole,
  activate,
} = api;
const hangyeList = [
  '家电行业',
  '模具行业',
  '纺织服装行业',
  '建材行业',
  '农业行业',
  '能源行业',
  '化工行业',
  '机械制造行业',
  '电子行业',
  '交通行业',
  '其他',
];
function SuccessTips(props) {
  let {
    isRead = false,
    isShow = false,
    menuList = [],
    disAgree = () => {},
    setRead = () => {},
    agreePrivacy = () => {},
    pickTime = () => {},
    updateApp = () => {},
  } = props;
  return (
    <Modal
      visible={isShow}
      transparent
      statusBarTranslucent
      animationType="slide"
      title="消耗量">
      <View
        style={{
          zIndex: 999,
          position: 'absolute',
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          width: $fns.getWindowWidth(),
          height: $fns.getWindowHeight() * 0.5,
          borderRadius: 5,
        }}>
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#e6e6e6',
            width: '100%',
            height: 40,
          }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              disAgree();
            }}>
            <Text style={{fontSize: 15, color: 'black'}}>取消</Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              color: '#444',
              textAlign: 'center',
            }}>
            选择应用
          </Text>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              updateApp();
            }}>
            <Text style={{fontSize: 15}}>确定</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{
            width: '100%',
            flex: 8,
          }}>
          <View
            style={{
              justifyContent: 'flex-start',
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: 10,
              paddingLeft:20
            }}>
            {menuList.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: '#f5f5f5',
                  // height: 80,
                  marginBottom: 10,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                  width: 170,
                  marginRight:8
                }}>
                {/* <IconFont icon={'\ue604'} color="#1c84c6" size={32} /> */}
                <CheckBox
                  containerStyle={{
                    padding: 0,
                    margin: 0,
                    backgroundColor: '#f5f5f5',
                    borderWidth: 0,
                  }}
                  textStyle={{color: '#333'}}
                  checked={menuList[index].expireTime == null ? false : true}
                  title={item.name}
                  onPress={() => {
                    setRead(index);
                  }}
                />
                {item.expireTime && (
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: '#777'}}>到期时间:</Text>
                    <Text
                      style={{color: '#1c83c6'}}
                      onPress={() => {
                        pickTime(index);
                      }}>
                      {moment(item.expireTime).format('YYYY-MM-DD')}
                    </Text>
                    <IconFont
                      icon={'\ue621'}
                      size={15}
                      color="#1c83c6"
                      style={{position: 'relative', top: 2}}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      isRead: false,
      // 分组数据
      name: '',
      itemInfo: '',
      selectCityName: '请选择所在省份',
      industry: '',
      accountNum: 0,
      // 角色数据
      menuList: [],
      FirmMenuList: [],
      timeIndex: 0,
      appNum: 0,
    };
  }

  componentDidMount() {
    this.getMenus();
    const {itemInfo, flag} = this.props.route.params;
    this.setState(
      {
        accountNum: itemInfo.accountNum,
        name: itemInfo.name,
        landLine: itemInfo.landLine,
        selectCityName: `${itemInfo.addressProvince} ${itemInfo.addressCity}`,
        address: itemInfo.address,
        industry: itemInfo.industry,
      }
    );

    // storage.load('loginData', (data) => {
    //   let {firmId} = data.userData;
    //   this.getGroup(firmId);
    //   this.getRole(firmId);
    // });
  }
  getMenus = () => {
    const {itemInfo} = this.props.route.params;
    $ajax({
      url: getMenus,
      data: {},
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        this.getFirmMenus(itemInfo.id)
        this.setState(
          {
            menuList: value.data,
          }
        );
      }
    });
  };
  getFirmMenus = (firmId) => {
    $ajax({
      url: getFirmMenu,
      data: {id: firmId},
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        this.setState(
          {
            FirmMenuList: value.data.apps,
          },
          () => {
            this.checkApps(this.state.FirmMenuList, this.state.menuList);
          },
        );
      }
    });
  };
  disAgree = () => {
    this.setState({
      isShow: false,
    });
  };
  agreePrivacy = () => {
    this.setState({
      isShow: true,
    });
  };
  checkApps(chindren, menus) {
    let col = menus.filter(function (item) {
      let flag = chindren.some(function (x) {
        return x.name == item.name;
      });
      return flag == false;
    });
    this.setState({
      FirmMenuList: this.state.FirmMenuList.concat(col),
    },()=>{
      console.log(this.state.FirmMenuList)
    });
  }

  show = () => {
    this.setState({
      isShow: true,
    });
  };
  pickTime = (index) => {
    this.setState({
      timeIndex: index,
    });
    this.refs.dateTimeRef.show();
  };
  confirmTime = (time) => {
    let list = this.state.FirmMenuList;
    list[this.state.timeIndex].expireTime = `${time} 00:00:00`;
    this.setState(
      {
        FirmMenuList: list,
      }
    );
  };
  updateApp = () => {
    let {FirmMenuList} = this.state;
    let apps = FirmMenuList.filter(function (item) {
      return item.expireTime != null;
    });
    if (apps.length == 0) {
      $ui.toast('请至少选择一个应用');
    } else {
      this.setState({
        appNum: apps.length,
        isShow: false,
      });
    }
  };
  updateApps = () => {
    const {itemInfo} = this.props.route.params;
    let {FirmMenuList, accountNum} = this.state;
    let apps = FirmMenuList.filter(function (item) {
      return item.expireTime != null;
    });
    let app = apps.map((item) => ({
      id: item.id,
      expireTime: item.expireTime,
    }));
    $ajax({
      url: updateApp,
      data: {
        accountNum: accountNum,
        adminId: itemInfo.admin.id,
        id: itemInfo.id,
        apps: app,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        $ui.toast('审核成功');
        $fns.route({
          context: this,
          type: 'back',
        });
      }
    });
  };
  setRead = (index) => {
    let list = this.state.FirmMenuList;
    if (list[index].expireTime != null) {
      list[index].expireTime = null;
    } else {
      list[index].expireTime = moment().format('YYYY-MM-DD 00:00:00');
    }
    this.setState({
      FirmMenuList: list,
    });
  };
  submit = () => {
    const {itemInfo} = this.props.route.params;
    let {
      FirmMenuList,
      accountNum,
      name,
      landLine,
      industry,
      address,
      selectCityName,
    } = this.state;
    let apps = FirmMenuList.filter(function (item) {
      return item.expireTime != null;
    });
    let app = apps.map((item) => ({
      id: item.id,
      expireTime: item.expireTime,
    }));
    let itemInfos={
      accountNum: accountNum,
      address: address,
      id: itemInfo.id,
      addressCity: selectCityName.split(' ')[1],
      addressProvince: selectCityName.split(' ')[0],
      apps: app,
      industry: industry,
      landLine: landLine,
      name: name,
    }
    $ajax({
      url: updateCompany,
      data: itemInfos,
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        $ui.toast('编辑成功');
        $ajax({
          url: getFirmMenu,
          data: {id: itemInfo.id},
          _this: this,
        }).then((value) => {
          if (value.code == 200) {
            $fns.route({
              context: this,
              routeName: 'dm_CompanyManageInfo',
              type:'replace',
              params:{
                itemInfo:value.data,
                flag:1
              }
            });
          }
        });
      
      }
    });
  };
  render() {
    let {
      appNum,
      isShow,
      name,
      landLine,
      selectCityName,
      address,
      industry,
      accountNum,
    } = this.state;
    const {itemInfo, flag} = this.props.route.params;
    return (
      <>
        <UiHeader
          title={flag == 0 ? '审核信息' : '信息编辑'}
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />
    
        <CityPicker
          ref="locationCompos"
          title="企业所在省市"
          cback={(data) => {
            this.setState({
              selectCityName: data,
            });
          }}
          type="provincialUrban"
        />
        <ScrollView style={{flex: 1, backgroundColor: '#eee', padding: 12}}>
              {flag == 1 && (
                <View>
                  <View
                    style={{
                      backgroundColor: '#fff',
                      padding: 10,
                      borderRadius: 4,
                    }}>
                    <FormItem
                      title="公司名"
                      slot={
                        <TextInput
                          value={name}
                          onChangeText={(text) =>
                            this.setState({
                              name: text,
                            })
                          }
                          placeholder="请输入企业名称(必填)"
                          onBlur={() => {}}
                          style={[ss.form_item_input]}
                        />
                      }
                    />
                    <FormItem
                      title="座机"
                      titleColor="#777"
                      slot={
                        <TextInput
                          value={landLine}
                          onChangeText={(text) =>
                            this.setState({
                              landLine: text,
                            })
                          }
                          placeholder="请输入企业座机(必填)"
                          style={[ss.form_item_input]}
                        />
                      }
                    />
                    <FormItem
                      title="企业所在"
                      slot={
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            height: 30,
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                          }}
                          onPress={() => {
                            this.refs.locationCompos.pickerType();
                          }}>
                          <Text style={{color: '#444'}}>{selectCityName}</Text>
                        </TouchableOpacity>
                      }
                    />
                    <FormItem
                      title="详细地址"
                      slot={
                        <TextInput
                          value={address}
                          onChangeText={(text) =>
                            this.setState({
                              address: text,
                            })
                          }
                          placeholder="企业详细地址"
                          style={[ss.form_item_input]}
                        />
                      }
                    />
                    <FormItem
                      title="行业"
                      slot={
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            height: 30,
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                          }}
                          onPress={() => {
                            this.refs.hangye.show();
                          }}>
                          <Text style={{color: '#444'}}>
                            {this.state.industry}
                          </Text>
                        </TouchableOpacity>
                      }
                    />
                    <FormItem
                      title="平台账号数"
                      slot={
                        <TextInput
                          keyboardType="numeric"
                          defaultValue={`${itemInfo.accountNum}`}
                          value={accountNum}
                          onChangeText={(text) => {
                            const newText = text.replace(/[^\d]+/, '0');
                            //可以打印看看是否过滤掉了非数字
                            this.setState({accountNum: newText});
                          }}
                          placeholder="请输入账号数"
                          style={[ss.form_item_input]}
                        />
                      }
                    />

                    <FormItem
                      title="分配应用"
                      slot={
                        <TouchableOpacity
                          style={ss.flexItem}
                          onPress={this.show}>
                          <Text style={[ss.form_item_input]}>
                            {appNum != 0
                              ? `已分配${appNum}个应用`
                              : '请分配应用'}
                          </Text>
                          <IconFont icon={'\ue621'} size={14} color="#999" />
                        </TouchableOpacity>
                      }
                    />
                  </View>
                  <MyButton
                    outterStyle={{
                      paddingTop: 30,
                      paddingLeft: 0,
                      paddingRight: 0,
                    }}
                    title="完成"
                    onPress={this.submit}
                  />
                </View>
              )}
              {flag == 0 && (
                <View>
                  <View
                    style={{
                      backgroundColor: '#fff',
                      padding: 10,
                      borderRadius: 4,
                    }}>
                    <FormItem
                      title="公司名"
                      slot={<Text style={[ss.form_item_input]}>{name}</Text>}
                    />

                    <FormItem
                      title="座机"
                      slot={
                        <Text style={[ss.form_item_input]}>{landLine}</Text>
                      }
                    />

                    <FormItem
                      title="企业所在"
                      slot={
                        <Text
                          style={[
                            ss.form_item_input,
                          ]}>{`${selectCityName}`}</Text>
                      }
                    />
                    <FormItem
                      title="详细地址"
                      slot={
                        <Text style={[ss.form_item_input]}>{`${address}`}</Text>
                      }
                    />

                    <FormItem
                      title="行业"
                      slot={
                        <Text style={[ss.form_item_input]}>{industry}</Text>
                      }
                    />
                    <FormItem
                      title="平台账号数"
                      slot={
                        <TextInput
                          keyboardType="numeric"
                          value={accountNum}
                          onChangeText={(text) => {
                            const newText = text.replace(/[^\d]+/, '');
                            //可以打印看看是否过滤掉了非数字
                            this.setState({accountNum: newText});
                          }}
                          placeholder="请输入账号数"
                          style={[ss.form_item_input]}
                        />
                      }
                    />
                    <FormItem
                      title="分配应用"
                      slot={
                        <TouchableOpacity
                          style={ss.flexItem}
                          onPress={this.show}>
                          <Text style={[ss.form_item_input]}>
                            {appNum != 0
                              ? `已分配${appNum}个应用`
                              : '请分配应用'}
                          </Text>
                          <IconFont icon={'\ue621'} size={14} color="#999" />
                        </TouchableOpacity>
                      }
                    />
                  </View>
                  <MyButton
                    outterStyle={{
                      paddingTop: 30,
                      paddingLeft: 0,
                      paddingRight: 0,
                    }}
                    title="完成"
                    onPress={this.updateApps}
                  />
                </View>
              )}
        </ScrollView>
        <SuccessTips
          isShow={isShow}
          pickTime={this.pickTime}
          disAgree={this.disAgree}
          agreePrivacy={this.agreePrivacy}
          isRead={this.state.isRead}
          setRead={this.setRead}
          updateApp={this.updateApp}
          menuList={this.state.FirmMenuList}
        />
        <UiDateTimePicker
          min="2018"
          ref="dateTimeRef"
          onComfirm={(e) => {
            this.confirmTime(e);
          }}
        />
        <UiPicker
          ref="hangye"
          datas={hangyeList}
          onConfirm={(_value, _index) =>
            this.setState({
              industry: _value[0],
            })
          }
        />
        {/** 角色数据 */}
      </>
    );
  }
}

let ss = StyleSheet.create({
  flexItem: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  form_item_input: {
    height: 30,
    fontSize: 14,
    textAlign: 'right',
    paddingVertical: 5,
    flex: 1,
  },
  formMain: {
    height: 40,
    width: 150,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderColor: 'red',
    borderWidth: 1,
  },
});
