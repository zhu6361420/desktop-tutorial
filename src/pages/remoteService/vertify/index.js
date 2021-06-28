import React from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {
  IconFont,
  UiHeader,
  renderErrorView,
  renderLoadingView,
  renderFooter,
  UiPicker,
} from '../../../global.components';
import {$myTheme, $ajax, api} from '../../../global.utils';
import {$fns} from '../../../utils/fns';
import moment from 'moment';
import {StyleSheet} from 'react-native';
const {findRecordByPage, checkRecord, readOneMsg} = api;
const hangyeList = ['待审核', '审核通过', '使用中', '已过期', '未通过'];
export default class App extends React.Component {
  state = {
    messageList: [],
    count: 1,
    totalPage: 0,
    isLoading: true,
    //网络请求状态
    error: false,
    errorInfo: '',
    // dataArray: [],
    showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
    isSearchShow: false,
    industry:"待审核",
    status:0
  };
  componentDidMount() {
    this.getRecord(1);
  }
  getRecord = (pageNum) => {
    $ajax({
      url: findRecordByPage,
      data: {
        args: {
          userId: null,
          status:this.state.status
        },
        pageNum: pageNum,
        pageSize: 30,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let {list} = value.data;
        let foot = 0;
        if (pageNum > value.data.totalPage || pageNum == value.data.totalPage) {
          foot = 1;
        }
        this.setState({
          messageList: this.state.messageList.concat(list),
          isLoading: false,
          showFoot: foot,
          totalPage: value.data.totalPage,
        });
      }
    });
  };
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
    this.setState({showFoot: 2, count: pageNo});
    //获取数据
    this.getRecord(pageNo);
  }
  validateStatus(value) {
    switch (value) {
      case 0:
        return '待审核';
      case 1:
        return '审核通过';
      case 2:
        return '使用中';
      case 3:
        return '已过期';
      case 4:
        return '未通过';
    }
  }
  checkRecord = (item, flag) => {
    $ajax({
      url: checkRecord,
      data: [
        {
          id: item.id,
          userId: item.userId,
          status: flag,
        },
      ],
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        this.setState(
          {
            messageList: [],
            count: 1,
            totalPage: 0,
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: '',
            // dataArray: [],
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
          },
          () => {
            this.getRecord(1);
          },
        );
      }
    });
  };
  select=(value,index)=>{
    this.setState({
      industry: value[0],
      status:index[0],
      messageList: [],
      count: 1,
      totalPage: 0,
      isLoading: true,
      //网络请求状态
      error: false,
      errorInfo: '',
      // dataArray: [],
      showFoot: 0, // 控制
    })
    this.getRecord(1)
  }
  render() {
    const {messageList, industry, curTabIndex, noticeList} = this.state;
    if (this.state.isLoading && !this.state.error) {
      return renderLoadingView(this, '审核列表');
    } else if (this.state.error) {
      //请求失败view
      return renderErrorView;
    }
    return (
      <>
        <UiHeader
          title="审核列表"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />
        <UiPicker
          ref="hangye"
          datas={hangyeList}
          onConfirm={(_value, _index) =>
            this.select(_value, _index)
          }
        />
        <View
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 16, marginRight: 10}}>申请状态:</Text>
          <TouchableOpacity
            onPress={() => {
              this.refs.hangye.show();
            }}
            style={{
              backgroundColor: '#fff',
              paddingLeft: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 30,
            }}>
            <Text style={{marginRight: 10}}>{industry}</Text>
            <IconFont icon={'\ue667'} size={20} color="#999" />
          </TouchableOpacity>
        </View>
        <FlatList
          style={{ flex: 1,padding: 5, }}
          data={messageList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter(this.state.showFoot)}
          onEndReachedThreshold={0.1}
          onEndReached={this._onEndReached.bind(this)}
          renderItem={({item, index}) => {
            return (
              <View style={ss.item}> 

              <View
                  style={{
                    paddingLeft: 10,
                  }}>
                  <View
                    style={{
                      marginBottom: 10,
                      flexDirection: 'row',
                    }}>
                    <Text style={{fontSize: 15, color: 'grey'}}>申请人：</Text>
                    <Text style={{fontSize: 15}}>{item.userName}</Text>
                  </View>
                  <View
                    style={{
                      marginBottom: 10,
                      flexDirection: 'row',
                    }}>
                    <Text style={{fontSize: 15, color: 'grey'}}>
                      设备编号：
                    </Text>
                    <Text style={{fontSize: 15}}>{item.macSequence}</Text>
                  </View>
                  <View
                    style={{
                      marginBottom: 10,
                      flexDirection: 'row',
                    }}>
                    <Text style={{fontSize: 15, color: 'grey'}}>
                      申请日期：
                    </Text>
                    <Text style={{fontSize: 15}}>{item.createTime}</Text>
                  </View>

                  <View
                    style={{
                      marginBottom: 10,
                      flexDirection: 'row',
                    }}>
                    <Text style={{fontSize: 15, color: 'grey'}}>状态：</Text>
                    <Text style={{fontSize: 15}}>
                      {this.validateStatus(item.status)}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginBottom: 10,
                      flexDirection: 'row',

                      flexWrap: 'wrap',
                    }}>
                    <Text style={{fontSize: 15, color: 'grey'}}>
                      有效时间：
                    </Text>
                    <Text style={{fontSize: 15}}>
                      {item.startTime}至{item.endTime}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginBottom: 10,
                      flexDirection: 'row',
                    }}>
                    <Text style={{fontSize: 15, color: 'grey'}}>审核人：</Text>

                    <Text style={{fontSize: 15}}>{item.checkUserName}</Text>
                  </View>
                </View>
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
  item: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    flexDirection: 'row',
    marginBottom:10
  },
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
