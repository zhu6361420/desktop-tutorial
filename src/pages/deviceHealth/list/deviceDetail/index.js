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
  Circle,
  HealthPane,
} from '../../../../global.components';
import {$myTheme, $source, $ajax, api} from '../../../../global.utils';
import {$fns} from '../../../../utils/fns';
import {Echarts, echarts} from 'react-native-secharts';
import {Card} from 'react-native-shadow-cards';
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
let viewWidth = 0;
const {
  getEveryDayEnergy,
  getEveryCharge,
  getRunStatus,
  getEveryElectric,
  LayoutAnimation,
} = api;
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    isShow: true,
    ChiLunAbility: 0.2,
    bujianList: [
      {url: require('../../../../assets/imgs/xilie1.png')},
      {url: require('../../../../assets/imgs/xilie2.png')},
      {url: require('../../../../assets/imgs/xilie3.png')},
      {url: require('../../../../assets/imgs/xilie4.png')},
      {url: require('../../../../assets/imgs/xilie5.png')},
      {url: require('../../../../assets/imgs/xilie6.png')},
    ],
  };
  componentDidMount() {}

  ChiLunStatus() {
    return (option = {
      series: [
        {
          type: 'gauge',
          radius: '46%',
          center: ['50%', '27%'],
          startAngle: 220,
          endAngle: -40,
          min: 0,
          max: 100,
          splitNumber: 4,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [0.5, '#f0ab58'],
                [1, '#56b38c'],
              ],
            },
          },
          progress: {
            show: true,
            width: 30,
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '30%',
            width: 0,
            offsetCenter: ['20%', '-10%'],
            itemStyle: {
              color: 'auto',
            },
          },
          axisTick: {
            length: 10,
            lineStyle: {
              color: 'auto',
              width: 2,
            },
          },
          splitLine: {
            length: 20,
            distance: 140,
            lineStyle: {
              color: 'auto',
              width: 3,
            },
            opacity: 1,
          },
          axisLabel: {
            color: '#464646',
            fontSize: 20,
            distance: -60,
            formatter: function (value) {
              if (value === 0) {
                return '??????';
              } else if (value === 100) {
                return '??????';
              }
            },
          },
          title: {
            offsetCenter: [0, '10%'],
            fontSize: 20,
            color: '#1C84C6',
          },
          detail: {
            fontSize: 40,
            offsetCenter: [0, '-20%'],
            valueAnimation: true,
            formatter: function (value) {
              return Math.round(value) + '???';
            },
            color: '#1C84C6',
          },
          data: [
            {
              value: 50,
              name: '????????????',
            },
          ],
        },
      ],
    });
  }
  TiJianOption() {
    const TypeJiaDongList = [
      {name: '??????????????????', value: 10},
      {name: '??????', value: 10},
      {name: '????????????', value: 10},
      {name: '?????????', value: 10},
      {name: '??????', value: 10},
      {name: '?????????', value: 10},
    ];
    let data = TypeJiaDongList.map((item) => parseFloat(item.value));
    let max = Math.max(...data) + 5;
    let name = TypeJiaDongList.map((item) => ({
      name: item.name,
      max: max,
    }));

    // if (TypeJiaDongList.length < 2) {
    //   name.push({name: '', max: max}, {name: '', max: max});
    // }
    // if (1 < TypeJiaDongList.length && TypeJiaDongList.length < 3) {
    //   name.push({name: '', max: max});
    // }
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
        center: ['50%', '30%'],
        radius: 80,
        splitNumber: 4,
        indicator: name,
        // [
        //   {name: '??????', max: 50},
        //   {name: '??????', max: 50},
        //   {name: '????????????', max: 50},
        //   {name: '??????', max: 50},
        //   {name: '??????', max: 50},
        // ],
      },
      series: [
        {
          name: '????????????',
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
  getText() {
    const {ChiLunAbility} = this.state;

    if (0 < ChiLunAbility * 100 < 50) {
      return '??????';
    } else if (50 < ChiLunAbility * 100 < 75) {
      return '????????????';
    } else {
      return '????????????';
    }
  }
  JianKangOption() {
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
          // name: '????????????',
          type: 'gauge',
          radius: '40%',
          center: ['50%', '23%'],
          axisLine: {
            show: true,
            lineStyle: {
              // ??????lineStyle??????????????????
              color: [
                //????????????
                [0.5, '#67d2a0'], //0-50%????????????
                [0.75, '#f1b657'], //51%-70%????????????
                [1, '#e73f3e'], //90%-100%????????????
              ],
              width: 10, //????????????
            },
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          title: {
            offsetCenter: [0, '-40%'],
            fontSize: 14,
          },
          detail: {formatter: '{value}%', fontSize: 16},
          data: [{value: ChiLunAbility * 100, name: this.getText()}],
        },
      ],
    });
  }
  componentWillUpdate() {
    LayoutAnimation.linear();
  }
  render() {
    // const {id, sequence, deviceTypeId, firm} = this.props.route.params;
    const {bujianList} = this.state;
    return (
      <>
        <UiHeader
          title="??????????????????"
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
          <Text style={{fontSize: 15}}>???????????????HLF2525452335622</Text>
        </View>

        <ScrollView
          style={{
            backgroundColor: $myTheme.mainBgGray,
            marginBottom: 10,
            padding: 12,
            paddingTop: 0,
            // display: currentIndex ? 'flex' : 'none',
          }}
          ref={(r) => (this.scrollview = r)}>
          <Card style={{marginTop: 4, borderRadius: 0, width: '100%'}}>
            <View style={[ss.title]}>
              <Text style={[ss.titleTxt]}>????????????</Text>
            </View>

            <View style={[ss.mainBox]}>
              <View style={{maxHeight: 200, marginBottom: 10}}>
                <Echarts option={this.ChiLunStatus()} />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: 'center',
                  marginBottom:20
                }}>
                <Image
                  style={{width: 14, height: 14}}
                  source={require('../../../../assets/imgs/warn.png')}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'red',
                    fontSize: 14,
                    marginLeft: 10,
                  }}>
                  ???????????????????????????50?????????????????????
                </Text>
              </View>
            </View>
          </Card>
          <Card style={ss.card}>
            <HealthPane
              // onPress={() => this.shwoEnergyDetail(item)}
              header={
                <Text style={{color: 'black', fontSize: 14}}>????????????</Text>
              }>
              <View style={{maxHeight: 220}}>
                <Echarts option={this.TiJianOption()} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}>
                {bujianList.map((item, index) => (
                  <View
                    style={{
                      width: 100,
                      // height: 70,
                      marginTop: 38,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Image style={{width: 21, height: 21}} source={item.url} />
                    <Text>9.5</Text>
                    <Text>??????????????????</Text>
                  </View>
                ))}
              </View>
            </HealthPane>
          </Card>
          <Card style={ss.card}>
            <HealthPane
              // onPress={() => this.shwoEnergyDetail(item)}
              header={
                <Text style={{color: 'black', fontSize: 14}}>????????????</Text>
              }>
              {[
                {name: '?????????', total: 180, current: 180},
                {name: '??????', total: 110, current: 110},
                {name: '?????????', total: 130, current: 10},
              ].map((item, index) => (
                <View style={{marginBottom: 10}}>
                  {/* <Echarts height={220} option={this.jindutiaoOption()} /> */}
                  <View style={{width: '100%', flexDirection: 'row'}}>
                    <Text style={{width: 60}}>{item.name}</Text>
                    <View style={{flex: 1}}>
                      <View
                        style={{
                          backgroundColor: '#EBEBEB',
                          height: 20,
                          borderRadius: 10,
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            backgroundColor:
                              item.current < item.total ? '#1C84C6' : '#f37280',
                            height: 20,
                            width:
                              ($fns.getWindowWidth() - 106) *
                              (item.current / item.total).toFixed(1),
                            borderRadius: 10,
                          }}></View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={{top: 5}}>{item.current}h</Text>
                        <Text style={{top: 5}}>{item.total}h</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{marginTop: 5, alignItems: 'center'}}>
                    <Text>???????????????100 h???????????????</Text>
                  </View>
                </View>
              ))}
            </HealthPane>
          </Card>
          <Card style={ss.card}>
            <HealthPane
              // onPress={() => this.shwoEnergyDetail(item)}
              header={
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    width: '100%',
                  }}>
                  <Text style={{color: 'black', fontSize: 14}}>????????????</Text>
                  <Text style={{color: '#A1A1A1', fontSize: 14}}>
                    2021???05???
                  </Text>
                </View>
              }>
              <View
                style={{
                  maxHeight: 220,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <Circle progress={20} color="#1C84C6" status="????????????" />
                <Circle progress={50} color="#F8AC59" status="????????????" />
                <Circle progress={10} color="#ED5565" status="????????????" />
              </View>
            </HealthPane>
          </Card>
          <Card style={ss.card}>
            <HealthPane
              // onPress={() => this.shwoEnergyDetail(item)}
              header={
                <Text style={{color: 'black', fontSize: 14}}>
                  ????????????AI??????
                </Text>
              }>
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    width: '60%',
                    color: '#1C84C6',
                    lineHeight: 20,
                    textAlign: 'center',
                  }}>
                  ????????????????????????????????????50%????????????????????????
                </Text>
                <View
                  style={{maxHeight: 170, width: '100%', alignItems: 'center'}}>
                  <Echarts option={this.JianKangOption()} />
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 25,
                        backgroundColor: '#1AB394',
                        marginRight: 2,
                      }}></View>
                    <Text>??????</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 25,
                        backgroundColor: '#F8AC59',
                        marginRight: 2,
                      }}></View>
                    <Text>????????????</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 25,
                        backgroundColor: '#ED5565',
                        marginRight: 2,
                      }}></View>
                    <Text>????????????</Text>
                  </View>
                </View>
              </View>
            </HealthPane>
          </Card>
          <Card style={ss.card}>
            <HealthPane
              // onPress={() => this.shwoEnergyDetail(item)}
              header={
                <Text style={{color: 'black', fontSize: 14}}>??????????????????</Text>
              }>
              <View
                style={{
                  maxHeight: 220,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <View
                  style={{
                    padding: 12,
                    height: 164,
                    backgroundColor: '#1C84C6',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: '#FFFFFF', fontSize: 36}}>0</Text>
                  <Text style={{color: '#FFFFFF', fontSize: 14}}>
                    ??????????????????
                  </Text>
                </View>
                <ImageBackground
                  source={require('../../../../assets/imgs/xilie11.png')}
                  style={{
                    padding: 12,
                    height: 164,
                    width:155,
                    alignItems: 'flex-start',
                    justifyContent: 'space-around',
                    // borderColor:'red',
                    // borderWidth:1
                  }}
                  resizeMode="stretch">
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{width: 21, height: 21}}
                      source={require('../../../../assets/imgs/xilie7.png')}
                    />
                    <Text
                      style={{color: '#1C84C6', fontSize: 14, marginLeft: 8}}>
                      ?????????
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{width: 21, height: 21}}
                      source={require('../../../../assets/imgs/xilie8.png')}
                    />
                    <Text
                      style={{color: '#1C84C6', fontSize: 14, marginLeft: 8}}>
                      85%
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{width: 21, height: 21}}
                      source={require('../../../../assets/imgs/xilie9.png')}
                    />
                    <Text
                      style={{color: '#1C84C6', fontSize: 14, marginLeft: 8}}>
                      14000mm/min
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{width: 21, height: 21}}
                      source={require('../../../../assets/imgs/xilie10.png')}
                    />
                    <Text
                      style={{color: '#1C84C6', fontSize: 14, marginLeft: 8}}>
                      0kg
                    </Text>
                  </View>
                </ImageBackground>
              </View>
            </HealthPane>
          </Card>
        </ScrollView>
      </>
    );
  }
}

let ss = StyleSheet.create({
  card: {
    marginTop: 15,
    borderRadius: 0,
    width: '100%',
  },
  progress: {
    height: 20,
    width: 300,
    marginLeft: 50,
    marginRight: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'blue',
  },
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
    // backgroundColor: '#fff',
    // borderColor: 'red',
    // borderWidth: 1,
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
