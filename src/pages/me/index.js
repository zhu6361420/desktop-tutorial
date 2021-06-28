import React from 'react';
import {View, Text, Image, ImageBackground} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {
  IconFont,
  UiHeader,
  LinkItem,
  MyButton,
  UiGap,
} from '../../global.components';
import {$myTheme, $source} from '../../global.utils';
import {$fns} from '../../utils/fns';
import { CommonActions  } from '@react-navigation/native';
const images=[
  {woker:'../../assets/imgs/worker.png'},
   {technology:'../../assets/imgs/technology.png'},
   {Administration:'../../assets/imgs/Administration.png'},
   {man:'../../assets/imgs/man.png'},


]
export default class Me extends React.Component {
  state = {
    isUpdate: false,
    userData: {apps: []},
    
  };
  componentDidMount() {
    this._navListener = this.props.navigation.addListener('focus', () => {
      let user=JSON.parse(sto.getValue('loginData'));
      let flag=JSON.parse(sto.getValue('isUpdate'));
      if(user){
        this.setState({
          userData: user.userData,
        });
      }
      if(flag){
        this.setState({
          isUpdate: flag,
        });
      }
    });
    //    this.getApp();
  }

  exit = () => {
    sto.removeKey('loginData')
    let {navigation} = this.props;
    navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'login' },
          ],
        })
      );
    // navigation.dispatch(resetAction);
  };
  render() {
    const {username, apps} = this.state.userData || {};
    const {isUpdate}=this.state;
    return (
      <>
        <UiHeader title="我的" hasBack={false} />

        <ScrollView style={{backgroundColor: $myTheme.mainBgGray}}>
          <View style={{paddingBottom: 10}}>
            <ImageBackground
              source={require('./../../assets/imgs/self_bg.jpg')}
              style={{
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 20,
                paddingBottom: 20,
                maxWidth: '100%',
                maxHeight: '100%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 14,
                }}>
                <Image
                  source={require("../../assets/imgs/worker.png")}
                  style={{width: 60, height: 60, borderRadius: 35,backgroundColor:'#e8e8e8'}}
                />

                <View style={{flex: 1}}>
                  <Text style={{fontSize: 18, paddingLeft: 10, color: '#fff'}}>
                    {username}
                  </Text>
                </View>

                <TouchableOpacity
                  style={{flexDirection: 'row',alignItems:'center',}}
                  onPress={() => {
                    $fns.route({
                      context: this,
                      routeName: 'my_BaseInfo',
                      // params:{
                      //     username:username,
                      //     phoneNumber:phoneNumber
                      // }
                    });
                  }}>
                  <Text style={{color: '#fff'}}>账号管理</Text>
                  <IconFont icon={'\ue643'} color="#fff" size={14} />
                </TouchableOpacity>
              </View>

              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{color: '#fff'}}>
                  当前可用应用数量：{apps.length}个
                </Text>
                <TouchableOpacity style={{ flexDirection:"row", backgroundColor:"#fff", borderRadius:16 , alignItems:"center",justifyContent:"center", height:24, paddingLeft:10, paddingRight:10, }}>
                                    <Text style={{ color:"#fff", fontSize:14, color:$myTheme.mainBlue }}>立即购买</Text>
                                    <IconFont icon={"\ue643"} color={$myTheme.mainBlue } size={14} />
                                </TouchableOpacity>
              </View> */}
            </ImageBackground>
          </View>

          <View
            style={{
              backgroundColor: '#fff',
              paddingLeft: 12,
              paddingRight: 12,
            }}>
            <LinkItem
              title="建议反馈"
              icon={'\ue62b'}
              onPress={() => {
                $fns.route({
                  context: this,
                  routeName: 'my_Feeback',
                });
              }}
            />

            <LinkItem
              title="分享APP"
              icon={'\ue605'}
              onPress={() => {
                $fns.route({
                  context: this,
                  routeName: 'my_share',
                });
              }}
            />

            <LinkItem
              title="关于我们"
              icon={'\ue654'}
              dot={isUpdate}
              onPress={() => {
                $fns.route({
                  context: this,
                  routeName: 'my_Aboutus',
                  params:{
                    isUpdate:isUpdate
                  }
                });
              }}
            />

            <LinkItem
              title="使用手册"
              icon={'\ue647'}
              onPress={() => {
                $fns.route({
                  context: this,
                  routeName: 'Pdf',
                  params: {
                    isCaozuo: true,
                  },
                });
              }}
            />
            <LinkItem
              title="我的邀请码"
              icon={'\ue647'}
              onPress={() => {
                $fns.route({
                  context: this,
                  routeName: 'my_yaoqing',
                  params: {
                    isCaozuo: true,
                  },
                });
              }}
            />
          </View>
          <MyButton title="退出登录" onPress={this.exit} />
        </ScrollView>
      </>
    );
  }
}
