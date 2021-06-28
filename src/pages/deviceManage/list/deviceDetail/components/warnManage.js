import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  FlatList,
  TextInput,
  Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  UiHeader,
  MsgPane,
  ArrowPane,
  MsgRow,
  UiDateTimePicker,
} from '../../../../../global.components';
import {$fns, $myTheme, $source, $ajax, api} from '../../../../../global.utils';
import {$ui} from '../../../../../utils/utils.ui';
import {
  renderErrorView,
  renderLoadingView,
  renderFooter,
} from '../../../../../components/Listextra';
const {getAlarmList, getAlramDetail} = api;
import moment from 'moment';
export default class App extends React.Component {
  state = {
    refreshing: false,
    alarmList: [],
    count: 1,
    totalPage: 0,
    isLoading: true,
    //网络请求状态
    error: false,
    errorInfo: '',
    // dataArray: [],
    showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
    startDate: null,
    endDate: null,
  };
  componentDidMount() {
    let beginTime = moment().format('YYYY-MM-DD 00:00:00');
    let endTime = moment().format('YYYY-MM-DD 23:59:59');
    this.setState({
      startDate: beginTime,
      endDate: endTime,
    });
    this.getAlarm(beginTime, endTime, 1);
  }
  getAlarm = (beginTime, endTime, pageNum) => {
    const {machineSequence} = this.props.route.params;
    $ajax({
      url: getAlarmList,
      data: {
        args: {
          startTime: beginTime,
          endTime: endTime,
          sequence: machineSequence,
        },
        pageNum: pageNum,
        pageSize: 10,
      },
      hasLoading: false,
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let arr=[];
        const {list, totalPage} = value.data;
         arr = list.map((item) => ({
          id: item.id,
          name: item.name,
          sequence: item.sequence,
          dataType: item.dataType,
          lastTime: item.lastTime,
          grade: item.grade,
        }));
        // console.log(this.state.alarmList)
        console.log(list)

        let foot = 0;
        if (pageNum > totalPage || pageNum == totalPage) {
          foot = 1;
        }
        this.setState({
          totalPage: totalPage,
          alarmList: this.state.alarmList.concat(arr),
          isLoading: false,
          showFoot: foot,
        });
        arr=[];
      }
    });
  };
  _onEndReached(){
    let {count, startDate, endDate, totalPage} = this.state;
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
      });
    }
    //底部显示正在加载更多数据
    this.setState({showFoot: 2});
    //获取数据
    this.getAlarm(startDate, endDate, pageNo);
  }
  showDetail = (id) => {
    $ajax({
      url: getAlramDetail,
      data: {
        args: {
          id: id,
        },
        pageNum: 1,
        pageSize: 20,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let {list} = value.data;
        $fns.route({
          context: this,
          routeName: 'dmHome_WarnHandleDetail',
          params: {
            detailList: list,
            id: id,
          },
        });
      } else {
        $ui.toast('查询失败，请稍后重试');
      }
    });
  };

  selectTime = (e, flag) => {
    let {startDate, endDate} = this.state;
    if (flag == 1) {
      this.setState(
        {
          startDate: moment(e).format('YYYY-MM-DD 00:00:00'),
          alarmList:[]
        },
        () => {
          if (endDate) {
            if (
              moment(endDate).diff(moment(this.state.startDate), 'days') > 29
            ) {
              $ui.toast('查询时间段不能超过7天');
              return;
            }
            this.getAlarm(this.state.startDate, endDate, 1);
          }
        },
      );
    } else {
      this.setState(
        {
          endDate: moment(e).format('YYYY-MM-DD 23:59:59'),
          alarmList:[]
        },
        () => {
          if (startDate) {
            if (
              moment(this.state.endDate).diff(moment(startDate), 'days') > 29
            ) {
              $ui.toast('查询时间段不能超过7天');
              return;
            }
            this.getAlarm(startDate, this.state.endDate, 1);
          }
        },
      );
    }
  };
  render() {
    return (
      <>
        <UiHeader
          title="报警管理"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />
        <UiDateTimePicker
          min="2020"
          ref="dateTimeRef"
          flag={1}
          currentDate={this.state.startDate}
          onComfirm={(e) => this.selectTime(e, 1)}
        />
        <UiDateTimePicker
          min="2020"
          ref="dateTimeRefs"
          flag={1}
          currentDate={this.state.endDate}
          onComfirm={(e) => this.selectTime(e, 2)}
        />
        <View
          style={[
            ss.titles,
            {
              backgroundColor: '#fff',
              borderTopWidth: 0.5,
              borderTopColor: '#eee',
            },
          ]}>
          <Text style={[ss.titleTxt]}>日期</Text>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
              // paddingBottom: 30,
            }}>
            <TouchableOpacity
              style={[ss.inputBox]}
              onPress={() => {
                this.refs.dateTimeRef.show();
              }}>
              <Text style={{color: '#666'}}>
                {this.state.startDate ? this.state.startDate : '开始日期'}
              </Text>
            </TouchableOpacity>
            <Text style={{paddingHorizontal: 10, color: 'black'}}>~</Text>
            <TouchableOpacity
              style={[ss.inputBox]}
              onPress={() => {
                this.refs.dateTimeRefs.show();
              }}>
              <Text style={{color: '#666'}}>
                {this.state.endDate ? this.state.endDate : '结束日期'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.alarmList.length == 0 ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 16}}>暂无报警信息</Text>
          </View>
        ) : (
          <FlatList
            style={{flex: 1,  paddingLeft: 12, paddingRight: 12, height: '100%'}}
            data={this.state.alarmList}
            renderItem={({item}) => {
              return (
                <MsgPane
                  // key={index}
                  title="报警名称"
                  title2={item.name}
                  onPress={() => this.showDetail(item.id)}>
                  <ArrowPane>
                    <MsgRow
                      title="设备编号："
                      msg={item.sequence}
                      border={false}
                      align="left"
                      rowHeight={30}
                    />

                    <MsgRow
                      title="报警类型："
                      msg={item.dataType}
                      border={false}
                      align="left"
                      rowHeight={30}
                    />

                    <MsgRow
                      title="最新报警时间："
                      msg={item.lastTime}
                      border={false}
                      align="left"
                      rowHeight={30}
                    />

                    <MsgRow
                      title="报警等级："
                      msg={item.grade}
                      border={false}
                      align="left"
                      rowHeight={30}
                    />
                  </ArrowPane>
                </MsgPane>
              );
            }}
            ListFooterComponent={renderFooter(this.state.showFoot)}
            onEndReachedThreshold={0.1}
            onEndReached={this._onEndReached.bind(this)}
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
  titles: {
    flexDirection: 'row',
    height: 46,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  titleTxt: {fontSize: 16},
  inputBox: {
    flex: 1,
    // minWidth:120,
    height: 34,
    borderWidth: 0.5,
    borderColor: '#666',
    borderRadius: 3,
    paddingVertical: 0,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
