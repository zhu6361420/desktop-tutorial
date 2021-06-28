import React, {Component} from 'react';
import Picker from 'react-native-picker';
import {View, Modal} from 'react-native';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: props.currentDate!=undefined?props.currentDate:this._getCurrentDate(),
      _picker: null,
      modalVisible: false,
    };
  }
  //获取当前日期  格式如 2018-12-15
  _getCurrentDate() {
    var currDate = new Date();
    var year = currDate.getFullYear();
    var month = (currDate.getMonth() + 1).toString();
    month = month.padStart(2, '0');
    var dateDay = currDate.getDate().toString();
    dateDay = dateDay.padStart(2, '0');
    let time = year + '-' + month + '-' + dateDay;
    return time;
  }
  //组装日期数据
  _createDateData() {
    var currDate = new Date();

    let {min = 1950, max = currDate.getFullYear()} = this.props;

    let date = [];
    var month = currDate.getMonth() + 1;
    for (let i = min; i <= max; i++) {
      let month = [];
      for (let j = 1; j < 13; j++) {
        let day = [];
        if (j === 2) {
          for (let k = 1; k < 29; k++) {
            day.push(k + '日');
          }
          // 润年
          if (i % 4 === 0) {
            day.push(29 + '日');
          }
        } else if (
          j in
          {
            1: 1,
            3: 1,
            5: 1,
            7: 1,
            8: 1,
            10: 1,
            12: 1,
          }
        ) {
          for (let k = 1; k < 32; k++) {
            day.push(k + '日');
          }
        } else {
          for (let k = 1; k < 31; k++) {
            day.push(k + '日');
          }
        }
        let _month = {};
        _month[j + '月'] = day;
        month.push(_month);
      }
      let _date = {};
      _date[i + '年'] = month;
      date.push(_date);
    }
    return date;
  }

  //打开日期选择 视图
  show() {
    
    var year = '';
    var month = '';
    var day = '';
    var dateStr = this.props.currentDate?this.props.currentDate:this._getCurrentDate();
    year = dateStr.substring(0, 4);
    month = parseInt(dateStr.substring(5, 7));
    day = parseInt(dateStr.substring(8, 10));
    if (this.state.modalVisible) {
      this.setState(
        {
          modalVisible: false,
        },
        () => {
          Picker.hide();
        },
      );
    } else {
      let {flag = 0} = this.props;
      if (flag == 1) {
        Picker.init({
          pickerTitleText: '时间选择',
          pickerCancelBtnText: '取消',
          pickerConfirmBtnText: '确定',
          pickerConfirmBtnColor: [100, 100, 100, 1],
          pickerCancelBtnColor: [100, 100, 100, 1],
          pickerToolBarBg: [232, 232, 232, 1],
          selectedValue: [year + '年', month + '月', day + '日'],
          pickerBg: [255, 255, 255, 1],
          pickerData: this._createDateData(),
          pickerFontColor: [33, 33, 33, 1],
          pickerRowHeight: 34,
          onPickerConfirm: (pickedValue, pickedIndex) => {
            var year = pickedValue[0].substring(0, pickedValue[0].length - 1);
            var month = pickedValue[1].substring(0, pickedValue[1].length - 1);
            month = month.padStart(2, '0');
            var day = pickedValue[2].substring(0, pickedValue[2].length - 1);
            day = day.padStart(2, '0');
            let str = year + '-' + month + '-' + day;
            this.props.onComfirm && this.props.onComfirm(str);
            this.hide();
          },
          onPickerCancel: (pickedValue, pickedIndex) => {
            this.hide();
          },
          onPickerSelect: (pickedValue, pickedIndex) => {},
        });
        Picker.show();
      } else {
        this.setState({
          modalVisible: true,
        });
      }
    }

    // Picker.show();
  }

  hide = () => {
    this.setState({
      modalVisible: false,
    });
    if (this.props.flag == 1) {
      Picker.hide();
    }
  };

  render() {
    const {modalVisible} = this.state;
    var year = '';
    var month = '';
    var day = '';
    var dateStr = this.props.currentDate?this.props.currentDate:this._getCurrentDate();
    year = dateStr.substring(0, 4);
    month = parseInt(dateStr.substring(5, 7));
    day = parseInt(dateStr.substring(8, 10));
    let {flag = 0} = this.props;
    return (
      <Modal
        transparent
        visible={flag == 0 && modalVisible}
        onDismiss={Picker.hide}
        onShow={() => {
          Picker.init({
            pickerTitleText: '时间选择',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            pickerConfirmBtnColor: [100, 100, 100, 1],
            pickerCancelBtnColor: [100, 100, 100, 1],
            pickerToolBarBg: [232, 232, 232, 1],
            selectedValue: [year + '年', month + '月', day + '日'],
            pickerBg: [255, 255, 255, 1],
            pickerData: this._createDateData(),
            pickerFontColor: [33, 33, 33, 1],
            pickerRowHeight: 34,
            onPickerConfirm: (pickedValue, pickedIndex) => {
              var year = pickedValue[0].substring(0, pickedValue[0].length - 1);
              var month = pickedValue[1].substring(
                0,
                pickedValue[1].length - 1,
              );
              month = month.padStart(2, '0');
              var day = pickedValue[2].substring(0, pickedValue[2].length - 1);
              day = day.padStart(2, '0');
              let str = year + '-' + month + '-' + day;
              this.props.onComfirm && this.props.onComfirm(str);
              this.hide();
            },
            onPickerCancel: (pickedValue, pickedIndex) => {
              this.hide();
            },
            onPickerSelect: (pickedValue, pickedIndex) => {},
          });
          Picker.show();
        }}
        animationType="slide">
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            flex: 1,
            justifyContent: 'center',
          }}></View>
      </Modal>
    );
  }
}
