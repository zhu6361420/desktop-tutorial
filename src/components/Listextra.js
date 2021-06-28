import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {$fns} from '../global.utils';
import {UiHeader} from '../global.components';
export const renderLoadingView = (_this, title) => {
  return (
    <>
      <UiHeader
        title={title}
        right={<Text></Text>}
        onBack={() => {
          $fns.route({
            context: _this,
            type: 'back',
          });
        }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F5FCFF',
          
        }}>
        <ActivityIndicator animating={true} color="black" size="large" />
      </View>
    </>
  );
};

export const renderErrorView = (
  <View
    style={{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    }}>
    <Text>Fail</Text>
  </View>
);
export const renderFooter = (showFoot) => {
  if (showFoot === 1) {
    return (
      <View
        style={{
          height: 30,
          alignItems: 'center',
          justifyContent: 'flex-start',
          // borderColor:'red',
          // borderWidth:1
        }}>
        <Text
          style={{
            color: '#999999',
            fontSize: 14,
            // marginTop: 5,
            marginBottom: 5,
          }}>
          没有更多数据了
        </Text>
      </View>
    );
  } else if (showFoot === 2) {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 24,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <ActivityIndicator />
        <Text>正在加载更多数据...</Text>
      </View>
    );
  } else if (showFoot === 0) {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 24,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <Text></Text>
      </View>
    );
  }
};
