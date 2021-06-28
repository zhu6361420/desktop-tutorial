import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StyleSheet,
  FlatList,
} from 'react-native';
import { $fns} from '../../../../global.utils';
import {
  UiHeader,
  MsgPane,
  MsgRow,
} from '../../../../global.components';
import {$ajax, api} from '../../../../global.utils';
import {
  isYWAdmin,
} from '../../../../utils/data';
import {
  renderErrorView,
  renderLoadingView,
  renderFooter,
} from '../../../../components/Listextra';
import moment from 'moment';
// 筛选面板
const {getFirmEneryTop} = api;

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    firmDevice: [],
    // isLoading: false,
    curTagIndex: -1,
    count: 1,
    totalPage: 0,

    isLoading: true,
    //网络请求状态
    error: false,
    errorInfo: '',
    // dataArray: [],
    showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
    isRefreshing: false,
  };
  componentDidMount() {
    this.getFirmEneryTop(null, null, null, null, 1);
  }
  //能耗列表和设备能耗前三名排行
  getFirmEneryTop = (firm, sequence, status, type, pageNum) => {
    const {curTabIndex, monthBegin, monthEnd} = this.props.route.params;
    console.log(curTabIndex)
    $ajax({
      url: getFirmEneryTop,
      data: {
        args: {
          start: curTabIndex==1?monthBegin:moment().startOf('years').format('YYYY-MM-DD'),
          end: curTabIndex==1?monthEnd:moment().endOf('years').format('YYYY-MM-DD'),
        },
        pageNum: pageNum,
        pageSize: 10,
      },
      _this: this,
      hasLoading: false,
    }).then((value) => {
      if (value.code == 200) {
        let {list} = value.data;
        console.log(list)
        if (list.length != 0) {
          let foot = 0;
          if (
            pageNum > value.data.totalPage ||
            pageNum == value.data.totalPage
          ) {
            foot = 1;
          }
          this.setState({
            firmDevice: this.state.firmDevice.concat(list),
            // isLoading: false,
            showFoot: foot,
            totalPage: value.data.totalPage,
            isRefreshing: false,
          });
          firmDevice = null;
        }
        this.setState({
          isLoading: false,
        });
      }
    });
  };
  getChild = (result, arr) => {
    let {deviceTypeId, operatingState, sequence, ownerId} = arr.args;
    let {pageNum} = arr;
    this.setState(
      {
        firmDevice: [],
      },
      () => {
        this.getFirmEneryTop(
          ownerId,
          sequence,
          operatingState,
          deviceTypeId,
          pageNum,
        );
      },
    );
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
      this.setState({
        count: pageNo,
      });
    }
    //底部显示正在加载更多数据
    this.setState({showFoot: 2});
    //获取数据
    this.getFirmEneryTop(null, null, null, null, pageNo);
  }
  _onRefresh() {
    // 下拉刷新
    // 正在上拉刷新，请求第一页
    this.setState({isRefreshing: true, firmDevice: [], count: 1}, () => {
      this.getFirmEneryTop(
        null,
        null,
        null,
        null,
        1,
      );
    });
  }
  render() {
    const {firmDevice, isRefreshing} = this.state;
    const {curTabIndex, monthBegin, monthEnd} = this.props.route.params;
    if (this.state.isLoading && !this.state.error) {
      return renderLoadingView(this, '能耗排行');
    } else if (this.state.error) {
      //请求失败view
      return renderErrorView;
    }
    return (
      <>
        <UiHeader
          title="能耗排行"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />
        {firmDevice.length != 0 && (
          <FlatList
            style={{flex: 1, height: '100%', paddingLeft: 12, paddingRight: 12}}
            data={firmDevice}
            showsVerticalScrollIndicator = { false }
            renderItem={({item}) => {
              return (
                <MsgPane
                  title="企业名称"
                  title2={item.name}
                  // bgImg={{
                  //   uri: `${$source.url}/api/ems${item.iconUrl}`,
                  // }}
                  bgSize={{width: 140, height: 100}}
                  style={{marginBottom: 10, borderRadius: 0}}
                  >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{flex: 1}}>
                      <MsgRow
                        title="设备台数："
                        msg={`${item.machineNum}台`}
                        align="left"
                        border={false}
                        rowHeight={30}
                      />

                      <MsgRow
                        title="电费方式："
                        msg={item.consumeType==0?'通用电费':item.consumeType==null?'未配电价':'阶梯电费'}
                        align="left"
                        border={false}
                        rowHeight={30}
                      />
                      {/* <MsgRow
                        title="设备状态："
                        msg="2020-10-21"
                        align="left"
                        border={false}
                        rowHeight={30}
                        slot={
                          <View
                            style={[ss.msgTag, {backgroundColor: item.color}]}>
                            <Text style={{color: '#fff'}}>{item.stateTxt}</Text>
                          </View>
                        }
                      /> */}
                 

                      <MsgRow
                        title='能耗/电费：'
                        msg={`${item.power}KWH / ${item.price}元`}
                        align="left"
                        border={false}
                        rowHeight={30}
                      />
                      <View
                        style={{
                          borderColor: '#ddd',
                          borderTopWidth: 0.5,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: 5,
                        }}>
                        <Text style={{color: '#8F8F8F', fontSize: 15}}>
                          峰时：
                          <Text style={{color: '#222'}}>
                            {item.highMoney}元
                          </Text>
                        </Text>
                        <Text style={{color: '#8F8F8F', fontSize: 15}}>
                          平时：
                          <Text style={{color: '#222'}}>{item.avgMoney}元</Text>
                        </Text>
                        <Text style={{color: '#8F8F8F', fontSize: 15}}>
                          谷时：
                          <Text style={{color: '#222'}}>{item.lowMoney}元</Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                </MsgPane>
              );
            }}
            ListFooterComponent={renderFooter(this.state.showFoot)}
            onEndReachedThreshold={0.1}
            onEndReached={this._onEndReached.bind(this)}
            keyExtractor={(item, index) => index.toString()}
            // onRefresh={  this._onRefresh.bind(this)  }
            // refreshing = {this.state.isRefreshing}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                progressViewOffset={-10}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          />
        )}
        {firmDevice.length == 0 && (
          <Text
            style={{
              textAlign: 'center',
              flex: 1,
              textAlignVertical: 'center',
              marginBottom: 10,
            }}>
            暂无数据
          </Text>
        )}

      </>
    );
  }
}
{
  /* <Lazylist data={} renderItem={} onEndReached={} />; */
}
let ss = StyleSheet.create({
  msgItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    height: 36,
    alignItems: 'center',
  },
  msgLbl: {color: '#666'},
  msgMain: {flex: 1, flexDirection: 'row', justifyContent: 'flex-end'},
  msgMainTxt: {fontSize: 15, color: '#000'},
  msgTag: {
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 4,
  },
  mainBox: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  flexRowCenter: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 15,
    color: 'blue',
  },
  footer: {
    flexDirection: 'row',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  content: {
    fontSize: 15,
    color: 'black',
  },
});
let styless = StyleSheet.create({
  loading: {
    backgroundColor: '#10101099',
    height: 80,
    width: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: (height - 80) / 2,
    left: (width - 100) / 2,
  },

  loadingTitle: {
    // marginTop: 10,
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },
});
