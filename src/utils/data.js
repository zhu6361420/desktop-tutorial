import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
//机床状态(数值转为汉字)

export function getMachineStatus(status) {
  switch (status) {
    case 0:
      return '空闲';
    case 1:
      return '运行';
    case 2:
      return '故障';
    case 3:
      return '关机';
    case 4:
      return '准备';
    default:
      return '未知';
  }
}
export function getStatusValue(status) {
  switch (status) {
    case '空闲':
      return 0;
    case '运行':
      return 1;
    case '故障':
      return 2;
    case '关机':
      return 3;
    case '准备':
      return 4;
    default:
      return null;
  }
}
//机床状态颜色(数值转为颜色)
export function getMachineStatusColor(status) {
  switch (status) {
    case 0:
      return '#1890f2';
    case 1:
      return '#21d29f';
    case 2:
      return '#ff4343';
    case 3:
      return '#b8b8b8';
    case 4:
      return '#fdb659';
    default:
      return '#b8b8b8';
  }
}

//机床状态名字加数值
export const machineStatus = [
  {status: 1, name: '运行'},
  {status: 4, name: '准备'},
  {status: 0, name: '空闲'},
  {status: 2, name: '故障'},
  {status: 3, name: '关机'},
];
//养护类型
export const maintainTypeOption = [
  {value: 0, label: '每日维护'},
  {value: 1, label: '每周维护'},
  {value: 2, label: '每季维护'},
  {value: 3, label: '每年维护'},
];
// 将浮点数转成时间
export function floatToTime(float) {
  var numArr = String(float).split('.');
  var hours = prefixZero(numArr[0]);
  var minutes = numArr[1]
    ? prefixZero(Math.floor(+('.' + numArr[1]) * 60))
    : '00';
  return `${hours}:${minutes}`;
}
//时间转换
export function prefixZero(num) {
  return num < 10 ? `0${num}` : num;
}
//时间计算返回时分秒
export function timeCompution(start, end) {
  // var date3 = new Date(end).getTime() - new Date(start).getTime(); //时间差的毫秒数
  var date3 =
    new Date(end.substring(0, 19).replace(/-/g, '/')).getTime() -
    new Date(start.substring(0, 19).replace(/-/g, '/')).getTime();
  //计算出小时数
  var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000);
  return `${prefixZero(hours)}:${prefixZero(minutes)}:${prefixZero(seconds)}`;
}
export function formatSecondTotime(duration) {
  if (typeof duration != 'number' || duration <= 0) {
    return '00:00:00';
  }
  const h = Math.floor(duration / (60 * 60));
  const m = Math.floor((duration / 60) % 60);
  const s = Math.floor(duration % 60);
  return `${prefixZero(h)}:${prefixZero(m)}:${prefixZero(s)}:`;
}
//超管判断
export const isYWAdmin = () => {
  let roleId, firmId;
  if (JSON.parse(sto.getValue('loginData')) != null) {
    roleId = JSON.parse(sto.getValue('loginData')).userData.roleId;
    firmId = JSON.parse(sto.getValue('loginData')).userData.firmId;
  }
  if (roleId == 1 && firmId == 1) {
    return true;
  } else {
    return false;
  }
};
//企管判断
export const isCustomAdmins = () => {
  // console.log(JSON.parse(sto.getValue('loginData')))
  let roleId;
  if (JSON.parse(sto.getValue('loginData')) != null) {
    roleId = JSON.parse(sto.getValue('loginData')).userData.roleId;
  }
  return roleId == 4;
};
let timeout = null;
export const debounce = (cb, wait = 500) => {
  if (timeout !== null) clearTimeout(timeout);
  timeout = setTimeout(() => {
    timeout = null;
    cb && cb();
  }, wait);
};
export const appsName = {
  设备管理: true,
  能耗管理: true,
  // 权限管理: true,
  远程服务:true,
  设备健康:true
};
export function twoFixed(num) {
  return (num * 100).toFixed(2);
}
export const tooptip = [
  <View style={{backgroundColor: 'black', height: 10, width: 10}}></View>,
  <Text>333</Text>,
];
export function monthlist(){
  var dataArr = [];
  var data = new Date();
  data.setMonth(data.getMonth() + 1, 1); //获取到当前月份,设置月份
  for (var i = 0; i < 12; i++) {
    data.setMonth(data.getMonth() - 1); //每次循环一次 月份值减1
    var m = data.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    dataArr.push(data.getFullYear() + '-' + m);
  }
  return dataArr
};
