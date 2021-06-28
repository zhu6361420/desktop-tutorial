import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
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
import {getMachineStatus, getMachineStatusColor} from '../../../utils/data';
import DeviceFilter from '../../../components/DeviceFilter';
// 筛选面板
const {find, getMachineLists} = api;

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.getlist(null, null, null, null, 1);
  }
  getlist = (deviceTypeId, operatingState, sequence, ownerId, pageNum) => {
    $ajax({
      url: getMachineLists,
      data: {
        args: {
          deviceTypeId: deviceTypeId,
          operatingState: operatingState,
          sequence: sequence,
          ownerId: ownerId,
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
          console.log(value.data.list);
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
          }));
          let foot = 0;
          if (pageNum > value.data.totalPage||pageNum==value.data.totalPage) {
            foot = 1;
          }
          this.setState({
            listData: this.state.listData.concat(machinList),
            isLoading: false,
            showFoot: foot,
            totalPage: value.data.totalPage,
          });
          machinList = null;
          // totalPage = value.data.totalPage;
        }
      }
    });
  };
  shwoDeviceDetail = (item) => {
    $fns.route({
      context: this,
      routeName: 'DeviceDetail',
      params: {
        id: item.id,
        sequence: item.sequence,
        deviceTypeId: item.deviceTypeId,
        deviceTypeName: item.deviceTypeName,
      },
    });
  };
  //加载失败view
  renderErrorView() {
    return (
      <View style={styles.container}>
        <Text>Fail</Text>
      </View>
    );
  }
  render() {
    let {listData,_renderItemView,_onEndReached=()=>{},}=this.props
    if (this.state.isLoading && !this.state.error) {
      return this.renderLoadingView();
    } else if (this.state.error) {
      //请求失败view
      return this.renderErrorView();
    }
    return (
      <>
        
        {listData.length != 0 && (
          <FlatList
            style={{flex: 1, height: '100%', paddingLeft: 12, paddingRight: 12}}
            data={listData}
            renderItem={_renderItemView}
            ListFooterComponent={this._renderFooter.bind(this)}
            onEndReached={()=>{_onEndReached()}}
            onEndReachedThreshold={0.1}
          />
        )}
        {listData == 0 && (
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

