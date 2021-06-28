import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Switch,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {
  IconFont,
  UiHeader,
  UiButton,
  FormItem,
  UiPicker,
  MyButton,
} from '../../global.components';
import {CheckBox} from 'react-native-elements';
import {$ui, $fns, api, $myTheme} from '../../global.utils';
import {default as CityPicker} from '../../components/picker/index';
import pattern from '../../utils/pattern';
import {$ajax} from '../../utils/utils.fetch';
const {register, registerIndividual,createMessageNoToken} = api;
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
export default class App extends React.Component {
  state = {
    checked: false,
    curTabIndex: 0,
    selectCityName: '请选择所在省份',
    selectHangye: '请选择行业',
    value: '',
    firmName: '',
    landLine: '',
    firmAddress: '',
    username: '',
    email: '',
    password: '',
    confirmPassWord: '',
    companyYao: '',
    userYao: '',
  };

  //  企业注册
  _uiCompanyInfo() {
    const {mobile, veriCode} = this.props.route.params;
    const {
      selectCityName,
      firmName,
      landLine,
      firmAddress,
      username,
      email,
      password,
      confirmPassWord,
      checked,
      selectHangye,
      companyYao,
    } = this.state;
    let _this = this;
    function registers() {
      if (!checked) {
        return $ui.toast('请勾选隐私协议');
      }
      if (!pattern.firmName.test(firmName)) {
        return $ui.toast('公司全称只能是中英文数字小括号');
      }
      // if (landLine == '' || !pattern.landline.test(landLine)) {
      //   return $ui.toast('座机不能为空，以“-”连接');
      // }
      if (selectCityName == '请选择所在省份') {
        return $ui.toast('请选择企业所在省份');
      }
      if (selectHangye == '请选择行业') {
        return $ui.toast('请选择企业所属行业');
      }
      if (firmAddress != '' && !pattern.address.test(firmAddress)) {
        return $ui.toast('地址只能是中英文数字');
      }
      if (!pattern.word.test(username)) {
        return $ui.toast('姓名不能为空只能是中英文');
      }
      // if (!pattern.mail.test(email)) {
      //   return $ui.toast('请输入正确邮箱');
      // }
      if (!pattern.password.test(password)) {
        return $ui.toast('密码8-24位，至少为字母数字组合，特殊字符也可');
      }
      if (confirmPassWord != password) {
        return $ui.toast('两次密码输入不一致');
      }
      $ajax({
        url: register,
        data: {
          email: email,
          firmAddressCity: selectCityName.split(' ')[1],
          firmAddressProvince: selectCityName.split(' ')[0],
          industry: selectHangye,
          firmName: firmName,
          landLine: landLine==''?null:landLine,
          mobile: mobile,
          password: password,
          smsCode: veriCode,
          username: username,
          invitationCode: companyYao,
        },
        hasLoading: true,
        _this: this,
      }).then((value) => {
        if (value.code == 200) {
          createMessage()
          // $ui.toast('注册成功，请等待平台管理员审核');
          // $fns.route({
          //   context: _this,
          //   routeName: 'login',
          // });

        }
      });
    }
    function createMessage(){
      $ajax({
        url: createMessageNoToken,
        data: {
          creatorId: 1,
          messageCategoryCode: '003',
          messageCategoryDesc: '企业注册通知',
          messageContent: `${firmName}注册了企业账户，请及时审核`,
          messageTitle: '企业注册通知',
          operatorId: 1,
          userids: [1],
        },
        hasLoading: true,
        _this: this,
      }).then((value) => {
        if (value.code == 200) {
          $ui.toast('注册成功，请等待平台管理员审核');
          $fns.route({
            context: _this,
            routeName: 'login',
          });
  
        }
      });
    }
    return (
      <>
        <FormItem
          title="企业名称"
          bitian={true}
          slot={
            <TextInput
              value={firmName}
              onChangeText={(text) =>
                this.setState({
                  firmName: text,
                })
              }
              placeholder="请输入企业名称(必填)"
              onBlur={() => {}}
              style={[ss.form_item_input]}
            />
          }
        />

        <FormItem
          title="企业座机"
          slot={
            <TextInput
              value={landLine}
              onChangeText={(text) =>
                this.setState({
                  landLine: text,
                })
              }
              placeholder="请输入企业座机"
              style={[ss.form_item_input]}
            />
          }
        />

        <FormItem
          bitian={true}
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
              <Text style={{color: '#444'}}>{this.state.selectCityName}</Text>
            </TouchableOpacity>
          }
        />

        <FormItem
          bitian={true}
          title="详细地址"
          slot={
            <TextInput
              value={firmAddress}
              onChangeText={(text) =>
                this.setState({
                  firmAddress: text,
                })
              }
              placeholder="企业详细地址"
              style={[ss.form_item_input]}
            />
          }
        />
        <FormItem
          bitian={true}
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
              <Text style={{color: '#444'}}>{this.state.selectHangye}</Text>
            </TouchableOpacity>
          }
        />
        <FormItem
          bitian={true}
          title="联系人"
          slot={
            <TextInput
              value={username}
              onChangeText={(text) =>
                this.setState({
                  username: text,
                })
              }
              placeholder="请输入企业联系人姓名"
              style={[ss.form_item_input]}
            />
          }
        />

        <FormItem
          title="企业邮箱"
          slot={
            <TextInput
              value={email}
              onChangeText={(text) =>
                this.setState({
                  email: text,
                })
              }
              placeholder="请输入企业邮箱"
              style={[ss.form_item_input]}
            />
          }
        />

        <FormItem
          bitian={true}
          title="登录密码"
          slot={
            <TextInput
              value={password}
              onChangeText={(text) =>
                this.setState({
                  password: text,
                })
              }
              placeholder="请输入登录密码"
              style={[ss.form_item_input]}
              secureTextEntry={true}
            />
          }
        />

        <FormItem
           bitian={true}
          title="确认密码"
          slot={
            <TextInput
              placeholder="请再次输入密码"
              style={[ss.form_item_input]}
              secureTextEntry={true}
              value={confirmPassWord}
              onChangeText={(text) => {
                this.setState({
                  confirmPassWord: text,
                });
              }}
            />
          }
        />
        <FormItem
          title="填写邀请码(可选)"
          slot={
            <TextInput
              placeholder="请输入邀请码"
              style={[ss.form_item_input]}
              value={companyYao}
              onChangeText={(text) => {
                this.setState({
                  companyYao: text,
                });
              }}
              secureTextEntry={true}
            />
          }
        />
        <View style={{alignItems: 'flex-start'}}>
          <CheckBox
            center
            title="同意隐私协议"
            checked={this.state.checked}
            containerStyle={{
              backgroundColor: '#fff',
              color: 'red',
              borderWidth: 0,
              paddingLeft: 0,
              marginLeft: 0,
            }}
            onPress={() => this.setState({checked: !this.state.checked})}
          />
        </View>

        <MyButton
          title="注册"
          outterStyle={{paddingLeft: 0, paddingRight: 0, marginTop: 0}}
          buttonStyle={{borderRadius: 26, height: 44}}
          onPress={registers}
        />
      </>
    );
  }

 
  // height:30, marginTop:10, paddingBottom:10

  // 员工注册
  _uiStaff() {
    const {mobile, veriCode} = this.props.route.params;
    let _this = this;
    const {
      firmName,
      username,
      email,
      password,
      confirmPassWord,
      checked,
      userYao,
    } = this.state;
    function registers() {
      if (!checked) {
        return $ui.toast('请勾选隐私协议');
      }
      if (firmName == '') {
        return $ui.toast('所属公司不能为空');
      }
      if (!pattern.word.test(username)) {
        return $ui.toast('姓名不能为空只能是中英文');
      }
      // if (email != '' && !pattern.mail.test(email)) {
      //   return $ui.toast('请输入正确邮箱');
      // }
      if (!pattern.password.test(password)) {
        return $ui.toast('密码8-24位，至少为字母数字组合，特殊字符也可');
      }
      if (confirmPassWord != password) {
        return $ui.toast('两次密码输入不一致');
      }
      $ajax({
        url: registerIndividual,
        data: {
          email: email,
          firmName: firmName,
          mobile: mobile,
          password: password,
          smsCode: veriCode,
          username: username,
          invitationCode: userYao,
        },
        hasLoading: true,
        _this: this,
      }).then((value) => {
        if (value.code == 200) {
          $ui.toast('注册成功，请等待企业管理员审核');
          $fns.route({
            context: _this,
            routeName: 'login',
          });
        }
      });
    }
    return (
      <>
        <FormItem
          title="用户姓名"
          bitian={true}
          slot={
            <TextInput
              placeholder="请输入姓名"
              value={username}
              onChangeText={(text) =>
                this.setState({
                  username: text,
                })
              }
              style={[ss.form_item_input]}
            />
          }
        />

        <FormItem
          title="所属公司"
          bitian={true}
          slot={
            <TextInput
              placeholder="所属公司"
              value={firmName}
              onChangeText={(text) =>
                this.setState({
                  firmName: text,
                })
              }
              style={[ss.form_item_input]}
            />
          }
        />

        <FormItem
          title="邮箱"
          slot={
            <TextInput
              placeholder="请输入邮箱"
              value={email}
              onChangeText={(text) =>
                this.setState({
                  email: text,
                })
              }
              style={[ss.form_item_input]}
            />
          }
        />

        <FormItem
          title="登录密码"
          bitian={true}
          slot={
            <TextInput
              value={password}
              onChangeText={(text) =>
                this.setState({
                  password: text,
                })
              }
              placeholder="请输入登录密码"
              style={[ss.form_item_input]}
              secureTextEntry={true}
            />
          }
        />

        <FormItem
          title="确认密码"
          bitian={true}
          slot={
            <TextInput
              placeholder="请再次输入密码"
              style={[ss.form_item_input]}
              value={confirmPassWord}
              onChangeText={(text) => {
                this.setState({
                  confirmPassWord: text,
                });
              }}
              secureTextEntry={true}
            />
          }
        />
        <FormItem
          title="填写邀请码(可选)"
          slot={
            <TextInput
              placeholder="请输入邀请码"
              style={[ss.form_item_input]}
              value={userYao}
              onChangeText={(text) => {
                this.setState({
                  userYao: text,
                });
              }}
              secureTextEntry={true}
            />
          }
        />
        <View style={{alignItems: 'flex-start'}}>
          <CheckBox
            center
            title="同意隐私协议"
            checked={this.state.checked}
            containerStyle={{
              backgroundColor: '#fff',
              borderWidth: 0,
              paddingLeft: 0,
              marginLeft: 0,
            }}
            onPress={() => this.setState({checked: !this.state.checked})}
          />
        </View>

        <MyButton
          title="注册"
          outterStyle={{paddingLeft: 0, paddingRight: 0, marginTop: 10}}
          buttonStyle={{borderRadius: 26, height: 44}}
          onPress={registers}
        />
      </>
    );
  }

  // 选项卡
  _uiTabs() {
    return (
      <View style={[ss.cm_tabs]}>
        <TouchableOpacity
          style={[ss.cm_tab_item]}
          onPress={() => {
            this.setState({
              curTabIndex: 0,
            });
          }}>
          <Text style={[ss.cm_tab_txt]}>企业注册</Text>
          <View
            style={[
              this.state.curTabIndex == 0 ? ss.cm_tab_active : '',
            ]}></View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[ss.cm_tab_item]}
          onPress={() => {
            this.setState({
              curTabIndex: 1,
            });
          }}>
          <Text style={[ss.cm_tab_txt]}>员工注册</Text>
          <View
            style={[
              this.state.curTabIndex == 1 ? ss.cm_tab_active : '',
            ]}></View>
        </TouchableOpacity>
      </View>
    );
  }

  onChangeTabs(e) {
    this.setState({
      curTabIndex: e,
    });
  }

  render() {
    let {navigation} = this.props;

    return (
      <>
        <UiHeader
          title="信息填写"
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />

        {this._uiTabs()}

        <ScrollView  
          style={{
            paddingTop: 10,
            paddingLeft: 20,
            paddingRight: 20,
            // flex: 1,
            backgroundColor: '#fff',
          }}>
          {this.state.curTabIndex == 0
            ? this._uiCompanyInfo()
            : this._uiStaff()}
        </ScrollView>

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
        <UiPicker
          ref="hangye"
          datas={hangyeList}
          onConfirm={(_value, _index) =>
            this.setState({
              selectHangye: _value[0],
            })
          }
        />
      </>
    );
  }
}

let ss = StyleSheet.create({
  form_row: {
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: '#bbb',
    borderBottomWidth: 0.5,
    marginBottom: 10,
  },
  form_row_tag: {
    width: 50,
    alignItems: 'center',
    borderRightColor: '#bbb',
    borderRightWidth: 0.5,
    paddingTop: 2,
    paddingBottom: 2,
  },
  form_row_main: {flex: 1, paddingLeft: 10},
  form_vcode: {
    fontSize: 13,
    backgroundColor: '#e5aa5f',
    color: '#fff',
    height: 26,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 20,
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 7,
    color: '#fff',
  },
  form_input: {fontSize: 15, padding: 0, height: 40, fontSize: 14},

  form_item: {
    height: 46,
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  form_lbl: {fontSize: 15},
  form_item_main: {flex: 1, height: 30, paddingRight: 10},
  form_item_input: {
    height: 30,
    fontSize: 14,
    textAlign: 'right',
    paddingVertical: 0,
    flex: 1,
  },

  cm_tabs: {flexDirection: 'row', backgroundColor: $myTheme.mainBlue},
  cm_tab_item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    alignItems: 'center',
  },
  cm_tab_active: {
    height: 3,
    width: 100,
    backgroundColor: 'rgba(255,255,255,0.9)',
    position: 'absolute',
    bottom: 2,
  },
  cm_tab_txt: {color: '#fff', fontSize: 18},
});
