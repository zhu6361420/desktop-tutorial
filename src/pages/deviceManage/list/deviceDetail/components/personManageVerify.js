import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {CheckBox} from 'react-native-elements';
import {
  UiHeader,
  IconFont,
  StepIndicator,
  MsgRow,
  MyButton,
  UiPicker,
} from '../../../../../global.components';
import {$fns, $myTheme, $source, $ajax, api} from '../../../../../global.utils';
import {$ui} from '../../../../../utils/utils.ui';
// import { $ajax } from "../../../utils/utils.fetch";

const {getGroup, getRole, activate} = api;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupList: [],
      roleList: [],
      curStepIndex: 1,

      // 分组数据
      groupArr: ['分组一', '分组二', '分组三'],
      groupSelected: '',

      // 角色数据
      roleArr: ['11111', '22222', '3333'],
      roleSelected: '',
      checked: false,
    };
  }

  componentDidMount() {
    let data = JSON.parse(sto.getValue('loginData'));
    let firmId = data.userData.firmId;
    this.getGroup(firmId);
    this.getRole(firmId);
  }
  getGroup = (firmId) => {
    $ajax({
      url: getGroup,
      data: {
        firmId: firmId,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let arr = (value.data || []).map((item) => ({
          id: item.id,
          name: item.name,
        }));
        this.setState({
          groupList: arr,
        });
      }
    });
  };
  getRole = (firmId) => {
    $ajax({
      url: getRole,
      data: {
        firmId: firmId,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let arr = (value.data || []).map((item) => ({
          id: item.id,
          name: item.name,
        }));
        this.setState({
          roleList: arr,
        });
      }
    });
  };
  getId(arr, name) {
    let a = arr.filter(function (x, index) {
      return x.name == name;
    });
    return a[0].id;
  }
  getName(arr) {
    let a = arr.map((item) => item.name);
    return a;
  }
  submit = () => {
    const {itemInfo, flag} = this.props.route.params;
    let params={};
    if(this.state.checked){
        params={
            id: itemInfo.id,
            isFirmAdmin:1
        }
    }
    else{
        params={
        id: itemInfo.id,
        roleId: this.getId(this.state.roleList, this.state.roleSelected),
        userGroupId: this.getId(this.state.groupList, this.state.groupSelected),
        }
    }
    $ajax({
      url: activate,
      data: params,
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        $ui.toast(`${flag == 0 ? '审核' : '修改'}成功`);
        $fns.route({
          context: this,
          params: {
            flag: 1,
          },
          routeName: 'dm_PersonManage',
        });
      }
    });
  };
  next = () => {
    if (!this.state.checked) {
      if (this.state.groupSelected == '') {
        return $ui.toast('请选择部门');
      }
      if (this.state.roleSelected == '') {
        return $ui.toast('请选择角色');
      }
    }
    this.setState({
      curStepIndex: 2,
    });
  };
  render() {
    let {groupSelected, curStepIndex, roleSelected} = this.state;
    const {itemInfo, flag} = this.props.route.params;
    return (
      <>
        <UiHeader
          title={flag == 0 ? '信息审核' : '信息编辑'}
          onBack={() => {
            curStepIndex == 2
              ? this.setState({
                  curStepIndex: 1,
                })
              : $fns.route({
                  context: this,
                  type: 'back',
                });
          }}
        />

        <StepIndicator
          datas={[
            {title1: flag == 0 ? '分配权限' : '修改权限'},
            {title1: '完成'},
          ]}
          curIndex={this.state.curStepIndex}
        />

        <ScrollView style={{flex: 1, backgroundColor: '#eee', padding: 12}}>
          {this.state.curStepIndex == 1 && (
            <View>
              <View
                style={{backgroundColor: '#fff', padding: 10, borderRadius: 4}}>
                <MsgRow
                  title="用户名"
                  msg={itemInfo.username}
                  titleColor="#777"
                  msgColor="#222"
                />

                <MsgRow
                  title="手机号"
                  msg={itemInfo.mobile}
                  titleColor="#777"
                  msgColor="#222"
                />

                <MsgRow
                  title="邮箱"
                  msg={itemInfo.email}
                  titleColor="#777"
                  msgColor="#222"
                />

                {!this.state.checked && (
                  <MsgRow
                    title="部门"
                    titleColor="#777"
                    slot={
                      <TouchableOpacity
                        style={ss.flexItem}
                        onPress={() => {
                          this.refs.groupRef.show();
                        }}>
                        <Text
                          style={{
                            color: groupSelected ? '#222' : '#777',
                            fontSize: 15,
                          }}>
                          {groupSelected ? groupSelected : '请选择部门'}
                        </Text>
                        <IconFont icon={'\ue621'} size={14} color="#999" />
                      </TouchableOpacity>
                    }
                  />
                )}
                {!this.state.checked && (
                  <MsgRow
                    title="角色"
                    titleColor="#777"
                    slot={
                      <TouchableOpacity
                        style={ss.flexItem}
                        onPress={() => {
                          this.refs.roleRef.show();
                        }}>
                        <Text
                          style={{
                            color: roleSelected ? '#222' : '#777',
                            fontSize: 15,
                          }}>
                          {roleSelected ? roleSelected : '请选择角色'}
                        </Text>
                        <IconFont icon={'\ue621'} size={14} color="#999" />
                      </TouchableOpacity>
                    }
                  />
                )}

                <View style={{alignItems: 'flex-start', marginTop: 5}}>
                  <CheckBox
                    center
                    title="企业管理员"
                    checked={this.state.checked}
                    containerStyle={{
                      backgroundColor: '#fff',
                      color: 'red',
                      borderWidth: 0,
                      paddingLeft: 0,
                      marginLeft: 0,
                      marginTop: 0,
                      marginBottom: 0,
                      paddingBottom: 0,
                      paddingTop: 0,
                    }}
                    onPress={() =>
                      this.setState({checked: !this.state.checked})
                    }
                  />
                </View>
              </View>

              <MyButton
                outterStyle={{paddingTop: 30, paddingLeft: 0, paddingRight: 0}}
                title="下一步"
                onPress={this.next}
              />
            </View>
          )}

          {this.state.curStepIndex == 2 && (
            <View>
              <View
                style={{backgroundColor: '#fff', padding: 10, borderRadius: 4}}>
                <MsgRow
                  title="用户名"
                  msg={itemInfo.username}
                  titleColor="#777"
                  msgColor="#222"
                />

                <MsgRow
                  title="手机号"
                  msg={itemInfo.mobile}
                  titleColor="#777"
                  msgColor="#222"
                />

                <MsgRow
                  title="邮箱"
                  msg={itemInfo.email}
                  titleColor="#777"
                  msgColor="#222"
                />
                {!this.state.checked && (
                  <MsgRow
                    title="部门"
                    titleColor="#777"
                    msg={this.state.groupSelected}
                    msgColor="#222"
                  />
                )}
                {!this.state.checked && (
                  <MsgRow
                    title="角色"
                    titleColor="#777"
                    msg={this.state.roleSelected}
                    msgColor="#222"
                  />
                )}
                {this.state.checked && ( <MsgRow
                    title="角色"
                    titleColor="#777"
                    msg='企业管理员'
                    msgColor="#222"
                  />)}

              </View>

              <MyButton
                outterStyle={{paddingTop: 30, paddingLeft: 0, paddingRight: 0}}
                title="完成"
                onPress={this.submit}
              />
            </View>
          )}
        </ScrollView>

        <UiPicker
          ref="groupRef"
          datas={this.getName(this.state.groupList)}
          onConfirm={(_value, _index) => {
            this.setState({
              groupSelected: _value,
            });
          }}
        />
        {/** 分组数据 */}

        <UiPicker
          ref="roleRef"
          datas={this.getName(this.state.roleList)}
          onConfirm={(_value, _index) => {
            this.setState({
              roleSelected: _value,
            });
          }}
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
});
