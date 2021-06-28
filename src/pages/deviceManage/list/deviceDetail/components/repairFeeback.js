import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {UiHeader} from '../../../../../global.components';
import UiImageUpload from '../../../../../components/UiImageUpload';
import {$myTheme, api, $ajax, $source} from '../../../../../global.utils';
import {$fns} from '../../../../../utils/fns';
import {CheckBox} from 'react-native-elements';
import UiButton from '../../../../../components/UiButton';
import {$ui} from '../../../../../utils/utils.ui';
import {Rating, AirbnbRating} from 'react-native-ratings';
const {createFeedback} = api;
export default class App extends React.Component {
  state = {
    textValue: '',
    taidu:3,
    jishi:3,
    wending:3,
    zuizhong:3
  };
  submit = () => {
    const { taidu,jishi,wending ,zuizhong,textValue} = this.state;
    const {repairDetail} = this.props.route.params;
    $ajax({
      url: createFeedback,
      data: {
        attitude: (5-taidu)>4?4:(5-taidu),
        timeliness: 5-jishi>4?4:5-jishi,
        stability: 5-wending>4?4:5-wending,
        finalPj: 5-zuizhong>4?4:5-zuizhong,
        dataSource:1,
        repairId:repairDetail.repairId,
        transId:'',
        memo:textValue,
        creatorName: ""
      },
      _this: this,
    }).then((value) => {
      // $ui.toast('提交反馈成功！');
      if (value.code == 200) {
        $fns.route({
          context: this,
          routeName: 'dm_RepairDetail',
          params: {
            id: repairDetail.id,
          },
        });
        $ui.toast('提交反馈成功！');
      }
    });
  };
  taidu=(rating)=>{
    this.setState({
        taidu:rating
    })
  }
  jishi=(rating)=>{
    this.setState({
        jishi:rating
    })
  }
  wending=(rating)=>{
    this.setState({
        wending:rating
    })
  }
  zuizhong=(rating)=>{
    this.setState({
        zuizhong:rating
    })
  }
  render() {
    return (
      <>
        <UiHeader
          title="报修反馈"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />

        <ScrollView style={{backgroundColor: '#fafafa'}}>
          <View style={[ss.sec]}>
            <View style={[ss.secTitle]}>
              <Text style={[ss.setTitleDot]}>*</Text>
              <Text style={[ss.setTitleTxt]}>服务态度：</Text>
              <Rating
                type="star"
                ratingCount={5}
                imageSize={15}
                onFinishRating={this.taidu}
              />
            </View>
          </View>

          <View style={[ss.sec]}>
            <View style={[ss.secTitle]}>
              <Text style={[ss.setTitleDot]}>*</Text>
              <Text style={[ss.setTitleTxt]}>服务及时性：</Text>
              <Rating
                type="star"
                ratingCount={5}
                imageSize={15}
                onFinishRating={this.jishi}
              />
            </View>
          </View>
           
          <View style={[ss.sec]}>
            <View style={[ss.secTitle]}>
              <Text style={[ss.setTitleDot]}>*</Text>
              <Text style={[ss.setTitleTxt]}>机床稳定性：</Text>
              <Rating
                type="star"
                ratingCount={5}
                imageSize={15}
                onFinishRating={this.wending}
              />
            </View>
          </View>

          <View style={[ss.sec]}>
            <View style={[ss.secTitle]}>
              <Text style={[ss.setTitleDot]}>*</Text>
              <Text style={[ss.setTitleTxt]}>最终评价：</Text>
              <Rating
                type="star"
                ratingCount={5}
                imageSize={15}
                onFinishRating={this.zuizhong}
              />
            </View>
          </View>
          <View style={[ss.sec]}>
            <View style={[ss.secTitle]}>
              {/* <Text style={[ss.setTitleDot]}>*</Text> */}
              <Text style={[ss.setTitleTxt],{marginLeft:15}}>备注</Text>
            </View>

            <View style={[ss.secMain]}>
              <TextInput
                placeholder="请输入备注信息"
                value={this.state.textValue}
                style={[ss.secInput]}
                onChangeText={(res) =>
                  this.setState({
                    textValue: res,
                  })
                }
                multiline
              />
            </View>

          </View>

     
       

          <UiButton
            style={{
              width: '100%',
              paddingLeft: 12,
              paddingRight: 12,
              marginTop: 10,
              marginBottom: 30,
            }}
            buttonStyle={{height: 44}}
            title="提交"
            onPress={() =>
              this.submit()
            }
          />
        </ScrollView>
      </>
    );
  }
}

let ss = StyleSheet.create({
  sec: {backgroundColor: '#fff', padding: 12, marginBottom: 10},
  secTitle: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  setTitleDot: {color: 'red', fontSize: 20},
  setTitleTxt: {fontSize: 14, marginLeft: 4,width:90},

  tagItem: {
    width: '31.5%',
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  tagItemActive: {backgroundColor: '#e6effe'},
  tagItemTxt: {color: '#888'},
  tagItemTxtActive: {color: $myTheme.mainBlue},

  secMain: {backgroundColor: '#fff',alignItems:'center',justifyContent:'center'},
  secInput: {
    paddingVertical: 0,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 15,
    borderColor:'#ddd',
    borderWidth:1,
    width:'90%'
  },
});
