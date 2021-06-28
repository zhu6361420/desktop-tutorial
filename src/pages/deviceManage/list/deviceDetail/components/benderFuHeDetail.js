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
const {getBendFuHe} = api;
export default class App extends React.Component {
  state = {
    isShow: true,
    FuheList: [],
    startDate: null,
    endDate: null,
  };
  componentDidMount() {
    const {id, FuheList,beginTime, endTime} = this.props.route.params;
    let current=moment().format('YYYY-MM-DD 23:59:59')
    this.setState({
        startDate:beginTime,
        endDate:current<endTime?current:endTime,
        FuheList:FuheList.reverse()
    })
  }
  getBendFuHe = (id, beginTime, endTime) => {
    $ajax({
      url: getBendFuHe,
      data: {
        machineId: id,
        startdate: beginTime,
        stopdate: endTime,
      },
      type:'get',
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const FuheList = value.data;
        this.setState({
          FuheList: FuheList.reverse(),
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
          startDate: moment(e).format('YYYY-MM-DD'),
        },
        () => {
          if (endDate) {
            if (
              moment(endDate).diff(moment(this.state.startDate), 'days') > 60
            ) {
              $ui.toast('最多查询60天');
              return;
            }
            this.getBendFuHe(id, this.state.startDate, endDate);
          }
        },
      );
    } else {
      this.setState(
        {
          endDate: moment(e).format('YYYY-MM-DD'),
        },
        () => {
          if (startDate) {
            if (
              moment(this.state.endDate).diff(moment(startDate), 'days') > 60
            ) {
              $ui.toast('最多查询60天');
              return;
            }
            this.getBendFuHe(id, startDate, this.state.endDate);
          }
        },
      );
    }
  };
  render() {
    return (
      <>
        <UiHeader
          title="负荷状态"
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
          style={{paddingVertical: 12,marginBottom:10, flex: 1}}
          data={this.state.FuheList}
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
                  >
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
                      {moment(item.workDate).format('MM-DD')}
                    </Text>
                    <Text style={{fontSize: 16, marginLeft: 20}}>
                      折弯次数： {item.workPieceAmount}
                    </Text>
                  </View>

           
                </TouchableOpacity>

         
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
    backgroundColor: 'red',
    marginRight: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
});
