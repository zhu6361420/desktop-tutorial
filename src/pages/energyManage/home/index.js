import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import {
  UiHeader,
  UiPicker,
  UiGap,
  EchartsView,
  RightExtra,
  ApplicationIcon,
  IconFont,
} from '../../../global.components';
import {$myTheme, $fns, $source, $ui, $ajax, api} from '../../../global.utils';
import {Echarts, echarts} from 'react-native-secharts';
import moment from 'moment';
import {
  twoFixed,
  monthlist,
  // machineStatus
} from '../../../utils/data';
const monthList = monthlist();
const machineStatus = [
  {status: 2, name: '故障'},
  {status: 0, name: '空闲'},
  {status: 1, name: '运行'},
  {status: 4, name: '准备'},
];
const {
  getMachineEnergeList,
  getEveryMonthElectric,
  //-----企管总览-----------
  getFirmEnergyDetail,
  getConsumeMonth,
  getEnergyByYear,
  getConsumeYear,
} = api;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    let data = JSON.parse(sto.getValue('loginData'));
    let firmId = data.userData.firmId;
    this.state = {
      topDevice: [], //设备能耗排行，sequence:设备编号，power:值
      monthElectric: [], //近半年能耗值 time,value
      monthAverage: 0, //近半年能耗平均值
      electricData: [], //电流值 time,value
      currentMonthEnergy: {}, //当月能耗
      singleData: {}, //单月电费详情
      yearElectric: [], //近三年能耗
      priceMonth: [], //近6月电费
      priceYear: [], //近3年电费
      days: 0,
      curTabIndex: 1,
      yearCurTabIndex: 1,
      curTabIndexss: 1,
      monthSelected: moment().format('YYYY-MM'),
      monthBegin: moment().startOf('months').format('YYYY-MM-DD'),
      monthEnd: moment().endOf('months').format('YYYY-MM-DD'),
      firmId:firmId
    };
  }
  componentDidMount() {
    const {monthBegin, monthEnd} = this.state;
    20;
    this.getMachineEnergeList(monthBegin, monthEnd); //firm公司id
    this.getEveryMonthElectric();
    this.getEnergyByYear();
    this.getFirmEnergyDetail();
    this.getSingleMonth(monthBegin, monthEnd);
    this.getPriceMonth();
    this.getConsumeYear();
  }
  //企业接入天数
  getFirmEnergyDetail = () => {
    $ajax({
      url: getFirmEnergyDetail,
      data: {},
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let {days} = value.data;
        this.setState({
          days: days,
        });
      }
    });
  };
  //近6月能耗、当月能耗、环比
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
  //能耗列表和设备能耗前三名排行
  getMachineEnergeList = (start, end) => {
    let data = JSON.parse(sto.getValue('loginData'));
    let firmId = data.userData.firmId;
    $ajax({
      url: getMachineEnergeList,
      data: {
        args: {
          start: start,
          end: end,
          firm: firmId,
        },
        pageNum: 1,
        pageSize: 3,
      },
      _this: this,
      hasLoading: false,
    }).then((value) => {
      if (value.code == 200) {
        let {list} = value.data;
        console.log(list)
        this.setState({
          topDevice: list,
        });
      }
    });
  };
  //月电费统计、能耗详情(同比、环比)
  getSingleMonth = (start, end) => {
    let data = JSON.parse(sto.getValue('loginData'));
    let firmId = data.userData.firmId;
    $ajax({
      url: getConsumeMonth,
      data: {
        args: {
          startDate: start,
          endDate: end,
          // id:null
          firmId: firmId,
        },
        pageNum: 1,
        pageSize: 3,
      },
      _this: this,
      hasLoading: false,
    }).then((value) => {
      if (value.code == 200) {
        let {list} = value.data;
        let singleData = {};
        if (list.length != 0) {
          singleData = {
            highMoney: list[0].highMoney, //高峰
            lowMoney: list[0].lowMoney, //低峰
            avgMoney: list[0].avgMoney, //平时
            normalMoney: list[0].normalMoney,
            normalPower: list[0].normalPower,
            highPower: list[0].highPower,
            lowPower: list[0].lowPower,
            avgPower: list[0].avgPower,
            price: list[0].price, //总支出
            power: list[0].power,
            monthOnMonthBasisMoney: twoFixed(list[0].monthOnMonthBasisMoney)?twoFixed(list[0].monthOnMonthBasisMoney):0, //环比电费比例
            basisMoney: list[0].basisMoney?list[0].basisMoney:0, //环比电费差值
            monthOnMonthBasisPower: twoFixed(list[0].monthOnMonthBasisPower)?twoFixed(list[0].monthOnMonthBasisPower):0, //环比能耗比例
            basisPower: list[0].basisPower?list[0].basisPower:0, //环比能耗差值
            monthOnMonthRadioMoney: twoFixed(list[0].monthOnMonthRadioMoney)? twoFixed(list[0].monthOnMonthRadioMoney):0, //同比电费比例
            radioMoney: list[0].radioMoney?list[0].radioMoney:0, //同比电费差值
            monthOnMonthRadioPower: twoFixed(list[0].monthOnMonthRadioPower)?twoFixed(list[0].monthOnMonthRadioPower):0, //同比能耗比例
            radioPower: list[0].radioPower?list[0].radioPower:0, //同比能耗差值
          };
        }
        this.setState({
          singleData: singleData,
        });
      }
    });
  };
  //近三年能耗
  getEnergyByYear = () => {
    $ajax({
      url: getEnergyByYear,
      data: {},
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let datas = JSON.parse(value.data);
        let {result} = datas;
        let energyList = [];
        result = result.reverse();
        // alert(((result[1].electricCurrent -
        //   result[0].electricCurrent) /
        //   result[0].electricCurrent) *
        // 100)
        if (result.length != 0) {
          for (let i = 0; i < result.length; i++) {
            let single = {
              time: moment(result[i].countTime).format('YYYY'),
              value: result[i].electricCurrent.toFixed(2), //总能耗
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
        }
        this.setState({
          yearElectric: energyList,
        });
      }
    });
  };
  getEneryYearOption() {
    const {yearElectric} = this.state;
    let data = [],
      rate = [],
      time = [];
    if (yearElectric.length != 0) {
      rate = yearElectric.map((item) => item.rate);
      data = yearElectric.map((item) => item.value);
      time = yearElectric.map((item) => item.time);
    }

    return (option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'line', // 默认为直线，可选为：'line' | 'shadow'
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
          name: '年能耗',
          type: 'bar',
          barWidth: '60%',
          data: data,
          barMaxWidth: 20,
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
  //近6月电费
  getPriceMonth = () => {
    let data = JSON.parse(sto.getValue('loginData'));
    let firmId = data.userData.firmId;
    $ajax({
      url: getConsumeMonth,
      data: {
        args: {
          startDate: moment()
            .subtract(5, 'months')
            .startOf('month')
            .format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-01'),
          firmId: firmId,
        },
        pageNum: 1,
        pageSize: 6,
      },
      _this: this,
      hasLoading: false,
    }).then((value) => {
      if (value.code == 200) {
        let {list} = value.data;
        let col = (list || []).map((item) => ({
          highMoney: item.highMoney, //高峰
          lowMoney: item.lowMoney, //低峰
          avgMoney: item.avgMoney, //平时
          normalMoney: item.normalMoney, //通用
          time: moment(item.consumeDate).format('MM'),
          monthOnMonthBasisMoney: twoFixed(item.monthOnMonthBasisMoney), //环比电费比例
        }));
        this.setState({
          priceMonth: col,
        });
      }
    });
  };
  chargeOption() {
    const {priceMonth} = this.state;
    let highMoney = [],
      avgMoney = [],
      lowMoney = [],
      normalMoney = [],
      time = [],
      rate = [];
    if (priceMonth.length != 0) {
      highMoney = priceMonth.map((item) => item.highMoney);
      avgMoney = priceMonth.map((item) => item.avgMoney);
      lowMoney = priceMonth.map((item) => item.lowMoney);
      normalMoney = priceMonth.map((item) => item.normalMoney);
      rate = priceMonth.map((item) => item.monthOnMonthBasisMoney);
      time = priceMonth.map((item) => item.time);
      // highMoney = [23, 30, 45, 13, 99.76, 33];
      // normalMoney = [13, 20, 15, 13, 49.66, 13];
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
        {
          type: 'value',
          name: '环比(%)',
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
  //近3年电费
  getConsumeYear = () => {
    let data = JSON.parse(sto.getValue('loginData'));
    let firmId = data.userData.firmId;
    $ajax({
      url: getConsumeYear,
      data: {
        args: {
          startDate: moment()
            .subtract(2, 'years')
            .startOf('years')
            .format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-01'),
          firmId: firmId,
        },
        pageNum: 1,
        pageSize: 3,
      },
      _this: this,
      hasLoading: false,
    }).then((value) => {
      if (value.code == 200) {
        let {result} = value.data;
        let col = (result || []).map((item) => ({
          time: moment(item.consumeDate).format('YYYY'),
          price: item.price,
          monthOnMonthBasisMoney: twoFixed(item.monthOnMonthBasisMoney), //环比电费比例
        }));
        this.setState({
          priceYear: col.reverse(),
        });
      }
    });
  };
  getYearChargrOption() {
    const {priceYear} = this.state;
    let price = [],
      time = [],
      rate = [];
    if (priceYear.length != 0) {
      price = priceYear.map((item) => item.price);
      rate = priceYear.map((item) => item.monthOnMonthBasisMoney);
      time = priceYear.map((item) => item.time);
      // highMoney = [23, 30, 45, 13, 99.76, 33];
      // normalMoney = [13, 20, 15, 13, 49.66, 13];
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
        {
          type: 'value',
          name: '环比(%)',
        },
      ],
      series: [
        {
          name: '年能耗',
          type: 'bar',
          barWidth: '60%',
          data: price,
          barMaxWidth: 20,
          color: ' #1AB394',
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
  onChangeTab(e) {
    // const {id, sequence, isBender} = this.props.route.params;
    // this.getPriceMonth('1');
    if (e == 1) {
      this.setState({
        priceMonth: [],
        curTabIndex: e,
      });
      this.getEveryMonthElectric();
    } else {
      this.setState({
        curTabIndex: e,
        monthElectric: [],
      });
      this.getPriceMonth();
    }

    // let beginTime = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
    // let endTime = moment().format('YYYY-MM-DD 23:59:59');
    // if (e == 1) {
    //   this.getEveryDayEnergy(id, beginTime, endTime);
    //   this.getEveryCharge(id, beginTime, endTime);
    // }
  }
  onChangeTabs(e) {
    // const {id, sequence, isBender} = this.props.route.params;
    this.setState({
      yearCurTabIndex: e,
    });
  }
  onChangeTabss(e) {
    this.setState({
      curTabIndexss: e,
    });
    if (e == 2) {
      let begin = moment().startOf('years').format('YYYY-MM-DD');
      let end = moment().endOf('years').format('YYYY-MM-DD');
      // this.getFirmEneryTop(begin, end);
      this.getMachineEnergeList(begin, end);
    }
  }
  monthSelect = (value, index) => {
    let begin = moment(value[0]).startOf('month').format('YYYY-MM-DD');
    let end = moment(value[0]).endOf('month').format('YYYY-MM-DD');
    // this.getFirmEneryTop(begin, end);
    this.getMachineEnergeList(begin, end);
    this.getSingleMonth(begin, end);
    this.setState({
      monthSelected: value,
      // monthIndex: index,
      monthBegin: begin,
      monthEnd: end,
    });
  };
  chargeCensusOption() {
    const {singleData} = this.state;
    let {highMoney, lowMoney, avgMoney, normalMoney} = singleData;
    let machine_status = [
      {
        name: '峰时',
        value: highMoney,
        itemStyle: {color: '#1AB394'},
      },
      {
        name: '平时',
        value: avgMoney,
        itemStyle: {color: '#EF6A78'},
      },
      {
        name: '谷时',
        value: lowMoney,
        itemStyle: {color: '#1C84C6'},
      },
      {
        name: '通用',
        value: normalMoney,
        itemStyle: {color: '#61a0a8'},
      },
    ];
    let option = {};
    option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : ({d}%)',
        // formatter: function (name) {
        //   return (
        //     name.name
        //   );
        // },
      },
      graphic: {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text:
            '共' + (highMoney + lowMoney + avgMoney + normalMoney).toFixed(2),
          textAlign: 'center',
          fill: '#000000',
          width: 190,
          height: 180,
          fontSize: 15,
        },
      },
      series: [
        {
          name: '电费统计',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          // hoverOffset:5,
          data: machine_status,
          roseType: false,
          legendHoverLink: false,
          avoidLabelOverlap: true,
          label: {
            show: true,
            formatter: function (name) {
              return (
                '{d|' + name.value + '}{b|' + name.name.substring(0, 2) + '}'
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
          animation: true,
          animationType: 'scale',
          animationEasing: 'elasticOut',
        },
      ],
    };
    return option;
  }
  render() {
    const {
      machineNum,
      firmNum,
      topDevice,
      DeviceTypeData,
      monthElectric,
      yearAverage,
      yearElectric,
      eletricType,
      dayEnergy,
      singleData,
      curTabIndexss,
      currentMonthEnergy,
      monthSelected,
      priceMonth,
      priceYear,
      curTabIndex,
      yearCurTabIndex,
      days,
      monthBegin,
      monthEnd,
    } = this.state;
    console.log(singleData)
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
              <Text style={{fontSize: 16, color: '#fff'}}>{days}</Text>
              <Text style={{fontSize: 12, color: '#fff', marginVertical: 5}}>
                接入天数
              </Text>
              <View
                style={{
                  width: '100%',
                  height: 2,
                  backgroundColor: '#fff',
                  marginBottom: 5,
                }}></View>
              <Text style={{color: '#fff', fontSize: 16}}>
                {currentMonthEnergy.value}
              </Text>
              <Text style={{color: '#fff', fontSize: 12, marginTop: 5}}>
                {currentMonthEnergy.time}月用电(KWH)
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
              <Text>设备能耗前三</Text>

              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={[
                    sss.dayItem,
                    curTabIndexss == 1
                      ? {backgroundColor: '#e6effe'}
                      : {backgroundColor: '#c8eeff'},
                  ]}
                  onPress={() => {
                    this.refs.month.show();
                    // this.setState({
                    //   visable:true
                    // })
                    this.onChangeTabss(1);
                  }}>
                  <Text
                    style={{
                      color: curTabIndexss == 1 ? $myTheme.mainBlue : '#333',
                    }}>
                    {monthSelected && curTabIndexss == 1
                      ? monthSelected
                      : '按月'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    sss.dayItem,
                    curTabIndexss == 2
                      ? {backgroundColor: '#e6effe'}
                      : {backgroundColor: '#c8eeff'},
                  ]}
                  onPress={() => {
                    this.onChangeTabss(2);
                  }}>
                  <Text
                    style={{
                      paddingHorizontal: 2,
                      color: curTabIndexss == 2 ? $myTheme.mainBlue : '#333',
                    }}>
                    按年
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginLeft: 10}}
                  onPress={() => {
                    $fns.route({
                      context: this,
                      type: 'navigate',
                      routeName: 'energe_more',
                      params: {
                        curTabIndex: curTabIndexss,
                        monthBegin: monthBegin,
                        monthEnd: monthEnd,
                      },
                    });
                  }}>
                  <Text style={{color: '#0086c6'}}>更多</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{padding: 10}}>
              {topDevice.length != 0 ? (
                topDevice.map((item, index) => (
                  <View style={sss.itemRow} key={index}>
                    <Text
                      style={{
                        fontFamily: 'iconfont',
                        fontSize: 20,
                        color: '#1C84C6',
                      }}>
                      {'\ue613'}
                    </Text>
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
                  <Text style={{textAlign: 'center'}}>暂无企业能耗信息</Text>
                </View>
              )}
            </View>
            {Object.keys(singleData).length != 0 && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    // backgroundColor: '#c8eeff',
                    paddingHorizontal: 10,
                  }}>
                  <Text
                    style={{color: '#1C84C6', fontSize: 16, letterSpacing: 1}}>
                    {`${moment(monthBegin).format('YYYY')}年${moment(
                      monthBegin,
                    ).format('MM')}月`}
                    <Text style={{color: '#222'}}>电费统计</Text>
                  </Text>
                  {/* <Text style={{color: '#1C84C6', fontSize: 14}}>更多</Text> */}
                  <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={() => {
                      $fns.route({
                        context: this,
                        type: 'navigate',
                        routeName: 'statis_more',
                        params: {
                          monthBegin: monthBegin,
                          monthEnd: monthEnd,
                          singleData: singleData,
                        },
                      });
                    }}>
                    <Text style={{color: '#0086c6'}}>更多</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <EchartsView
                    // title="今日设备状态"
                    option={this.chargeCensusOption()}
                    length={Object.keys(singleData).length}
                  />
                </View>
              </>
            )}
          {monthSelected<moment().format('YYYY-MM')&&(
             <View
             style={{
               backgroundColor: '#fff',
               paddingBottom: 20,
               borderBottomRightRadius: 6,
               borderBottomLeftRadius: 6,
             }}>
             <View style={{paddingHorizontal: 10, marginBottom: 10}}>
               <View
                 style={{
                   height: 40,
                   flexDirection: 'row',
                   alignItems: 'center',
                 }}>
                 <Text style={{fontSize: 15}}>与</Text>
                 <Text style={{fontSize: 15, color: '#0086c6'}}>
                   {`${moment(monthBegin).format('YYYY')}年${moment(monthBegin)
                     .subtract(1, 'months')
                     .format('MM')}月`}
                 </Text>
                 <Text style={{fontSize: 15}}>环比</Text>
               </View>

               <View
                 style={{
                   flexDirection: 'row',
                 }}>
                 <View
                   style={{
                     flex: 1,
                     flexDirection: 'row',
                     alignItems: 'flex-start',
                     justifyContent: 'center',
                   }}>
                   <View style={[ss.flexItem, {marginRight: 4}]}>
                     <Text
                       style={{
                         fontFamily: 'iconfont',
                         fontSize: 20,
                       }}>
                       {'\ue612'}
                     </Text>

                     <Text style={{marginLeft: 3}}>电费</Text>
                   </View>

                   <View>
                     <View style={[ss.flexItem, {marginBottom: 3}]}>
                       {singleData.basisMoney > 0 ? (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#d81e06'
                           }}>
                           {'\ue610'}
                         </Text>
                       ) : (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#1AB394'
                           }}>
                           {'\ue611'}
                         </Text>
                       )}
                       <Text>{singleData.basisMoney?Math.abs( singleData.basisMoney):0}元</Text>
                     </View>

                     <View style={ss.flexItem}>
                       {singleData.monthOnMonthBasisMoney > 0 ? (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#d81e06'
                           }}>
                           {'\ue610'}
                         </Text>
                       ) : (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#1AB394'
                           }}>
                           {'\ue611'}
                         </Text>
                       )}
                       <Text>{singleData.monthOnMonthBasisMoney?Math.abs(singleData.monthOnMonthBasisMoney):0}%</Text>
                     </View>
                   </View>
                 </View>

                 <View
                   style={{
                     flex: 1,
                     flexDirection: 'row',
                     alignItems: 'flex-start',
                     justifyContent: 'center',
                   }}>
                   <View style={[ss.flexItem, {marginRight: 4}]}>
                     <Text
                       style={{
                         fontFamily: 'iconfont',
                         fontSize: 20,
                       }}>
                       {'\ue614'}
                     </Text>

                     <Text style={{marginLeft: 3}}>能耗</Text>
                   </View>

                   <View>
                     <View style={[ss.flexItem, {marginBottom: 3}]}>
                       {singleData.basisPower > 0 ? (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#d81e06' 
                           }}>
                           {'\ue610'}
                         </Text>
                       ) : (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#1AB394'
                           }}>
                           {'\ue611'}
                         </Text>
                       )}

                       <Text>{singleData.basisPower?Math.abs(singleData.basisPower):0}KWH</Text>
                     </View>

                     <View style={ss.flexItem}>
                       {singleData.monthOnMonthBasisPower > 0 ? (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#d81e06' 
                           }}>
                           {'\ue610'}
                         </Text>
                       ) : (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#1AB394'
                           }}>
                           {'\ue611'}
                         </Text>
                       )}

                       <Text>{singleData.monthOnMonthBasisPower?Math.abs(singleData.monthOnMonthBasisPower):0}%</Text>
                     </View>
                   </View>
                 </View>
               </View>
             </View>

             <View style={{paddingHorizontal: 10}}>
               <View
                 style={{
                   height: 40,
                   flexDirection: 'row',
                   alignItems: 'center',
                 }}>
                 <Text style={{fontSize: 15}}>与</Text>
                 <Text style={{fontSize: 15, color: '#0086c6'}}>
                   {`${moment(monthBegin)
                     .subtract(1, 'years')
                     .format('YYYY')}年${moment(monthBegin).format('MM')}月`}
                 </Text>
                 <Text style={{fontSize: 15}}>同比</Text>
               </View>

               <View style={{flexDirection: 'row'}}>
                 <View
                   style={{
                     flex: 1,
                     flexDirection: 'row',
                     alignItems: 'flex-start',
                     justifyContent: 'center',
                   }}>
                   <View style={[ss.flexItem, {marginRight: 4}]}>
                     <Text
                       style={{
                         fontFamily: 'iconfont',
                         fontSize: 20,
                       }}>
                       {'\ue612'}
                     </Text>
                     <Text style={{marginLeft: 3}}>电费</Text>
                   </View>

                   <View>
                     <View style={[ss.flexItem, {marginBottom: 3}]}>
                       {singleData.radioMoney > 0 ? (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#d81e06'  
                           }}>
                           {'\ue610'}
                         </Text>
                       ) : (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#1AB394'
                           }}>
                           {'\ue611'}
                         </Text>
                       )}
                       <Text>{singleData.radioMoney?Math.abs(singleData.radioMoney):0}元</Text>
                     </View>

                     <View style={ss.flexItem}>
                       {singleData.monthOnMonthRadioMoney > 0 ? (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#d81e06' 
                           }}>
                           {'\ue610'}
                         </Text>
                       ) : (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#1AB394'
                           }}>
                           {'\ue611'}
                         </Text>
                       )}
                       <Text>{singleData.monthOnMonthRadioMoney?Math.abs(singleData.monthOnMonthRadioMoney):0}%</Text>
                     </View>
                   </View>
                 </View>

                 <View
                   style={{
                     flex: 1,
                     flexDirection: 'row',
                     alignItems: 'flex-start',
                     justifyContent: 'center',
                   }}>
                   <View style={[ss.flexItem, {marginRight: 4}]}>
                     <Text
                       style={{
                         fontFamily: 'iconfont',
                         fontSize: 20,
                       }}>
                       {'\ue614'}
                     </Text>
                     <Text style={{marginLeft: 3}}>能耗</Text>
                   </View>

                   <View>
                     <View style={[ss.flexItem, {marginBottom: 3}]}>
                       {singleData.radioPower > 0 ? (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#d81e06' 
                           }}>
                           {'\ue610'}
                         </Text>
                       ) : (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#1AB394'
                           }}>
                           {'\ue611'}
                         </Text>
                       )}
                       <Text>{singleData.radioPower?Math.abs(singleData.radioPower):0}KWH</Text>
                     </View>

                     <View style={ss.flexItem}>
                       {singleData.monthOnMonthRadioPower > 0 ? (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#d81e06'
                           }}>
                           {'\ue610'}
                         </Text>
                       ) : (
                         <Text
                           style={{
                             fontFamily: 'iconfont',
                             fontSize: 20,
                             color:'#1AB394'
                           }}>
                           {'\ue611'}
                         </Text>
                       )}
                       <Text>{singleData.monthOnMonthRadioPower?Math.abs(singleData.monthOnMonthRadioPower):0}%</Text>
                     </View>
                   </View>
                 </View>
               </View>
             </View>
           </View>
          )}  
           
          </View>

          <View style={{padding: 12}}>
            <EchartsView
              title={curTabIndex == 1 ? '近6月能耗对比' : '近6月电费对比'}
              option={
                curTabIndex == 1
                  ? this.getEneryMonthOption()
                  : this.chargeOption()
              }
              length={
                curTabIndex == 1 ? monthElectric.length : priceMonth.length
              }
              tooltip={
                curTabIndex == 1
                  ? [
                      {color: '#FDB659', mode: 'rect', text: '工作能耗'},
                      {color: '#1C84C6', mode: 'rect', text: '待机能耗'},
                      {color: '#EF6A78', mode: 'line', text: '环比'},
                    ]
                  : [
                      {color: '#1AB394', mode: 'rect', text: '峰时'},
                      {color: '#EF6A78', mode: 'rect', text: '平时'},
                      {color: '#1C84C6', mode: 'rect', text: '谷时'},
                      {color: '#61a0a8', mode: 'rect', text: '通用'},
                      {color: '#EF6A78', mode: 'line', text: '环比'},
                    ]
              }
              right={
                <View style={[ss.titleMain]}>
                  <RightExtra
                    index={1}
                    curTabIndex={curTabIndex}
                    text="能耗"
                    onPress={() => this.onChangeTab(1)}
                  />
                  <RightExtra
                    index={2}
                    curTabIndex={curTabIndex}
                    text="电费"
                    onPress={() => this.onChangeTab(2)}
                  />
                </View>
              }
            />

            <EchartsView
              title={yearCurTabIndex == 1 ? '近3年总能耗对比' : '近3年电费对比'}
              option={
                yearCurTabIndex == 1
                  ? this.getEneryYearOption()
                  : this.getYearChargrOption()
              }
              length={
                yearCurTabIndex == 1 ? yearElectric.length : priceYear.length
              }
              tooltip={
                yearCurTabIndex == 1
                  ? [
                      {color: '#1C84C6', mode: 'rect', text: '年能耗'},
                      {color: '#EF6A78', mode: 'line', text: '环比'},
                    ]
                  : [
                      {color: '#1AB394', mode: 'rect', text: '年电费'},
                      {color: '#EF6A78', mode: 'line', text: '环比'},
                    ]
              }
              right={
                <View style={[ss.titleMain]}>
                  <RightExtra
                    index={1}
                    curTabIndex={yearCurTabIndex}
                    text="能耗"
                    onPress={() => this.onChangeTabs(1)}
                  />
                  <RightExtra
                    index={2}
                    curTabIndex={yearCurTabIndex}
                    text="电费"
                    onPress={() => this.onChangeTabs(2)}
                  />
                </View>
              }
            />

            {/* <EchartsView
            title="近3年能耗汇总"
            option={this.getEneryYearOption()}
            length={this.state.yearElectric.length}
            tooltip={[
              {color: '#1C84C6', mode: 'rect', text: '年能耗'},
              {color: '#EF6A78', mode: 'line', text: '平均值'},
            ]}
          />
          <EchartsView
            title="今日设备状态"
            option={this.NumberTypeOption()}
            length={this.state.eletricType.length}
            tooltip={[
              {color: '#1AB394', mode: 'circle', text: '阶梯电价'},
              {color: '#1C84C6', mode: 'circle', text: '通用电价'},
              {color: '#EF6A78', mode: 'circle', text: '未配电价'},
            ]}
          /> */}
          </View>
        </ScrollView>
      </>
    );
  }
}
let ss = StyleSheet.create({
  titleMain: {flexDirection: 'row', flex: 1, justifyContent: 'flex-end'},
  mainBox: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: '#fff',
    paddingLeft: 12,
  },
  dayItem: {
    padding: 3,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginLeft: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  flexItem: {flexDirection: 'row', alignItems: 'center'},
  dayItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    borderRadius: 3,
    height: 24,
    justifyContent: 'center',
  },
});
let sss = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  flexItem: {flexDirection: 'row', alignItems: 'center'},
  dayItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    borderRadius: 3,
    height: 24,
    justifyContent: 'center',
  },
});
