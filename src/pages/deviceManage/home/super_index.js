import React from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import {UiHeader, EchartsView} from './../../../global.components';
import {MarqueeVertical} from 'react-native-marquee-ab';
import IconFont from '../../../components/IconFont';
import {$fns, $myTheme, $ajax, api} from './../../../global.utils';
import {Echarts, echarts} from 'react-native-secharts';
import {isYWAdmin} from '../../../utils/data';
const {find, getAlarmList, JiaDongStatistic, getMachineType, countUser} = api;
// ==== 新增加 ====
import {Card} from 'react-native-shadow-cards';
import moment from 'moment';
export default class App extends React.Component {
  state = {
    machine_status: [],
    maintainData: [
      // {name: '已完成机床数', value: 1, itemStyle: {color: '#5786e7'}},
      // {name: '未完成机床数', value: 1, itemStyle: {color: '#ff4d4f'}},
    ],
    alarmList: [],
    JiaDongList: [],
    TypeJiaDongList: [],
    machineType: [],
    JiaDongByCompany: [],
    machine_total: 0,
    userCount: 0,
    companyName: '',
    firmList: [],
    isSearchShow: false,
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.countUser();
    this.getMachineType();
    this.getMachineStatus();
    this.getAlarmList();
    this.getTypeJiaDongStatistic();
  }
  countUser = () => {
    $ajax({
      url: countUser,
      data: {},
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        this.setState({
          userCount: value.data,
        });
      }
    });
  };
  getMachineType() {
    $ajax({
      url: getMachineType,
      data: {},
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const data = value.data;
        this.setState({
          machineType: data,
        });
      }
    });
  }
  getMachineStatus() {
    $ajax({
      url: find,
      data: {},
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const status = [
          {
            value: value.data.machine_state_rt[1].percent,
            name: `运行:${value.data.machine_state_rt[1].amount}台`,
            itemStyle: {color: '#72e8af'},
          },
          {
            value: value.data.machine_state_rt[4].percent,
            name: `准备:${value.data.machine_state_rt[4].amount}台`,
            itemStyle: {color: '#fdb75a'},
          },
          {
            value: value.data.machine_state_rt[0].percent,
            name: `空闲:${value.data.machine_state_rt[0].amount}台`,
            itemStyle: {color: '#519fff'},
          },
          {
            value: value.data.machine_state_rt[2].percent,
            name: `故障:${value.data.machine_state_rt[2].amount}台`,
            itemStyle: {color: '#e74545'},
          },
          {
            value: value.data.machine_state_rt[3].percent,
            name: `关机:${value.data.machine_state_rt[3].amount}台`,
            itemStyle: {color: '#cacaca'},
          },
        ];
        this.setState({
          machine_status: status,
          JiaDongList: value.data.machine_running_rate_7days,
          machine_total: value.data.machine_total.amount,
        });
      }
    });
  }
  statusOption() {
    const {machine_status} = this.state;
    // let name = (machineStatus || []).map((item) => item.name);
    let option = {};
    option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : ({c}%)',
      },
      legend: {
        orient: 'horizontal',
        // left: 'right',
        data: machine_status.map((item) => item.name),
        // align: 'left',
        padding: 0,
        itemHeight: 9, //改变圆圈大小
        itemWidth: 8,
        // itemGap:8,
        textStyle: {
          fontSize: 12,
          color: '#B6B9BE',
        },
      },
      icon: 'circle',
      // grid:{
      //   top:50,
      //   left:20,

      // },
      series: [
        {
          name: '设备状态',
          type: 'pie',
          radius: '65%',
          center: ['50%', '57%'],
          // hoverOffset:5,
          data: machine_status,
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
                '%' +
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
  JiaDongOption() {
    const {JiaDongList} = this.state;
    let time = (JiaDongList || []).map((item) =>
      moment(item.day).format('MM-DD'),
    );
    let data = (JiaDongList || []).map((item) => item.rate);
    return (option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}%',
      },
      grid: {
        top: 43,
        left: '5%',
        right: '3%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: {
        name: '日期', // 横轴名称
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
        axisLabel: {
          formatter: `{value}日`,
        },
        // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        name: '有效运行率(%)',
        nameTextStyle: {
          fontSize: 12,
          color: '#333333',
          fontWeight: 'bold',
        },
        nameGap: 15,
        nameLocation: 'end',
        type: 'value',
        axisLabel: {
          formatter: `{value}%`,
        },
      },
      lineStyle: {
        color: 'green',
      },
      series: [
        {
          name: '有效运行率',
          data: data,
          // [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          markPoint: {
            data: [
              {
                name: '最大值',
                type: 'max',
                itemStyle: {
                  color: 'green',
                },
              },
              {
                name: '最小值',
                type: 'min',
                itemStyle: {
                  color: 'green',
                },
              },
            ],
          },
        },
      ],
    });
  }
  getAlarmList = () => {
    $ajax({
      url: getAlarmList,
      data: {
        args: {
          startTime: moment().format('YYYY-MM-DD 00:00:00'),
          endTime: moment().format('YYYY-MM-DD 23:59:59'),
        },
        pageNum: 1,
        pageSize: 3,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const {list} = value.data;
        const arr = list.map((item) => ({
          id: item.id,
          name: item.name,
          sequence: item.sequence,
          dataType: item.dataType,
          lastTime: item.lastTime,
          grade: item.grade,
          deviceComponent: item.deviceComponent,
        }));
        this.setState({
          alarmList: arr,
        });
      }
    });
  };
  getName(id) {
    const {machineType} = this.state;
    let name = '';
    machineType.forEach((element) => {
      if (element.id == id) {
        name = element.name;
      }
    });
    return name;
  }
  getTypeJiaDongStatistic = () => {
    $ajax({
      url: JiaDongStatistic,
      data: {},
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const {AvgByDeviceType, ListByCompany} = value.data;
        this.setState({
          TypeJiaDongList: AvgByDeviceType,
          JiaDongByCompany: ListByCompany.slice(0, 5),
        });
      }
    });
  };
  TypeJiaDongOption() {
    const {TypeJiaDongList} = this.state;

    let data = TypeJiaDongList.map((item) => item.avgworkratio.toFixed(2));
    let max = Math.max(...data) + 5;
    let name = TypeJiaDongList.map((item) => ({
      name: this.getName(item.parent_id),
      max: max,
    }));
    return (option = {
      tooltip: {
        position: 'inside',
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
        center: ['50%', '50%'],
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
          name: '有效运行率统计：',
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
            show: true,
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
  JiaDongProvinceOption() {
    let data = [59.31, 54.28, 52.02, 49.72, 42.37],
      name = ['江苏', '上海', '广东', '山东', '浙江'];

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
        top: 35,
        left: '2%',
        right: '3%',
        bottom: '9%',
        containLabel: true,
      },
      xAxis: [
        {
          name: '区域',
          nameTextStyle: {
            fontSize: 12,
            color: '#333333',
            fontWeight: 'bold',
          },
          nameGap: 25,
          nameLocation: 'middle',
          type: 'category',
          data: name,
          //  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          name: '有效运行率(%)',
          nameTextStyle: {
            fontSize: 12,
            color: '#333333',
            fontWeight: 'bold',
          },
          nameGap: 15,
          type: 'value',
          axisLabel: {
            formatter: `{value}%`,
          },
        },
      ],
      series: [
        {
          name: '有效运行率',
          type: 'bar',
          barWidth: '60%',
          data: data,
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#aaafb3',
            },
          },
          // [10, 52, 200, 334, 390, 330, 220],
        },
      ],
    });
  }
  render() {
    const {JiaDongByCompany, machine_total, userCount} = this.state;
    const {that} = this.props;
    return (
      <ScrollView style={{flex: 1, padding: 12}}
       >
        <Card style={{ borderRadius: 0, width: '100%'}}>
          <View style={[sss.title]}>
            <Text style={[sss.titleTxt]}>设备/节点数量统计</Text>
          </View>
          <View
            style={{
              paddingHorizontal: 6,
              paddingVertical: 10,
              backgroundColor: '#fff',
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: 100,
            }}>
            <View
              style={{
                width: '48%',
                borderRadius: 10,
                overflow: 'hidden',
              }}>
              <ImageBackground
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  maxHeight: 100,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}
                source={require('../../../assets/imgs/device_back.png')}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={{marginBottom: 10, color: '#fff'}}>
                    工业设备总数
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 20,
                      marginBottom: 7,
                    }}>
                    {machine_total}
                  </Text>
                </View>
                <Image
                  source={require('../../../assets/imgs/device_right.png')}
                />
              </ImageBackground>
            </View>
            <View
              style={{
                width: '48%',
                borderRadius: 10,
                overflow: 'hidden',
              }}>
              <ImageBackground
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  maxHeight: '100%',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}
                source={require('../../../assets/imgs/box_back.png')}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={{marginBottom: 10, color: '#fff'}}>
                    平台用户总数
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 20,
                      marginBottom: 7,
                    }}>
                    {userCount}
                  </Text>
                </View>
                <Image source={require('../../../assets/imgs/box_right.png')} />
              </ImageBackground>
            </View>
          </View>
        </Card>
        <EchartsView
          title="今日设备状态"
          option={this.statusOption()}
          length={this.state.machine_status.length}
        />

        <EchartsView
          title="近七日设备有效运行率"
          option={this.JiaDongOption()}
          length={this.state.JiaDongList.length}
        />

        <EchartsView
          title="设备类型有效运行率统计"
          option={this.TypeJiaDongOption()}
          length={this.state.TypeJiaDongList.length}
        />

        <EchartsView
          title="有效运行率省份排行"
          option={this.JiaDongProvinceOption()}
          length={5}
        />

     <Card style={{ marginTop: 15,marginBottom:25, borderRadius: 0, width: '100%'}}>
          <View style={[sss.title]}>
            <Text style={[sss.titleTxt]}>有效运行率前5名公司</Text>
          </View>

          <View style={[sss.mainBox]}>
            {JiaDongByCompany.map((item, index) => (
              <View
                key={index}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    width: 40,
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../../../assets/imgs/icon_rank.png')}
                    style={{width: 40, height: 40}}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      position: 'absolute',
                      top: 26,
                      left: 16,
                      color: 'orange',
                      fontWeight: 'bold',
                    }}>
                    {index + 1}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    height: 60,
                    alignItems: 'center',
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#eee',
                    paddingRight: 12,
                  }}>
                  <Text style={{width: '85%'}} numberOfLines={1}>
                    {item.firmName}
                  </Text>
                  <Text numberOfLines={1}>
                    {(item.workingRatio * 100).toFixed(2)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    );
  }
}

let sss = StyleSheet.create({
  title: {
    flexDirection: 'row',
    height: 46,
    // backgroundColor: '#ece9e9',
    borderColor:'#ddd',
    borderBottomWidth:1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  titleTxt: {fontSize: 16, color: '#222'},
  mainBox: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
});
