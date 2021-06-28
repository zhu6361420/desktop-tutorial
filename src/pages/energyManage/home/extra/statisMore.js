import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {$fns} from '../../../../global.utils';
import {
  UiHeader,
  MsgPane,
  EchartsView,
  MsgRow,
} from '../../../../global.components';
import {$ajax, api} from '../../../../global.utils';
import {isYWAdmin} from '../../../../utils/data';
import {
  renderErrorView,
  renderLoadingView,
  renderFooter,
} from '../../../../components/Listextra';
import moment from 'moment';
// 筛选面板
const {getConsumeWithDateDailyForAll} = api;
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    topDevice: [],
    height: 400,
  };
  componentDidMount() {
    const {monthBegin, monthEnd} = this.props.route.params;
    this.getConsumeWithDateDailyForAll(monthBegin, monthEnd);
  }
  getConsumeWithDateDailyForAll = (start, end) => {
    let data = JSON.parse(sto.getValue('loginData'));
    let firmId = data.userData.firmId;
    $ajax({
      url: getConsumeWithDateDailyForAll,
      data: {
        args: {
          startDate: start,
          endDate: end,
          firmId: firmId,
        },
        pageNum: 1,
        pageSize: 999,
      },
      _this: this,
      hasLoading: false,
    }).then((value) => {
      if (value.code == 200) {
        let {list} = value.data;
        console.log(list)
        this.setState({
          topDevice: list,
          height: list.length * 40,
        });
      }
    });
  };
  //能耗列表和设备能耗前三名排行
  chargeOption() {
    const {topDevice} = this.state;
    // let list = topDevice.filter((item, index) => {
    //   return (
    //     moment(item.consumeDate).format('MM-DD') >=
    //     moment().startOf('months').format('MM-DD')
    //   );
    // });
    let list=topDevice;
    let highMoney = [],
      avgMoney = [],
      lowMoney = [],
      normalMoney=[],
      time = [];
    if (list.length != 0) {
      highMoney = list.map((item) => item.highMoney);
      avgMoney = list.map((item) => item.avgMoney);
      lowMoney = list.map((item) => item.lowMoney);
      normalMoney= list.map((item) => item.normalMoney);
      time = list.map((item) => moment(item.consumeDate).format('MM-DD'));
    }
    return (option = {
      //   color: ['#3398DB'],
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
      yAxis: [
        {
          type: 'category',
          data: time,
          //   axisTick: {
          //     alignWithLabel: true,
          //   },
        },
      ],
      xAxis: [
        {
          type: 'value',
          name: '电费(元)',
        },
      ],
      series: [
        {
          name: '峰时',
          type: 'bar',
          //   barWidth: '60%',
          barMinHeight: 0, //最小柱高
          data: highMoney,
          stack: '电费',
          color: ' #1AB394',
          label: {
            show: false,
          },
        },
        {
          name: '平时',
          type: 'bar',
          //   barWidth: '60%',
          barMinHeight: 0, //最小柱高
          data: avgMoney,
          stack: '电费',
          color: '#EF6A78',
          label: {
            show: false,
          },
        },
        {
          name: '谷时',
          type: 'bar',
          //   barWidth: '60%',
          barMinHeight: 0, //最小柱高

          data: lowMoney,
          stack: '电费',
          color: '#1C84C6',
          label: {
            show: false,
          },
        },
        {
          name: '通用',
          type: 'bar',
          //   barWidth: '60%',
          barMinHeight: 0, //最小柱高

          data: normalMoney,
          stack: '电费',
          color: '#61a0a8',
          label: {
            show: false,
          },
        },
        
      ],
    });
  }
  render() {
    const {topDevice, height} = this.state;
    const {singleData,monthBegin} = this.props.route.params;
    return (
      <>
        <UiHeader
          title="统计详情"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />
        <ScrollView style={{flex: 1, marginTop: 15}}>
          <View
            style={{
              //   height: 330,
              backgroundColor: '#1C84C6',
              width: '100%',
              borderRadius: 10,
            }}>
            <View
              style={{
                flex: 1,
                margin: 12,
                backgroundColor: '#fff',
                borderRadius: 10,
                padding: 10,
              }}>
              <View style={[ss.row]}>
                <Text style={{fontSize: 17, color: '#1C84C6'}}>{moment(monthBegin).format('M')}月统计</Text>
              </View>
              <View style={[ss.row]}>
                <Text style={[ss.title]}>使用总电费：{singleData.price}元</Text>
                <Text style={{marginLeft:10, fontSize: 15, color: '#1C84C6'}}>
                  使用总能耗：{singleData.power}KWH
                </Text>
              </View>
              <View style={[ss.row]}>
                <Text style={[ss.title]}>峰时：{singleData.highMoney}元/{singleData.highPower}KWH</Text>
              </View>
              <View style={[ss.row]}>
                <Text style={[ss.title]}>平时：{singleData.avgMoney}元/{singleData.avgPower}KWH</Text>
              </View>
              <View style={[ss.row]}>
                <Text style={[ss.title]}>谷时：{singleData.lowMoney}元/{singleData.avgPower}KWH</Text>
              </View>
              <View style={[ss.row]}>
                <Text style={[ss.title]}>通用电价：{singleData.normalMoney}元/{singleData.normalPower}KWH</Text>
              </View>
            </View>
          </View>
          <View >
            <EchartsView
              title={'电费统计'}
              option={this.chargeOption()}
              length={topDevice.length}
              height={350}
              tooltip={
                [
                {color: '#1AB394', mode: 'rect', text: '峰时'},
                {color: '#EF6A78', mode: 'rect', text: '平时'},
                {color: '#1C84C6', mode: 'rect', text: '谷时'},
                {color: '#61a0a8', mode: 'rect', text: '通用'},
                
              ]}
            />
          </View>
        </ScrollView>
      </>
    );
  }
}
{
  /* <Lazylist data={} renderItem={} onEndReached={} />; */
}

const ss = StyleSheet.create({
  row: {
    height: 30,
    marginHorizontal: 13,
    // borderColor: 'red',
    // borderWidth: 1,
    // justifyContent:'space-between',
    flexDirection: 'row',
  },
  title: {
    fontSize: 15,
    color: '#1C84C6',
  },
});
