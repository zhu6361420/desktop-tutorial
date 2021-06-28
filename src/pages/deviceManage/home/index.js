import React from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import {Select, Option} from 'react-native-chooser';
import {ScrollView} from 'react-native-gesture-handler';
import {UiHeader, UiPicker, EchartsView} from './../../../global.components';
//import {MarqueeVertical} from 'react-native-marquee-ab';
import {MarqueeHorizontal, MarqueeVertical} from 'react-native-marquee-ab';
import debounce from '../../../utils/debounce';
import IconFont from '../../../components/IconFont';
import {$fns, $myTheme, $ajax, api} from './../../../global.utils';
import {isCustomAdmins} from '../../../utils/data';
import {Echarts, echarts} from 'react-native-secharts';
import {Card} from 'react-native-shadow-cards';
const {
  find,
  getAlarmList,
  gerEnergyDailyTop,
  getMaintainCompelteNum,
  getDayWorkingRadio,
  getMonthWorkingRadio,
  getDeviceTypeRadio,
  getTopJiaDong,
  getAlarmTypeSummary,
  getFirmAlarmTop,
  getGroupList,
  countUser,
} = api;
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
// ==== 新增加 ====
import moment from 'moment';
import {$ui} from '../../../utils/utils.ui';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      machine_status: [],
      maintainData: [
        // {name: '已完成机床数', value: 1, itemStyle: {color: '#5786e7'}},
        // {name: '未完成机床数', value: 1, itemStyle: {color: '#ff4d4f'}},
      ],
      alarmList: [],
      FirmDayEnery: [],
      average: 0,
      curTabIndex: 1,
      monthSelected: '',
      firmId: '',
      DayWorkingRadioList: [],
      TypeJiaDongList: [],
      topJiaDongList: [],
      alarmLevel: [],
      alarmtopList: [],
      box_total: 0,
      machine_total: 0,
      groupName: '',
      groupList: [],
      groupFilterList: [],
      isSearchShow: false,
      selectOne: {},
      userCount: 0,
    };
  }

  updateUser = (user) => {
    this.setState({user: user});
  };
  componentDidMount() {
    // let data = JSON.parse(sto.getValue('loginData'));
    // console.log('加载了' + this.props.firmId);
    let firmId = this.props.firmId;
    let beginTime = moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00');
    let endTime = moment().format('YYYY-MM-DD 00:00:00');
    let groupId = null;
    // this.AlarmLevel(firmId);
    this.getMachineStatus(firmId, groupId);
    this.getAlarmList(firmId, groupId);
    this.getMaintainCompelteNum(firmId, groupId);
    this.getTopJiaDon(firmId, groupId);
    this.countUser();
    this.getDayWorkingRadio(
      beginTime,
      moment().format('YYYY-MM-DD 23:59:59'),
      firmId,
      groupId,
    );
    this.getTypeJiaDong(firmId, groupId);
    this.getAlarmToop(firmId, groupId);
    this.getGroupLists();
  }
  componentWillUnmount() {
    this.refs.month.hide();
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
  getGroupLists = () => {
    $ajax({
      url: getGroupList,
      data: {
        args: {
          name: '',
        },
        pageNum: 1,
        pageSize: 100,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const {list} = value.data;
        // console.log(list);
        this.setState({
          groupList: list,
          groupFilterList: list,
        });
      }
    });
  };
  getMachineStatus = (firmId, groupId) => {
    $ajax({
      url: find,
      data: {
        firmId: firmId,
        groupId: groupId,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        // console.log(value.data);
        const status = [
          {
            value: value.data.machine_state_rt[1].percent,
            name: `运行:${value.data.machine_state_rt[1].amount}台`,
            itemStyle: {color: '#72e8af'},
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
          {
            value: value.data.machine_state_rt[4].percent,
            name: `准备:${value.data.machine_state_rt[4].amount}台`,
            itemStyle: {color: '#fdb75a'},
          },
        ];
        let terminal = status.filter(function (item, index) {
          return item.value > 0;
        });
        let {alarm_type} = value.data;
        this.setState({
          machine_status: terminal,
          box_total: value.data.box_total.amount,
          machine_total: value.data.machine_total.amount,
          alarmLevel: alarm_type,
        });
      }
    });
  };
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
        //   formatter: function(value) {
        //     var index = 0;
        //     // var clientlabels = machine_status.map((item)=>item.name);
        //     var clientcounts = ['空闲1'];
        //     // clientlabels.forEach(function(value,i){
        //     //     if(value == name){
        //     //         index = i;
        //     //     }
        //     // });
        //     return value + "  " + clientcounts[index];
        // },
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
            // formatter: '{d|{c}}{p|%}\n{b|{b}}',
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
  maintainOption() {
    const {maintainData} = this.state;
    // let name = (machineStatus || []).map((item) => item.name);
    option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}',
      },

      series: [
        {
          name: '养护数量',
          type: 'pie',
          radius: '65%',
          data: maintainData,
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: '{b}({c})',
              },
              labelLine: {
                show: true,
                length: 2,
                show: true,
                lineStyle: {
                  color: '#b2b2b2',
                },
              },
            },
          },
        },
      ],
    };
    return option;
  }
  getAlarmList = (firmId, groupId) => {
    $ajax({
      url: getAlarmList,
      data: {
        args: {
          startTime: moment().format('YYYY-MM-DD 00:00:00'),
          endTime: moment().format('YYYY-MM-DD 23:59:59'),
          firmId: firmId,
          groupId: groupId,
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
        // console.log(arr);
        this.setState({
          alarmList: arr,
        });
      }
    });
  };

  getMaintainCompelteNum = (firmId, groupId) => {
    $ajax({
      url: getMaintainCompelteNum,
      data: {
        firmId: firmId,
        groupId: groupId,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const {finishedMac, unFinishedMac} = value.data;

        this.setState({
          maintainData: [
            {
              name: '已完成机床数',
              value: finishedMac,
              itemStyle: {color: '#21d29f'},
            },
            {
              name: '未完成机床数',
              value: unFinishedMac,
              itemStyle: {color: '#b8b8b8'},
            },
          ],
        });
      }
    });
  };
  onChangeTab(e) {
    this.setState({
      curTabIndex: e,
    });
    let beginTime = [
      moment().format('YYYY-MM-DD'),
      moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00'),
      moment().subtract(29, 'days').format('YYYY-MM-DD 00:00:00'),
    ];
    let data = JSON.parse(sto.getValue('loginData'));
    let firmId = data.userData.firmId;
    let endTime = moment().format('YYYY-MM-DD 23:59:59');
    if (e == 1) {
      this.getDayWorkingRadio(
        beginTime[e],
        endTime,
        firmId,
        this.state.selectOne.id,
      );
    }
    if (e == 3) {
      this.getMonthWorkingRadio(firmId, this.state.selectOne.id);
    }
  }
  onSelect(value, label) {
    this.setState({value: value});
  }
  //公司每日有效运行率
  getDayWorkingRadio = (beginTime, endTime, firmId, groupId) => {
    $ajax({
      url: getDayWorkingRadio,
      data: {
        firmId: firmId,
        groupId: groupId,
        beginTime: beginTime,
        endTime: endTime,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const list = value.data;
        this.setState({
          DayWorkingRadioList: list,
        });
      }
    });
  };
  //公司年有效运行率
  getMonthWorkingRadio = (firmId, groupId) => {
    $ajax({
      url: getMonthWorkingRadio,
      data: {
        firmId: firmId,
        beginTime: moment(monthList[monthList.length - 1]).format(
          'YYYY-MM-DD 00:00:00',
        ),
        endTime: moment().format('YYYY-MM-01 00:00:00'),
        groupId: groupId,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const list = value.data;
        this.setState({
          DayWorkingRadioList: list,
        });
      }
    });
  };
  JiaDongOption() {
    const {DayWorkingRadioList} = this.state;
    let time = [];
    if (this.state.curTabIndex == 3) {
      time = (DayWorkingRadioList || []).map((item) =>
        moment(item.census_date).format('MM'),
      );
    } else {
      time = (DayWorkingRadioList || []).map((item) =>
        moment(item.census_date).format('MM-DD'),
      );
    }

    let data = (DayWorkingRadioList || []).map((item) =>
      item.workingRatio.toFixed(2),
    );
    return (option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}',
      },
      grid: {
        top: 35,
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
        color: 'green',
      },
      series: [
        {
          name: '有效运行率',
          data: data,
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
  monthSelect = (value, index) => {
    let begin = moment(value[0]).startOf('month').format('YYYY-MM-DD 00:00:00');
    let end = moment(value[0]).endOf('month').format('YYYY-MM-DD 23:59:59');
    let data = JSON.parse(sto.getValue('loginData'));
    let firmId = data.userData.firmId;
    this.getDayWorkingRadio(begin, end, firmId, this.state.selectOne.id);
    this.setState({
      monthSelected: value,
    });
  };
  //设备类型有效运行率
  getTypeJiaDong = (firmId, groupId) => {
    $ajax({
      url: getDeviceTypeRadio,
      data: {
        firmId: firmId,
        groupId: groupId,
        queryDate: moment().format('YYYY-MM-DD'),
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const list = value.data;
        this.setState({
          TypeJiaDongList: list,
          // JiaDongByCompany:ListBylistCompany.slice(0,5)
        });
      }
    });
  };
  TypeJiaDongOption() {
    const {TypeJiaDongList} = this.state;
    let data = TypeJiaDongList.map((item) =>
      parseFloat(item.avgworkratio.toFixed(2)),
    );
    let max = Math.max(...data) + 5;
    let name = TypeJiaDongList.map((item) => ({
      name: item.device_type_name[0],
      max: max,
    }));

    if (TypeJiaDongList.length < 2) {
      name.push({name: '', max: max}, {name: '', max: max});
      // data.push(,0)
    }
    if (1 < TypeJiaDongList.length && TypeJiaDongList.length < 3) {
      name.push({name: '', max: max});
      // data.push(,0)
    }
    return (option = {
      tooltip: {
        position: ['40%', '10%'],
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
              // name:names
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
  //有效运行率排行
  getTopJiaDon = (firmId, groupId) => {
    $ajax({
      url: getTopJiaDong,
      data: {
        args: {
          beginTime: moment().format('YYYY-MM-DD 00:00:00'),
          endTime: moment().format('YYYY-MM-DD 23:59:59'),
          firmId: firmId,
          groupId: groupId,
          orderBy: 'workingRatio DESC',
        },
        pageNum: 1,
        pageSize: 20,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const {list} = value.data;
        console.log(list);
        this.setState({
          topJiaDongList: list.slice(0, 5),
          // JiaDongByCompany:ListBylistCompany.slice(0,5)
        });
      }
    });
  };
  //设备有效运行率排行
  DeviceJiaDongOption() {
    const {topJiaDongList} = this.state;
    // console.log(topJiaDongList)
    let names = topJiaDongList.map((item) => item.machineSequence);
    let data = topJiaDongList.map((item) => item.workingRatio);
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
        left: '2%',
        right: '3%',
        bottom: '8%',
        top: 35,
        containLabel: true,
      },
      xAxis: [
        {
          name: '有效运行率(%)',
          nameTextStyle: {
            fontSize: 12,
            color: '#333333',
            fontWeight: 'bold',
          },
          nameGap: 25,
          nameLocation: 'middle',
          type: 'value',
        },
      ],
      yAxis: [
        {
          name: '设备名',
          nameTextStyle: {
            fontSize: 12,
            color: '#333333',
            fontWeight: 'bold',
          },
          nameGap: 15,
          nameLocation: 'end',
          type: 'category',
          data: names.reverse(),
          // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            show: true,
            interval: 0,
            formatter: function (params) {
              var paramsNameNumber = params.length;
              let resolveName = '';
              if (paramsNameNumber > 5) {
                resolveName = params.substring(0, 4);
                resolveName += '...';
                // resolveName = params;
              } else {
                resolveName = params;
              }
              return resolveName;
            },
          },
        },
      ],
      series: [
        {
          name: '有效运行率',
          type: 'bar',
          barWidth: '60%',
          label: {
            show: true,
            position: ['30%', '99%'],
            fontSize: 10,
            formatter: (data) => {
              if (data.value == 0) {
                return '';
              }
              return '(' + data.name + ')' + data.value + '%';
            },
          },
          data: data.reverse(),
          // [10, 52, 200,   330, 220],
        },
      ],
    });
  }
  //报警等级
  AlarmLevelOption() {
    const {alarmLevel} = this.state;
    let names = alarmLevel.map((item) => item.type);
    let data = alarmLevel.map((item) => item.amount);
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
        left: '2%',
        right: '3%',
        bottom: '8%',
        top: 25,
        containLabel: true,
      },
      xAxis: [
        {
          name: '数量(个)',
          nameTextStyle: {
            fontSize: 12,
            color: '#333333',
            fontWeight: 'bold',
          },
          nameGap: 25,
          nameLocation: 'middle',
          type: 'value',
        },
      ],
      yAxis: [
        {
          name: '类型',
          nameTextStyle: {
            fontSize: 12,
            color: '#333333',
            fontWeight: 'bold',
          },
          nameGap: 8,
          nameLocation: 'end',
          type: 'category',
          data: names,
          // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0,
            formatter: function (params) {
              var paramsNameNumber = params.length;
              let resolveName = '';
              if (paramsNameNumber > 11) {
                resolveName = params.substring(0, 10);
                resolveName += '...';
              } else {
                resolveName = params;
              }
              return resolveName;
            },
          },
        },
      ],
      series: [
        {
          name: '数量',
          type: 'bar',
          barWidth: '60%',
          data: data,
          // [10, 52, 200, 334, 390, 330, 220]
        },
      ],
    });
  }
  //前十报警
  getAlarmToop = (firmId, groupId) => {
    $ajax({
      url: getFirmAlarmTop,
      data: {
        ownerId: firmId,
        groupId: groupId,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let col = Object.getOwnPropertyNames(value.data);
        this.setState({
          alarmtopList: col.slice(0, 5),
        });
      }
    });
  };

  getGroupList = (text) => {
    this.setState(
      {
        groupName: text,
      },
      () => {
        let list = [];
        if (this.state.groupList.length != 0) {
          list = this.state.groupList.filter((item) => {
            return item.name.indexOf(text) != -1;
          });
          this.setState({
            groupFilterList: list,
          });
        }
      },
    );
  };
  select = (item) => {
    this.setState(
      {
        isSearchShow: false,
        groupName: item.name,
        firmId: item.id,
        roleId: 4,
        selectOne: item,
      },
      () => {
        global_group = item.id;
        let firmId = this.props.firmId;
        let beginTime = moment()
          .subtract(6, 'days')
          .format('YYYY-MM-DD 00:00:00');
        this.getMachineStatus(firmId, item.id);
        this.getAlarmList(firmId, item.id);
        this.getMaintainCompelteNum(firmId, item.id);
        this.getTopJiaDon(firmId, item.id);
        this.getDayWorkingRadio(
          beginTime,
          moment().format('YYYY-MM-DD 23:59:59'),
          firmId,
          item.id,
        );
        this.getTypeJiaDong(firmId, item.id);
        this.getAlarmToop(firmId, item.id);
      },
    );
  };
  reset = () => {
    this.setState(
      {
        selectOne: {},
        groupName: '',
        roleId: 1,
        curTabIndex: 1,
        groupFilterList: this.state.groupList,
      },
      () => {
        global_group = null;
        let firmId = this.props.firmId;
        let beginTime = moment()
          .subtract(6, 'days')
          .format('YYYY-MM-DD 00:00:00');
        let groupId = null;
        // this.AlarmLevel(firmId);
        this.getMachineStatus(firmId, groupId);
        this.getAlarmList(firmId, groupId);
        this.getMaintainCompelteNum(firmId, groupId);
        this.getTopJiaDon(firmId, groupId);
        this.getDayWorkingRadio(
          beginTime,
          moment().format('YYYY-MM-DD 23:59:59'),
          firmId,
          groupId,
        );
        this.getTypeJiaDong(firmId, groupId);
        this.getAlarmToop(firmId, groupId);
      },
    );
  };
  render() {
    const {
      curTabIndex,
      monthSelected,
      machine_total,
      box_total,
      selectOne,
      isSearchShow,
      userCount,
    } = this.state;
    return (
      <>
        <UiPicker
          ref="month"
          datas={monthList}
          onConfirm={(_value, _index) => this.monthSelect(_value, _index)}
        />
        {isCustomAdmins() && (
          <View style={[ss.view]}>
            {Object.keys(selectOne).length == 0 && (
              <TextInput
                placeholder="请输入部门名称"
                style={[ss.input]}
                value={this.state.groupName}
                onFocus={() => {
                  this.setState({
                    isSearchShow: true,
                  });
                }}
                // onBlur={() => {
                //   this.setState({
                //     isSearchShow: false,
                //   });
                // }}
                onChangeText={(text) => this.getGroupList(text)}
              />
            )}
            {Object.keys(selectOne).length != 0 && (
              <View style={[ss.input]}>
                <Text style={[ss.wenzi]}>{selectOne.name}</Text>
                <TouchableOpacity
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}
                  onPress={this.reset}>
                  <Text style={{color: '#1c83c6'}}>清空</Text>
                </TouchableOpacity>
              </View>
            )}
            {isSearchShow && (
              <View style={[ss.search]}>
                <ScrollView keyboardShouldPersistTaps={'handled'}>
                  {this.state.groupFilterList.map((item) => (
                    <TouchableOpacity onPress={() => this.select(item)}>
                      <Text style={ss.inputText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}
        <ScrollView
          style={{flex: 1, padding: 12, marginBottom: 10}}
          alwaysBounceVertical={false}>
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
                      用户数量
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
                  <Image
                    source={require('../../../assets/imgs/box_right.png')}
                  />
                </ImageBackground>
              </View>
            </View>
          </Card>
          <EchartsView
            title="平台接入与配置"
            option={this.statusOption()}
            length={this.state.machine_status.length}
          />
          <EchartsView
            title="今日设备类型有效运行率统计"
            option={this.TypeJiaDongOption()}
            length={this.state.TypeJiaDongList.length}
          />

          <View>
            <View style={[sss.title]}>
              <Text style={[sss.titleTxt]}>设备平均有效运行率</Text>
              <View style={[sss.titleMain]}>
                <TouchableOpacity
                  style={[
                    sss.dayItem,
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
                    sss.dayItem,
                    curTabIndex == 2
                      ? {backgroundColor: '#e6effe'}
                      : {backgroundColor: '#fff'},
                  ]}
                  onPress={() => {
                    this.refs.month.show();
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
                    sss.dayItem,
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

            <View style={[sss.mainBox]}>
              {this.state.DayWorkingRadioList.length != 0 ? (
                <Echarts option={this.JiaDongOption()} height={200} />
              ) : (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{textAlign: 'center'}}>暂无有效运行率信息</Text>
                </View>
              )}
            </View>
          </View>
          <EchartsView
            title="今日有效运行率排行前五设备"
            option={this.DeviceJiaDongOption()}
            length={this.state.topJiaDongList.length}
          />

          <EchartsView
            title="报警类型统计(当日)"
            option={this.AlarmLevelOption()}
            length={this.state.alarmLevel.length}
          />

          <Card style={{marginTop: 15, borderRadius: 0, width: '100%'}}>
            <View style={[sss.title]}>
              <Text style={[sss.titleTxt]}>高频报警TOP5</Text>
            </View>

            <View style={[sss.mainBox]}>
              {this.state.alarmtopList.length != 0 ? (
                this.state.alarmtopList.map((item, index) => (
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
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '190%',
                      }}>
                      <IconFont icon={'\ue747'} size={30} color="red" />

                      <MarqueeVertical
                        textList={[{label: item, value: item}]}
                        width={Dimensions.get('window').width * 0.88}
                        height={50}
                        delay={4800}
                        direction={'up'}
                        textStyle={{fontSize: 14}}
                        numberOfLines={2}
                        onTextClick={(item) => {
                          $ui.alert(item.value, '报警');
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{textAlign: 'center'}}>暂无高频次报警信息</Text>
                </View>
              )}
            </View>
          </Card>
          <EchartsView
            title="养护完成概况"
            option={this.maintainOption()}
            length={this.state.maintainData.length}
          />
        </ScrollView>

        {/** 新增加 */}
      </>
    );
  }
}

let ss = StyleSheet.create({
  view: {
    marginTop: 8,
    paddingLeft: 12,
    paddingRight: 12,
  },
  input: {
    paddingLeft: 10,
    height: 34,
    // borderColor: '#fafafa',
    paddingTop: 0,
    paddingVertical: 0,
    borderWidth: 1.5,
    borderColor: '#1c83c6',
    borderRadius: 6,
    textAlignVertical: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wenzi: {
    textAlignVertical: 'center',
  },
  inputText: {
    height: 40,
    borderColor: '#e5e5e5',
    borderBottomWidth: 0.5,
    textAlignVertical: 'center',
    paddingLeft: 10,
  },
  search: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    // position: 'absolute',
    // top: 34,
    // zIndex: 999,
    backgroundColor: '#fff',
    // borderColor: 'red',
    // borderWidth: 1,
    // borderRightWidth: 0.5,
    // borderLeftWidth: 0.5,
    maxHeight: 200,
  },
});
let sss = StyleSheet.create({
  title: {
    flexDirection: 'row',
    height: 46,
    // backgroundColor: '#ece9e9',
    borderColor: '#ddd',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  titleTxt: {fontSize: 16, color: '#222'},
  titleMain: {flexDirection: 'row', flex: 1, justifyContent: 'flex-end'},
  mainBox: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: '#fff',
    // minHeight: 200,
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
