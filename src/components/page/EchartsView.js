import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Echarts, echarts} from 'react-native-secharts';
import {$myTheme} from '../../global.utils';
// import {tooptip}from '../../utils/data'
import {Card} from 'react-native-shadow-cards';
export default function (props) {
  let {
    title = null,
    option = null,
    length = 0,
    onPress = () => {},
    detail = false,
    tooltip = [],
    right = null,
    height = 0,
    ismargin=true,
  } = props;

  function selectTooltip(mode, color) {
    switch (mode) {
      case 'rect':
        return (
          <View
            style={{
              backgroundColor: color,
              height: 10,
              width: 18,
              marginRight: 3,
            }}></View>
        );
      case 'circle':
        return (
          <View
            style={{
              backgroundColor: color,
              height: 10,
              width: 10,
              borderRadius: 25,
              marginRight: 3,
            }}></View>
        );
      case 'line':
        return (
          <View
            style={{
              height: 10,
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 3,
            }}>
            <Text
              style={{
                color: color,
                textAlignVertical: 'center',
                textAlign: 'center',
              }}>
              -----
            </Text>
          </View>
        );
    }
  }

  return (
    <Card style={{marginTop: ismargin?15:1, borderRadius: 0, width: '100%'}}>
      {title && (
        <View style={[sss.title]}>
          <Text style={[sss.titleTxt]}>{title}</Text>
          {detail && (
            <View style={[sss.titleMain]}>
              <TouchableOpacity
                onPress={() => {
                  onPress();
                }}>
                <Text style={[sss.titleMore]}>查看详情</Text>
              </TouchableOpacity>
            </View>
          )}
          {right && right}
        </View>
      )}
      {tooltip.length != 0 && (
        <View style={[sss.toolip]}>
          {tooltip.map((item, index) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
              {selectTooltip(item.mode, item.color)}
              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 12,
                }}>
                {item.text}
              </Text>
            </View>
          ))}
        </View>
      )}
      <View style={[sss.mainBox]}>
        {length != 0 ? (
          <Echarts option={option} height={height == 0 ? 200 : height} />
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{textAlign: 'center'}}>暂无{title}</Text>
          </View>
        )}
      </View>
    </Card>
  );
}
let sss = StyleSheet.create({
  title: {
    flexDirection: 'row',
    height: 46,
    // backgroundColor: '#ece9e9',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderColor:'#ddd',
    borderBottomWidth:1
  },
  titleTxt: {fontSize: 16, color: '#222'},
  titleMain: {flexDirection: 'row', flex: 1, justifyContent: 'flex-end'},
  titleMore: {color: $myTheme.mainBlue},
  mainBox: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: '#fff',
    minHeight: 180,
  
    // height:900
    //     borderColor:"red",
    // borderWidth:1,
  },
  toolip: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 10,
    // borderColor:"red",
    // borderWidth:1,
    // minHeight:30
  },
});
