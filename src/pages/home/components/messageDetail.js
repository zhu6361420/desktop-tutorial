import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {UiHeader} from '../../../global.components';
import UiImageUpload from '../../../components/UiImageUpload';
import {$myTheme, api, $ajax, $source} from '../../../global.utils';
import {$fns} from '../../../utils/fns';
import {CheckBox} from 'react-native-elements';
import UiButton from '../../../components/UiButton';
import {$ui} from '../../../utils/utils.ui';
import Zoom from '../../../components/Zoom';
const {createMessage} = api;
export default class App extends React.Component {
  state = {
    curIndex: 0,
    typeArr: ['功能建议', '用户体验', '产品缺陷'],
    isRead: false,
    textValue: '',
    picList: [],
  };

  render() {
    let {curIndex, typeArr} = this.state;
    const {messageDetail} = this.props.route.params;
    console.log(messageDetail);
    let images =messageDetail.imageUrls? messageDetail.imageUrls
      .split(',')[0]==[""]?[]:
      messageDetail.imageUrls
      .split(',').map((item) => ({url: `${$source.url}/api/auth${item}`})):[];
    return (
      <>
        <UiHeader
          title="反馈详情"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />
        <Zoom ref="zoom" images={images} />
        <ScrollView style={{backgroundColor: '#fafafa'}}>
          <View style={[ss.sec]}>
            <View style={[ss.secTitle]}>
              <Text style={[ss.setTitleDot]}>*</Text>
              <Text style={[ss.setTitleTxt]}>反馈类型</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 20,
              }}>
              <View style={[ss.tagItem]}>
                <Text style={{color: '#444'}}>
                  {messageDetail.messageTitle}
                </Text>
              </View>
            </View>
          </View>

          <View style={[ss.sec]}>
            <View style={[ss.secTitle]}>
              <Text style={[ss.setTitleDot]}>*</Text>
              <Text style={[ss.setTitleTxt]}>内容</Text>
            </View>

            <View style={[ss.secMain]}>
              <Text style={{fontSize: 16, color: '#777'}}>
                {messageDetail.messageContent}
              </Text>
            </View>
          </View>

          <View style={[ss.sec, {paddingTop: 0}]}>
            <View style={[ss.secTitle]}>
              <Text style={[ss.setTitleDot]}>*</Text>
              <Text style={[ss.setTitleTxt]}>附加图片</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: images.length == 0 ?'center':'flex-start',
                paddingLeft:20
              }}>
              {images.length == 0 && (
                <Text style={{color: '#222', fontSize: 15, textAlign: 'right'}}>
                  暂无图片
                </Text>
              )}
              {images.length != 0 &&
                images.map((items, index) => (
                  <TouchableOpacity
                    style={{marginRight: 10, marginBottom: 5}}
                    onPress={() => this.refs.zoom.show(index)}>
                    <Image
                      key={index}
                      source={{uri: items.url}}
                      style={{
                        width: 100,
                        height: 100,
                        borderColor: '#ddd',
                        borderWidth: 1,
                      }}
                    />
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </ScrollView>
      </>
    );
  }
}

let ss = StyleSheet.create({
  sec: {backgroundColor: '#fff', padding: 12, marginBottom: 10},
  secTitle: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  setTitleDot: {color: 'red', fontSize: 20},
  setTitleTxt: {fontSize: 15, marginLeft: 4},

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

  secMain: {
    backgroundColor: '#fff',
    minHeight: 100,
    marginTop: 10,
    marginLeft: 20,
  },
  secInput: {
    paddingVertical: 0,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 15,
  },
});
