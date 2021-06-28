import React from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  IconFont,
  UiHeader,
  FormItem,
  UiGap,
  LinkItem,
  UiDateTimePicker,
} from '../../../../../global.components';
import {$myTheme, $source, $ajax, api} from '../../../../../global.utils';
import {$fns} from '../../../../../utils/fns';
import {
  getMachineStatus,
  machineStatus,
  getMachineStatusColor,
  floatToTime,
  prefixZero,
} from '../../../../../utils/data';
import {Echarts, echarts} from 'react-native-secharts';
import moment from 'moment';
const {getRunStatus} = api;
export default class App extends React.Component {
  state = {
    isShow: true,
    monitorProfileData: [],
    totalPage: 0,
    currentList: [],
    pageNum: 1,
    errDate: moment().format('YYYY-MM-DD'),
  };
  getRunStatus = (beginTime) => {
    const {id} = this.props.route.params;
    $ajax({
      url: getRunStatus,
      data: {
        machineId: id,
        date: beginTime,
        flag:1
      },
      type: 'get',
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        this.setState({
          monitorProfileData: value.data.machineDrifts,
          totalPage: Math.ceil(value.data.machineDrifts.length / 10),
          currentList: value.data.machineDrifts.slice(0, 10),
        });
      }
    });
  };
  componentDidMount() {
    this.getRunStatus(this.state.errDate);
  }
  handleCreateStatus(data, monitorProfileData, currentDate) {
    const sortIndex = {
      1: 4,
      4: 3,
      0: 2,
      2: 1,
      3: 0,
    };
    monitorProfileData &&
      monitorProfileData.forEach((e, index) => {
        let timeline = this.handleCreateTimeline(
          e.startTime,
          e.endTime,
          currentDate,
        );
        if (machineStatus[e.status]) {
          data.push({
            name: getMachineStatus(e.status),
            value: [
              sortIndex[e.status],
              timeline.lineS, // 开始时间
              timeline.lineE, // 结束时间
            ],
            itemStyle: {
              normal: {
                color: getMachineStatusColor(e.status),
              },
            },
          });
        }
      });
    return data;
  }
  handleCreateTimeline = (beginTime, finishTime, currentDate) => {
    let timeS = moment(beginTime),
      timeE = moment(finishTime);
    let currentDateS = timeS.format('YYYYMMDD') * 1,
      currentDateE = timeE.format('YYYYMMDD') * 1,
      currentDateNormal = moment(currentDate).format('YYYYMMDD') * 1;
    let lineS =
      timeS.format('H') * 1 +
      (timeS.format('m') / 60) * 1 +
      (timeS.format('s') / 3600) * 1;
    let lineE =
      timeE.format('H') * 1 +
      (timeE.format('m') / 60) * 1 +
      (timeE.format('s') / 3600) * 1;
    if (currentDateS < currentDateNormal) {
      lineS = 0;
    }
    if (currentDateE > currentDateNormal) {
      lineE = 24;
    }

    return {
      lineS: lineS,
      lineE: lineE,
    };
  };
  profileOption() {
    let data = [];
    const {monitorProfileData} = this.state;
    // let currentDate = moment().format('YYYY-MM-DD');
    let currentDate = this.state.errDate;
    let datas = this.handleCreateStatus(data, monitorProfileData, currentDate);
    option = {
      tooltip: {
        formatter: function (params) {
          return `
             ${params.name}时间：<br />
             ${floatToTime(params.value[1])}~${floatToTime(params.value[2])}
                      `;
        },
      },
      dataZoom: [
        {
          type: 'slider',
          filterMode: 'none',
          showDetail: false,
        },
      ],
      grid: {
        top: 10,
        left: 60,
        right: 20,
        bottom: 60,
      },
      xAxis: {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5',
          },
        },
        axisTick: {
          inside: true,
          lineStyle: {
            color: '#e5e5e5',
          },
        },
        axisLabel: {
          textStyle: {
            color: '#999',
          },
          formatter: (value) => {
            var numArr = String(value).split('.');
            var hours = numArr[0] < 10 ? `0${numArr[0]}` : numArr[0];
            var minutes = numArr[1]
              ? Math.floor(+('.' + numArr[1]) * 60) < 10
                ? `0${Math.floor(+('.' + numArr[1]) * 60)}`
                : Math.floor(+('.' + numArr[1]) * 60)
              : '00';
            return `${hours}:${minutes}`;
          },
        },
        splitLine: {
          show: false,
        },
        min: 0,
        max: 24,
      },
      yAxis: {
        type: 'category',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#999',
          },
        },
        splitLine: {
          show: false,
        },
        data: [...machineStatus].reverse().map((item) => item.name + '时间'),
      },
      series: [
        {
          type: 'custom',
          renderItem: (params, api) => {
            var categoryIndex = api.value(0);
            var start = api.coord([api.value(1), categoryIndex]);
            var end = api.coord([api.value(2), categoryIndex]);
            var height = api.size([0, 1])[1] * 0.6;

            let targetRect = {
              x: start[0],
              y: start[1] - height / 2,
              width: end[0] - start[0],
              height: height,
            };
            let rect = {
              x: params.coordSys.x,
              y: params.coordSys.y,
              width: params.coordSys.width,
              height: params.coordSys.height,
            };

            var x = Math.max(targetRect.x, rect.x);
            var x2 = Math.min(
              targetRect.x + targetRect.width,
              rect.x + rect.width,
            );
            var y = Math.max(targetRect.y, rect.y);
            var y2 = Math.min(
              targetRect.y + targetRect.height,
              rect.y + rect.height,
            );
            // If the total rect is cliped, nothing, including the border,
            // should be painted. So return undefined.
            if (x2 >= x && y2 >= y) {
              rectShape = {
                x: x,
                y: y,
                width: x2 - x,
                height: y2 - y,
              };
            }

            // var rectShape =
            //   {
            //     x: start[0],
            //     y: start[1] - height / 2,
            //     width: end[0] - start[0],
            //     height: height,
            //   }
            // ;
            return (
              rectShape && {
                type: 'rect',
                shape: rectShape,
                style: api.style(),
              }
            );
          },
          itemStyle: {
            maxWidth: 20,
            normal: {
              opacity: 1,
            },
          },
          encode: {
            x: [1, 2],
            y: 0,
          },
          data: datas,
        },
      ],
    };
    return option;
  }
  _contentViewScroll = (e) => {
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    if (contentSizeHeight + oriageScrollHeight + 10 >= contentSizeHeight) {
      if (this.state.pageNum < this.state.totalPage) {
        let col = this.state.monitorProfileData.slice(
          this.state.pageNum * 10,
          (this.state.pageNum + 1) * 10,
        );
        let cols = this.state.currentList;
        this.setState({
          currentList: cols.concat(col),
          pageNum: this.state.pageNum + 1,
        });
      }
    } else if (offsetY + oriageScrollHeight <= 1) {
      //这个是没有数据了然后给了false  得时候还在往上拉
    } else if (offsetY == 0) {
      //这个地方是下拉刷新，意思是到顶了还在指行，可以在这个地方进行处理需要刷新得数据
    }
  };
  selectTime = (e) => {
    this.setState(
      {
        errDate: e,
      },
      () => {
        this.getRunStatus(e);
      },
    );
  };
  refresh=()=>{
     this.setState({
      totalPage: 0,
      currentList: [],
      pageNum: 1,
     },()=>{
      this.getRunStatus(this.state.errDate);
     })
  }
  render() {
    return (
      <>
        <UiHeader
          title="运行详情"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />
        <View
          style={[
            ss.titles,
            {
              backgroundColor: '#fff',
              borderTopWidth: 0.5,
              borderTopColor: '#eee',
              justifyContent: 'space-between',
              flexDirection: 'row',
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={[ss.titleTxt]}>日期</Text>
            <View style={[ss.titleMain]}>
              <TouchableOpacity
                style={[ss.dayItem]}
                onPress={() => {
                  this.refs.dateTimeRef.show();
                }}>
                <Text
                  style={{
                    color: '#1c83c6',
                  }}>
                  {this.state.errDate ? this.state.errDate : '请选择时间'}
                </Text>
                <IconFont icon={'\ue621'} size={16} color="#1c83c6" />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              width: 80,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
    
            }}>
            <Text style={[ss.titleTxt]}>刷新</Text>
            <TouchableOpacity  onPress={this.refresh}>
              <Text
                style={{
                  fontFamily: 'iconfont',
                  fontSize: 19,
                  marginLeft: 10,
                  color: 'black',
                }}>
                {'\ue62b'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={{backgroundColor: $myTheme.mainBgGray, flex: 1}}
          onMomentumScrollEnd={this._contentViewScroll}>
          <View>
            <View style={[ss.title]}>
              <Text style={{color: '#444', fontSize: 16}}>运行时序分布</Text>
            </View>

            <View style={{height: 240}}>
              <Echarts option={this.profileOption()} height={240} />
            </View>
          </View>
          {/** 运行时序分布 */}

          <View>
            <View style={[ss.title]}>
              <Text style={{color: '#444', fontSize: 16}}>运行详细时序</Text>
            </View>

            {this.state.currentList.map((item, index) => {
              return (
                <View
                  style={[
                    ss.flexRow,
                    index % 2 == 1
                      ? {backgroundColor: '#c9e2f1'}
                      : {backgroundColor: '#fff'},
                  ]}
                  key={index}>
                  <Text style={{fontSize: 15}}>
                    {moment(item.startTime).format('HH:mm:ss')} -
                    {moment(item.endTime).format('HH:mm:ss')}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={[
                        ss.ball,
                        {
                          backgroundColor: getMachineStatusColor(item.status),
                        },
                      ]}></View>
                    <Text style={{fontSize: 15}}>
                      {getMachineStatus(item.status)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          {/** 运行时序分布 */}
        </ScrollView>
        <UiDateTimePicker
          min="2020 "
          ref="dateTimeRef"
          currentDate={this.state.errDate}
          onComfirm={(e) => this.selectTime(e)}
        />
      </>
    );
  }
}

let ss = StyleSheet.create({
  ball: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    marginRight: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  title: {
    height: 45,
    justifyContent: 'center',
    backgroundColor: '#f6f6f6',
    paddingHorizontal: 12,
  },
  titles: {
    flexDirection: 'row',
    height: 46,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dayItem: {
    padding: 4,
    paddingHorizontal: 8,
    // backgroundColor: '#fff',
    backgroundColor: '#e6effe',
    alignItems: 'center',
    borderRadius: 4,
    marginLeft: 10,
    flexDirection: 'row',
  },
  titleTxt: {fontSize: 16},
  titleMain: {width: 120},
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 48,
    alignItems: 'center',
  },
});
