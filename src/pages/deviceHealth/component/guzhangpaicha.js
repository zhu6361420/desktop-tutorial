import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  FlatList,
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
      question: '',
      guzhangList: [],
    };
  }
  search = () => {
    this.setState({
      guzhangList: [{imgUrl: true}, {}, {}]
    })
  };
  showQuestionDetail=()=>{
    $fns.route({
        context: this,
        type: 'navigate',
        routeName: 'guzhangDetail',
      });
  }
  render() {
    const {guzhangList} = this.state;
    return (
      <>
        <UiHeader hasBack={false} />
        <View style={s.search}>
          <TextInput
            placeholder="搜索故障排查方法"
            style={s.textinput}
            value={this.state.question}
            onChangeText={(text) => {
              this.setState({
                question: text,
              });
            }}
          />
          <TouchableOpacity
            style={s.quxiao}
            onPress={() => {
              $fns.route({
                context: this,
                type: 'back',
              });
            }}>
            <Text style={{fontSize: 17, color: '#FFFFFF'}}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{position: 'absolute', top: 7, left: 10}}
            onPress={this.search}>
            <Image
              style={{
                width: 25,
                height: 25,
              }}
              source={require('../../../assets/imgs/Search_icon.png')}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{flex: 1, padding: '4%', paddingTop: 5, marginBottom: 20}}
          bounces={false}>
          {guzhangList.length == 0 ? (
            <>
              <Text style={s.title}>常见问题</Text>
              <View style={{flex: 1}}>
                {this.state.tooltip.map((item, index) => (
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      padding: 10,
                    }}>
                    <View style={s.dot}></View>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 20,
                      }}>
                      切割过程中割嘴发烫,切割不良？
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={{marginTop: 10}}>
              <Text style={{color: '#000000', fontSize: 16}}>
                共搜出3条和「切割」有关的结果
              </Text>
              <FlatList
                style={{
                  flex: 1,
                  height: '100%',
                  // borderColor:'red',
                  // borderWidth:1
                }}
                data={guzhangList}
                renderItem={({item}) => {
                  return (
                    <View style={s.card}>
                      <View style={{flexDirection:'row',height:78}}>
                        <TouchableOpacity style={{width:item.imgUrl?'77%':'100%',}} onPress={()=>this.showQuestionDetail()}>
                          <Text style={s.cardTitle} numberOfLines={1} ellipsizeMode={'tail'}>
                            切割过程中割嘴发烫,切割不良?
                          </Text>
                          <Text style={{fontSize: 16, marginTop: 5,lineHeight:24,}} numberOfLines={2} ellipsizeMode={'tail'}>
                            故障排查：1、清理比例阀怎么检查怎
                            么检查怎么检查怎么检查么检查怎么检查怎么检查怎么检...怎么检...
                          </Text>
                        </TouchableOpacity>
                        {item.imgUrl&&(
                        <View style={{width:'23%',height:'100%'}}>
                          <Image source={{uri: 'http://121.36.226.216/api/auth/attachments/设备监测.png'}} style={{width:'100%',height:'100%'}} />
                        </View>)}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                        }}>
                        <View style={s.icon}>
                          <IconFont size={18} icon={'\ue76a'} color="#B5B5B5" />
                          <Text style={{color: '#B5B5B5'}}>已解决1541</Text>
                        </View>
                        <View style={s.middle}></View>
                        <View style={s.icon}>
                          <IconFont size={18} icon={'\ue76b'} color="#B5B5B5" />
                          <Text style={{color: '#B5B5B5'}}>未解决15</Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
        </ScrollView>
      </>
    );
  }
}
let s = StyleSheet.create({
  middle: {
    marginLeft: 15,
    marginRight: 15,
    width: 6,
    height: 6,
    backgroundColor: '#B5B5B5',
    borderRadius: 25,
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  card: {
    marginTop: 10,
    padding: 12,
    height: 131,
    width: '100%',
    backgroundColor: '#fff',
    
  },
  search: {
    position: 'absolute',
    top: 35,
    left: '4%',
    right: '4%',
    height: 40,
    width: '100%',
    flexDirection: 'row',
  },
  textinput: {
    paddingLeft: 40,
    height: 37,
    paddingTop: 0,
    paddingVertical: 0,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.46)',
    width: '80%',
  },
  quxiao: {
    flex: 1,
    paddingLeft: '3%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 15,
    fontFamily: 'PingFang SC',
    color: '#000000',
    padding: 15,
    paddingLeft: 5,
    fontWeight: 'bold',
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: '#1C84C6',
    borderRadius: 25,
    marginRight: 6,
    marginTop: 5,
  },
});
