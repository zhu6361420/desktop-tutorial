import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {UiHeader, EchartsView} from './../../../global.components';
import Qiguan from './index';
import ChaoGuan from './super_index';
import {$fns, $myTheme, $ajax, api} from './../../../global.utils';
import {isYWAdmin, isCustomAdmins} from '../../../utils/data';
import debounce from '../../../utils/debounce';
import listPage from '../list/index';
const {getMachineType, getFirmList} = api;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    let data = JSON.parse(sto.getValue('loginData'));
    let roleId = data.userData.roleId;
    let firmId = data.userData.firmId;
    this.state = {
      isSearchShow: false,
      companyName: '',
      firmList: [],
      firmId: firmId,
      roleId: roleId,
      selectOne: {},
    };
  }
  componentDidMount() {
    // let data = JSON.parse(sto.getValue('loginData'));
    // let roleId = data.userData.roleId;
    // let firmId = data.userData.firmId;
    //  this.setState({
    //     roleId:roleId,
    //     firmId:firmId
    //  })
  }
  serachs = (text) => {
    if (text.length == 0) {
      this.setState({
        firmList: [],
        isSearchShow: false,
        companyName: '',
      });
    } else {
      $ajax({
        url: getFirmList,
        data: {name: text},
        _this: this,
      }).then((value) => {
        if (value.code == 200) {
          console.log(value.data);
          this.setState({
            firmList: value.data,
            isSearchShow: value.data.length != 0,
            // companyName: text,
          });
        }
      });
    }
  };
  getFirmList = (text) => {
    this.setState(
      {
        companyName: text,
      },
      () => {
        debounce(() => this.serachs(text), 500);
      },
    );
  };
  select = (item) => {
    this.setState({
      isSearchShow: false,
      companyName: item.name,
      firmId: item.id,
      roleId: 4,
      selectOne: item,
    });
    global_firm = item.id;
    // let payload = {
    //   args: {
    //     deviceTypeId: null,
    //     operatingState: null,
    //     sequence: null,
    //     ownerId: item.id,
    //   },
    //   pageNum: 1,
    //   pageSize: 10,
    // };
    // // listPage.getChild(this, payload)
  };
  reset = () => {
    // alert(111);
    this.setState({
      selectOne: {},
      companyName: '',
      roleId: 1,
    });
    global_firm = null;
  };
  render() {
    const {
      roleId,
      firmId,
      selectOne,
      firmList,
      companyName,
      isSearchShow,
    } = this.state;
    console.log(roleId);
    return (
      <>
        <UiHeader
          title="设备管理"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'navigate',
              routeName: 'tabPages',
            });
          }}
          right={
            isCustomAdmins()&&(  
              <TouchableOpacity
              onPress={() => {
                $fns.route({
                  context: this,
                  type: 'push',
                  routeName: 'weekly',
                });
              }}
              style={{
                borderColor: '#ddd',
                padding: 1,
                paddingLeft: 4,
                paddingRight: 4,
                borderWidth: 1,
                borderRadius: 10,
              }}>
           <Text style={{color: '#ddd', fontSize: 12}}>上周小结</Text>
            </TouchableOpacity>
            )
          }
        />

        <View style={{flex: 1}}>
          {isYWAdmin() && (
            <View style={[sss.view]}>
              {Object.keys(selectOne).length == 0 && (
                <TextInput
                  placeholder="请输入公司名称"
                  style={[sss.input]}
                  value={this.state.companyName}
                  //   onBlur={() => {
                  //     this.setState({
                  //       isSearchShow: false,
                  //     });
                  //   }}
                  onChangeText={(text) => this.getFirmList(text)}
                />
              )}
              {Object.keys(selectOne).length != 0 && (
                <View style={[sss.input]}>
                  <Text style={[sss.wenzi]}>{selectOne.name}</Text>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}
                    onPress={this.reset}>
                    <Text style={{color: '#1c83c6'}}>清空</Text>
                  </TouchableOpacity>
                </View>
              )}
              {this.state.isSearchShow && (
                <View style={[sss.search]}>
                  <ScrollView keyboardShouldPersistTaps={'handled'}>
                    {this.state.firmList.map((item) => (
                      <TouchableOpacity onPress={() => this.select(item)}>
                        <Text style={sss.inputText}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
          <View style={{flex: 1}}>
            {roleId == 1 ? (
              <ChaoGuan that={this} />
            ) : (
              <Qiguan firmId={firmId} />
            )}
          </View>
        </View>
      </>
    );
  }
}
let sss = StyleSheet.create({
  view: {
    marginTop: 8,
    paddingLeft: 12,
    paddingRight: 12,
  },
  input: {
    paddingLeft: 10,
    height: 34,
    // borderColor: '#fafafa',
    paddingTop: 0,
    paddingVertical: 0,
    borderWidth: 1.5,
    borderColor: '#1c83c6',
    borderRadius: 6,
    textAlignVertical: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wenzi: {
    textAlignVertical: 'center',
  },
  inputText: {
    height: 40,
    borderColor: '#e5e5e5',
    borderBottomWidth: 0.5,
    textAlignVertical: 'center',
    paddingLeft: 10,
  },
  search: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    // position: 'absolute',
    // top: 34,
    // zIndex: 999,
    backgroundColor: '#fff',
    // borderColor: 'red',
    // borderWidth: 1,
    // borderRightWidth: 0.5,
    // borderLeftWidth: 0.5,
    maxHeight: 200,
  },
});
