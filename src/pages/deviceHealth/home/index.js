import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import {
  UiHeader,
  UiPicker,
  UiGap,
  EchartsView,
  RightExtra,
  ApplicationIcon,
  IconFont,
  HealthPane,
} from '../../../global.components';
import {$myTheme, $fns, $source, $ui, $ajax, api} from '../../../global.utils';
import {Echarts, echarts} from 'react-native-secharts';
import moment from 'moment';

const {
  getMachineEnergeList,
  getEveryMonthElectric,
  //-----企管总览-----------
  getFirmEnergyDetail,
  getConsumeMonth,
  getEnergyByYear,
  getConsumeYear,
} = api;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      baoYangList:[{},{}],
      alarmList: [{},{}],
      shuKongList:[{},{}],
      healthList:[{},{}]
    };
  }
  componentDidMount() {}
  //企业接入天数

  shwoBaoyangList = () => {
    $fns.route({
      context: this,
      type: 'push',
      routeName: 'baoyang',
    });
  };
  shwoJinjiList = () => {
    $fns.route({
      context: this,
      type: 'push',
      routeName: 'jinjiList',
    });
  };
  shwoShukongList = () => {
    $fns.route({
      context: this,
      type: 'push',
      routeName: 'shukongList',
    });
  };
  shwoBaoyangDetail = (item) => {
    $fns.route({
      context: this,
      type: 'push',
      routeName: 'baoyanggenzong',
    });
  };
  shwoShukongDetail = (item) => {
    $fns.route({
      context: this,
      type: 'push',
      routeName: 'shukongjiance',
    });
  };
  shwoJinjiDetail = (item) => {
    $fns.route({
      context: this,
      type: 'push',
      routeName: 'jinjibaojing',
    });
  };

  render() {
    const {baoYangList,alarmList,shuKongList,healthList} = this.state;
    return (
      <>
        <UiHeader
          title="设备健康"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'navigate',
              routeName: 'tabPages',
            });
          }}
        />

        <ScrollView
          style={{flex: 1, padding: 14, paddingTop: 5, marginBottom: 20}}
          bounces={false}>
          <View style={sss.box1}>
            <View style={sss.box1Item}>
              <Text style={{color: 'red'}}>
                <Text style={{fontSize: 36}}>1</Text>台
              </Text>
              <Text style={{color: 'red'}}>建议维修</Text>
            </View>
            <View style={sss.box1Item}>
              <Text style={{color: '#F8AC59'}}>
                <Text style={{fontSize: 36}}>2</Text>台
              </Text>
              <Text style={{color: '#F8AC59'}}>建议保养</Text>
            </View>
            <View style={sss.box1Item}>
              <Text style={{color: '#1C84C6'}}>
                <Text style={{fontSize: 36}}>1</Text>台
              </Text>
              <Text style={{color: '#1C84C6'}}>良好状态</Text>
            </View>
            <View style={sss.box1Item}>
              <Text style={{color: '#1AB394'}}>
                <Text style={{fontSize: 36}}>10</Text>台
              </Text>
              <Text style={{color: '#1AB394'}}>健康状态</Text>
            </View>
          </View>

          <View style={sss.box1}>
            <HealthPane
              style={{
                marginBottom: 10,
                borderRadius: 0,
                width: '100%',
                shadowColor: 'black',
                shadowOpacity: 0.5,
              }}
              header={
                <View style={sss.header}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={sss.headertitle}>保养提醒</Text>
                    <Text style={sss.tixing}>3条新提醒</Text>
                  </View>
                  <TouchableOpacity onPress={() => this.shwoBaoyangList()}>
                    <IconFont icon={'\ue643'} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              }>
              {baoYangList.length != 0 &&
                baoYangList.map((item, index) => (
                  <TouchableOpacity
                    style={{height: 50, width: '100%', marginBottom: 10}}
                    onPress={() => this.shwoBaoyangDetail(item)}>
                    <Text style={{lineHeight: 25, fontSize: 14}}>
                      {index + 1}.
                      设备编号为HPE30256225252设备已运行1500小时，需要保养维修！
                    </Text>
                  </TouchableOpacity>
                ))}
              {baoYangList.length == 0 && (
                <View style={{width: '70%',alignItems:'center',marginLeft:'15%'}}>
                  <ImageBackground
                    source={require('../../../assets/imgs/none_baoyang.png')}
                    style={{
                      width: '100%',
                      height: 220,
                      // borderColor:'red',
                      // borderWidth:1
                    }}
                    resizeMode="stretch">
                    {/* <Text style={{ fontSize:14, color:$myTheme.mainBlue }}>{ title }：{msg}</Text> */}
                  </ImageBackground>
                </View>
              )}
            </HealthPane>
          </View>

          <View style={sss.box1}>
            <HealthPane
              style={{
                marginBottom: 10,
                borderRadius: 0,
                width: '100%',
                shadowColor: 'black',
                shadowOpacity: 0.5,
              }}
              // onPress={() => this.shwoEnergyDetail(item)}
              header={
                <View style={sss.header}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={sss.headertitle}>紧急报警</Text>
                    <Text style={sss.tixing}>2条新提醒</Text>
                  </View>
                  <TouchableOpacity onPress={() => this.shwoJinjiList()}>
                    <IconFont icon={'\ue643'} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              }>
              {alarmList.length != 0 &&alarmList.map((item, index) => (
                <TouchableOpacity
                  style={{height: 50, width: '100%', marginBottom: 10}}
                  onPress={() => this.shwoJinjiDetail(item)}>
                  <Text style={{lineHeight: 25, fontSize: 14}}>
                    {index + 1}.
                    设备编号为HPE30256225252设备已运行1500小时，需要保养维修！
                  </Text>
                </TouchableOpacity>
              ))}
                 {alarmList.length == 0 && (
                <View style={{width: '70%',alignItems:'center',marginLeft:'15%'}}>
                <ImageBackground
                  source={require('../../../assets/imgs/none_jinji.png')}
                  style={{
                    width: '100%',
                    height: 220,
                    // borderColor:'red',
                    // borderWidth:1
                  }}
                  resizeMode="stretch">
                  {/* <Text style={{ fontSize:14, color:$myTheme.mainBlue }}>{ title }：{msg}</Text> */}
                </ImageBackground>
              </View>
              )}
            </HealthPane>
          </View>

          <View style={sss.box1}>
            <HealthPane
              style={{
                marginBottom: 10,
                borderRadius: 0,
                width: '100%',
                shadowColor: 'black',
                shadowOpacity: 0.5,
              }}
              // onPress={() => this.shwoEnergyDetail(item)}
              header={
                <View style={sss.header}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={sss.headertitle}>数控检测</Text>
                    <Text style={sss.tixing}>1条新提醒</Text>
                  </View>
                  <TouchableOpacity onPress={() => this.shwoShukongList()}>
                    <IconFont icon={'\ue643'} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              }>
              {shuKongList.length != 0 &&shuKongList.map((item, index) => (
                <TouchableOpacity
                  style={{height: 50, width: '100%', marginBottom: 10}}
                  onPress={() => this.shwoShukongDetail(item)}>
                  <Text style={{lineHeight: 25, fontSize: 14}}>
                    {index + 1}.
                    设备编号为HPE30256225252设备已运行1500小时，需要保养维修！
                  </Text>
                </TouchableOpacity>
              ))}
             {shuKongList.length == 0 && (
                <View style={{width: '70%',alignItems:'center',marginLeft:'15%'}}>
                <ImageBackground
                  source={require('../../../assets/imgs/none_baoyang.png')}
                  style={{
                    width: '100%',
                    height: 220,
                    // borderColor:'red',
                    // borderWidth:1
                  }}
                  resizeMode="stretch">
                  {/* <Text style={{ fontSize:14, color:$myTheme.mainBlue }}>{ title }：{msg}</Text> */}
                </ImageBackground>
              </View>
              )}
            </HealthPane>
          </View>

          <View style={sss.box1}>
            <HealthPane
              style={{
                marginBottom: 10,
                borderRadius: 0,
                width: '100%',
                shadowColor: 'black',
                shadowOpacity: 0.5,
              }}
              // onPress={() => this.shwoEnergyDetail(item)}
              header={
                <View style={sss.header}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={sss.headertitle}>健康管理</Text>
                  </View>
                  <IconFont icon={'\ue643'} size={20} color="#999" />
                </View>
              }>
              {healthList.length!=0&&healthList.map((item, index) => (
                <View
                  style={{
                    height: 50,
                    width: '100%',
                    marginBottom: 10,
                    flexDirection: 'row',
                  }}>
                  <View style={{width: '75%', height: '100%'}}>
                    <Text style={{lineHeight: 25, fontSize: 14}}>
                      {index + 1}. 激光器使用方法
                    </Text>
                  </View>
                  <View style={{width: '25%', height: '100%'}}>
                    <Image
                      source={{
                        uri:
                          'http://121.36.226.216/api/auth/attachments/设备监测.png',
                      }}
                      style={{width: '100%', height: '100%'}}
                    />
                  </View>
                </View>
              ))}
          
            </HealthPane>
          </View>
        </ScrollView>
      </>
    );
  }
}

let sss = StyleSheet.create({
  box1: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 5,
  },
  box1Item: {
    width: '25%',
    height: 70,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headertitle: {
    color: '#000000',
    fontSize: 16,
    marginRight: 5,
    fontWeight: '600',
  },
  tixing: {
    backgroundColor: '#ED5565',
    borderRadius: 12,
    paddingLeft: 4,
    paddingRight: 4,
    borderColor: 'red',
    borderWidth: 1,
    color: '#fff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  dayItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    borderRadius: 3,
    height: 24,
    justifyContent: 'center',
  },
});
