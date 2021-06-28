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

import {IconFont, UiHeader,  renderErrorView,
  renderLoadingView,
  renderFooter} from '../../../global.components';
import {$myTheme, $ajax, api} from '../../../global.utils';
import {$fns} from '../../../utils/fns';
import moment from 'moment';
import {StyleSheet} from 'react-native';
const {findRecordByPage} = api;
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
  };
  componentDidMount() {
     this.getRecord(1);
  }
  getRecord=(pageNum)=>{
    let data = JSON.parse(sto.getValue('loginData'));

    $ajax({
      url: findRecordByPage,
      data: {
        args:{
          startTime:null,
          endTime:null,
          userId:data.userData.userId,
        },
        pageNum:pageNum,
        pageSize:30
      },
      _this: this,
    }).then((value) => {
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
          messageList: this.state.messageList.concat(list),
          isLoading: false,
          showFoot: foot,
          totalPage: value.data.totalPage,
        });
      }
    });
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
  render() {
    const {messageList, disReadtotal, curTabIndex, noticeList} = this.state;
    if (this.state.isLoading && !this.state.error) {
      return renderLoadingView(this, '审核列表');
    } else if (this.state.error) {
      //请求失败view
      return renderErrorView;
    }
    return (

      <>
        <UiHeader
          title="我的申请"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />
        <FlatList
          style={{padding: 12}}
          data={messageList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter(this.state.showFoot)}
          onEndReachedThreshold={0.1}
          onEndReached={this._onEndReached.bind(this)}
          renderItem={({item, index}) => {
            return (
              <View key={index} style={[ss.item]}>
                <View
                  style={{flex: 1, paddingLeft: 10}}
                  >
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

                    <Text style={{fontSize: 15}}>{this.validateStatus(item.status)}</Text>
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
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
});
