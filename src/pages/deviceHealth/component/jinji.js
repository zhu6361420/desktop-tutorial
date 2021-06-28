import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {UiHeader, IconFont} from '../../../global.components';
import {$fns, $source, $ui, $ajax, api} from '../../../global.utils';
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
      tooltip: [{}, {}, {}],
      alarmList: [{}, {}],
    };
  }
  shwoJinjiDetail=item=>{
    $fns.route({
      context: this,
      type: 'push',
      routeName:"jinjibaojing",
    });
  }
  render() {
    return (
      <>
        <UiHeader
          title="紧急报警列表"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
          right={
            <TouchableOpacity
              onPress={() => {
                // this.refs.deviceRef.show();
              }}>
              <IconFont icon={'\ue640'} size={22} color="#fff" />
            </TouchableOpacity>
          }
        />

        <ScrollView
          style={{flex: 1, padding: 14, paddingTop: 5, marginBottom: 20}}
          bounces={false}>
          <Text
            style={{
              fontSize: 15,
              //   borderColor: 'red',
              //   borderWidth: 1,
              fontFamily: 'PingFang SC',
              color: '#000000',
              padding: 15,
              paddingLeft: 5,
              fontWeight: 'bold',
            }}>
            待处理15条
          </Text>
          <View style={{flex: 1}}>
            {this.state.tooltip.map((item, index) => (
              <TouchableOpacity
              onPress={() => this.shwoJinjiDetail(item)}
                style={{
                  width: '100%',
                  height: 70,
                  marginBottom: 15,
                  backgroundColor: '#fff',
                  padding: 13,
                }}>
                <Text style={{fontSize: 14, lineHeight: 20}}>
                  设备编号为HPE30256225252设备已运行1500小时，需要保养维修！
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        
      </>
    );
  }
}
