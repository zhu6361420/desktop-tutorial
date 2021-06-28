import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import {UiHeader, EchartsView, UiPicker} from '../../../global.components';
import {$myTheme, $fns, $source, $ui, $ajax, api} from '../../../global.utils';
import {Echarts, echarts} from 'react-native-secharts';
import moment from 'moment';
import {
  getMachineStatus,
  getMachineStatusColor,
  floatToTime,
  prefixZero,
  monthlist,
  // machineStatus
} from '../../../utils/data';
const machineStatus = [
  {status: 2, name: '故障'},
  {status: 0, name: '空闲'},
  {status: 1, name: '运行'},
  {status: 4, name: '准备'},
];
const monthList = monthlist();
const {
  getDeviceAndFirmInEnergyApp,
  getMachineEnergeList,
  getFirmEneryTop,
  getEveryMonthElectric,
  getDeviceTypeConsume,
  getEnergyByYear,
  getNumberType,
  getRunStatus,
  getEveryElectric,
} = api;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      machineNum: 0, //设备接入数
      firmNum: 0, //公司接入数
      topDevice: [], //设备能耗排行，sequence:设备编号，power:值
      topFirm: [], //公司能耗排行，Firmname:公司名，power:值
      DeviceTypeData: [], //设备类型平均能效 powerOfTime
      monthElectric: [], //近半年能耗值 time,value
      monthAverage: 0, //近半年能耗平均值
      yearElectric: [], //近三年能耗
      eletricType: [], //阶梯，通用，未配置
      monitorProfileData: [],
      curTabIndex: 1,
      monthSelected: moment().format('YYYY-MM'),
      monthBegin:moment().startOf('months').format('YYYY-MM-DD'),
      monthEnd: moment().endOf('months').format('YYYY-MM-DD')
    };
  }
  componentDidMount() {
    const{monthBegin,monthEnd}=this.state;
    this.getDeviceAndFirmInEnergyApp();
    this.getMachineEnergeList(monthBegin, monthEnd);
    this.getFirmEneryTop(monthBegin, monthEnd);
    this.getDeviceTypeConsume();
    this.getEveryMonthElectric();
    this.getEnergyByYear();
    this.getNumberType();
    // this.getRunStatus(2,'2021-03-16')
    // this.getEveryElectric(20381,'2021-03-16')
    // this.getFirmEnergyDetail()
  }
  //接入设备和公司数目
  getDeviceAndFirmInEnergyApp = () => {
    $ajax({
      url: getDeviceAndFirmInEnergyApp,
      data: {},
      _this: this,
      hasLoading: false,
    }).then((value) => {
      if (value.code == 200) {
        this.setState({
          machineNum: value.data.machineNum,
          firmNum: value.data.appNum,
        });
      }
    });
  };

  //能耗列表和设备能耗前三名排行
  getMachineEnergeList = (start, end) => {
    $ajax({
      url: getMachineEnergeList,
      data: {
        args: {
          start: start,
          end: end,
        },
        pageNum: 1,
        pageSize: 3,
      },
      _this: this,
      hasLoading: false,
    }).then((value) => {
      if (value.code == 200) {
        let {list} = value.data;
        // console.log(list)
        let topDevice = (list || []).map((item) => ({
          sequence: item.sequence,
          power: item.power,
        }));
        this.setState({
          topDevice: topDevice,
        });
      }
    });
  };
  //公司能耗排行
  getFirmEneryTop = (start, end) => {
    $ajax({
      url: getFirmEneryTop,
      data: {
        args: {
          start: start,
          end: end,
        },
        pageNum: 1,
        pageSize: 3,
      },
      _this: this,
      hasLoading: false,
    }).then((value) => {
      // alert(value.code)
      if (value.code == 200) {
        let {list} = value.data;
        console.log(list)
        this.setState({
          topFirm: list,
        });
      }
    });
  };
  //设备类型平均能效
  getDeviceTypeConsume = () => {
    $ajax({
      url: getDeviceTypeConsume,
      data: {
        root: 0,
        //  deviceTypeId:204,
      },
      _this: this,
      hasLoading: false,
    }).then((value) => {
      if (value.code == 200) {
        let {result} = value.data;
        let DeviceTypeData = (result || []).map((item) => ({
          deviceName: item.deviceName,
          powerOfTime: item.powerOfTime,
        }));
        this.setState({
          DeviceTypeData: DeviceTypeData,
        });
      }
    });
  };
  TypeConsumeOption() {
    const {DeviceTypeData} = this.state;

    let data = DeviceTypeData.map((item) => item.powerOfTime.toFixed(2));
    let max = Math.max(...data) + 5;
    let name = DeviceTypeData.map((item) => ({
      name: item.deviceName,
      max: max,
    }));
    return (option = {
      tooltip: {
        position: 'inside',
        // formatter:function(name){
        //   return name.value
        // }
      },
      radar: {
        //shape: 'circle',
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5],
          },
        },
        center: ['50%', '60%'],
        radius: 65,
        splitNumber: 4,
        indicator: name,
        // [
        //   {name: '销售', max: 50},
        //   {name: '管理', max: 50},
        //   {name: '信息技术', max: 50},
        //   {name: '客服', max: 50},
        //   {name: '研发', max: 50},
        // ],
      },
      series: [
        {
          name: '设备类型平均能效',
          type: 'radar',
          areaStyle: {
            normal: {
              color: '#4a90f2',
            },
          },
          data: [
            {
              value: data,
            },
          ],
          label: {
            show: false,
            color: '#4a90f2',
            formatter: '{c}%',
          },
          itemStyle: {
            color: '#4a90f2',
          },
        },
      ],
    });
  }
  //近6月能耗(传firmId查公司)
  getEveryMonthElectric = () => {
    $ajax({
      url: getEveryMonthElectric,
      data: {
        startDate: moment()
          .subtract(5, 'months')
          .startOf('month')
          .format('YYYY-MM-DD 00:00:00'),
        endDate: moment().format('YYYY-MM-01 00:00:00'),
      },
      _this: this,
      hasLoading: false,
    }).then((value) => {
      if (value.code == 200) {
        let datas = JSON.parse(value.data);
        const {result} = datas;
        console.log(result)
        console.log( moment()
        .subtract(5, 'months')
        .startOf('month')
        .format('YYYY-MM-DD 00:00:00'))
        console.log(moment().format('YYYY-MM-01 00:00:00'))
        let energyList = [];
        let currentMonthEnergy = {};
        if (result.length != 0) {
          for (let i = 0; i < result.length; i++) {
            let single = {
              time: moment(result[i].countTime).format('MM'),
              value: result[i].electricCurrent.toFixed(2), //总能耗
              freeConsumption: (
                result[i].freeConsumption + result[i].faultConsumption
              ).toFixed(2), //待机能耗
              runConsumption: (
                result[i].runConsumption + result[i].preConsumption
              ).toFixed(2), //工作能耗
              rate:
                i < 1
                  ? 0
                  : result[i - 1].electricCurrent != 0
                  ? (
                      ((result[i].electricCurrent -
                        result[i - 1].electricCurrent) /
                        result[i - 1].electricCurrent) *
                      100
                    ).toFixed(2)
                  : 0,
            };
            energyList.push(single);
          }
          currentMonthEnergy = energyList[energyList.length - 1];
        }
        this.setState({
          monthElectric: energyList,
          currentMonthEnergy: currentMonthEnergy,
        });
      }
    });
  };
  getEneryMonthOption() {
    const {monthElectric} = this.state;
    let runEnergy = [],
      freeEnergy = [],
      rate = [],
      time = [];
    if (monthElectric.length != 0) {
      runEnergy = monthElectric.map((item) => item.runConsumption);
      freeEnergy = monthElectric.map((item) => item.freeConsumption);
      rate = monthElectric.map((item) => item.rate);

      time = monthElectric.map((item) => item.time);
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
        {
          type: 'value',
          name: '环比(%)',
        },
      ],
      series: [
        {
          name: '工作能耗',
          type: 'bar',
          // barWidth: '60%',
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
        {
          name: '环比',
          type: 'line',
          lineStyle: {
            type: 'dotted',
          },
          yAxisIndex: 1,
          color: '#EF6A78',
          data: rate,
        },
      ],
    });
  }
  //近三年能耗
  getEnergyByYear = () => {
    $ajax({
      url: getEnergyByYear,
      data: {},
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let datas = JSON.parse(value.data);
        const {result} = datas;
        let energyList = [];
        if (result.length != 0) {
          energyList = result.map((item) => ({
            time: moment(item.countTime).format('YYYY'),
            value: item.electricCurrent.toFixed(2),
          }));
        }
        this.setState({
          yearElectric: energyList.reverse(),
        });
      }
    });
  };
  getEneryYearOption() {
    const {yearElectric, MonthElectric, curTabIndexs} = this.state;
    let data = [],
      times = [];

    if (yearElectric.length != 0) {
      data = yearElectric.map((item) => item.value);
      times = yearElectric.map((item) => item.time);
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
          data: times,
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
          name: '能耗值',
          type: 'bar',
          barWidth: '60%',
          data: data,
          markLine: {
            symbol: 'none',
            label: {
              show: true,
              normal: {
                formatter: (data) => {
                  if (data.value == 0) {
                    return '';
                  }
                  return data.value;
                },
                position: 'middle', // 这儿设置安全基线
                // color:'#EF6A78'
              },
              distance: 50,
            },
            lineStyle: {
              normal: {
                color: '#EF6A78', // 这儿设置安全基线颜色
              },
            },
            data: [{type: 'average'}],
          },
          barMaxWidth: 20,
          label: {
            show: true,

            position: 'top',
            textStyle: {
              color: '#aaafb3',
            },
          },
        },
      ],
    });
  }
  //电价配置分布
  getNumberType = () => {
    $ajax({
      url: getNumberType,
      data: {},
      _this: this,
      hasLoading: false,
    }).then((value) => {
      if (value.code == 200) {
        let {divideType, normalType, nullType} = value.data;
        let eletricType = [
          {name: '通用电价', value: normalType, itemStyle: {color: '#1C84C6'}},
          {name: '阶梯电价', value: divideType, itemStyle: {color: '#1AB394'}},
          {name: '未配电价', value: nullType, itemStyle: {color: '#EF6A78'}},
        ];
        this.setState({
          eletricType: eletricType,
        });
      }
    });
  };
  NumberTypeOption() {
    const {eletricType} = this.state;
    // let name = (machineStatus || []).map((item) => item.name);
    let option = {};
    option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}个',
      },
      series: [
        {
          name: '电价配置分布',
          type: 'pie',
          radius: '65%',
          center: ['50%', '45%'],
          // hoverOffset:5,
          data: eletricType,
          roseType: false,
          legendHoverLink: false,
          avoidLabelOverlap: true,
          label: {
            show: true,
            formatter: function (name) {
              return (
                '{d|' +
                name.value +
                '}{b|' +
                '个' +
                name.name.substring(0, 2) +
                '}'
              );
            },
            rich: {
              b: {
                fontSize: 10,
                color: '#b2b2b2',
              },
              d: {
                fontSize: 16,
              },
              p: {
                fontSize: 10,
              },
            },
          },
          labelLine: {
            length: 2,
            show: true,
            lineStyle: {
              color: '#b2b2b2',
            },
          },
          // emphasis: {
          //   itemStyle: {
          //     show:true,
          //     shadowBlur: 10,
          //     shadowOffsetX: 0,
          //     shadowColor: 'rgba(0, 0, 0, 0.5)',
          //   },
          // },
          animation: true,
          animationType: 'scale',
          animationEasing: 'elasticOut',
        },
      ],
    };
    return option;
  }
  //机床状态
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
    let currentDate = moment().format('YYYY-MM-DD');
    // let currentDate = this.state.errDate;
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
            var height = api.size([0, 1])[1] * 0.28;
            // alert(start[1] - height / 2)
            let targetRect = {
              x: start[0],
              y: 200,
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

  onChangeTab(e) {
    this.setState({
      curTabIndex: e,
    });
    if (e == 2) {
      let begin = moment().startOf('years').format('YYYY-MM-DD');
      let end = moment().endOf('years').format('YYYY-MM-DD');
      this.getFirmEneryTop(begin, end);
      this.getMachineEnergeList(begin, end);
    }
  }
  monthSelect = (value, index) => {
    let begin = moment(value[0]).startOf('month').format('YYYY-MM-DD');
    let end = moment(value[0]).endOf('month').format('YYYY-MM-DD');
    this.getFirmEneryTop(begin, end);
    this.getMachineEnergeList(begin, end);
    this.setState({
      monthSelected: value,
      // monthIndex: index,
      monthBegin: begin,
      monthEnd: end,
    });
  };
  render() {
    const {
      machineNum,
      firmNum,
      topDevice,
      DeviceTypeData,
      topFirm,
      monthElectric,
      yearElectric,
      eletricType,
      curTabIndex,
      monthSelected,
      monthEnd,
      monthBegin
    } = this.state;
    // console.log(topDevice)
    return (
      <>
        <UiHeader
          title="能耗管理"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'navigate',
              routeName: 'tabPages',
            });
          }}
        />
        <UiPicker
          ref="month"
          datas={monthList}
          // hideModal={()=>this.setState}
          onConfirm={(_value, _index) => this.monthSelect(_value, _index)}
        />
        <ScrollView style={{flex: 1}} bounces={false}>
          <ImageBackground
            source={require('../../../assets/imgs/bg.png')}
            style={{
              width: '100%',
              height: 300,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 140,
                height: 140,
                padding: 10,
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,187,255,0.4)',
              }}>
              <Text style={{fontSize: 16, color: '#fff'}}>{firmNum}</Text>
              <Text style={{fontSize: 12, color: '#fff', marginVertical: 5}}>
                企业接入数
              </Text>
              <View
                style={{
                  width: '100%',
                  height: 2,
                  backgroundColor: '#fff',
                  marginBottom: 5,
                }}></View>
              <Text style={{color: '#fff', fontSize: 16}}>{machineNum}</Text>
              <Text style={{color: '#fff', fontSize: 12, marginTop: 5}}>
                机床接入数
              </Text>
            </View>
          </ImageBackground>

          <View style={{marginHorizontal: 12, marginTop: -30, marginBottom: 0}}>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                alignItems: 'center',
                backgroundColor: '#c8eeff',
                paddingHorizontal: 10,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              }}>
              <Text>企业能耗TOP3</Text>

              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={[
                    ss.dayItem,
                    curTabIndex == 1
                      ? {backgroundColor: '#e6effe'}
                      : {backgroundColor: '#c8eeff'},
                  ]}
                  onPress={() => {
                    this.refs.month.show();
                    // this.setState({
                    //   visable:true
                    // })
                    this.onChangeTab(1);
                  }}>
                  <Text
                    style={{
                      color: curTabIndex == 1 ? $myTheme.mainBlue : '#333',
                    }}>
                    {monthSelected && curTabIndex == 1 ? monthSelected : '按月'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[
                  ss.dayItem,
                  curTabIndex == 2
                    ? {backgroundColor: '#e6effe'}
                    : {backgroundColor: '#c8eeff'},
                ]}
                  onPress={() => {
                    this.onChangeTab(2);
                  }}>
                  <Text style={{paddingHorizontal: 2,color: curTabIndex == 2 ? $myTheme.mainBlue : '#333',}}>按年</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:10}}
                onPress={()=>{
                  $fns.route({
                    context: this,
                    type: 'navigate',
                    routeName: 'energe_extra',
                    params:{
                      curTabIndex:curTabIndex,
                      monthBegin:monthBegin,
                      monthEnd:monthEnd
                    }
                  });
                }}>
                  <Text style={{color: '#0086c6'}}>更多</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{padding: 10}}>
              {topFirm.length != 0 ? (
                topFirm.map((item,index) => (
                  <View style={ss.itemRow} key={index}>
                    <Image
                      source={require('../../../assets/imgs/Vector.png')}
                      style={{width: 20, height: 20}}
                    />
                    <View style={{flex: 1, paddingLeft: 6}}>
                      <Text style={{color: '#0086c6', fontSize: 14}}>
                        {item.name}
                      </Text>
                    </View>
                    <Text style={{color: '#444'}}>{item.power}KWH</Text>
                  </View>
                ))
              ) : (
                <View>
                  <Text style={{textAlign: 'center'}}>暂无企业能耗信息</Text>
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                height: 40,
                alignItems: 'center',
                // backgroundColor: '#fff',
                paddingHorizontal: 10,
              }}>
              <Text>设备能耗TOP3</Text>
            </View>
            <View style={{padding: 10, paddingBottom: 0}}>
              {topDevice.length != 0 ? (
                topDevice.map((item,index) => (
                  <View style={ss.itemRow} key={index}>
                    <Image
                      source={require('../../../assets/imgs/3.png')}
                      style={{width: 20, height: 20}}
                    />
                    <View style={{flex: 1, paddingLeft: 6}}>
                      <Text style={{color: '#0086c6', fontSize: 14}}>
                        {item.sequence}
                      </Text>
                    </View>
                    <Text style={{color: '#444'}}>{item.power}KWH</Text>
                  </View>
                ))
              ) : (
                <View>
                  <Text style={{textAlign: 'center'}}>暂无设备能耗信息</Text>
                </View>
              )}
            </View>
          </View>
          <View style={{padding: 12}}>
            <EchartsView
              title="设备类型平均能效(单位:KW)"
              option={this.TypeConsumeOption()}
              length={DeviceTypeData.length}
            />
            <EchartsView
              title={ '近6月能耗对比' }
              option={
               this.getEneryMonthOption()  
              }
              length={
               monthElectric.length
              }
              tooltip={
                 [
                      {color: '#FDB659', mode: 'rect', text: '工作能耗'},
                      {color: '#1C84C6', mode: 'rect', text: '待机能耗'},
                      {color: '#EF6A78', mode: 'line', text: '环比'},
                    ]
                  
              }
         
            />
            <EchartsView
              title="近3年能耗汇总"
              option={this.getEneryYearOption()}
              length={yearElectric.length}
              tooltip={[
                {color: '#1C84C6', mode: 'rect', text: '年能耗'},
                {color: '#EF6A78', mode: 'line', text: '平均值'},
              ]}
            />
            <EchartsView
              title="电价配置分布"
              option={this.NumberTypeOption()}
              length={eletricType.length}
              tooltip={[
                {color: '#1AB394', mode: 'circle', text: '阶梯电价'},
                {color: '#1C84C6', mode: 'circle', text: '通用电价'},
                {color: '#EF6A78', mode: 'circle', text: '未配电价'},
              ]}
            />
          </View>
        </ScrollView>
      </>
    );
  }
}
let ss = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  flexItem: {flexDirection: 'row', alignItems: 'center'},
  dayItem:{
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    borderRadius: 3,
    height: 24,
    justifyContent: 'center',
  }
});
