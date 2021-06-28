import React from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  IconFont,
  UiHeader,
  FormItem,
  UiGap,
  LinkItem,
  UiPicker,
  EchartsView,
  Circle,
  HealthPane,
} from '../../../../../global.components';
import {$myTheme, $source, $ajax, api} from '../../../../../global.utils';
import {$fns} from '../../../../../utils/fns';
import {Echarts, echarts} from 'react-native-secharts';
import {Card} from 'react-native-shadow-cards';
// import Echarts from 'native-echarts';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {
  isCustomAdmins,
  isYWAdmin,
  getMachineStatus,
  getMachineStatusColor,
  floatToTime,
  prefixZero,
  machineStatus,
} from '../../../../../utils/data';
const {
  getEveryDayEnergy,
  getEveryCharge,
  getRunStatus,
  getEveryElectric,
  LayoutAnimation,
} = api;
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    isShow: true,
    ChiLunAbility: 0.2,
    reverse: false,
  };
  componentDidMount() {}

  render() {
    // const {id, sequence, deviceTypeId, firm} = this.props.route.params;
    const {reverse} = this.state;
    return (
      <>
        <UiHeader
          title="数控系统检测"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />

        <ScrollView
          style={{
            backgroundColor: $myTheme.mainBgGray,
            marginBottom: 10,
            padding: 12,
            paddingTop: 0,
            // display: currentIndex ? 'flex' : 'none',
          }}
          ref={(r) => (this.scrollview = r)}>
          {[
            {name: 'X1', total: 180, current: 100},
            {name: 'X2', total: 100, current: 100},
          ].map((item, index) => (
            <Card style={ss.card}>
              <HealthPane
                // onPress={() => this.shwoEnergyDetail(item)}
                style={{
                  marginBottom: 0,
                }}
                header={
                  <View
                    style={{
                      height: 30,
                      // backgroundColor: '#fff',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <LinearGradient
                      colors={['#80c0fe', '#288efc']}
                      useAngle={true}
                      angle={-45}
                      style={{
                        width: 5,
                        height: 20,
                        marginRight: 6,
                      }}></LinearGradient>
                    <Text>设备编号：HLF2525452335622</Text>
                  </View>
                }>
                <View style={{width: '100%'}}>
                  <View style={{paddingBottom:10}}>
                    <Text style={{fontSize: 16, color: '#000000'}}>
                      伺服系统{item.name}轴电流
                    </Text>
                    <View
                      style={{
                        width: '100%',
                        paddingBottom: 5,
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          left: '22%',
                          top: '18%',
                          position: 'absolute',
                          alignItems: 'center',
                        }}>
                        <Text>齿条间距</Text>
                        <Text>34.64mm</Text>
                      </View>
                      <View
                        style={{
                          right: '27%',
                          bottom: '7%',
                          position: 'absolute',
                          alignItems: 'center',
                        }}>
                        <Text>齿条长度</Text>
                        <Text>3464mm</Text>
                      </View>
                      <ImageBackground
                        source={require('../../../../../assets/imgs/z1.png')}
                        style={{
                          width: 158,
                          height: 98,
                        }}
                        resizeMode="stretch">
                        {/* <Text style={{ fontSize:14, color:$myTheme.mainBlue }}>{ title }：{msg}</Text> */}
                      </ImageBackground>
                    </View>
                  </View>
                  <View style={{borderTopWidth:1,borderColor:'#F2F2F2',flexDirection:'row',paddingTop:10}}>
                        <View style={{width:'50%',alignItems:'center'}}>
                        <ImageBackground
                        source={require('../../../../../assets/imgs/dj.png')}
                        style={{
                          width: 105,
                          height: 87,
                        }}
                        resizeMode="stretch">
                      </ImageBackground>
                        </View>
                        <View style={{flex:1,justifyContent:'space-between'}}>
                            <Text>电流：0A</Text>
                         <Text>温度：48℃</Text>
                         <Text>位置：607.44</Text>
                         <Text>转速：0mm/s</Text>
                        </View>
                  </View>
                </View>
              </HealthPane>
            </Card>
          ))}
        </ScrollView>
      </>
    );
  }
}

let ss = StyleSheet.create({
  card: {
    marginTop: 15,
    borderRadius: 0,
    width: '100%',
  },
  progress: {
    height: 20,
    width: 300,
    marginLeft: 50,
    marginRight: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'blue',
  },
  title: {
    flexDirection: 'row',
    height: 46,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  titleTxt: {fontSize: 16},
  titleMain: {flexDirection: 'row', flex: 1, justifyContent: 'flex-end'},
  mainBox: {
    // backgroundColor: '#fff',
    // borderColor: 'red',
    // borderWidth: 1,
  },
  dayItem: {
    padding: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginLeft: 10,
  },
  titleMore: {color: $myTheme.mainBlue},
  ball: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ed5565',
    marginRight: 10,
    borderRadius: 15,
    marginVertical: 10,
  },
  ballRow: {flexDirection: 'row', alignItems: 'center'},
  ballNum: {fontSize: 15, color: '#fff', fontWeight: 'bold'},
  ballTxt: {fontSize: 15},
  dayItemActive: {backgroundColor: 'red'},
});
