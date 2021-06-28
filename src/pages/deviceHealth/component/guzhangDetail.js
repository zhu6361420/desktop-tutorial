import React from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {UiHeader, IconFont} from '../../../global.components';
import {$fns, $source, $ui, $ajax, api} from '../../../global.utils';
import {WebView} from 'react-native-webview';
const {getMachineEnergeList} = api;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltip: [{}, {}, {}],
      alarmList: [{}, {}],
      selectIndex: 0,
      isShow: false,
      isShowSuccess: false,
      textValue: '',
      webViewHeight: 0,
    };
  }
  change = (index) => {
    this.setState({
      selectIndex: index,
      isShow: index == 2,
      isShowSuccess: index == 1,
    });
  };
  webViewLoadedEnd = () => {
    this.webview.injectJavaScript(`
         const height = document.body.clientHeight;
         window.ReactNativeWebView.postMessage(JSON.stringify({height: height}));
    `);
  };
  onMessage = (e) => {
    const data = JSON.parse(e.nativeEvent.data);
    console.warn('data: ', 400);
    if (data.height) {
      this.setState({
        webViewHeight: data.height,
      });
    }
  };
  render() {
    const {selectIndex, textValue, isShowSuccess, isShow} = this.state;
    return (
      <>
        <UiHeader
          // title="保养提醒"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />
        <View style={{flex: 1}}>
          <WebView
            ref={(ref) => (this.webview = ref)}
            style={{flex:1,height: 500}}
            automaticallyAdjustContentInsets={true}
            source={{uri: 'https://learnku.com/articles/35381'}}
          />
          <View style={{padding: 17, marginTop: 10,borderColor:'#1C84C6',borderWidth:1,borderRadius:12,marginBottom:5}}>
            <View>
              <Text style={{color: '#1C84C6'}}>文档是否解决您的问题?</Text>
            </View>
            <View style={s.icons}>
              <TouchableOpacity style={s.icon} onPress={() => this.change(1)}>
                <IconFont
                  size={20}
                  icon={'\ue76a'}
                  color={selectIndex == 1 ? '#1C84C6' : '#B5B5B5'}
                />
                <Text style={{color: selectIndex == 1 ? '#1C84C6' : '#B5B5B5'}}>
                  已解决
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.icon} onPress={() => this.change(2)}>
                <IconFont
                  size={20}
                  icon={'\ue76b'}
                  color={selectIndex == 2 ? '#1C84C6' : '#B5B5B5'}
                />
                <Text style={{color: selectIndex == 2 ? '#1C84C6' : '#B5B5B5'}}>
                  未解决
                </Text>
              </TouchableOpacity>
            </View>
            {isShow && (
              <View style={s.fail}>
                <Text>
                  <Text style={{color: 'red'}}>*</Text>必填
                </Text>
                <View style={s.failInput}>
                  <TextInput
                    placeholder="请输入您的建议内容"
                    value={textValue}
                    style={[s.secInput]}
                    onChangeText={(res) =>
                      this.setState({
                        textValue: res,
                      })
                    }
                    multiline
                  />
                </View>
                <View style={s.button}>
                  <View
                    style={{
                      width: 83,
                      height: 35,
                      backgroundColor:
                        textValue == ''
                          ? 'rgba(181, 181, 181, 0.2)'
                          : '#1C84C6',
                      borderRadius: 8,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        color: textValue == '' ? '#B5B5B5' : '#FFFFFF',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                      }}>
                      提交反馈
                    </Text>
                  </View>
                  <View style={s.cancer}>
                    <Text
                      style={{
                        flex: 1,
                        color: '#1C84C6',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                      }}>
                      取消
                    </Text>
                  </View>
                </View>
              </View>
            )}
            {isShowSuccess && (
              <View style={s.success}>
                <View style={{height: 40, width: 23}}>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 5,
                    }}
                    source={require('../../../assets/imgs/success.png')}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text style={{lineHeight: 20}}>
                    提交成功！非常感谢您的反馈,我们会继续努力做到更好！
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </>
    );
  }
}
const s = StyleSheet.create({
  success: {
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    marginTop: 10,
    padding: 10,
    marginLeft: '15%',
    backgroundColor: 'rgba(28, 132, 198, 0.2)',
  },
  cancer: {
    width: 83,
    height: 35,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1C84C6',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  failInput: {
    borderColor: '#B5B5B5',
    borderWidth: 1,
    marginTop: 10,
  },
  fail: {
    width: '100%',
    justifyContent: 'center',
    height: 190,
    marginTop: 10,
    padding: 10,
  },
  secInput: {
    paddingVertical: 0,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 15,
  },
  icons: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    justifyContent: 'center',
  },
});
