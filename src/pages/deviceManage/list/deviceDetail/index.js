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
} from '../../../../global.components';
import {$myTheme, $source, $ajax, api} from '../../../../global.utils';
import {$fns} from '../../../../utils/fns';
import {Echarts, echarts} from 'react-native-secharts';
// import Echarts from 'native-echarts';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import {isCustomAdmins, isYWAdmin, monthlist} from '../../../../utils/data';
import {Card} from 'react-native-shadow-cards';
const {
  getMachineStatus,
  getJiaDong,
  getFuHe,
  getMaintainCompelteRate,
  getChiLunHealth,
  AlarmLevel,
  getStockList,
  getRepairList,
  getPdfList,
  getWorkRation,
  getYearJiaDong,
  getBendFuHe,
} = api;
const monthList = monthlist();
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    isShow: true,
    curTabIndex: 1,
    machineStatus: [], //设备状态
    statusText: {percent: 0, defeatPercent: 0}, //有效运行率占比和击败
    FuheList: [], //负荷列表
    maintainData: {Rate: 0, Count: 0},
    ChiLunAbility: 0, //齿轮健康
    ChiLunName: '',
    alarmLevel: [0, 0, 0, 0],
    mesList: [],
    repairList: [],
    fileList: [],
    RationList: [],
    spareList: [],
    monthSelected: '',
    monthIndex: 0,
    beginTime: moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'),
    endTime: moment().format('YYYY-MM-DD 23:59:59'),
  };
  componentDidMount() {
    const {id, sequence, deviceTypeId, isBender} = this.props.route.params;
    let currentTime = moment().format('YYYY-MM-DD'); //今天时间
    let beginTime = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
    let endTime = moment().format('YYYY-MM-DD 23:59:59');
    let yestday = moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59');
    let jiadong = moment().subtract(1, 'days').format('YYYY-MM-DD');
    this.getMachineStatus(
      id,
      moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00'),
      endTime,
    );
    this.getWorkRation(id, beginTime, endTime);
    this.getJiaDong(id, jiadong);
    // alert(moment().subtract(6, 'days').format('YYYY-MM-DD'))
    if (isBender) {
      this.getBendFuHe(
        id,
        moment().subtract(6, 'days').format('YYYY-MM-DD'),
        currentTime,
      );
    } else {
      this.getFuHe(id, beginTime, yestday);
    }
    this.getMaintainCompelteRate(id);
    this.getChiLunHealth(id);
    this.AlarmLevel(id, currentTime);
    this.getStockList(deviceTypeId);
    this.getRepairList(sequence);
    this.getPdfList(deviceTypeId);
  }
  //7/17/30/天

  //设备状态占比图表
  getMachineStatus = (id, currentTime, endTime) => {
    let beginTime = `${currentTime} 00:00:00`;
    $ajax({
      url: getMachineStatus,
      data: {
        id: id,
        beginTime: beginTime,
        endTime: endTime,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let status = [
          {
            value: value.data.totalRunPercent,
            name: '运行',
            itemStyle: {color: '#72e8af'},
          },
          {
            value: value.data.totalPreparePercent,
            name: '准备',
            itemStyle: {color: '#f4c860'},
          },
          {
            value: value.data.totalPausePercent,
            name: '空闲',
            itemStyle: {color: '#519fff'},
          },
          {
            value: value.data.totalFaultPercent,
            name: '故障',
            itemStyle: {color: '#e74545'},
          },
          {
            value: value.data.totalStopPercent,
            name: '关机',
            itemStyle: {color: '#cacaca'},
          },
        ];
        // let terminal = status.filter(function (item, index) {
        //   return item.value > 0;
        // });
        this.setState({
          machineStatus: status,
        });
      }
    });
  };
  getWorkRation = (id, beginTime, endTime) => {
    $ajax({
      url: getWorkRation,
      data: {
        id: id,
        startDate: beginTime,
        endDate: endTime,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const RationList = value.data.MachineDurationDaily;
        this.setState({
          RationList: RationList,
        });
      }
    });
  };
  getJiaDong = (id, yestday) => {
    let beginTime = `${yestday} 00:00:00`;
    $ajax({
      url: getJiaDong,
      data: {
        id: id,
        beginTime: beginTime,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const {workingRatio, workingRatioPlace} = value.data;
        let statusText = {
          percent: workingRatio,
          defeatPercent: workingRatioPlace,
        };
        this.setState({
          statusText: statusText,
        });
      }
    });
  };
  workRationOption() {
    const {RationList, curTabIndex} = this.state;
    let time = [];
    let data = [];
    if (curTabIndex != 3) {
      time = (RationList || []).map((item) =>
        moment(item.censusDate).format('MM-DD'),
      );
      data = (RationList || []).map((item) => item.workingRatio.toFixed(2));
    } else {
      time = (RationList || []).map((item) => item.time);
      data = (RationList || []).map((item) =>
        (item.workingRatio * 100).toFixed(2),
      );
    }
    return (option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%',
      },
      grid: {
        top: 43,
        left: '5%',
        right: '3%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: {
        name: '日期',
        nameTextStyle: {
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
        name: '有效运行率(%)',
        nameTextStyle: {
          fontSize: 12,
          color: '#333333',
          fontWeight: 'bold',
        },
        nameGap: 15,
        nameLocation: 'end',
        type: 'value',
      },
      lineStyle: {
        color: '#4a90f2',
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
                  color: '#4a90f2',
                },
              },
              {
                name: '最小值',
                type: 'min',
                itemStyle: {
                  color: '#4a90f2',
                },
              },
            ],
          },
        },
      ],
    });
  }
  statusOption() {
    const {machineStatus, curTabIndex} = this.state;
    let option = {};
    if (machineStatus.length != 0) {
      // let Status2 = machineStatus.filter((item) => {
      //   return item.value > 0||item.value==0;
      // });
      let Status = machineStatus;
      option = {
        // title: {
        //   subtext: curTabIndex == 0 ? '今天设备状态统计' : '有效运行率',
        //   left: 'left',
        // },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'horizontal',
          // left: 'right',
          data: Status.map((item) => item.name),
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
        // legend: {
        //     orient: 'vertical',
        //     left: 'left',
        //     data: name
        // },
        series: [
          {
            name: '设备状态',
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            roseType: false,
            data: Status,
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
            animation: true,
            animationType: 'scale',
            animationEasing: 'elasticOut',
          },
        ],
      };
    }
    return option;

    // let name = (machineStatus || []).map((item) => item.name);
  }
  //设备负荷
  getFuHe = (id, beginTime, endTime) => {
    $ajax({
      url: getFuHe,
      data: {
        args: {
          id: id,
          beginTime: beginTime,
          endTime: endTime,
        },
        pageNum: 1,
        pageSize: 30,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const FuheList = value.data.list;
        this.setState({
          FuheList: FuheList,
        });
      }
    });
  };
  //折弯负荷
  getBendFuHe = (id, beginTime, endTime) => {
    $ajax({
      url: getBendFuHe,
      data: {
        machineId: id,
        startdate: beginTime,
        stopdate: endTime,
      },
      type: 'get',
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const FuheList = value.data;
        console.log(value.data);
        this.setState({
          FuheList: FuheList,
        });
      }
    });
  };
  FuHeOption() {
    const {FuheList} = this.state;
    const {isBender} = this.props.route.params;
    let data = [];
    let time = [];
    if (isBender) {
      time = (FuheList || []).map((item) =>
        moment(item.workDate).format('MM-DD'),
      );
      data = (FuheList || []).map((item) => item.workPieceAmount);
    } else {
      time = (FuheList || []).map((item) =>
        moment(item.censusDate).format('MM-DD'),
      );
      data = (FuheList || []).map((item) => item.sum);
    }

    return (option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}',
      },
      grid: {
        top: 43,
        left: '2%',
        right: '3%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: {
        name: '日期',
        nameTextStyle: {
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
        name: isBender ? '折弯次数(次)' : '加工数(个)',
        nameTextStyle: {
          fontSize: 12,
          color: '#333333',
          fontWeight: 'bold',
        },
        nameGap: 15,
        nameLocation: 'end',
        type: 'value',
      },
      lineStyle: {
        color: 'green',
      },
      series: [
        {
          name: '加工数',
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
  //设备养护
  getMaintainCompelteRate = (id) => {
    $ajax({
      url: getMaintainCompelteRate,
      data: {
        id: id,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const {maintainCompelteRate, unCompleteMaintainCount} = value.data;
        this.setState({
          maintainData: {
            Rate:
              maintainCompelteRate == null
                ? 0
                : (maintainCompelteRate * 100).toFixed(2),
            Count: unCompleteMaintainCount,
          },
        });
      }
    });
  };
  maintainOption() {
    const {Rate} = this.state.maintainData;
    return (option = {
      tooltip: {
        formatter: '{b} : {c}%',
      },
      // toolbox: {
      //   feature: {
      //     restore: {},
      //     saveAsImage: {},
      //   },
      // },
      grid: {
        top: 25,
        left: '4%',
        right: '4%',
        bottom: 0,
        containLabel: true,
      },
      series: [
        {
          // name: '养护',
          type: 'gauge',
          radius: '100%',
          center: ['50%', '50%'],
          detail: {
            formatter: '{value}%',
            fontSize: 16,
          },
          data: [{value: Rate, name: '完成率'}],
        },
      ],
    });
  }
  //设备报警等级
  AlarmLevel = (id, today) => {
    $ajax({
      url: AlarmLevel,
      data: {
        machineId: id,
        workDate: today,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const list = value.data;
        let arr = this.getTotalAndRate(list);
        this.setState({
          alarmLevel: arr,
        });
      }
    });
  };
  getTotalAndRate(list) {
    let JingBao = 0,
      YiBan = 0,
      JiTing = 0,
      Syetem = 0,
      Sum = 0;
    if (list.length != 0) {
      list.forEach((item) => {
        if (item.grade == 3 || item.grade == 4) {
          JingBao += item.amount;
        } else if (item.grade == 2) {
          YiBan += item.amount;
        } else if (item.grade == 0) {
          JiTing += item.amount;
        } else {
          Syetem += item.amount;
        }
        Sum += item.amount;
      });
      return [
        (JingBao / Sum).toFixed(4),
        (YiBan / Sum).toFixed(4),
        (JiTing / Sum).toFixed(4),
        (Syetem / Sum).toFixed(4),
      ];
    } else {
      return [0, 0, 0, 0];
    }
  }
  //齿轮齿条健康
  getChiLunHealth = (id) => {
    $ajax({
      url: getChiLunHealth,
      data: {
        id: id,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let featureProbability = 0;
        if (value.data[0].currentHealthStatus) {
          if (value.data[0].currentHealthStatus.featureProbability)
            featureProbability =
              value.data[0].currentHealthStatus.featureProbability;
        }
        const {name} = value.data[0];
        this.setState({
          ChiLunAbility: featureProbability,
          ChiLunName: name,
        });
      }
    });
  };
  getText() {
    const {ChiLunAbility} = this.state;

    if (0 < ChiLunAbility * 100 < 50) {
      return '健康';
    } else if (50 < ChiLunAbility * 100 < 75) {
      return '轻度故障';
    } else {
      return '重度故障';
    }
  }
  ChiLunStatus() {
    const {ChiLunAbility} = this.state;
    return (option = {
      tooltip: {
        formatter: '{b} : {c}%',
      },
      // toolbox: {
      //   feature: {
      //     restore: {},
      //     saveAsImage: {},
      //   },
      // },
      series: [
        {
          // name: '业务指标',
          type: 'gauge',
          radius: '100%',
          axisLine: {
            show: true,
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: [
                //表盘颜色
                [0.5, '#67d2a0'], //0-50%处的颜色
                [0.75, '#f1b657'], //51%-70%处的颜色
                [1, '#e73f3e'], //90%-100%处的颜色
              ],
              width: 30, //表盘宽度
            },
          },
          detail: {formatter: '{value}%', fontSize: 16},
          data: [{value: ChiLunAbility * 100, name: this.getText()}],
        },
      ],
    });
  }
  //备品备件库存
  getStockList = (id) => {
    $ajax({
      url: getStockList,
      data: {
        args: {
          deviceTypeId: id,
        },
        pageNum: 1,
        pageSize: 30,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const {list} = value.data;
        let mesList = this.getMessage(list);
        this.setState({
          mesList: mesList,
          spareList: list,
        });
      }
    });
  };
  getMessage(list) {
    let mesList = [];
    if (list.length != 0) {
      list.forEach((item) => {
        let message = '';
        if (item.stockCount == 0) {
          message = `${item.name}备件已耗尽,请及时补充！`;
          mesList.push(message);
        } else if (
          0 < Number(item.stockCount / item.count) &&
          Number(item.stockCount / item.count) <= 0.3
        ) {
          message = `${item.name}备件不足,请及时补充！`;
          mesList.push(message);
        }
      });
      if (mesList.length == 0) {
        mesList.push('备件充足,请放心生产');
      }
    } else {
      mesList.push('暂无备件信息');
    }
    return mesList;
  }

  //报修列表
  getRepairList = (id) => {
    $ajax({
      url: getRepairList,
      data: {
        args: {
          machineSequence: id,
          dataSource: 0,
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
          deviceComponentName: item.deviceComponentName,
          occurredTime: item.occurredTime,
          maintenanceStatusDesc: item.maintenanceStatusDesc,
        }));
        this.setState({
          repairList: arr,
        });
      }
    });
  };
  //pdf列表
  getPdfList = (deviceTypeId) => {
    $ajax({
      url: getPdfList,
      data: {
        args: {
          deviceTypeId: deviceTypeId,
        },
        pageNum: 1,
        pageSize: 3,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const {list} = value.data;
        let fileList = [];
        if (list.length != 0) {
          const {fileUrlList} = list[0];
          if (fileUrlList.length != 0) {
            fileList = fileUrlList.map((item) => `/api/ems${item}`);
          }
        }
        this.setState({
          fileList: fileList,
        });
      }
    });
  };
  showWorkingDetail = () => {
    const {id, sequence, deviceTypeId} = this.props.route.params;
    $fns.route({
      context: this,
      routeName: 'WorkDetail',
      params: {
        id: id,
      },
    });
  };
  showJiaDongDetail = () => {
    const {id, sequence, deviceTypeId} = this.props.route.params;
    $fns.route({
      context: this,
      routeName: 'JiadongDetail',
      params: {
        id: id,
        monthSelected: this.state.monthSelected,
        beginTime: this.state.beginTime,
        endTime: this.state.endTime,
      },
    });
  };
  showFuHeDetail = () => {
    const {id, isBender, deviceTypeId} = this.props.route.params;
    $fns.route({
      context: this,
      routeName: isBender ? 'benderFuHeDetail' : 'FuheDetail',
      params: {
        id: id,
        curTabIndex: this.state.curTabIndex,
        monthIndex: this.state.monthIndex,
        beginTime:
          this.state.curTabIndex == 2
            ? moment(this.state.beginTime).format('YYYY-MM-DD')
            : moment().subtract(6, 'days').format('YYYY-MM-DD'),
        endTime:
          this.state.curTabIndex == 2
            ? isBender
              ? moment(this.state.endTime).format('YYYY-MM-DD')
              : moment(this.state.beginTime).add(6, 'days').format('YYYY-MM-DD')
            : moment().format('YYYY-MM-DD'),
        FuheList: this.state.FuheList,
      },
    });
  };
  showMaintain = () => {
    const {id, sequence, deviceTypeId} = this.props.route.params;
    $fns.route({
      context: this,
      routeName: 'dm_MaintainMange',
      params: {
        machineSequence: sequence,
        outside: false,
      },
    });
  };
  showWarn = () => {
    const {id, sequence, deviceTypeId} = this.props.route.params;
    $fns.route({
      context: this,
      routeName: 'dm_WarnManage',
      params: {
        machineSequence: sequence,
      },
    });
  };
  showRepair = () => {
    const {id, sequence, deviceTypeId} = this.props.route.params;
    $fns.route({
      context: this,
      routeName: 'dm_RepairManage',
      params: {
        machineSequence: sequence,
      },
    });
  };
  showSpareList = () => {
    const {id, sequence, deviceTypeId} = this.props.route.params;
    $fns.route({
      context: this,
      routeName: 'dm_de',
      params: {
        deviceTypeId: deviceTypeId,
      },
    });
  };
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
    let yestday = moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59');
    if (e == 1) {
      this.getWorkRation(id, beginTime, endTime);
      this.getMachineStatus(
        id,
        moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00'),
        endTime,
      );
      if (isBender) {
        this.getBendFuHe(
          id,
          moment().subtract(6, 'days').format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD'),
        );
      } else {
        this.getFuHe(id, beginTime, yestday);
      }
      this.setState({
        beginTime: beginTime,
        endTime: endTime,
      });
    }
    if (e == 3) {
      this.getYearJiaDong(sequence);
    }
  }
  getYearJiaDong = (sequence) => {
    $ajax({
      url: getYearJiaDong,
      data: {
        args: {
          beginTime: moment(monthList[monthList.length - 1]).format(
            'YYYY-MM-DD 00:00:00',
          ),
          endTime: moment().format('YYYY-MM-01 00:00:00'),
          sequence: sequence,
        },
        pageNum: 1,
        pageSize: 20,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const {list} = value.data;
        this.setState({
          RationList: list,
        });
      }
    });
  };
  monthSelect = (value, index) => {
    const {id, sequence, isBender} = this.props.route.params;
    // alert(this.state.curTabIndex)
    let begin = moment(value[0]).startOf('month').format('YYYY-MM-DD 00:00:00');
    let end = moment(value[0]).endOf('month').format('YYYY-MM-DD 23:59:59');
    this.getWorkRation(id, begin, end);
    this.getMachineStatus(id, begin, end);
    if (isBender) {
      this.getBendFuHe(
        id,
        moment(value[0]).startOf('month').format('YYYY-MM-DD'),
        moment(value[0]).endOf('month').format('YYYY-MM-DD'),
      );
    } else {
      this.getFuHe(id, begin, end);
    }
    this.setState({
      monthSelected: value,
      monthIndex: index,
      beginTime: begin,
      endTime: end,
    });
  };
  showMaintainDetail = () => {
    const {
      id,
      sequence,
      deviceTypeId,
      deviceTypeName,
    } = this.props.route.params;
    $fns.route({
      context: this,
      routeName: 'dm_Repair',
      params: {
        id: id,
        sequence: sequence,
        deviceTypeId: deviceTypeId,
        deviceTypeName: deviceTypeName,
      },
    });
  };
  render() {
    let {
      FuheList,
      curTabIndex,
      statusText,
      maintainData,
      alarmLevel,
      ChiLunName,
      mesList,
      repairList,
      fileList,
      monthSelected,
    } = this.state;
    const {Count} = maintainData;
    const {id, sequence, deviceTypeId, isBender} = this.props.route.params;
    return (
      <>
        <UiHeader
          title="设备详情"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
          right={
            <TouchableOpacity onPress={() => this.showMaintainDetail()}>
              <IconFont icon={'\ue60e'} size={20} color="#fff" />
            </TouchableOpacity>
          }
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

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconFont icon={'\ue631'} size={20} color={$myTheme.mainBlue} />
            <Text
              style={{
                paddingLeft: 6,
                fontSize: 15,
                color: $myTheme.mainBlue,
              }}>
              {moment().format('YYYY/MM/DD')}
            </Text>
          </View>
        </View>

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

            <TouchableOpacity
              style={[
                ss.dayItem,
                curTabIndex == 3
                  ? {backgroundColor: '#e6effe'}
                  : {backgroundColor: '#fff'},
              ]}
              onPress={() => {
                this.refs.month.hide();
                this.onChangeTab(3);
              }}>
              <Text
                style={{
                  color: curTabIndex == 3 ? $myTheme.mainBlue : '#333',
                }}>
                按年
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={{
            backgroundColor: $myTheme.mainBgGray,
            // display: currentIndex ? 'flex' : 'none',
          }}
          ref={(r) => (this.scrollview = r)}>
          <EchartsView
            ismargin={false}
            title="设备状态"
            option={this.statusOption()}
            detail={true}
            onPress={this.showWorkingDetail}
            length={this.state.machineStatus.length}
          />
          <EchartsView
            title="有效运行率"
            option={this.workRationOption()}
            detail={curTabIndex != 3}
            onPress={this.showJiaDongDetail}
            length={this.state.RationList.length}
          />

          <UiPicker
            ref="month"
            datas={monthList}
            // hideModal={()=>this.setState}
            onConfirm={(_value, _index) => this.monthSelect(_value, _index)}
          />
          <EchartsView
            title="负荷状态"
            option={this.FuHeOption()}
            detail={
              this.state.FuheList.length != 0 && isYWAdmin() && curTabIndex != 3
            }
            onPress={this.showFuHeDetail}
            length={this.state.FuheList.length}
          />

          <Card style={{marginTop: 15, borderRadius: 0, width: '100%'}}>
            <View style={[ss.title]}>
              <Text style={[ss.titleTxt]}>设备养护</Text>
              <View style={[ss.titleMain]}>
                <TouchableOpacity onPress={this.showMaintain}>
                  <Text style={[ss.titleMore]}>查看详情</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[ss.mainBox]}>
              <View>
                <Echarts option={this.maintainOption()} height={200} />
              </View>

              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 16}}>未完成次数</Text>
                <Text style={{fontSize: 20, color: 'red'}}>{Count}</Text>
              </View>
            </View>
          </Card>
          <Card style={{marginTop: 15, borderRadius: 0, width: '100%'}}>
            <View style={[ss.title]}>
              <Text style={[ss.titleTxt]}>设备报警</Text>
              <View style={[ss.titleMain]}>
                <TouchableOpacity onPress={this.showWarn}>
                  <Text style={[ss.titleMore]}>查看详情</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={[
                ss.mainBox,
                {flexDirection: 'row', justifyContent: 'space-around'},
              ]}>
              <View style={{width: 84, alignItems: 'center'}}>
                <Progress.Circle
                  size={75}
                  progress={alarmLevel[0]}
                  color="#ff6600"
                  borderWidth={0}
                  formatText={(e) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-end',
                        }}>
                        <Text style={{fontSize: 20, color: '#ff6600'}}>
                          {(alarmLevel[0] * 100).toFixed(2)}
                        </Text>
                        <Text>%</Text>
                      </View>
                    );
                  }}
                  showsText={true}
                  unfilledColor="#ddd"
                  thickness={6}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: '#444',
                    marginTop: 6,
                    marginBottom: 8,
                  }}>
                  警告提醒
                </Text>
              </View>

              <View style={{width: 84, alignItems: 'center'}}>
                <Progress.Circle
                  size={75}
                  progress={alarmLevel[1]}
                  color={$myTheme.mainBlue}
                  borderWidth={0}
                  formatText={(e) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-end',
                        }}>
                        <Text style={{fontSize: 20, color: $myTheme.mainBlue}}>
                          {(alarmLevel[1] * 100).toFixed(2)}
                        </Text>
                        <Text>%</Text>
                      </View>
                    );
                  }}
                  showsText={true}
                  unfilledColor="#ddd"
                  thickness={6}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: '#444',
                    marginTop: 6,
                    marginBottom: 8,
                  }}>
                  一般报警
                </Text>
              </View>

              <View style={{width: 84, alignItems: 'center'}}>
                <Progress.Circle
                  size={75}
                  progress={alarmLevel[2]}
                  color={$myTheme.mainBlue}
                  formatText={(e) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-end',
                        }}>
                        <Text style={{fontSize: 20, color: $myTheme.mainBlue}}>
                          {(alarmLevel[2] * 100).toFixed(2)}
                        </Text>
                        <Text>%</Text>
                      </View>
                    );
                  }}
                  borderWidth={0}
                  showsText={true}
                  unfilledColor="#ddd"
                  thickness={6}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: '#444',
                    marginTop: 6,
                    marginBottom: 8,
                  }}>
                  急停报警
                </Text>
              </View>

              <View style={{width: 84, alignItems: 'center'}}>
                <Progress.Circle
                  size={75}
                  progress={alarmLevel[3]}
                  color={$myTheme.mainBlue}
                  formatText={(e) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-end',
                        }}>
                        <Text style={{fontSize: 20, color: $myTheme.mainBlue}}>
                          {(alarmLevel[3] * 100).toFixed(2)}
                        </Text>
                        <Text>%</Text>
                      </View>
                    );
                  }}
                  borderWidth={0}
                  showsText={true}
                  unfilledColor="#ddd"
                  thickness={6}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: '#444',
                    marginTop: 6,
                    marginBottom: 8,
                  }}>
                  系统报警
                </Text>
              </View>
            </View>
          </Card>
          <Card style={{marginTop: 15, borderRadius: 0, width: '100%'}}>
            <View style={[ss.title]}>
              <Text style={[ss.titleTxt]}>设备报修</Text>
              <View style={[ss.titleMain]}>
                <TouchableOpacity onPress={this.showRepair}>
                  <Text style={[ss.titleMore]}>
                    {repairList.length != 0 ? '查看详情' : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[ss.mainBox]}>
              {repairList.length != 0 ? (
                repairList.map((item, index) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: 44,
                    }}
                    key={index}>
                    <View
                      style={{
                        flex: 2,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <IconFont icon={'\ue600'} size={20} color="red" />
                      <Text
                        style={{fontSize: 15, marginLeft: 6}}
                        numberOfLines={1}>
                        {item.deviceComponentName}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 3,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color:
                            item.maintenanceStatusDesc == '维修完成'
                              ? '#67d2a0'
                              : 'red',
                        }}>
                        {item.maintenanceStatusDesc}
                      </Text>
                      <Text style={{fontSize: 15}}>
                        {moment(item.occurredTime).format('MM-DD HH:mm')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{textAlign: 'center'}}>暂无报修信息</Text>
              )}
            </View>
          </Card>

          <Card style={{marginTop: 15, borderRadius: 0, width: '100%'}}>
            <View style={[ss.title]}>
              <Text style={[ss.titleTxt]}>健康预测</Text>
            </View>

            <View style={[ss.mainBox]}>
              <View>
                <Text>{ChiLunName}</Text>
                <Echarts option={this.ChiLunStatus()} height={200} />
              </View>
            </View>
          </Card>
          <Card style={{marginTop: 15, borderRadius: 0, width: '100%'}}>
            <View style={[ss.title]}>
              <Text style={[ss.titleTxt]}>备品配件</Text>
              <View style={[ss.titleMain]}>
                <TouchableOpacity onPress={this.showSpareList}>
                  <Text style={[ss.titleMore]}>
                    {this.state.spareList.length != 0 ? '查看详情' : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[ss.mainBox]}>
              {mesList.length != 0 ? (
                mesList.map((item, index) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: 44,
                    }}
                    key={index}>
                    <IconFont icon={'\ue661'} size={20} color="#4a90f2" />
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        marginLeft: 6,
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{textAlign: 'center'}}>暂无备品配件信息</Text>
              )}
            </View>
          </Card>
          <Card style={{marginTop: 15,marginBottom:5, borderRadius: 0, width: '100%'}}>
            <View style={[ss.title]}>
              <Text style={[ss.titleTxt]}>相关手册</Text>
            </View>

            <View style={[ss.mainBox]}>
              {fileList.length != 0 ? (
                fileList.map((item, index) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: 44,
                    }}
                    key={index}
                    onPress={() => {
                      $fns.route({
                        context: this,
                        routeName: 'Pdf',
                        params: {
                          url: item,
                        },
                      });
                    }}>
                    <IconFont icon={'\ue67a'} size={20} color="red" />
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        marginLeft: 6,
                      }}>
                      {item.split('/').pop().substring(14)}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{textAlign: 'center'}}>暂无相关手册</Text>
              )}
            </View>
          </Card>
        </ScrollView>
      </>
    );
  }
}

let ss = StyleSheet.create({
  title: {
    flexDirection: 'row',
    height: 46,
    // backgroundColor: '#f6f6f6',
    borderColor: '#ddd',
    borderBottomWidth: 1,
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
