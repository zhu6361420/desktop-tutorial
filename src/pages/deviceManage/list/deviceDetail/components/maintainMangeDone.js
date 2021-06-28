import React, {useState} from 'react';
import {View, ScrollView, Text, TextInput, StyleSheet} from 'react-native';
import {
  UiHeader,
  UiGap,
  MsgPaneS2,
  MsgRow,
  TagHeader,
  MyButton,
  StepIndicator,
} from '../../../../../global.components';
import {$fns, $myTheme, $ajax, $ui, api} from '../../../../../global.utils';
import {maintainTypeOption} from '../../../../../utils/data';
const {getContent, getMaintainDetail, updateMaintain, createMaintain} = api;
export default class App extends React.Component {
  state = {
    curTabIndex: 0,
    detail: {},
    content: [],
    textValue: '',
  };
  componentDidMount() {
    const {maintainDetail} = this.props.route.params;
    $ajax({
      url: getMaintainDetail,
      data: {
        id: maintainDetail.id,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let {deviceTypeId, type, ownerId} = value.data;
        this.getContent(deviceTypeId, type, ownerId);
        this.setState({
          detail: value.data,
        });
      }
    });
  }
  getContent = (deviceTypeId, type, ownerId) => {
    $ajax({
      url: getContent,
      data: {
        deviceTypeId: deviceTypeId,
        type: type,
        ownerId: ownerId,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        if (value.data != null) {
          let {details} = value.data;
          this.setState({
            content: details,
          });
        }
      } else {
        $ui.toast('查询失败');
      }
    });
  };
  submit = () => {
    let obj = this.state.detail;
    obj.status = 1;
    const {
      deviceId,
      deviceSequence,
      deviceTypeId,
      deviceTypeName,
      outside,
    } = this.props.route.params;
    if (this.state.textValue != '' && this.state.textValue != null) {
      $ajax({
        url: createMaintain,
        data: {
          deviceTypeId: obj.deviceTypeId,
          type: obj.type,
          machineId: obj.machineId,
          comment: this.state.textValue,
        },
        _this: this,
      }).then((value) => {
        if (value.code == 200) {
          $ajax({
            url: updateMaintain,
            data: {
              dealTime: null,
              deviceType: obj.deviceType,
              deviceTypeId: obj.deviceTypeId,
              dutierId: obj.dutierId,
              dutierName: obj.dutierName,
              id: obj.id,
              machineId: obj.machineId,
              machineName: obj.machineName,
              machineSequence: obj.machineSequence,
              maintainDate: obj.maintainDate,
              ownerName: obj.ownerName,
              status: 1,
              type: obj.type,
            },
            _this: this,
          }).then((value) => {
            if (value.code == 200) {
              if (outside) {
                $fns.route({
                  context: this,
                  routeName: 'dm_Repair',
                  type: 'replace',
                  params: {
                    id: deviceId,
                    sequence: deviceSequence,
                    deviceTypeId: deviceTypeId,
                    deviceTypeName: deviceTypeName,
                  },
                });
              } else {
                $fns.route({
                  context: this,
                  type: 'replace',
                  routeName: 'dm_MaintainMange',
                  params: {
                    machineSequence: this.state.detail.machineSequence,
                  },
                });
              }
              $ui.toast('处理成功');
            }
          });
        }
      });
    } else {
      $ajax({
        url: updateMaintain,
        data: {
          dealTime: null,
          deviceType: obj.deviceType,
          deviceTypeId: obj.deviceTypeId,
          dutierId: obj.dutierId,
          dutierName: obj.dutierName,
          id: obj.id,
          machineId: obj.machineId,
          machineName: obj.machineName,
          machineSequence: obj.machineSequence,
          maintainDate: obj.maintainDate,
          ownerName: obj.ownerName,
          status: 1,
          type: obj.type,
        },
        _this: this,
      }).then((value) => {
        if (value.code == 200) {
          if (outside) {
            $fns.route({
              context: this,
              routeName: 'dm_Repair',
              type: 'replace',
              params: {
                id: deviceId,
                sequence: deviceSequence,
                deviceTypeId: deviceTypeId,
                deviceTypeName: deviceTypeName,
              },
            });
          } else {
            $fns.route({
              context: this,
              type: 'replace',
              routeName: 'dm_MaintainMange',
              params: {
                machineSequence: this.state.detail.machineSequence,
              },
            });
          }
          $ui.toast('处理成功');
        }
      });
    }
  };
  render() {
    const {
      deviceId,
      deviceSequence,
      deviceTypeId,
      deviceTypeName,
      outside,
    } = this.props.route.params;
        const {content} = this.state;
    const {
      machineSequence,
      deviceType,
      machineName,
      dutierName,
      maintainDate,
      status,
      type,
    } = this.state.detail;

    return (
      <>
        <UiHeader
          title="养护处理"
          onBack={() => {
            outside
              ? $fns.route({
                context: this,
                routeName: 'dm_Repair',
                type: 'replace',
                params: {
                  id: deviceId,
                  sequence: deviceSequence,
                  deviceTypeId: deviceTypeId,
                  deviceTypeName: deviceTypeName,
                },
              })
              : $fns.route({
                  context: this,
                  type: 'replace',
                  routeName: 'dm_MaintainMange',
                  params: {
                    machineSequence: this.state.detail.machineSequence,
                  },
                });
          }}
        />

        <TagHeader title="设备编号" msg={machineSequence} />

        <UiGap />

        <ScrollView>
          <MsgPaneS2 title="设备信息">
            <MsgRow
              title="设备别名"
              msg={machineName}
              titleColor="#777"
              msgColor="#000"
            />

            <MsgRow
              title="设备类型"
              msg={deviceType}
              titleColor="#777"
              msgColor="#000"
            />

            <MsgRow
              title="责任人"
              msg={dutierName}
              titleColor="#777"
              msgColor="#000"
            />

            <MsgRow
              title="预计养护时间"
              msg={maintainDate}
              titleColor="#777"
              msgColor="#000"
            />
          </MsgPaneS2>

          <MsgPaneS2 title="养护信息">
            <MsgRow
              title="本次养护类型"
              msg={type != undefined ? maintainTypeOption[type].label : ''}
              titleColor="#777"
              msgColor={$myTheme.mainBlue}
            />
            <MsgRow
              title="养护内容"
              msg={content.length == 0 ? '暂无' : ''}
              titleColor="#777"
              msgColor="#fe4545"
              border={true}
            />
            <View>
              {content.length != 0 && (
                <View style={[ss.xuhao]}>
                  <Text style={{flex: 2, textAlign: 'center'}}>序号</Text>
                  <Text style={{flex: 4, textAlign: 'center'}}>养护内容</Text>
                  <Text style={{flex: 4, textAlign: 'center'}}>质量标准</Text>
                </View>
              )}

              {content.map((item, index) => (
                <View style={[ss.main]} key={index}>
                  <View style={[ss.row1]}>
                    <Text>{index + 1}</Text>
                  </View>
                  <View style={[ss.row2]}>
                    <Text>{item.detail}</Text>
                  </View>
                  <View style={[ss.row3]}>
                    <Text>{item.quality}</Text>
                  </View>
                </View>
              ))}
            </View>
            <MsgRow
              title="当前养护状态"
              msg={status == 0 ? '待处理' : '已处理'}
              titleColor="#777"
              msgColor={status == 0 ? '#fe4545' : '#35cc8a'}
            />
          </MsgPaneS2>

          <MsgPaneS2 title="养护说明">
            <View style={{paddingTop: 10, paddingBottom: 10}}>
              <TextInput
                style={{height: 100, padding: 10, backgroundColor: '#eee'}}
                multiline={true}
                placeholder="请输入养护信息"
                value={this.state.textValue}
                onChangeText={(t) => {
                  this.setState({
                    textValue: t,
                  });
                }}
              />
            </View>
          </MsgPaneS2>

          <MyButton title="完成养护" onPress={this.submit} />
        </ScrollView>
      </>
    );
  }
}
let ss = StyleSheet.create({
  main: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#ddd',
    height: 'auto',
    minHeight: 30,
  },
  xuhao: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 0.5,
    borderColor: '#ddd',
    paddingTop: 6,
    paddingBottom: 6,
  },
  row1: {
    flex: 2,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  row2: {
    flex: 4,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  row3: {
    flex: 4,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
});
