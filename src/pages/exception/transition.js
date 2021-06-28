import React from 'react';
import {Text, View, Image, TouchableOpacity, StatusBar} from 'react-native';
import {$fns} from '../../global.utils';
import {UiHeader} from '../../global.components';
export default class App extends React.Component {
  render() {
    return (
        <>
        <UiHeader
        title="设备管理"
        onBack={() => {
          $fns.route({
            context: this,
            type: 'back',
          });
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}>
        <View
          style={{
            flex: 5,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}>
          {/* <StatusBar
            backgroundColor="#fff"
            translucent
            barStyle="dark-content"
          /> */}
        </View>
     
      </View>
   </>
    );
  }
}
