import React from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {IconFont, UiHeader, FormItem, UiGap} from '../../global.components';
import {$myTheme, $source} from '../../global.utils';
import {$fns} from '../../utils/fns';
import {Avatar} from 'react-native-paper';
function formatNum(num) {
  //以@符号判断
  if(num){
    if (num.indexOf('@') == -1) {
      // 手机
      return num.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2');
    } else {
      let ss = num.split('@')[0].length;
      // 邮箱
      return num.replace(num.substring(ss / 2, num.lastIndexOf('@')), '*****');
    }
  }
  else{
    return null
  }

}
export default class App extends React.Component {
  state = {
    isShow: false,
    userData:{}
  };
  componentDidMount() {
    this._navListener = this.props.navigation.addListener('focus', () => {
      let data=JSON.parse(sto.getValue('loginData'));
            this.setState({
                userData:data.userData
            })
        });
    //    this.getApp();
  }
  render() {
    const {username,industry,roleName,phoneNumber,email}= this.state.userData||{}; 
    return (
      <>
        <UiHeader
          title="基本信息"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />

        <ScrollView style={{backgroundColor: $myTheme.mainBgGray, flex: 1}}>
          <View style={[ss.mainBox]}>
            <FormItem
              title="头像"
              slot={
                <View style={[ss.mainRow]}>
                  <Avatar.Image size={30} backgroundColor="#e8e8e8"  source={require("../../assets/imgs/worker.png")} />
                </View>
              }
            />

            <FormItem
              title="账号名称"
              slot={
                <View style={[ss.mainRow]}>
                  <Text style={{color: '#666'}}>{username}</Text>
                </View>
              }
            />

            <FormItem
              title="手机号码"
              slot={
                <View style={[ss.mainRow]}>
                  <Text style={{color: '#666'}}>{formatNum(phoneNumber)}</Text>
                </View>
              }
            />

            <FormItem
              title="注册邮箱"
              border="none"
              slot={
                <View style={[ss.mainRow]}>
                  <Text style={{color: '#666'}}>
                    {email == '' ? '未注册' : formatNum(email)}
                  </Text>
                </View>
              }
            />
          </View>

          <View style={[ss.mainBox, {paddingRight: 6}]}>
            <FormItem
              title="账号类型"
              border="none"
              slot={
                <TouchableOpacity
                  style={[ss.mainRow]}
                  onPress={() => {
                    // $fns.route({
                    //   context: this,
                    //   routeName: 'my_AccountType',
                    // });
                  }}
                  >
                  <Text style={{color: '#666'}}>{roleName}</Text>
                  {/* <IconFont icon={'\ue643'} size={18} color="#999" /> */}
                </TouchableOpacity>
              }
            />
          </View>

          <View style={[ss.mainBox, {paddingRight: 6}]}>
            <FormItem
              title="公司行业"
              border="none"
              style={{backgroundColor:"grey"}}
              slot={
                <TouchableOpacity
                  style={[ss.mainRow]}
                  onPress={() => {
                    // $fns.route({
                    //   context: this,
                    //   routeName: 'my_IndustryType',
                    // });
                  }}
                  >
                  <Text style={{color: '#666'}}>{industry==null?'未填写':industry}</Text>
                  {/* <IconFont icon={'\ue643'} size={18} color="#999" /> */}
                </TouchableOpacity>
              }
              onPress={() => {
                $fns.route({
                  context: this,
                  routeName: 'my_IndustryType',
                });
              }}
            />
          </View>
        </ScrollView>
      </>
    );
  }
}

let ss = StyleSheet.create({
  mainBox: {
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  mainRow: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  linkRow: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkTxt: {fontSize: 14, color: '#555'},
});
