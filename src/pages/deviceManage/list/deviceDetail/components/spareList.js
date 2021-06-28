import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {IconFont, UiHeader, MsgPane, MsgRow} from '../../../../../global.components';
import {$myTheme, $source,$ajax,api,$ui} from '../../../../../global.utils';
import {$fns} from '../../../../../utils/fns';
const {consumeSpare,getStockList}=api
function Confirm(props) {
  let {isShow = false,value, onClose = () => {},OK=()=>{}} = props;
let [textValue,setTextValue]=useState(value)
  return (
    <Modal
      visible={isShow}
      transparent
      statusBarTranslucent
      animationType="fade">
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}>
        <View
          style={{
            width: $fns.getWindowWidth() - 60,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 20,
            borderRadius: 4,
          }}>
          <View
            style={{
              paddingHorizontal: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                paddingHorizontal: '10%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#444',
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                消耗量：
              </Text>
              <TextInput
                style={{
                  marginBottom: 10,
                  fontSize: 14,
                  height: 30,
                  borderColor: 'black',
                  borderWidth: 0.5,
                  textAlign: 'center',
                  color: '#777',
                  textAlignVertical:'center',
                  paddingVertical: 0,
                }}
                value={value}
                
                placeholder="请输入消耗数量"
                onChangeText={(res)=>{
                    const newText = res.replace(/[^\d]+/, '');
                    setTextValue(newText)
                }}
                keyboardType = 'numeric'
              />
            </View>
          </View>

          <View
            style={{
              borderTopColor: '#eee',
              borderTopWidth: 0.5,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                height: 50,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                onClose();
              }}>
              <Text style={{fontSize: 15}}>取消</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 50,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderLeftWidth: 0.5,
                borderLeftColor: '#eee',
              }}
              onPress={() => {
                OK(textValue);
              }}>
              <Text style={{fontSize: 15, color: $myTheme.mainBlue}}>确认</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default class App extends React.Component {
  state = {
    spareList: [],
    isShowConfirm: false,
    id:null,
    textValue:0,
    stockCount:0
  };
  componentDidMount() {
    const {deviceTypeId} = this.props.route.params;
    this.getStockList(deviceTypeId);
  }
  consume=(value)=>{
    const {deviceTypeId} = this.props.route.params;
    if(value==0){
      Alert.alert("注意","请输入消耗数量",[{
        text: '好的',
    },])
    }
    else if(value>this.state.stockCount){
      Alert.alert("注意","消耗数量不能大于库存",[{
        text: '好的',
    },])
    }
    else{
      $ajax({
        url: consumeSpare,
        data: {
            consumeCount:value,
            id:this.state.id
        },
        _this: this,
      }).then((value) => {
        if (value.code == 200) {
            this.setState({
                isShowConfirm:false,
                textValue:0
            })
           $ui.toast("变更消耗量成功")
           this.getStockList(deviceTypeId)
        }
      });
    }
   
  }
  getStockList = (id) => {
    $ajax({
      url: getStockList,
      data: {
        args: {
          deviceTypeId: id,
        },
        pageNum: 1,
        pageSize: 30,
      },      _this:this

    }).then((value) => {
      if (value.code == 200) {
        const {list} = value.data;
        this.setState({
          spareList:list
        });
      }
    });
  };
  render() {
    const {spareList, isShowConfirm,textValue,} = this.state;
    return (
      <>
        <UiHeader
          title="备件列表"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        
        />

        <ScrollView
        >
            {spareList.length!=0&&spareList.map((item,index)=>(
                  <MsgPane
                  key={index}
                  title="备件名称"
                  title2={item.name}
                  bgSize={{width: 0, height: 0}}
                  style={{marginBottom: 10, borderRadius: 0}}
                  onPress={() => {}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 1}}>
                      <View style={[ss.flexRow]}>
                        <Text style={[ss.txtItem, ss.txtGray]}>备件规格：</Text>
                        <Text style={[ss.txtItem]}>{item.specification}</Text>
                      </View>
      
                      <View style={[ss.flexRow]}>
                        <View style={{flexDirection: 'row', marginRight: 20}}>
                          <Text style={[ss.txtItem, ss.txtGray]}>当前库存：</Text>
                          <Text style={[ss.txtItem, {color: 'red'}]}>{item.stockCount}</Text>
                        </View>
      
                        <View style={{flexDirection: 'row'}}>
                          <Text style={[ss.txtItem, ss.txtGray]}>标准库存：</Text>
                          <Text style={[ss.txtItem]}>{item.count}</Text>
                        </View>
                      </View>
      
                      <View style={[ss.flexRow]}>
                        <Text style={[ss.txtItem, ss.txtGray]}>备注：{item.memo}</Text>
                      </View>
                    </View>
      
                    <View>
                      <TouchableOpacity
                        style={{paddingHorizontal: 6}}
                        onPress={() => {
                          item.stockCount<1?$ui.toast("库存空啦，请及时补充该备件库存！"):
                          this.setState({
                            isShowConfirm: true,
                            stockCount:item.stockCount,
                            id:item.id
                          });
                        }}>
                        <IconFont
                          icon={'\ue641'}
                          size={30}
                          color={$myTheme.mainBlue}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </MsgPane>
      
            ))}
        
         
        </ScrollView>

        <Confirm
          isShow={isShowConfirm}
          value={textValue}
          // stockCount={stockCount}
          onClose={() => {
            this.setState({
              isShowConfirm: false,
            });
          }}
          OK={(res)=>this.consume(res)
          }
        />
      </>
    );
  }

}

let ss = StyleSheet.create({
  flexRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 6},
  ball: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    marginRight: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  msgTag: {
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 4,
  },
  txtItem: {fontSize: 13},
  txtGray: {color: '#777'},

  h3Title: {
    height: 40,
    backgroundColor: '#e7f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  tagItem: {
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    width: $fns.getWindowWidth() / 3.8,
    backgroundColor: '#eeeeee',
    borderRadius: 4,
    marginBottom: 15,
  },
  tagTxt: {color: '#666'},
  inputBox: {
    flex: 1,
    height: 34,
    borderWidth: 0.5,
    borderColor: '#666',
    borderRadius: 3,
    paddingVertical: 0,
    textAlign: 'center',
  },
});
