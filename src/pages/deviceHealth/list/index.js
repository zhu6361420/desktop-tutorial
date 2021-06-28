import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StyleSheet,
  FlatList,
  Image
} from 'react-native';
import {$myTheme, $fns, $source, $ui} from '../../../global.utils';
import {
  UiHeader,
  HealthPane,
  HealthRow,
  IconFont,
} from './../../../global.components';
import {SwipeListView} from 'react-native-swipe-list-view';
import {$ajax, api} from '../../../global.utils';
import {
  getMachineStatus,
  getMachineStatusColor,
  isYWAdmin,
} from '../../../utils/data';
import DeviceFilter from '../../../components/DeviceFilter';
import {
  renderErrorView,
  renderLoadingView,
  renderFooter,
} from '../../../components/Listextra';
import moment from 'moment';
// import {HcdWaveView} from 'react-native-art-hcdwave';
// 筛选面板
const {getMachineEnergeList} = api;

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    topDevice: [{value:70}, {value:80}, {value:40}],
    // isLoading: false,
  };
  componentDidMount() {}
  shwoEnergyDetail = (item) => {
    $fns.route({
      context: this,
      type: 'navigate',
      routeName: 'deviceDetail',
    });
  };
  render() {
    const {topDevice} = this.state;
    return (
      <>
        <UiHeader
          title="设备列表"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'navigate',
              routeName: 'tabPages',
            });
          }}
        />
        {/* <View style={styles.container}>
          <HcdWaveView
            surfaceWidth={150}
            surfaceHeigth={150}
            powerPercent={50}
            type="dc"
            style={{backgroundColor: 'red'}}></HcdWaveView>
          <HcdWaveView
            surfaceWidth={230}
            surfaceHeigth={230}
            powerPercent={50}
            type="ac"
            style={{backgroundColor: '#FF7800'}}></HcdWaveView>
        </View> */}
        {topDevice.length != 0 && (
          <FlatList
            style={{flex: 1, height: '100%', paddingLeft: 12, paddingRight: 12}}
            data={topDevice}
            renderItem={({item}) => {
              return (
                <HealthPane
                  bgSize={{width: 140, height: 100}}
                  style={{marginBottom: 10, borderRadius: 0}}
                  isRow={true}
                  onPress={() => this.shwoEnergyDetail(item)}
                  header={
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                 <Image style={{ width:14, height:14, }}source={require('../../../assets/imgs/warn.png')}/> 
                  <Text style={{color: 'red',marginLeft:15}}>存在健康报警未处理!</Text>
                    </View>
                  }>
                  <View
                    style={{
                      width: 100,
                      height: 80,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        width: 75,
                        height: 75,
                        borderRadius: 50,
                        backgroundColor: item.value>50?'rgba(28, 132, 198, 0.5)':'rgba(237, 85, 101, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 67,
                          height: 67,
                          borderRadius: 50,
                          backgroundColor: item.value>50?'#1C84C6':'#ED5565',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                          <Text style={{color:'#fff',fontSize:20}}>{item.value}分</Text>
                        </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{flex: 1}}>
                      <HealthRow
                        title="设备别名："
                        msg="江苏聚能电气激光切..."
                        align="left"
                        border={false}
                        rowHeight={30}
                      />

                      <HealthRow
                        title="设备型号："
                        msg="HLF2560"
                        align="left"
                        border={false}
                        rowHeight={30}
                      />
                    </View>
                  </View>
                </HealthPane>
              );
            }}
            // ListFooterComponent={renderFooter(this.state.showFoot)}
            onEndReachedThreshold={0.1}
            // onEndReached={this._onEndReached.bind(this)}
            keyExtractor={(item, index) => index.toString()}
            // onRefresh={  this._onRefresh.bind(this)  }
            // refreshing = {this.state.isRefreshing}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={this.state.isRefreshing}
            //     progressViewOffset={-10}
            //     onRefresh={this._onRefresh.bind(this)}
            //   />
            // }
          />
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
