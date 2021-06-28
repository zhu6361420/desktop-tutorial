import React from 'react';
import {
  View,
  Text,
  Image,
  Switch,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {event} from 'react-native-reanimated';
import {IconFont, UiHeader, MyButton} from '../../global.components';
import pattern from '../../utils/pattern';
import { $ajax,$ui , api,$myTheme } from "../../global.utils";
import {$fns} from '../../utils/fns';
const {resetPassword}=api;
export default class Me extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      passWord: '',
      confirmPassWord: '',
      firstTrue: false,
      secondTrue: false,
    };
  }
  firstPassWord = () => {
    if (this.state.passWord == '') {
      return $ui.toast('密码不能为空');
    } else if (!pattern.password.test(this.state.passWord)) {
      return $ui.toast('8-24位，至少为字母数字组合，特殊字符也可');
    }
    this.setState({
      firstTrue: true,
    });
  };
  // CompassWord = (event) => {
  //   if (this.state.passWord != this.state.confirmPassWord) {
  //     return $ui.toast('密码不一致');
  //   }
  //   this.setState({
  //     secondTrue: true,
  //   });
  // };
  submit=() =>{
    let {navigation, route} = this.props;
    let {phoneNumber, veriCode} = route.params;
      if (!pattern.password.test(this.state.passWord)) {
        return $ui.toast('8-24位，至少为字母数字组合，特殊字符也可');
      }
      if (this.state.passWord != this.state.confirmPassWord) {
        return $ui.toast('密码不一致');
      }
      if(this.state.firstTrue){
        $ajax({
            url:resetPassword,
            data:{
                confirmTargetPwd:this.state.confirmPassWord,
                targetPwd:this.state.passWord,
                smsCode:veriCode,
                mobile:phoneNumber,
            },
            _this:this
        })
        .then((value)=>{
       
          
            if(value.code==200){
              $ui.toast(value.data)
              $fns.route({
                context: this,
                routeName: 'login',
              });
            }
            else{
                $ui.toast(value.data)
              }
        })
      }
      else{
        $ui.toast("请输入正确密码")
      }
     
   
  }
  render() {
    let {navigation, route} = this.props;
    let {passWord, confirmPassWord} = this.state;
    let {phoneNumber, veriCode} = route.params;
    return (
      <>
        <UiHeader
          title="设置密码"
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
              <IconFont size={20} icon={'\ue620'} color="#4e83c2" />
            </View>

            <View style={[ss.form_row_main]}>
              <TextInput
                style={{height: 40}}
                style={[ss.input]}
                keyboardType="default"
                secureTextEntry={true}
                placeholder="请输入密码"
                value={passWord}
                onBlur={this.firstPassWord}
                onChangeText={(text) => {
                  this.setState({
                    passWord: text,
                  });
                }}
              />
            </View>
          </View>

          <View style={[ss.form_row]}>
            <View style={[ss.form_row_tag]}>
              <IconFont size={20} icon={'\ue620'} color="#4e83c2" />
            </View>

            <View style={[ss.form_row_main]}>
              <TextInput
                style={{height: 40}}
                style={[ss.input]}
                keyboardType="default"
                secureTextEntry={true}
                placeholder="确认密码"
                value={confirmPassWord}
                // onEndEditing={this.CompassWord}
                onChangeText={(text) => {
                  this.setState({
                    confirmPassWord: text,
                  });
                }}
              />
            </View>
          </View>

          <View>
            <Text style={{fontSize: 12, color: '#bbb'}}>
              密码长度6-32位，必须包含数字、子母、符号等两种组合
            </Text>
          </View>

          <MyButton
            title="提交"
            disabled={this.state.firstTrue&&this.state.secondTrue}
            outterStyle={{paddingLeft: 0, paddingRight: 0}}
            buttonStyle={{borderRadius: 26}}
            onPress={
              this.submit
            }
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
  form_input: {fontSize: 15, padding: 0, height: 40},
});
