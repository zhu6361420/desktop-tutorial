import React from 'react';
import {
  View,
  Text,
  Image,
  Switch,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {IconFont, BackBtn, MyButton} from '../../global.components';
import {$ui, $fns, api, $ajax} from '../../global.utils';
import {Button} from 'react-native-elements';
import pattern from '../../utils/pattern';
const {sendResetPassword} = api;
// let timer=null
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      veriText: '获取验证码',
      phoneNumber: '',
      veriCode: '',
      count:60,
    };
  }
  sendResetPassword = () => {
    if (!pattern.phone.test(this.state.phoneNumber)) {
      return $ui.toast('请输入正确手机号码');
    } else {
      $ajax({
        url: sendResetPassword,
        data: {
          mobile: this.state.phoneNumber,
        },
        _this: this,
      }).then((value) => {
        if (value.code == 200) {
          // $ui.toast('验证码发送成功');
          // 这里写一个定时器就可以去更新灰色按钮的内容而且show_btn是false时会出现灰色按钮，当倒计时结束又变成可以触发的按钮
          let count = this.state.count;
          this.setState(
            {
              veriText: count + 's后重发',
            })
           this.timer = setInterval(() => {
            this.setState(
              {
                count: count--,
                veriText: count + 's后重发',
              },
              () => {
                if (count === 0) {
                  clearInterval(this.timer);
                  this.setState({
                    count: 60,
                    veriText: '获取验证码',
                  });
                }
              },
            );
          }, 1000);
        }
      });
    }
  };
  next = () => {
    if (!pattern.phone.test(this.state.phoneNumber)) {
      return $ui.toast('请输入正确手机号码');
    }
    if (this.state.veriCode == '') {
      return $ui.toast('请输入正确验证码');
    }
    $fns.route({
      context: this,
      routeName: 'register2',
      params: {
        mobile: this.state.phoneNumber,
        veriCode: this.state.veriCode,
      },
    });
  };
  componentWillUnmount(){
    this.timer&&clearInterval(this.timer)
  }
  render() {
    let {navigation} = this.props;
    let {phoneNumber, veriText, veriCode} = this.state;
    let vcode = {
      backgroundColor: veriText != '已发送' ? '#F8AC59' : '#e5e7e8',
      fontSize: 13,
      color: '#fff',
      height: 29,
      paddingLeft: 12,
      paddingRight: 12,
      borderRadius: 20,
      position: 'absolute',
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      bottom: 7,
      color: '#fff',
    };
    return (
      <>
        <KeyboardAvoidingView
          enabled={true}
          behavior="position"
          style={{backgroundColor: '#fff', height: 'auto'}}>
          <Image
            source={require('./../../assets/imgs/login_pic.jpg')}
            resizeMode="stretch"
            style={{width: '100%', height: 280}}
          />

          <BackBtn
            onPress={() => {
              navigation.goBack();
            }}
          />

          <View style={{paddingLeft: 30, paddingRight: 30}}>
            <View style={{paddingTop: 20, paddingBottom: 20}}>
              <Text style={{fontSize: 14, color: '#444'}}>
                请输入您的手机号码，登录或者注册您的智云账号
              </Text>
            </View>

            <View style={[ss.form_row]}>
              <View style={[ss.form_row_tag]}>
                <Text style={{marginRight: 4}}>+86</Text>
                <IconFont icon={'\ue61b'} size={12} color="#666" />
              </View>

              <View style={[ss.form_row_main]}>
                <TextInput
                  placeholder="请输入手机号"
                  style={{height: 40}}
                  style={[ss.input]}
                  value={phoneNumber}
                  keyboardType="numeric"
                  onChangeText={(num) => {
                    this.setState({
                      phoneNumber: num,
                    });
                  }}
                />

                <TouchableOpacity
                  style={[
                    vcode,
                    {
                      borderRadius: 25,
                      width: 110,
                      backgroundColor:
                        veriText != '获取验证码' ? '#f5f5f5' : '#F8AC59',
                    },
                  ]}
                  onPress={
                    veriText == '获取验证码'
                      ? this.sendResetPassword
                      : () => {
                          $ui.toast('请稍后再试');
                        }
                  }>
                  <Text
                    style={{
                      color: veriText != '获取验证码' ? '#d9d9d9' : '#fff',
                      textAlign: 'center',
                    }}>
                    {veriText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[ss.form_row]}>
              <View style={[ss.form_row_tag]}>
                <Text
                  value={veriCode}
                  onChangeText={(text) => {
                    this.setState({
                      veriCode: text,
                    });
                  }}>
                  验证码
                </Text>
              </View>

              <View style={[ss.form_row_main]}>
                <TextInput
                  placeholder="请输入验证码"
                  style={{height: 40}}
                  onChangeText={(text) => {
                    this.setState({
                      veriCode: text,
                    });
                  }}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10,
                display: veriText == '已发送' ? 'flex' : 'none',
              }}>
              <IconFont icon={'\ue626'} size={20} color="#F8AC59" />
              <Text style={{marginLeft: 6, fontSize: 12, color: '#242424'}}>
                验证码已发送，可能会有延迟，请耐心等待
              </Text>
            </View>

            <MyButton
              title="下一步"
              outterStyle={{paddingLeft: 0, paddingRight: 0, marginTop: 10}}
              buttonStyle={{borderRadius: 26, height: 44}}
              onPress={this.next}
            />
          </View>
        </KeyboardAvoidingView>
      </>
    );
  }
}

let ss = StyleSheet.create({
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 30,
  },
  inputBox: {
    height: 45,
    marginBottom: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  txtInput: {backgroundColor: '#fff', height: 40, fontSize: 16},
  btnInput: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: '#4e83c2',
  },
  tips: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },

  form_row: {
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: '#bbb',
    borderBottomWidth: 0.5,
    marginBottom: 14,
  },
  form_row_tag: {
    width: 70,
    borderRightColor: '#bbb',
    borderRightWidth: 0.5,
    paddingTop: 2,
    paddingBottom: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  input: {fontSize: 15, padding: 0, height: 40},
});
