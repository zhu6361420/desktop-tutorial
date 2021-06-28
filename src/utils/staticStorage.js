import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
export default class SyncStorage extends React.Component {
  static cache = [];

  // 初始化需要在App启动时执行
  static async init() {
    let keys = await AsyncStorage.getAllKeys();
    let items = await AsyncStorage.multiGet(keys).then();
    items.map(([key, value]) => {
      this.cache[key] = value;
    });
  }

  static getValue(key) {
    let a = this.cache[key];
    if (a) {
      return this.cache[key];
    } else {
      return null;
    }
  }

  static setValue(key, value) {
    if (this.cache[key] === value) return;
    this.cache[key] = value;
    AsyncStorage.setItem(key, value);
  }

  static removeKey(key) {
    delete this.cache[key];
    AsyncStorage.removeItem(key);
  }
  static removeAllKey() {
    delete this.cache;
    AsyncStorage.clear();
  }
}
global.sto = SyncStorage;
global.global_firm=null;
global.global_group=null;
