import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {
  UiHeader,
  UiGap,
  LeaveMsg,
  MsgPaneS2,
  MsgRow,
  TagHeader,
  MyButton,
} from '../../../../../global.components';
import {$fns,api,$ajax, $myTheme} from '../../../../../global.utils';
import Zoom from '../../../../../components/Zoom';
const{getRepaiDetail}=api;
export default class App extends React.Component {
  state = {
    curTabIndex: 0,
    repairDetail:{}
  };
  getColor(code){
    let color="";
     switch(code){
       case "-1":
        color= '#f50';
        break;
        case "0":
        color= '#2db7f5';
        break;
        case "1":
        color= '#108ee9';
        break;
        case "2":
        color= '#108ee9';
        break;
        case "3":
        color= '#108ee9';
        break;
        case "4":
        color= '#108ee9';
        break;
        case "5":
        color= '#87d068';
        break;
     }
     return color
  }
  componentDidMount(){
    const {id} = this.props.route.params;
 
    $ajax({
      url: getRepaiDetail,
      data: {
        __tailPath:id,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let detail = value.data;
        console.log('调用了')
         this.setState({
          repairDetail:detail
         })
      } else {
        $ui.toast('查询失败，请稍后重试');
      }
    });
  }
  render() {
    // const {repairDetail} = this.state.repairDetail;
    const {
      repairId,
      machineSequence,
      machineName,
      deviceTypeName,
      creator,
      maintenanceStatusDesc,
      deviceComponentName,
      createTime,
      maintenanceMobile,
      maintenanceTime,
      memo,
      maintenanceMan,
      picUrlList,
      city,
      province,
      maintenanceStatusCode,
    } = this.state.repairDetail;
    let images =picUrlList==null?[]:picUrlList.length == 0?[]:picUrlList.map((item) => ({
      url: item,
    }));
    let picUrlLists=picUrlList==null?[]:picUrlList.length == 0?[]:picUrlList;
    return (
      <>
        <UiHeader
          title="报修详情"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />
        <Zoom ref="zoom" images={images} />
        <TagHeader title="流水号" msg={repairId==null?'暂无':repairId} />

        <UiGap />

        <ScrollView>
          <MsgPaneS2 title="设备信息">
            <MsgRow
              title="设备编号"
              msg={machineSequence}
              titleColor="#777"
              msgColor="#000"
            />

            <MsgRow
              title="设备别名"
              msg={machineName}
              titleColor="#777"
              msgColor="#000"
            />

            <MsgRow
              title="设备类型"
              msg={deviceTypeName}
              titleColor="#777"
              msgColor="#000"
            />
             <MsgRow
              title="地址信息"
              msg={`${city}-${province}`}
              titleColor="#777"
              msgColor="#000"
              border={false}
            />
            
          </MsgPaneS2>

          <MsgPaneS2 title="报修信息">
            <MsgRow msgColor={this.getColor(maintenanceStatusCode)} title="当前状态" msg={maintenanceStatusDesc} />
            {/* <MsgRow
                            title   = "本次养护类型"
                            msg     = "每月养护"
                            titleColor = "#777"
                            msgColor= {$myTheme.mainBlue}
                        /> */}

            <MsgRow title="报修部件" msg={deviceComponentName==''?'暂无':deviceComponentName} />
            <MsgRow
              title="报修人"
              msg={creator}
              titleColor="#777"
              msgColor="#000"
              border={false}
            />
            <MsgRow title="报修时间" msg={createTime} />

            {/* <MsgRow
                            title   = "联系电话"
                            msg     = {maintenanceMobile}
                            border  = { true }
                        /> */}
            <MsgRow
              title="故障描述"
              msg={memo}
              border={true}
              rowHeight={'auto'}
              rowHeight={40}
            />
            <View
              style={[
                {
                  height: 'auto',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                },
                true
                  ? {borderBottomWidth: 0.5, borderBottomColor: '#ddd'}
                  : null,
              ]}>
              <View
                style={{flexDirection: 'row',width:'100%', justifyContent: 'space-between'}}>
                <Text style={{color: '#777', fontSize: 15, marginBottom: 6}}>
                  故障图片
                </Text>
                {picUrlLists.length == 0 && (
                  <Text
                    style={{color: '#222', fontSize: 15, textAlign: 'right'}}>
                    暂无图片
                  </Text>
                )}
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  paddingLeft: 10,
                }}>
                {picUrlLists.length != 0 &&
                  picUrlLists.map((items, index) => (
                    <TouchableOpacity
                      style={{marginRight: 10, marginBottom: 5}}
                      onPress={() => this.refs.zoom.show(index)}>
                      <Image
                        key={index}
                        source={{uri: items}}
                        style={{
                          width: 100,
                          height: 100,
                          borderColor: '#ddd',
                          borderWidth: 1,
                        }}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          </MsgPaneS2>
          <MsgPaneS2 title="处理信息">
            <MsgRow
              title="处理人"
              msg={maintenanceMan}
              titleColor="#777"
              msgColor="#000"
            />

            <MsgRow
              title="联系人电话"
              msg={maintenanceMobile}
              titleColor="#777"
              msgColor="#000"
            />

            <MsgRow
              title="处理时间"
              msg={maintenanceTime}
              titleColor="#777"
              msgColor="#000"
            />
          </MsgPaneS2>
      
        {maintenanceStatusCode=="3"&&(
          <MyButton title="反馈" onPress={()=>{
            $fns.route({
              context: this,
              type: 'navigate',
              routeName: 'repairFeeback',
              params:{
                repairDetail:this.state.repairDetail,
              }
            });
         }}/>
        )}
        </ScrollView>
      </>
    );
  }
}

let ss = StyleSheet.create({
  msgItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    height: 36,
    alignItems: 'center',
  },
  msgLbl: {color: '#666'},
  msgMain: {flex: 1, flexDirection: 'row', justifyContent: 'flex-end'},
  msgMainTxt: {fontSize: 15, color: '#000'},

  flexRowCenter: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
});
