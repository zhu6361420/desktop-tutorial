import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {UiHeader, MsgPane, ArrowPane, MsgRow,  renderErrorView,
  renderLoadingView,
  renderFooter} from '../../../../../global.components';
import {$fns, $myTheme, $source, $ajax, api} from '../../../../../global.utils';
import {$ui} from '../../../../../utils/utils.ui';
const {getRepairList, getRepaiDetail} = api;
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default class App extends React.Component {
  state = {
    refreshing: false,
    repairList: [],
    count: 1,
    totalPage:0,
    isLoading: true,
    //网络请求状态
    error: false,
    errorInfo: '',
    // dataArray: [],
    showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
  };
  componentDidMount() {
    const {id, machineSequence, deviceTypeId} = this.props.route.params;
    this.getRepairLists(1)
  }
  getRepairLists = (pageNum) => {
    const {id, machineSequence, deviceTypeId} = this.props.route.params;
     $ajax({
      url: getRepairList,
      data: {
        args: {
          machineSequence: machineSequence,
          dataSource:0
        },
        pageNum: pageNum,
        pageSize: 10,
      },
      hasLoading: false,
      _this:this
    }).then((value) => {
      let arr = [];
      if (value.code == 200) {
        const {list} = value.data;
        arr = list.map((item) => ({
          id: item.id,
          repairId: item.repairId,
          deviceComponentName: item.deviceComponentName,
          creator: item.creator,
          occurredTime: item.occurredTime,
          createTime:item.createTime,
          maintenanceStatusCode:item.maintenanceStatusCode,
          maintenanceStatusDesc: item.maintenanceStatusDesc,
        }));
        let foot = 0;
        if (
          pageNum > value.data.totalPage ||
          pageNum == value.data.totalPage
        ) {
          foot = 1;
        }
        this.setState({
          repairList: this.state.repairList.concat(arr),
          isLoading: false,
          showFoot: foot,
          totalPage: value.data.totalPage,
        });
        arr = [];
      }
    });
  };
  showDetail = (id) => {
    $ajax({
      url: getRepaiDetail,
      data: {
        __tailPath: id,
      },_this:this
    }).then((value) => {
      if (value.code == 200) {
        let detail=value.data;
        $fns.route({
          context: this,
          routeName: 'dm_RepairDetail',
          params:{
            id:detail.id,
          }
        });
      } else {
        $ui.toast('查询失败，请稍后重试');
      }
    });
  };
  _onEndReached() {
    let {count, totalPage} = this.state;
    let pageNo = count;
    //如果是正在加载中或没有更多数据了，则返回
    if (this.state.showFoot != 0) {
      return;
    }
    //如果当前页大于或等于总页数，那就是到最后一页了，返回
    if (pageNo != 1 && pageNo >= totalPage) {
      return;
    } else {
      pageNo++;
      this.setState({
        count: pageNo,
        showFoot: 2
      });
    }
    //底部显示正在加载更多数据
    // this.setState({});
    //获取数据
    this.getRepairLists(pageNo);
  }
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
  render() {
    const {listData} = this.state;
    if (this.state.isLoading && !this.state.error) {
      return renderLoadingView(this, '报警列表');
    } else if (this.state.error) {
      //请求失败view
      return renderErrorView;
    }
    return (
      <>
        <UiHeader
          title="报修管理"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />
       {this.state.repairList.length == 0 ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 16}}>暂无报修信息</Text>
          </View>
        ) : (
        <FlatList
          style={{flex: 1,  height: '100%', paddingLeft: 12, paddingRight: 12}}
          data={this.state.repairList}
          ListFooterComponent={renderFooter(this.state.showFoot)}
          onEndReachedThreshold={0.1}
          onEndReached={this._onEndReached.bind(this)}
          renderItem={({item}) => {
            return (
              <MsgPane
              // key={index}
              title="流水号"
              title2={item.repairId==null?'暂无':item.repairId}
              onPress={() => this.showDetail(item.id)}>
              <ArrowPane>
                <MsgRow
                  title="故障部件："
                  msg={item.deviceComponentName}
                  border={false}
                  align="left"
                  rowHeight={30}
                />

                <MsgRow
                  title="报修人："
                  msg={item.creator}
                  border={false}
                  align="left"
                  rowHeight={30}
                />

                <MsgRow
                  title="报修时间："
                  msg={item.createTime}
                  border={false}
                  align="left"
                  rowHeight={30}
                />

                <MsgRow
                  title="当前状态："
                  msg={item.maintenanceStatusDesc}
                  border={false}
                  align="left"
                  rowHeight={30}
                  msgColor={this.getColor(item.maintenanceStatusCode)}
                />
              </ArrowPane>
            </MsgPane>
            )}}
         />
        )}
      </>
    );
  }
}

let ss = StyleSheet.create({
  msgItem: {marginBottom: 6},
  msgLbl: {color: '#666'},
  msgTag: {
    padding: 8,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  flexRowCenter: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
});
