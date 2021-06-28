import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {
  IconFont,
  UiHeader,
  UiDateTimePicker,
} from '../../../../../global.components';
import {$myTheme, $source, $ajax, $ui, api} from '../../../../../global.utils';
import {$fns} from '../../../../../utils/fns';

import {timeCompution} from '../../../../../utils/data';
import moment from 'moment';
const {getFuheDetail} = api;
export default class App extends React.Component {
  state = {
    isShow: true,
    FuHeData: [],
    currentList: [],
    totalPage: 0,
    pageNum: 1,
    startDate: null,
    endDate: null,
  };
  componentDidMount() {
    const {id, beginTime, endTime} = this.props.route.params;
    // let beginTime=curTabIndex==2?moment()
    // .month(monthIndex)
    // .startOf('month')
    // .format('YYYY-MM-DD'):moment().subtract(7, 'days').format('YYYY-MM-DD')
    // let endTime =curTabIndex==2?moment()
    // .month(monthIndex)
    // .endOf('month')
    // .format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
    this.getFuheDetail(beginTime, endTime);
    this.setState({
      startDate:beginTime,
      endDate:endTime
    })
  }
  loadmore = (e) => {
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
   console.log(this.state.pageNum)
    if (offsetY + oriageScrollHeight + 10 >= contentSizeHeight) {
      if (this.state.pageNum < this.state.totalPage) {
        let col = this.state.FuHeData.slice(
          this.state.pageNum * 10,
          (this.state.pageNum + 1) * 10,
        );
        let cols = this.state.currentList;
        this.setState({
          currentList: cols.concat(col),
          pageNum: this.state.pageNum + 1,
        });
      }
    } else if (offsetY + oriageScrollHeight <= 1) {
      //这个是没有数据了然后给了false  得时候还在往上拉
    } else if (offsetY == 0) {
      //这个地方是下拉刷新，意思是到顶了还在指行，可以在这个地方进行处理需要刷新得数据
    }
  };
  getFuheDetail = (beginTime, endTime) => {
    const {id} = this.props.route.params;
    $ajax({
      url: getFuheDetail,
      data: {
        machineId: id,
        startDate: beginTime,
        endDate: endTime,
      },
      type: 'get',
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        console.log(value.data)
        this.setState({
          FuHeData: value.data,
          totalPage: Math.ceil(value.data.length / 10),
          currentList: value.data.slice(0, 10),
          pageNum:1
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
              moment(endDate).diff(moment(this.state.startDate), 'days') > 6
            ) {
              $ui.toast('查询时间段不能超过7天');
              return;
            }
            this.getFuheDetail( this.state.startDate, endDate);
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
              moment(this.state.endDate).diff(moment(startDate), 'days') > 6
            ) {
              $ui.toast('查询时间段不能超过7天');
              return;
            }
            this.getFuheDetail(startDate, this.state.endDate);
          }
        },
      );
    }
  };
  render() {
    return (
      <>
        <UiHeader
          title="负荷详情"
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
        {this.state.currentList.length!=0&&(
          <FlatList
          style={{paddingVertical: 12, flex: 1}}
          data={this.state.currentList}
          onMomentumScrollEnd={this.loadmore}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  backgroundColor: '#fff',
                  marginBottom: 10,
                  padding: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{fontSize: 16, marginRight: 10, fontWeight: 'bold'}}>
                    {moment(item.finishTime).format('MM月DD日')}
                  </Text>
                  <Text style={{fontSize: 14, color: '#444'}}>
                    {item.sequence}
                  </Text>
                </View>

                <View>
                  <View>
                    <View style={[ss.flexRow, {zIndex: 1}]}>
                      <Text
                        style={[
                          ss.ball,
                          {backgroundColor: $myTheme.mainBlue},
                        ]}></Text>
                      <Text style={{fontSize: 15, color: $myTheme.mainGray}}>
                        {item.beginTime}
                      </Text>
                    </View>

                    <View style={[ss.flexRow, {zIndex: 1}]}>
                      <Text style={[ss.ball]}></Text>
                      <Text style={{fontSize: 15, color: $myTheme.mainGray}}>
                        {item.finishTime}
                      </Text>
                    </View>

                    <View
                      style={{
                        position: 'absolute',
                        left: 5,
                        top: 12,
                        bottom: 12,
                        backgroundColor: '#bbb',
                        width: 0.5,
                      }}></View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <IconFont
                        icon={'\ue651'}
                        size={20}
                        color={$myTheme.mainBlue}
                      />
                      <Text style={{paddingLeft: 6, fontSize: 15}}>
                        {timeCompution(item.beginTime, item.finishTime)}
                      </Text>
                    </View>
                    <View style={[ss.flexRow, {alignItems: 'flex-end'}]}>
                      <Text style={{fontSize: 30, color: $myTheme.mainBlue}}>
                        {item.amountFinish}
                      </Text>
                      <Text style={{marginBottom: 6, fontSize: 15}}>
                        /{item.amountAll} 件
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
          keyExtractor={(item, index) => 'xx_' + index}
        />
        )}
        {this.state.currentList.length==0&&(
          <Text style={{flex:1,justifyContent:'center',textAlignVertical:'center',textAlign:"center"}}>未查到负荷数据</Text>
        )}
      </>
    );
  }
}

let ss = StyleSheet.create({
  flexRow: {flexDirection: 'row', alignItems: 'center'},
  ball: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    marginRight: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
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
});
