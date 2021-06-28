import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import {maintainTypeOption} from '../../../../../utils/data';
import {$myTheme, $fns, $ajax, api} from '../../../../../global.utils';
import {
  UiHeader,
  MsgPane,
  StateTabPane,
  MsgRow,
  ArrowPane,
  IconFont,
  UiDateTimePicker,
  renderErrorView,
  renderLoadingView,
  renderFooter
} from '../../../../../global.components';
import {SwipeListView} from 'react-native-swipe-list-view';
import moment from 'moment';
const {curingFindByPage} = api;
export default class App extends React.Component {
  state = {
    isShow: false,
    maintainList: [],
    totalPage: 0,
    count: 1,
    startDate: null,
    endDate: null,
    statusIndex: null,
    totalPage: 0,
    isLoading: true,
    //网络请求状态
    error: false,
    errorInfo: '',
    // dataArray: [],
    showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
  };
  componentDidMount() {
    this.getMaintainList(1);
  }
  getMaintainList = (pageNum) => {
    const {machineSequence} = this.props.route.params;
    return $ajax({
      url: curingFindByPage,
      data: {
        args: {
          machineSequence: machineSequence,
          startTime: this.state.startDate,
          endTime: this.state.endDate,
          type: this.state.statusIndex,
        },
        pageNum: pageNum,
        pageSize: 10,
      },
      hasLoading: false,
      _this: this,
    }).then((value) => {
      let arr = [];
      if (value.code == 200) {
        let {list} = value.data;
        let foot = 0;
        if (
          pageNum > value.data.totalPage ||
          pageNum == value.data.totalPage
        ) {
          foot = 1;
        }
        this.setState({
          maintainList: this.state.maintainList.concat(list),
          isLoading: false,
          showFoot: foot,
          totalPage: value.data.totalPage,
        });
      }
    });
  };
  getMaintain = (item) => {
    const {deviceId,deviceSequence,deviceTypeId,deviceTypeName,outside} = this.props.route.params;
    $fns.route({
      context: this,
      type: 'replace',
      routeName:
        item.status == 0 ? 'dm_MaintainMangeDone' : 'Dm_MaintainMangeDetail',
      params: {
        maintainDetail: item,
        deviceId: deviceId,
        deviceSequence: deviceSequence,
        deviceTypeId: deviceTypeId,
        deviceTypeName: deviceTypeName,
        outside:outside
      },
    });
  };
  submit = () => {
    this.refs.dateTimeRef.hide()
    this.refs.dateTimeRefs.hide()
    this.setState({
      maintainList:[],
      count:1,
      isShow: false,
    },()=>{
      this.getMaintainList(1);
    })
  };
  _uiFilter() {
    let {isShow} = this.state;

    return (
      <Modal
        animationType="slide"
        visible={isShow}
        transparent
        statusBarTranslucent>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <KeyboardAvoidingView
            behavior="padding"
            style={{
              width: '100%',
              paddingHorizontal: 20,
              paddingBottom: 30,
              backgroundColor: '#fff',
            }}>
            <View
              style={{
                height: 50,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isShow: false,
                  });
                  this.refs.dateTimeRef.hide()
                  this.refs.dateTimeRefs.hide()
                }}>
                <Text style={{fontSize: 16, color: $myTheme.mainBlue}}>
                  取消
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text
                  style={{fontSize: 16, color: $myTheme.mainBlue}}
                  onPress={this.submit}>
                  确定
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[ss.h3Title]}>
              <Text
                style={{
                  color: $myTheme.mainBlue,
                  fontSize: 16,
                  borderRadius: 4,
                }}>
                选择养护类型
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}>
              {maintainTypeOption.map((item, index) => (
                <View
                  style={[
                    ss.tagItem,
                    index === this.state.statusIndex
                      ? {backgroundColor: $myTheme.mainBlue}
                      : null,
                  ]}
                  key={index}>
                  <Text
                    style={[
                      ss.tagTxt,
                      index === this.state.statusIndex ? {color: '#fff'} : null,
                    ]}
                    onPress={() => {
                      this.setState({
                        statusIndex: index,
                      });
                    }}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>

            <View style={[ss.h3Title]}>
              <Text
                style={{
                  color: $myTheme.mainBlue,
                  fontSize: 16,
                  borderRadius: 4,
                }}>
                选择时间周期
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingBottom: 30,
              }}>
              <TouchableOpacity
                style={[ss.inputBox]}
                onPress={() => {
                  this.refs.dateTimeRef.show();
                }}>
                <Text style={{color: '#666'}}>
                  {this.state.startDate ? this.state.startDate : '计划时间段'}
                </Text>
              </TouchableOpacity>
              <Text style={{paddingHorizontal: 10, color: 'black'}}>~</Text>
              <TouchableOpacity
                style={[ss.inputBox]}
                onPress={() => {
                  this.refs.dateTimeRefs.show();
                }}>
                <Text style={{color: '#666'}}>
                  {this.state.endDate ? this.state.endDate : '计划时间段'}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }
  _onEndReached() {
    let {count, totalPage} = this.state;
    let pageNo = count;
    //如果是正在加载中或没有更多数据了，则返回
    if (this.state.showFoot != 0) {
      return;
    }
    //如果当前页大于或等于总页数，那就是到最后一页了，返回
    if (pageNo != 1 && pageNo >= totalPage) {
      return;
    } else {
      pageNo++;
      // this.setState({
      //   count: pageNo,
      // });
    }
    //底部显示正在加载更多数据
    this.setState({showFoot: 2,count:pageNo});
    //获取数据
    this.getMaintainList(pageNo);
  }
  render() {
    if (this.state.isLoading && !this.state.error) {
      return renderLoadingView(this, '养护列表');
    } else if (this.state.error) {
      //请求失败view
      return renderErrorView;
    }
    return (
      <>
        <UiHeader
          title="养护管理"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
          right={() => {
            return (
              <TouchableOpacity
                style={{
                  width: 44,
                  height: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  this.setState({
                    isShow: true,
                  });
                }}>
                <IconFont icon={'\ue6eb'} size={20} color="#fff" />
              </TouchableOpacity>
            );
          }}
        />

        {this.state.maintainList.length == 0 ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 16}}>暂无养护信息</Text>
          </View>
        ) : (
          <FlatList
            style={{flex: 1, paddingRight: 12, paddingLeft: 12}}
            showsVerticalScrollIndicator = { false }
            data={this.state.maintainList}
            ListFooterComponent={renderFooter(this.state.showFoot)}
            onEndReachedThreshold={0.1}
            onEndReached={this._onEndReached.bind(this)}
            renderItem={({item}) => {
              return (
                <MsgPane
                  title="设备编号"
                  title2={item.machineSequence}
                  // bgImg   = { require("./../../../assets/imgs/icon_yanghu.png") }
                  style={{marginBottom: 10, borderRadius: 0}}
                  onPress={() => this.getMaintain(item)}>
                  <ArrowPane style={{backgroundColor: 'none'}}>
                    <MsgRow
                      title="养护类型："
                      msg={maintainTypeOption[item.type].label}
                      align="left"
                      border={false}
                      rowHeight={30}
                    />

                    <MsgRow
                      title="责任人："
                      msg={item.dutierName}
                      align="left"
                      border={false}
                      rowHeight={30}
                    />

                    <MsgRow
                      title="预计养护日期："
                      msg={item.maintainDate}
                      align="left"
                      border={false}
                      rowHeight={30}
                    />

                    <MsgRow
                      title="养护状态："
                      msg={item.status == 0 ? '待处理' : '已处理'}
                      align="left"
                      border={false}
                      rowHeight={30}
                      msgColor={item.status == 0 ? '#fe4545' : '#35cc8a'}
                    />
                  </ArrowPane>
                </MsgPane>
              );
            }}
          />
        )}
        {this._uiFilter()}
        <UiDateTimePicker
          min="2018"
          ref="dateTimeRef"
          flag={1}
          currentDate={this.state.startDate}
          onComfirm={(e) => {
            this.setState({
              startDate: moment(e).format('YYYY-MM-DD 00:00:00'),
            });
          }}
        />
        <UiDateTimePicker
          min="2018"
          ref="dateTimeRefs"
          flag={1}
          currentDate={this.state.endDate}
          onComfirm={(e) => {
            this.setState({
              endDate: moment(e).format('YYYY-MM-DD 23:59:59'),
            });
          }}
        />
      </>
    );
  }
}
let ss = StyleSheet.create({
  flexRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 6},
  ball: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    marginRight: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  msgTag: {
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 4,
  },
  txtItem: {fontSize: 13},
  txtGray: {color: '#777'},

  h3Title: {
    height: 40,
    backgroundColor: '#e7f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  tagItem: {
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    width: $fns.getWindowWidth() / 3.8,
    backgroundColor: '#eeeeee',
    borderRadius: 4,
    marginBottom: 15,
  },
  tagTxt: {color: '#666'},
  inputBox: {
    flex: 1,
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
