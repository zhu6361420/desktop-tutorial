import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {
  IconFont,
  UiHeader,
  UiDateTimePicker,
} from '../../../../../global.components';
import {$myTheme, $source, $ajax, api} from '../../../../../global.utils';
import {$fns} from '../../../../../utils/fns';
import moment from 'moment';
import {$ui} from '../../../../../utils/utils.ui';
import {formatSecondTotime} from '../../../../../utils/data';
const {getMachineStatus} = api;
export default class App extends React.Component {
  state = {
    isShow: true,
    dataList: [
      {isShow: false},
      {isShow: false},
      {isShow: false},
      {isShow: false},
      {isShow: false},
    ],
    machineStatus: [],
    startDate: null,
    endDate: null,
  };
  componentDidMount() {
    const {id, monthSelected, beginTime, endTime} = this.props.route.params;
    // alert(monthSelected[0])
    // let beginTime= moment().subtract(curTabIndex==1?7:curTabIndex==2?15:curTabIndex==3?30:0, 'days').format('YYYY-MM-DD 00:00:00');
    // let beginTime=moment(monthSelected[0]).startOf('month').format('YYYY-MM-DD 00:00:00');
    // let endTime =moment(monthSelected[0]).endOf('month').format('YYYY-MM-DD 23:59:59');
    // let currentTime=moment().format('YYYY-MM-DD hh:mm:ss');
    // if(endTime>currentTime){
    //     endTime=currentTime
    // }
    let current=moment().format('YYYY-MM-DD 23:59:59')
    // alert(current<endTime)
    // alert(endTime)
    this.setState({
        startDate:beginTime,
        endDate:current<endTime?current:endTime
    })
    this.getWorkingTime(id, beginTime, current<endTime?current:endTime);
  }
  getWorkingTime = (id, beginTime, endTime) => {
    // alert(endTime)
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
        let list = value.data.data;
        list.forEach((item) => {
          item.isShow = false;
          let a =
            item.faultDuration +
            item.pauseDuration +
            item.prepareDuration +
            item.runDuration;
          item.workingRadio =
            item.runDuration != 0
              ? ((item.runDuration / a) * 100).toFixed(2)
              : 0;
        });
        this.setState({
          machineStatus: list.reverse(),
        });
      }
    });
  };
  selectTime = (e, flag) => {
    let {startDate, endDate} = this.state;
    const {id} = this.props.route.params;
    if (flag == 1) {
      this.setState(
        {
          startDate: moment(e).format('YYYY-MM-DD 00:00:00'),
        },
        () => {
          if (endDate) {
            if (
              moment(endDate).diff(moment(this.state.startDate), 'days') > 60
            ) {
              $ui.toast('最多查询60天');
              return;
            }
            this.getWorkingTime(id, this.state.startDate, endDate);
          }
        },
      );
    } else {
      this.setState(
        {
          endDate: moment(e).format('YYYY-MM-DD 23:59:59'),
        },
        () => {
          if (startDate) {
            if (
              moment(this.state.endDate).diff(moment(startDate), 'days') > 60
            ) {
              $ui.toast('最多查询60天');
              return;
            }
            this.getWorkingTime(id, startDate, this.state.endDate);
          }
        },
      );
    }
  };
  render() {
    return (
      <>
        <UiHeader
          title="有效运行率"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />
        <UiDateTimePicker
          min="2020"
          ref="dateTimeRef"
          flag={1}
          currentDate={this.state.startDate}
          onComfirm={(e) => this.selectTime(e, 1)}
        />
        <UiDateTimePicker
          min="2020"
          ref="dateTimeRefs"
          flag={1}
          currentDate={this.state.endDate}
          onComfirm={(e) => this.selectTime(e, 2)}
        />
        <View
          style={[
            ss.titles,
            {
              backgroundColor: '#fff',
              borderTopWidth: 0.5,
              borderTopColor: '#eee',
            },
          ]}>
          <Text style={[ss.titleTxt]}>日期</Text>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
              // paddingBottom: 30,
            }}>
            <TouchableOpacity
              style={[ss.inputBox]}
              onPress={() => {
                this.refs.dateTimeRef.show();
              }}>
              <Text style={{color: '#666'}}>
                {this.state.startDate ? this.state.startDate : '开始日期'}
              </Text>
            </TouchableOpacity>
            <Text style={{paddingHorizontal: 10, color: 'black'}}>~</Text>
            <TouchableOpacity
              style={[ss.inputBox]}
              onPress={() => {
                this.refs.dateTimeRefs.show();
              }}>
              <Text style={{color: '#666'}}>
                {this.state.endDate ? this.state.endDate : '结束日期'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          style={{paddingVertical: 12, flex: 1}}
          data={this.state.machineStatus}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  backgroundColor: '#fff',
                  marginBottom: 10,
                  paddingHorizontal: 12,
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    height: 50,
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    item.isShow = !item.isShow;
                    var machineStatus = this.state.machineStatus;
                    machineStatus[index] = item;
                    this.setState({
                      machineStatus: [...machineStatus],
                    });
                  }}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View
                      style={{
                        width: 4,
                        height: 20,
                        backgroundColor: '#1c84c6',
                        marginRight: 6,
                      }}></View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: $myTheme.mainBlue,
                      }}>
                      {moment(item.censusDate).format('MM-DD')}
                    </Text>
                    <Text style={{fontSize: 16, marginLeft: 20}}>
                      有效运行率： {item.workingRadio}%
                    </Text>
                  </View>

                  <View
                    style={[
                      item.isShow
                        ? {transform: [{rotate: '180deg'}]}
                        : {transform: [{rotate: '0deg'}]},
                    ]}>
                    <IconFont
                      icon={'\ue61b'}
                      color={$myTheme.mainBlue}
                      size={20}
                    />
                  </View>
                </TouchableOpacity>

                {item.isShow && (
                  <View style={{borderTopWidth: 0.5, borderTopColor: '#ddd'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        height: 40,
                        alignItems: 'center',
                        paddingHorizontal: 12,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        <View style={[ss.ball]}></View>
                        <Text style={{fontSize: 16}}>
                          {/* 运行时长：{(item.runDuration / 3600).toFixed(1)}H */}
                          运行时长：{formatSecondTotime(item.runDuration)}
                          
                        </Text>
                      </View>

                      <Text style={{fontSize: 16}}>
                        占比：{item.runPercent}%
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        height: 40,
                        alignItems: 'center',
                        backgroundColor: '#eee',
                        paddingHorizontal: 12,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        <View
                          style={[ss.ball, {backgroundColor: '#1890f2'}]}></View>
                        <Text style={{fontSize: 16}}>
                          空闲时长：{formatSecondTotime(item.pauseDuration)}
                        </Text>
                      </View>

                      <Text style={{fontSize: 16}}>
                        占比：{item.pausePercent}%
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        height: 40,
                        alignItems: 'center',
                        paddingHorizontal: 12,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        <View
                          style={[
                            ss.ball,
                            {backgroundColor: '#fdb659'},
                          ]}></View>
                        <Text style={{fontSize: 16}}>
                          准备时长：{formatSecondTotime(item.prepareDuration)}
                        </Text>
                      </View>

                      <Text style={{fontSize: 16}}>
                        占比：{item.preparePercent}%
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        height: 40,
                        alignItems: 'center',
                        backgroundColor: '#eee',
                        paddingHorizontal: 12,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        <View
                          style={[
                            ss.ball,
                            {backgroundColor: '#ff4343'},
                          ]}></View>
                        <Text style={{fontSize: 16}}>
                          故障时长：{formatSecondTotime(item.faultDuration)}
                        </Text>
                      </View>

                      <Text style={{fontSize: 16}}>
                        占比：{item.faultPercent}%
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        height: 40,
                        alignItems: 'center',
                        paddingHorizontal: 12,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        <View
                          style={[ss.ball, {backgroundColor: '#b8b8b8'}]}></View>
                        <Text style={{fontSize: 16}}>
                          关机时长：{formatSecondTotime(item.stopDuration)}
                        </Text>
                      </View>

                      <Text style={{fontSize: 16}}>
                        占比：{item.stopPercent}%
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          }}
          keyExtractor={(item, index) => 'xx_' + index}
        />
      </>
    );
  }
}

let ss = StyleSheet.create({
  titles: {
    flexDirection: 'row',
    height: 46,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  titleTxt: {fontSize: 16},
  inputBox: {
    flex: 1,
    // minWidth:120,
    height: 34,
    borderWidth: 0.5,
    borderColor: '#666',
    borderRadius: 3,
    paddingVertical: 0,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {flexDirection: 'row', alignItems: 'center'},
  ball: {
    width: 10,
    height: 10,
    backgroundColor: '#21d29f',
    marginRight: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
});
