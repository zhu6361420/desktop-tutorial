import {IconFont, UiHeader, LinkItem, UiGap} from '../../global.components';
import React from 'react';
import {View, Text, Image, ImageBackground} from 'react-native';

export default class error extends React.Component {
  render() {
    return (
      <>
        <UiHeader
          title="出错了"
        //   hasBack={true}
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: '#f5f5f5',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            paddingBottom: 10,
            paddingTop: 8,
          }}>
          <Image
            source={require('../../assets/imgs/403.png')}
            resizeMode="stretch"
            style={{width: '100%', height: 330}}
          />
        </View>
      </>
    );
  }
}
