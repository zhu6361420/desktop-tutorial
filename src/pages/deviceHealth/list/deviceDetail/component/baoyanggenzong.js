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
} from '../../../../../global.components';
import {$myTheme, $source, $ajax, api} from '../../../../../global.utils';
import {$fns} from '../../../../../utils/fns';
import {Echarts, echarts} from 'react-native-secharts';
import {Card} from 'react-native-shadow-cards';
// import Echarts from 'native-echarts';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {
  isCustomAdmins,
  isYWAdmin,
  getMachineStatus,
  getMachineStatusColor,
  floatToTime,
  prefixZero,
  machineStatus,
} from '../../../../../utils/data';
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
    reverse: false,
  };
  componentDidMount() {}

  render() {
    // const {id, sequence, deviceTypeId, firm} = this.props.route.params;
    const {reverse} = this.state;
    return (
      <>
        <UiHeader
          title="保养跟踪"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />

        <ScrollView
          style={{
            backgroundColor: $myTheme.mainBgGray,
            marginBottom: 10,
            padding: 12,
            paddingTop: 0,
            // display: currentIndex ? 'flex' : 'none',
          }}
          ref={(r) => (this.scrollview = r)}>
          {[{name: '切割头', total: 180, current: 100},{name: '镜片', total: 100, current: 100}].map((item, index) => (
            <Card style={ss.card}>
              <HealthPane
                // onPress={() => this.shwoEnergyDetail(item)}
                style={{
                  marginBottom: 0,
                }}
                header={
                  <View
                    style={{
                      height: 30,
                      // backgroundColor: '#fff',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <LinearGradient
                      colors={['#80c0fe', '#288efc']}
                      useAngle={true}
                      angle={-45}
                      style={{
                        width: 5,
                        height: 20,
                        marginRight: 6,
                      }}></LinearGradient>
                    <Text>设备编号：HLF2525452335622</Text>
                  </View>
                }>
                <View>
                  {/* <Echarts height={220} option={this.jindutiaoOption()} /> */}
                  <View style={{width: '100%'}}>
                    <View
                      style={{
                        height: 25,
                        marginBottom: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{width: 60, fontSize: 16}}>{item.name}</Text>
                      <TouchableOpacity
                        style={{
                          width: 80,
                          height: '100%',
                          backgroundColor: '#1C84C6',
                          borderRadius: 10,
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            flex: 1,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                          }}>
                          完成保养
                        </Text>
                      </TouchableOpacity>
                    </View>
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
                              ($fns.getWindowWidth() - 45) *
                              (item.current / item.total).toFixed(1),
                            borderRadius: 10,
                          }}></View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            top: 5,
                            marginLeft:
                              ($fns.getWindowWidth() - 106) *
                              (item.current / item.total).toFixed(1),
                            left: '-50%',
                          }}>
                          {item.current}h
                        </Text>
                        <Text style={{top: 5}}>{item.total}h</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{marginTop: 9}}>
                    <Text style={{fontSize: 12}}>
                      已经运行满100 h，建议保养
                    </Text>
                  </View>
                  <View style={{marginTop: 19}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{marginBottom: 10}}>建议保养内容</Text>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            reverse: !this.state.reverse,
                          });
                        }}>
                        {reverse ? (
                          <IconFont icon={'\ue667'} size={20} color="#999" />
                        ) : (
                          <IconFont icon={'\ue61b'} size={20} color="#999" />
                        )}
                      </TouchableOpacity>
                    </View>

                    {!reverse && (
                      <>
                        <Text style={{fontSize: 12, lineHeight: 23}}>
                          1.清洁
                        </Text>
                        <Text style={{fontSize: 12}}>2.镜片清理</Text>
                      </>
                    )}
                  </View>
                </View>
              </HealthPane>
            </Card>
          ))}
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
