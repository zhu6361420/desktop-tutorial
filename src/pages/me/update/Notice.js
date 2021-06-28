import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

function App(props) {
  let {isShow = false, onClose = () => {}, messageList = []} = props;

  let [pgVal, setPgVal] = useState(0);

  return (
    <Modal transparent visible={isShow} animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{width: Dimensions.get('screen').width * 0.8}}>
          <View style={{flexDirection: 'column'}}>
            <View style={{height: 40}}></View>
            <View
              style={{
                height: 60,
                backgroundColor: '#1c84c6',
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              }}></View>
            <Image
              source={require('../../../assets/imgs/icon_notice.png')}
              style={{
                width: 90,
                height: 90,
                position: 'absolute',
                top: 0,
                left: '14%',
              }}
              resizeMode={'contain'}
            />
            <Text
              style={{
                fontSize: 24,
                position: 'absolute',
                left: '60%',
                top: 55,
                color: '#fff',
              }}>
              公告
            </Text>
          </View>

          <View
            style={{
              paddingHorizontal: 10,
              backgroundColor: '#fff',
              paddingVertical: 8,
              height:220
            //   maxHeight: 230,

            //   borderColor: 'red',
            //   borderWidth: 1,
            }}>
            <ScrollView
              style={{
                paddingHorizontal: 5,
              
              }}>
              {messageList.map((item, key) => (
                <View style={{flexDirection: 'row', marginBottom: 14,borderColor:'#fff',borderWidth:1}}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#1c84c6',
                      borderRadius: 4,
                      marginTop: 6,
                    }}></View>
                  <View style={{flex: 1, paddingLeft: 10}}>
                    <Text style={{lineHeight: 20, fontSize: 15,}}>
                      {item.messageContent}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View
            style={{
              backgroundColor: '#fff',
              paddingBottom: 18,
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 200,
                  borderRadius: 20,
                  backgroundColor: '#1c84c6',
                  fontSize: 18,
                  color: '#fff',
                }}
                onPress={() => {
                  onClose();
                }}>
                <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold'}}>
                  我知道了
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default App;
