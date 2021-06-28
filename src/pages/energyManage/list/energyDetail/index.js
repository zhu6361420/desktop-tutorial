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
  UiPicker,
  EchartsView,
  UiDateTimePicker
} from '../../../../global.components';
import {$myTheme, $source, $ajax, api} from '../../../../global.utils';
import {$fns} from '../../../../utils/fns';
import {Echarts, echarts} from 'react-native-secharts';
// import Echarts from 'native-echarts';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import {
  isCustomAdmins,
  isYWAdmin,
  getMachineStatus,
  getMachineStatusColor,
  floatToTime,
  prefixZero,
  machineStatus,
} from '../../../../utils/data';
const {getEveryDayEnergy, getEveryCharge, getRunStatus, getEveryElectric} = api;
var dataArr = [];
var data = new Date();
var year = data.getFullYear();
data.setMonth(data.getMonth() + 1, 1); //获取到当前月份,设置月份
for (var i = 0; i < 12; i++) {
  data.setMonth(data.getMonth() - 1); //每次循环一次 月份值减1
  var m = data.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  dataArr.push(data.getFullYear() + '-' + m);
}
const monthList = dataArr;
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    isShow: true,
    curTabIndex: 1,
    dayEnergy: [], //能耗
    dayCharge: [], //电费
    electricData: [],
    monthSelected: '',
    monitorProfileData: [],
    beginTime: moment().format('YYYY-MM-DD'),
  };
  componentDidMount() {
    const {id, sequence, deviceTypeId} = this.props.route.params;
    let today = moment().format('YYYY-MM-DD');
    let beginTime = moment().subtract(7, 'days').format('YYYY-MM-DD'); //7天前
    let endTime = moment().subtract(1, 'days').format('YYYY-MM-DD'); //今天时间
    this.getEveryDayEnergy(id, beginTime, endTime);
    this.getEveryCharge(id, beginTime, endTime);
    this.getRunStatus(id, today);
    this.getEveryElectric(id, today);
  }
  //单台设备日能耗
  getEveryDayEnergy = (id, beginTime, endTime) => {
    $ajax({
      url: getEveryDayEnergy,
      data: {
        id: id,
        startDate: beginTime,
        endDate: endTime,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let list = value.data;
        console.log(list)
        list = (list || []).map((item) => ({
          time: moment(item.createTime).format('MM-DD'),
          free: item.freeConsumption+item.faultConsumption,
          run: item.runConsumption+item.preConsumption,
        }));
        this.setState({
          dayEnergy: list,
        });
      }
    });
  };
  dayEnergyOption() {
    const {dayEnergy} = this.state;
    let runEnergy = [],
      freeEnergy = [],
      time = [];
    if (dayEnergy.length != 0) {
        runEnergy = dayEnergy.map((item) => item.run);
        freeEnergy = dayEnergy.map((item) => item.free);
      time = dayEnergy.map((item) => item.time);
      // runEnergy = [23, 30, 45, 13, 99.76, 33];
      // freeEnergy = [13, 20, 15, 13, 49.66, 13];
    }
    return (option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        top: 30,
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: time,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '能耗(KWH)',
        },
      ],
      series: [
        {
          name: '工作能耗',
          type: 'bar',
          barWidth: '60%',
          data: runEnergy,
          barMaxWidth: 20,
          stack: '能耗',
          color: '#FDB659',
        },
        {
          name: '待机能耗',
          type: 'bar',
          barWidth: '60%',
          data: freeEnergy,
          barMaxWidth: 20,
          stack: '能耗',
          color: '#1C84C6',
        },
      ],
    });
  }
  //每日电费
  getEveryCharge = (id, beginTime, endTime) => {
    $ajax({
      url: getEveryCharge,
      data: {
        args: {
          id: id,
          startDate: beginTime,
          endDate: endTime,
        },
        pageNum: 1,
        pageSize: 999,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let {list} = value.data;
        list = (list || []).map((item) => ({
          time: moment(item.consumeDate).format('MM-DD'),
          highMoney: item.highMoney, //峰时
          avgMoney: item.avgMoney, //平时
          lowMoney: item.lowMoney, //谷时
          normalMoney:item.normalMoney,//通用
        }));
        this.setState({
          dayCharge: list,
        });
      }
    });
  };
  chargeOption() {
    const {dayCharge} = this.state;
    // alert(dayCharge.length)
    let highMoney = [],
      avgMoney = [],
      lowMoney = [],
      normalMoney=[],
      time = [];
    if (dayCharge.length != 0) {
        highMoney = dayCharge.map((item) => item.highMoney);
        avgMoney = dayCharge.map((item) => item.avgMoney);
        lowMoney = dayCharge.map((item) => item.lowMoney);
        normalMoney= dayCharge.map((item) => item.normalMoney)
      time = dayCharge.map((item) => item.time);
      // highMoney = [23, 30, 45, 13, 99.76, 33];
      // avgMoney = [13, 20, 15, 13, 49.66, 13];
      // lowMoney = [10, 24, 23, 67, 44, 12];
    }
    return (option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        top: 30,
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: time,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '电费(元)',
        },
      ],
      series: [
        {
          name: '峰时',
          type: 'bar',
          barWidth: '60%',
          data: highMoney,
          barMaxWidth: 20,
          stack: '电费',
          color: ' #1AB394',
        },
        {
          name: '平时',
          type: 'bar',
          barWidth: '60%',
          data: avgMoney,
          barMaxWidth: 20,
          stack: '电费',
          color: '#EF6A78',
        },
        {
          name: '谷时',
          type: 'bar',
          barWidth: '60%',
          data: lowMoney,
          barMaxWidth: 20,
          stack: '电费',
          color: '#1C84C6',
        },
        {
          name: '通用',
          type: 'bar',
          barWidth: '60%',
          data: normalMoney,
          barMaxWidth: 20,
          stack: '电费',
          color: '#61a0a8',
        },
        
      ],
    });
  }
  getRunStatus = (id, beginTime) => {
    $ajax({
      url: getRunStatus,
      data: {
        machineId: id,
        date: beginTime,
        flag: 1,
      },
      type: 'get',
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        this.setState({
          monitorProfileData: value.data.machineDrifts,
        });
      }
    });
  };
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
    let currentDate = this.state.beginTime;
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
 
  //单台设备电流
  getEveryElectric = (id, time) => {
    $ajax({
      url: getEveryElectric,
      data: {
        dateString: time,
        id: id,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let list = value.data;
        list = (list || []).map((item) => ({
          time: item.UTC_UPLINK,
          value: item.ELECTRIC_CURRENT,
        }));
        this.setState({
          electricData: list,
        });
      }
    });
  };
  electricOption() {
    const {electricData} = this.state;
    let time = (electricData || []).map((item) =>
      moment(item.time).format('HH:mm:ss'),
    );
    let data = (electricData || []).map((item) => item.value);
    return (option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'line', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        top: 30,
        left: '2%',
        right: '3%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: {
        name: '时间', // 横轴名称
        nameTextStyle: {
          // 名称样式
          fontSize: 12,
          color: '#333333',
          fontWeight: 'bold',
        },
        nameGap: 25,
        nameLocation: 'middle',
        type: 'category',
        data: time,
        // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        name: '电流(A)',
        nameTextStyle: {
          fontSize: 12,
          color: '#333333',
          fontWeight: 'bold',
        },
        nameGap: 15,
        nameLocation: 'end',
        type: 'value',
        // axisLabel:{
        //   formatter:`{value}%`
        // }
      },
      lineStyle: {
        color: 'green',
      },
      series: [
        {
          name: '电流',
          data: data,
          // [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
        },
      ],
    });
  }
  componentWillUnmount() {
    this.refs.month.hide();
  }
  onChangeTab(e) {
    const {id, sequence, isBender} = this.props.route.params;
    this.setState({
      curTabIndex: e,
    });
    let beginTime = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
    let endTime = moment().format('YYYY-MM-DD 23:59:59');
    if (e == 1) {
      this.getEveryDayEnergy(id, beginTime, endTime);
      this.getEveryCharge(id, beginTime, endTime);
    }
  }
  monthSelect = (value, index) => {
    const {id, sequence, isBender} = this.props.route.params;
    // alert(this.state.curTabIndex)
    let begin = moment(value[0]).startOf('month').format('YYYY-MM-DD');
    let end = moment(value[0]).endOf('month').format('YYYY-MM-DD')>moment().format('YYYY-MM-DD')?moment().format('YYYY-MM-DD'):moment(value[0]).endOf('month').format('YYYY-MM-DD');
    this.getEveryDayEnergy(id, begin, end);
    this.getEveryCharge(id, begin, end);
    this.setState({
      monthSelected: value,
    });
  };
  selectTime = (e) => {
    const {id} = this.props.route.params;
    this.setState(
      {
        beginTime: e,
      },
      () => {
        this.getRunStatus(id, e);
        this.getEveryElectric(id, e);
      },
    );
  };
  render() {
    let {dayEnergy, curTabIndex, monthSelected} = this.state;
    const {id, sequence, deviceTypeId, firm} = this.props.route.params;
    return (
      <>
        <UiHeader
          title="能耗详情"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />
        <View
          style={{
            height: 46,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
          }}>
          <Text style={{fontSize: 15}}>当前设备：{sequence}</Text>

        </View>
        {isYWAdmin() && (
          <View
            style={{
              height: 46,
              paddingHorizontal: 12,
              flexDirection: 'row',
              alignItems: 'center',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fff',
            }}>
            <Text style={{fontSize: 15}}>企业名称：{firm}</Text>
          </View>
        )}
        <View
          style={[
            ss.title,
            {
              backgroundColor: '#fff',
              borderTopWidth: 0.5,
              borderTopColor: '#eee',
            },
          ]}>
          <Text style={[ss.titleTxt]}>日期</Text>

          <View style={[ss.titleMain]}>
            <TouchableOpacity
              style={[
                ss.dayItem,
                curTabIndex == 1
                  ? {backgroundColor: '#e6effe'}
                  : {backgroundColor: '#fff'},
              ]}
              onPress={() => {
                this.refs.month.hide();
                this.onChangeTab(1);
              }}>
              <Text
                style={{
                  color: curTabIndex == 1 ? $myTheme.mainBlue : '#333',
                }}>
                近7天
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                ss.dayItem,
                curTabIndex == 2
                  ? {backgroundColor: '#e6effe'}
                  : {backgroundColor: '#fff'},
              ]}
              onPress={() => {
                this.refs.month.show();
                // this.setState({
                //   visable:true
                // })
                this.onChangeTab(2);
              }}>
              <Text
                style={{
                  color: curTabIndex == 2 ? $myTheme.mainBlue : '#333',
                }}>
                {monthSelected && curTabIndex == 2 ? monthSelected : '按月'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={{
            backgroundColor: $myTheme.mainBgGray,
            marginBottom:10
            // display: currentIndex ? 'flex' : 'none',
          }}
          ref={(r) => (this.scrollview = r)}>
          <UiPicker
            ref="month"
            datas={monthList}
            // hideModal={()=>this.setState}
            onConfirm={(_value, _index) => this.monthSelect(_value, _index)}
          />
          <UiDateTimePicker
          min="2020 "
          ref="dateTimeRef"
          currentDate={this.state.beginTime}
          onComfirm={(e) => this.selectTime(e)}
        />
          <EchartsView
            title="能耗数据"
            option={this.dayEnergyOption()}
            length={this.state.dayEnergy.length}
            tooltip={[
              {color: '#FDB659', mode: 'rect', text: '工作能耗'},
              {color: '#1C84C6', mode: 'rect', text: '待机能耗'},
            ]}
          />
          <EchartsView
            title="电费数据"
            option={this.chargeOption()}
            length={this.state.dayCharge.length}
            tooltip={[
              {color: '#1AB394', mode: 'rect', text: '峰时'},
              {color: '#EF6A78', mode: 'rect', text: '平时'},
              {color: '#1C84C6', mode: 'rect', text: '谷时'},
              {color: '#61a0a8', mode: 'rect', text: '通用'},
            ]}
          />
          <EchartsView
            title="机床状态与电流信息"
            option={this.profileOption()}
            length={this.state.monitorProfileData.length}
            right={   
            <View style={[ss.titleMain]}>
            <TouchableOpacity
              style={[ss.dayItem]}
              onPress={() => {
                this.refs.dateTimeRef.show();
              }}>
              <Text
                style={{
                  color: '#1c83c6',
                  textAlign:'center',
                }}>
                {this.state.beginTime ? this.state.beginTime : '请选择时间'}
                <IconFont icon={'\ue621'} size={16} color="#1c83c6" />
              </Text>
            </TouchableOpacity>
          </View>}
          />
          {this.state.electricData.length!=0&&(<EchartsView
            // title="电流信息"
            option={this.electricOption()}
            length={this.state.electricData.length}
            
          />)}
        </ScrollView>
      </>
    );
  }
}

let ss = StyleSheet.create({
  title: {
    flexDirection: 'row',
    height: 46,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  titleTxt: {fontSize: 16},
  titleMain: {flexDirection: 'row', flex: 1, justifyContent: 'flex-end'},
  mainBox: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: '#fff',
    paddingLeft: 12,
  },
  dayItem: {
    padding: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginLeft: 10,
  },
  titleMore: {color: $myTheme.mainBlue},
  ball: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ed5565',
    marginRight: 10,
    borderRadius: 15,
    marginVertical: 10,
  },
  ballRow: {flexDirection: 'row', alignItems: 'center'},
  ballNum: {fontSize: 15, color: '#fff', fontWeight: 'bold'},
  ballTxt: {fontSize: 15},
  dayItemActive: {backgroundColor: 'red'},
});
