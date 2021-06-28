import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import {IconFont, UiHeader} from '../../../../../global.components';
import {$fns} from '../../../../../utils/fns';
import {$source, api, $ajax} from '../../../../../global.utils';
import moment from 'moment';
import {Card} from 'react-native-shadow-cards';
const {getWeekly} = api;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weekInfo:{

      }
    };
  }
  componentDidMount() {
    this.getWeekly();
  }
  getWeekly = () => {
    $ajax({
      url: getWeekly,
      data: {},
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const {
          openHours,
          avgWorkingByCompany,
          endDate,
          machineNum,
          runHours,
          avgOpenByCompany,
          startDate,
        } = value.data;
        this.setState({
          weekInfo:{
            openHours:openHours,
            avgWorkingByCompany:avgWorkingByCompany,
            endDate:moment(endDate).format('M.DD') ,
            machineNum:machineNum,
            runHours:runHours,
            avgOpenByCompany:avgOpenByCompany,
            startDate:moment(startDate).format('M.DD') 
          }
        })
      }
    });
  };
  render() 
  {
    const {weekInfo }=this.state;
    return (
      <>
        <UiHeader
          // title="上周小结"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />

        <View style={{flex: 1,justifyContent:'center',alignItems:'center',}}>
            <Card style={{width:'80%',height:'80%',backgroundColor:'#fff',padding:10}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
              <Image
                  source={require("../../../../../assets/imgs/worker.png")}
                  style={{width: 40, height: 40, borderRadius: 35,backgroundColor:'#e8e8e8'}}
                />
               <Text style={{fontSize:16,color:'#222',marginLeft:10,letterSpacing:1}}>一周小结  {weekInfo.startDate}-{weekInfo.endDate}</Text> 
              </View>
              <View style={{marginTop:40,alignItems:"center",justifyContent:'space-around'}}>
                 <View style={ss.row}>
                   <Text style={ss.top}>工作机床</Text>
                 <Text style={ss.bottom}>{weekInfo.machineNum} 台</Text></View>

                 <View style={ss.row}>
                   <Text style={ss.top}>总开机时长</Text>
                 <Text style={ss.bottom}>{weekInfo.openHours} h</Text></View>

                 <View style={ss.row}>
                   <Text style={ss.top}>总运行时长</Text>
                 <Text style={ss.bottom}>{weekInfo.runHours} h</Text></View>

                 <View style={ss.row}>
                   <Text style={ss.top}>平均开机率</Text>
                 <Text style={ss.bottom}>{weekInfo.avgOpenByCompany}%</Text></View>

                 <View style={ss.row}>
                   <Text style={ss.top}>平均有效运行率</Text>
                 <Text style={ss.bottom}>{weekInfo.avgWorkingByCompany}%</Text></View>
              </View>

            </Card>
        </View>
      </>
    );
  }
}

let ss = StyleSheet.create({
   top:{
     color:'grey',
     fontSize:12
   },
   bottom:{
      fontSize:16,
      marginTop:10
   },
   row:{
    width:'80%',
    borderBottomWidth:1,
    borderColor:'#ddd',
    marginBottom:20,
    paddingBottom:10,
    paddingLeft:10
   }
});
