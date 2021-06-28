import React from 'react';
import {View, Text, Image, Switch, StyleSheet, TextInput} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {Button} from 'react-native-elements';
import {IconFont, UiHeader, MyButton} from '../../global.components';
import {$fns} from '../../utils/fns';
import {api, $ui, $ajax} from '../../global.utils';
import pattern from '../../utils/pattern';
const {sendResetPassword} = api;
let veriTexts = '发送验证码';
// let timer=null
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      phoneNumber: null,
      veriText: '获取验证码',
      veriCode: '',
      count: 60,
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
          // $ui.toast(value.data);
          // this.setState({
          //   veriText: '已发送',
          // });
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
      routeName: 'forget2',
      params: {
        phoneNumber: this.state.phoneNumber,
        veriCode: this.state.veriCode,
      },
    });
  };
  componentWillUnmount(){
    this.timer&&clearInterval(this.timer)
  }
  componentDidMount(){
  }
  render() {
    let {navigation} = this.props;
    let {phoneNumber, veriText, veriCode} = this.state;
    let vcode = {
      fontSize: 13,
      backgroundColor: veriText == '获取验证码' ? '#e5e7e8' : '#e5e7e8',
      color: '#fff',
      height: 29,
      paddingLeft: 12,
      paddingRight: 12,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      bottom: 7,
      color: '#fff',
    };

    return (
      <>
        <UiHeader
          title="忘记密码"
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />

        <View
          style={{
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 20,
            flex: 1,
            backgroundColor: '#fff',
          }}>
          <View style={[ss.form_row]}>
            <View style={[ss.form_row_tag]}>
              <Text style={{marginRight: 6}}>+86</Text>
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

              {/* <TouchableOpacity style={[vcode]}>
                <Button
                  buttonStyle={{
                    borderRadius: 25,
                    backgroundColor: veriText == '已发送' ? '' : '#F8AC59',
                  }}
                  disabled={veriText == '已发送' ? true : false}
                  borderRadius="50%"
                  style={{color: '#fff'}}
                  onPress={this.sendResetPassword}
                  title={veriText}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                style={[
                  vcode,
                  {
                    borderRadius: 25,
                    width:110,
                    backgroundColor: veriText != '获取验证码' ? '#f5f5f5' : '#F8AC59',
                  },
                ]}
                onPress={veriText == '获取验证码' ?this.sendResetPassword:()=>{$ui.toast('请稍后再试')}}>
                <Text style={{color:veriText != '获取验证码' ?'#d9d9d9':'#fff',textAlign:'center'}}>{veriText}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[ss.form_row]}>
            <View style={[ss.form_row_tag]}>
              <Text>验证码</Text>
            </View>

            <View style={[ss.form_row_main]}>
              <TextInput
                placeholder="请输入验证码"
                style={{height: 40}}
                value={veriCode}
                onChangeText={(text) => {
                  this.setState({
                    veriCode: text,
                  });
                }}
              />
            </View>
          </View>

          <MyButton
            title="下一步"
            outterStyle={{paddingLeft: 0, paddingRight: 0}}
            buttonStyle={{borderRadius: 26}}
            onPress={this.next}
          />
        </View>
      </>
    );
  }

  componentDidMount() {}
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
    width: 70,
    borderRightColor: '#bbb',
    borderRightWidth: 0.5,
    paddingTop: 2,
    paddingBottom: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form_row_main: {
    flex: 1,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  vcode: {
    fontSize: 13,
    backgroundColor: veriTexts != '已发送' ? '#F8AC59' : '#e5e7e8',
    color: '#fff',
    height: 29,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 7,
    color: '#fff',
  },
  input: {fontSize: 15, padding: 0, height: 40},
});
