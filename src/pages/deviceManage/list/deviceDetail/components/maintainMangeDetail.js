import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import {
  UiHeader,
  UiGap,
  LeaveMsg,
  MsgPaneS2,
  MsgRow,
  TagHeader,
  MyButton,
} from '../../../../../global.components';
import {$fns, $myTheme, $ajax, $ui, api} from '../../../../../global.utils';
import {maintainTypeOption} from '../../../../../utils/data';
const {getContent, getMaintainDetail, getCommentByPage} = api;
export default class App extends React.Component {
  state = {
    curTabIndex: 0,
    detail: {},
    content: [],
    commentList: [],
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
    $ajax({
      url: getCommentByPage,
      data: {
        args: {
          deviceTypeId: maintainDetail.deviceTypeId,
          type: maintainDetail.type,
        },
        pageNum: 1,
        pageSize: 100,
        // machineId:maintainDetail.machineId,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let {list} = value.data;
        this.setState({
          commentList: list,
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
  render() {
    const {content, commentList} = this.state;
    const {
      deviceId,
      deviceSequence,
      deviceTypeId,
      deviceTypeName,
      outside,
    } = this.props.route.params;
        const {
      machineSequence,
      deviceType,
      machineName,
      dutierName,
      maintainDate,
      status,
      type,
      dealTime,
    } = this.state.detail;
    return (
      <>
        <UiHeader
          title="养护详情"
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
              msgColor={$myTheme.mainBlue}
              border={true}
            />
            {content.length != 0 && (
              <View>
                <View style={[ss.xuhao]}>
                  <Text style={{flex: 2, textAlign: 'center'}}>序号</Text>
                  <Text style={{flex: 4, textAlign: 'center'}}>养护内容</Text>
                  <Text style={{flex: 4, textAlign: 'center'}}>质量标准</Text>
                </View>

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
            )}

            <MsgRow
              title="当前养护状态"
              msg={status == 0 ? '待处理' : '已处理'}
              titleColor="#777"
              msgColor={status == 0 ? '#fe4545' : '#35cc8a'}
            />
            <MsgRow
              title="处理时间"
              msg={dealTime}
              titleColor="#777"
              msgColor="#000"
            />
          </MsgPaneS2>

          <MsgPaneS2 title="留言信息" num={commentList.length} isOpen={true}>
            <View style={{paddingTop: 10}}>
              {commentList.map((item, index) => (
                <LeaveMsg
                  data={{
                    uname: item.creatorName,
                    time: item.createTime,
                    msg: item.comment,
                    redDot: false,
                  }}
                  key={index}
                />
              ))}
            </View>
          </MsgPaneS2>
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
