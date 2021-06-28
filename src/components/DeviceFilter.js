import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  // Chip
} from 'react-native';
import {$myTheme, $fns, $ajax, api, $source, $ui} from '../global.utils';
import {isYWAdmin,isCustomAdmins, getStatusValue} from '../utils/data';
import debounce from '../utils/debounce';
import {Chip} from 'react-native-paper';
const {getMachineType, getFirmList,getGroupList} = api;

export default class DeviceFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,

      // 类型相关
      deviceIndex: -1,
      isDeviceShow: true,
      deviceTypeArr: [{}, {}, {}, {}, {}, {}],

      // 型号相关
      xinghaoIndex: -1,
      parentName: null,
      deviceTypeId: {name: null, id: null},
      operatingState: {name: null, id: null},
      sequence: null,
      isXingHaoShow: true,
      xinghaoArr: [
        // {title: 'hlf1530'},
        // {title: 'hlf1530'},
        // {title: 'hlf1530'},
        // {title: 'hlf1530'},
        // {title: 'hlf1530'},
        // {title: 'hlf1530'},
      ],
      machineType: [],
      // 状态相关
      statusIndex: -1,
      isStatusShow: true,
      statusArr: [
        {title: '运行'},
        {title: '空闲'},
        {title: '故障'},
        {title: '关机'},
        {title: '准备'},
      ],
      companyName: '',
      isSearchShow: false,
      firmList: [],
      groupName:'',
      isGroupSearchShow:false,
      groupList:[],
      ownerId: null,
      groupId:null
    };
  }
  timer = null;
  componentDidMount() {
    this.getMachineType();
  }
  getMachineType() {
    $ajax({
      url: getMachineType,
      data: {},
      _this: this,
      hasLoading: false,
    }).then((value) => {
      if (value.code == 200) {
        const data = value.data;
        const machineType = (data || []).map((item) => {
          if (!item.childs || item.childs.length == 0) {
            item.disabled = true;
          }
          return item;
        });
        this.setState({
          machineType: machineType,
        });
      }
    });
  }

  serach() {
    if (this.state.parentName != null && this.state.deviceTypeId.id == null) {
      Alert.alert('注意', '请选择设备型号', [
        {
          text: '好的',
        },
      ]);
    } else {
      let payload = {
        args: {
          deviceTypeId: this.state.deviceTypeId.id,
          operatingState: this.state.operatingState.id,
          sequence: this.state.sequence,
          ownerId: this.state.ownerId,
          groupId:this.state.groupId
        },
        pageNum: 1,
        pageSize: 10,
      };
      this.props.parent.getChild(this, payload);
      this.hide();
    }
  }
  serachs = (text) => {
    if (text.length == 0) {
      this.setState({
        firmList: [],
        isSearchShow: false,
        ownerId: null,
        companyName: '',
      });
    } else {
      $ajax({
        url: getFirmList,
        data: {name: text},
        _this: this,
      }).then((value) => {
        if (value.code == 200) {
          this.setState({
            firmList: value.data,
            isSearchShow: value.data.length != 0,
            // companyName: text,
          });
        }
      });
    }
  };
  serachGroup = (text) => {
    if (text.length == 0) {
      this.setState({
        groupList: [],
        isGroupSearchShow: false,
        groupId: null,
        groupName: '',
      });
    } else {
      $ajax({
        url: getGroupList,
        data: {
          args:{
            name: text
          },
          pageNum:1,
          pageSize:100
        },
        _this: this,
      }).then((value) => {
        if (value.code == 200) {
          const {list}=value.data;
          this.setState({
            groupList: list,
            isGroupSearchShow: list.length != 0,
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
        debounce(() => this.serachs(text), 1000);
      },
    );
  };
  getGroupList = (text) => {
    this.setState(
      {
        groupName: text,
      },
      () => {
        debounce(() => this.serachGroup(text), 100);
      },
    );
  };
  remove() {
    this.setState({
      deviceTypeId: {name: null, id: null},
      operatingState: {name: null, id: null},
      sequence: null,
      deviceIndex: -1,
      statusIndex: -1,
      xinghaoIndex: -1,
      parentName: null,
      xinghaoArr: [],
      firmList: [],
      groupList:[],
      groupName:'',
      companyName: '',
      ownerId: null,
      groupId:null,
    });
  }
  // 容器盒子
  _uiBoxPane(title, boxIndexName, _comopnent) {
    return (
      <View style={[dv.secBox]}>
        <TouchableOpacity
          style={[dv.secHead]}
          onPress={() => {
            this.setState({
              [boxIndexName]: !this.state[boxIndexName],
            });
          }}>
          <Text style={[dv.secHeadTxt]}>{title}</Text>
        </TouchableOpacity>

        {this.state[boxIndexName] && _comopnent}
      </View>
    );
  }
  select = (item) => {
    this.setState({
      isSearchShow: false,
      companyName: item.name,
      ownerId: item.id,
    });
  };
  selectGroup = (item) => {
    this.setState({
      isGroupSearchShow: false,
      groupName: item.name,
      groupId: item.id,
    });
  };
  // 设备类型选择
  _uiType() {
    return this._uiBoxPane(
      '选择设备类型',
      'isDeviceShow',
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {this.state.machineType.map((item, index) => {
          return (
            <TouchableOpacity
            style={[
              dv.tagItem,
              index === this.state.deviceIndex
                ? {backgroundColor: $myTheme.mainBlue}
                : null,
            ]}
              key={index}
              onPress={() => {
                this.setState(
                  {
                    deviceIndex: index,
                    parentName: item.name,
                    xinghaoArr: item.childs,
                  },
                  () => {
                    console.log($fns.size(200));
                  },
                );
              }}>
            
                  {/* <Image
                    source={require('../assets/imgs/icon_filter_1_ed.png')}
                    style={{width: $fns.size(120), height: $fns.size(100)}}
                  /> */}
                 
                    <Text
                      style={{
                        marginTop: 10,
                        height: 30,
                        color:
                          index === this.state.deviceIndex ? '#fff' : '#666',
                      }}>
                      {item.name}
                    </Text>
              
              
            </TouchableOpacity>
          );
        })}
      </View>,
    );
  }

  // 型号选择
  _uiXingHao() {
    return this._uiBoxPane(
      '选择设备型号',
      'isXingHaoShow',
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          // justifyContent: 'space-between',
        }}>
        {this.state.xinghaoArr.map((item, index) => {
          return (
            <TouchableOpacity
              style={[
                dv.tagItem,
                index === this.state.xinghaoIndex
                  ? {backgroundColor: $myTheme.mainBlue}
                  : null,
              ]}
              key={index}
              onPress={() => {
                this.setState({
                  xinghaoIndex: index,
                  deviceTypeId: {name: item.name, id: item.id},
                });
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: index === this.state.xinghaoIndex ? '#fff' : '#666',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  // textAlign:'justify',
                  // borderWidth:1,
                  // borderColor:'red',
                  height: 40,
                  width: '100%',
                }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>,
    );
  }

  // 状态选择
  _uiStatus() {
    return this._uiBoxPane(
      '选择运行状态',
      'isStatusShow',
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          // justifyContent: 'flex-start',
        }}>
        {this.state.statusArr.map((item, index) => {
          return (
            <TouchableOpacity
              style={[
                dv.tagItem,
                index === this.state.statusIndex
                  ? {backgroundColor: $myTheme.mainBlue}
                  : null,
              ]}
              key={index}
              onPress={() => {
                this.setState({
                  statusIndex: index,
                  operatingState: {
                    name: item.title,
                    id: getStatusValue(item.title),
                  },
                });
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: index === this.state.statusIndex ? '#fff' : '#666',
                }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>,
    );
  }

  render() {
    return (
      <Modal visible={this.state.isShow} transparent animationType="fade">
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.6)'}}>
          <View
            style={{
              height: $fns.getWindowHeight() - 200,
              backgroundColor: '#fff',
            }}>
            <ScrollView style={{flex: 1}} keyboardShouldPersistTaps={'handled'}>
              {/* <View style={{height: $fns.getStatusBarHeight()}}></View> */}

              <View
                style={{
                  flexDirection: 'column',
                  paddingLeft: 12,
                  paddingRight: 16,
                  // marginBottom: 10,
                  marginTop: 10,
                }}>
                <View
                  style={{
                    flex: 1,
                    borderWidth: 0.5,
                    borderColor: '#aaa',
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}>
                  <TextInput
                    placeholder="请输入设备号"
                    style={{
                      paddingLeft: 10,
                      height: 34,
                      borderColor: '#fafafa',
                      paddingTop: 0,
                      paddingVertical: 0,
                    }}
                    value={this.state.sequence}
                    onChangeText={(text) => {
                      this.setState({
                        sequence: text,
                      });
                    }}
                    // onBlur={()=>{alert("失去焦点")}}
                  />
                </View>
                {/* {isYWAdmin() && (
                  <View
                    style={{
                      flex: 1,
                      marginTop: 10,
                    }}>
                    <TextInput
                      placeholder="请输入公司名称"
                      style={{
                        paddingLeft: 10,
                        height: 34,
                        // borderColor: '#fafafa',
                        paddingTop: 0,
                        paddingVertical: 0,
                        borderWidth: 0.5,
                        borderColor: '#aaa',
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                      }}
                      value={this.state.companyName}
                      onBlur={() => {
                        this.setState({
                          isSearchShow: false,
                        });
                      }}
                      onChangeText={(text) => this.getFirmList(text)}
                    />
                    {this.state.isSearchShow && (
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          position: 'absolute',
                          top: 34,
                          zIndex: 999,
                          backgroundColor: '#fff',
                          borderColor: '#e8e8e8',
                          borderRightWidth: 0.5,
                          borderLeftWidth: 0.5,
                        }}>
                        {this.state.firmList.map((item) => (
                          <TouchableOpacity onPress={() => this.select(item)}>
                            <Text
                              style={{
                                height: 40,
                                borderColor: '#e5e5e5',
                                borderBottomWidth: 0.5,
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                              }}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )} */}
                 {/* {isCustomAdmins() && (
                  <View
                    style={{
                      flex: 1,
                      marginTop: 10,
                    }}>
                    <TextInput
                      placeholder="请输入部门名称"
                      style={{
                        paddingLeft: 10,
                        height: 34,
                        // borderColor: '#fafafa',
                        paddingTop: 0,
                        paddingVertical: 0,
                        borderWidth: 0.5,
                        borderColor: '#aaa',
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                      }}
                      value={this.state.groupName}
                      onBlur={()=>{
                        this.setState({
                          isGroupSearchShow: false,
                        });
                      }}
                      onChangeText={(text) => this.getGroupList(text)}
                      />
                    {this.state.isGroupSearchShow && (
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          position: 'absolute',
                          top: 34,
                          zIndex: 999,
                          backgroundColor: '#fff',
                          borderColor: '#e8e8e8',
                          borderRightWidth: 0.5,
                          borderLeftWidth: 0.5,
                        }}>
                        {this.state.groupList.map((item) => (
                          <TouchableOpacity onPress={() => this.selectGroup(item)}>
                            <Text
                              style={{
                                height: 40,
                                borderColor: '#e5e5e5',
                                borderBottomWidth: 0.5,
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                              }}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )} */}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  // borderWidth: 0.5,
                  // borderColor: '#ddd',
                  paddingLeft: 16,
                  paddingRight: 16,
                  paddingTop: 10,
                }}>
                {this.state.parentName != null && (
                  <Chip
                    style={[dv.sItem]}
                    mode="outlined"
                    onClose={() => {
                      this.setState({
                        parentName: null,
                        deviceIndex: -1,
                        xinghaoIndex: -1,
                        deviceTypeId: {name: null, id: null},
                      });
                    }}>
                    {this.state.parentName}
                  </Chip>
                )}

                {this.state.deviceTypeId.name != null && (
                  <Chip
                    style={[dv.sItem]}
                    mode="outlined"
                    onClose={() => {
                      this.setState({
                        xinghaoIndex: -1,
                        deviceTypeId: {name: null, id: null},
                      });
                    }}>
                    {this.state.deviceTypeId.name}
                  </Chip>
                )}

                {this.state.operatingState.name != null && (
                  <Chip
                    style={[dv.sItem]}
                    mode="outlined"
                    onClose={() => {
                      this.setState({
                        statusIndex: -1,
                        operatingState: {name: null, id: null},
                      });
                    }}>
                    {this.state.operatingState.name}
                  </Chip>
                )}
              </View>

              {this._uiType()}

              {this._uiXingHao()}

              {this._uiStatus()}
            </ScrollView>
          </View>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                flex: 1,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#eeeeee',
              }}
              onPress={() => {
                this.remove();
                // this.hide();
              }}>
              <Text style={{fontSize: 16, color: '#222'}}>重置</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: $myTheme.mainBlue,
              }}
              onPress={() => {
                this.serach();
                // this.hide();
              }}>
              <Text style={{fontSize: 16, color: '#fff'}}>确定</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {
              this.setState({
                isShow: false,
              });
            }}></TouchableOpacity>
        </View>
      </Modal>
    );
  }

  hide() {
    this.setState({
      isShow: false,
    });
  }

  show() {
    this.setState({
      isShow: true,
    });
  }
}
let dv = StyleSheet.create({
  secBox: {paddingLeft: 12, paddingRight: 12, paddingBottom: 12},
  secHead: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6f2fe',
    marginBottom: 16,
  },
  secHeadTxt: {fontSize: 15, color: $myTheme.mainBlue},

  tagItem: {
    width: $fns.size(200),
    height: 50,
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 6,
    marginRight: 15,
    // borderColor:'black',
    // borderWidth:1,
    // maxWidth:$fns.size(230)
  },
  sItem: {marginRight: 10, marginBottom: 10},
});
