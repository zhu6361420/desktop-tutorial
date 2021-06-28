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
import {$myTheme, $fns, $source, $ui} from '../../../global.utils';
import {
  UiHeader,
  MsgPane,
  MsgRow,
  IconFont,
} from './../../../global.components';
import {SwipeListView} from 'react-native-swipe-list-view';
import {$ajax, api} from '../../../global.utils';
import {getMachineStatus, getMachineStatusColor,isYWAdmin ,isCustomAdmins} from '../../../utils/data';
import DeviceFilter from '../../../components/DeviceFilter';
import {
  renderErrorView,
  renderLoadingView,
  renderFooter,
} from '../../../components/Listextra';
// 筛选面板
const {find, getMachineLists} = api;

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    listData: [],
    // isLoading: false,
    machine_status: [{state: 0}, {state: 0}, {state: 0}, {state: 0}],
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
    this._navListener = this.props.navigation.addListener('focus', () => {
     this.setState({
      listData:[],
      count:1,
      totalPage:0,
      isLoading: true,
      error: false,
      showFoot: 0, 
     },()=>{
      this.getMachineStatus();
      this.getlist(null, null, null, null,null, 1);
     })    
    });
  }
  getlist = (deviceTypeId, operatingState, sequence, ownerId,groupId, pageNum) => {
    // let firmId=JSON.parse(sto.getValue('selectFirmId')) ;
    // alert(firmId)
    let firmid=null;
    let groupid=null
    if(isYWAdmin()){
      firmid=global_firm
    }
    else{
      firmid=ownerId;
      groupid=global_group;
    }
    $ajax({
      url: getMachineLists,
      data: {
        args: {
          deviceTypeId: deviceTypeId,
          operatingState: operatingState,
          sequence: sequence,
          ownerId: firmid,
          groupId:groupid
        },
        pageNum: pageNum,
        pageSize: 10,
      },
      hasLoading: false,
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let machinList = [];
        if (value.data.list.length != 0) {
          machinList = (value.data.list || []).map((item) => ({
            id: item.id,
            sequence: item.sequence,
            name: item.name,
            deviceTypeId: item.deviceTypeId,
            deviceTypeName: item.deviceTypeName,
            stateTxt: getMachineStatus(item.operatingState),
            workpieceAmount: item.workpieceAmount,
            color: getMachineStatusColor(item.operatingState),
            iconUrl: item.iconUrl,
            isBender:item.isBender
          }));
          let foot = 0;
          if (
            pageNum > value.data.totalPage ||
            pageNum == value.data.totalPage
          ) {
            foot = 1;
          }
          this.setState({
            listData: this.state.listData.concat(machinList),
            // isLoading: false,
            showFoot: foot,
            totalPage: value.data.totalPage,
            isRefreshing:false
          });
          machinList = null;
          // totalPage = value.data.totalPage;
        }
        this.setState({
          isLoading:false
        })
      }
    });
  };
  getChild = (result, arr) => {
    let {deviceTypeId, operatingState, sequence, ownerId,groupId} = arr.args;
    let {pageNum} = arr;
    this.setState(
      {
        listData: [],
      },
      () => {
        this.getlist(deviceTypeId, operatingState, sequence, ownerId,groupId, pageNum);
      },
    );
  };
  getMachineStatus() {
    $ajax({
      url: find,
      data: {},
      _this: this,
      hasLoading: false,
    }).then((value) => {
      if (value.code == 200) {
        let machine_status = (value.data.machine_state_rt || []).map(
          (item) => ({
            title: item.state,
            num: item.amount,
            state: item.percent,
          }),
        );
        this.setState({
          machine_status: machine_status,
        });
      }
    });
  }
  shwoDeviceDetail = (item) => {
    $fns.route({
      context: this,
      routeName: 'DeviceDetail',
      params: {
        id: item.id,
        sequence: item.sequence,
        deviceTypeId: item.deviceTypeId,
        deviceTypeName: item.deviceTypeName,
        isBender:item.isBender
      },
    });
  };
  showMaintainDetail = (item) => {
    $fns.route({
      context: this,
      routeName: 'dm_Repair',
      params: {
        id: item.id,
        sequence: item.sequence,
        deviceTypeId: item.deviceTypeId,
        deviceTypeName: item.deviceTypeName,
        outside:true
      },
    });
  };
  _onEndReached() {
    const {
      deviceTypeId,
      operatingState,
      sequence,
      ownerId,
      groupId
    } = this.refs.deviceRef.state;
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
    this.getlist(deviceTypeId.id, operatingState.id, sequence, ownerId,groupId, pageNo);
  }
  _onRefresh() {
    // 下拉刷新
    // 正在上拉刷新，请求第一页
    const {
      deviceTypeId,
      operatingState,
      sequence,
      ownerId,
      groupId
    } = this.refs.deviceRef.state;
    this.setState({isRefreshing: true,listData:[],count:1}, () => {
      this.getlist(deviceTypeId.id, operatingState.id, sequence, ownerId,groupId, 1);
    });
  }
  render() {
    const {listData,isRefreshing} = this.state;
    if (this.state.isLoading && !this.state.error) {
      return renderLoadingView(this, '设备列表');
    } else if (this.state.error) {
      //请求失败view
      return renderErrorView;
    }
    return (
      <>
        <UiHeader
          title="设备列表"
          right={
            <TouchableOpacity
              onPress={() => {
                this.refs.deviceRef.show();
              }}>
              <IconFont icon={'\ue640'} size={22} color="#fff" />
            </TouchableOpacity>
          }
          onBack={() => {
            $fns.route({
              context: this,
              type: 'navigate',
              routeName: 'tabPages',
            });
          }}
        />
        {listData.length != 0 && (
          <FlatList
            style={{flex: 1, height: '100%', paddingLeft: 12, paddingRight: 12}}
            data={listData}
            renderItem={({item}) => {
              return (
                <MsgPane
                  title="设备编号"
                  title2={item.sequence}
                  bgImg={{
                    uri: `${$source.url}/api/ems${item.iconUrl}`,
                  }}
                  bgSize={{width: 140, height: 100}}
                  style={{marginBottom: 10, borderRadius: 0}}
                  onPress={() => this.shwoDeviceDetail(item)}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{flex: 1}}>
                      <MsgRow
                        title="设备别名："
                        msg={item.name}
                        align="left"
                        border={false}
                        rowHeight={30}
                      />

                      <MsgRow
                        title="设备型号："
                        msg={item.deviceTypeName}
                        align="left"
                        border={false}
                        rowHeight={30}
                      />

                      <MsgRow
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
                      />

                      <MsgRow
                        title="计件："
                        msg={item.workpieceAmount}
                        align="left"
                        border={false}
                        rowHeight={30}
                      />
                    </View>

                    <TouchableOpacity
                      onPress={() => this.showMaintainDetail(item)}>
                      <IconFont
                        style={{paddingTop: 2}}
                        icon={'\ue60e'}
                        size={30}
                        color="#1c84c6"
                      />
                    </TouchableOpacity>
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
        {listData.length == 0 && (
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

        <DeviceFilter ref="deviceRef" parent={this} />
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
