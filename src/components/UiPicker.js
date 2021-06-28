import React, {Component} from 'react';
import Picker from 'react-native-picker';
import {
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {Button} from 'react-native-paper';
export default class DatePicker extends Component {
  state = {
    modalVisible: false,
  };
  show = () => {
    if(this.state.modalVisible)
    {

      this.setState({
        modalVisible: false,
      },()=>{
        Picker.hide()
      });
    }
    else{
      this.setState({
        modalVisible: true,
      })
      // let {title = '', datas = [], onConfirm = () => {}} = this.props;
      // Picker.init({
      //   isLoop: false,
      //   pickerData: datas,
      //   pickerTitleText: title,
      //   pickerCancelBtnText: '取消',
      //   pickerConfirmBtnText: '确定',
      //   pickerConfirmBtnColor: [100, 100, 100, 1],
      //   pickerCancelBtnColor: [100, 100, 100, 1],
      //   pickerToolBarBg: [232, 232, 232, 1],
      //   pickerBg: [255, 255, 255, 1],
      //   pickerFontColor: [33, 33, 33, 1],
      //   pickerRowHeight: 34,
      //   onPickerConfirm: (pickedValue, pickedIndex) => {
      //     onConfirm(pickedValue, pickedIndex);
      //     this.hide();
      //   },
      //   onPickerCancel: (pickedValue, pickedIndex) => {
      //     this.hide();
      //   },
      //   onPickerSelect: (pickedValue, pickedIndex) => {},
      // });
      // this.setState({
      //   modalVisible: true,
      // });
    }

  };

  hide = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const {modalVisible} = this.state;
    let {title = '', datas = [], onConfirm = () => {}} = this.props;
    return (
      <Modal
        transparent={true}
        visible={modalVisible}
        onDismiss={Picker.hide}
        onShow={()=>{
          Picker.init({
          isLoop: false,
          pickerData: datas,
          pickerTitleText: title,
          pickerCancelBtnText: '取消',
          pickerConfirmBtnText: '确定',
          pickerConfirmBtnColor: [100, 100, 100, 1],
          pickerCancelBtnColor: [100, 100, 100, 1],
          pickerToolBarBg: [232, 232, 232, 1],
          pickerBg: [255, 255, 255, 1],
          pickerFontColor: [33, 33, 33, 1],
          pickerRowHeight: 34,
          onPickerConfirm: (pickedValue, pickedIndex) => {
            onConfirm(pickedValue, pickedIndex);
            this.hide();
          },
          onPickerCancel: (pickedValue, pickedIndex) => {
            this.hide();
          },
          onPickerSelect: (pickedValue, pickedIndex) => {},
        });
          Picker.show()
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
