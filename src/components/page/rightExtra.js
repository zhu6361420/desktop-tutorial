import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import {$myTheme} from '../../global.utils';

export default function (props) {
  let {curTabIndex = null,text="",index=null, onPress = () => {}} = props;

  return (
    <TouchableOpacity
      style={[
        ss.dayItem,
        curTabIndex == index
          ? {backgroundColor: '#e6effe'}
          : {backgroundColor: '#fff'},
      ]}
      onPress={() =>onPress()}>
      <Text
        style={{
          color: curTabIndex == index ? $myTheme.mainBlue : '#333',
          fontSize: 12,
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
let ss = StyleSheet.create({
  titleMain: {flexDirection: 'row', flex: 1, justifyContent: 'flex-end'},
  mainBox: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: '#fff',
    paddingLeft: 12,
  },
  dayItem: {
    padding: 3,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginLeft: 10,
  },
});
