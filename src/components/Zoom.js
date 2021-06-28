import {Modal, Dimensions, ActivityIndicator, View} from 'react-native';
import React, {Component} from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
// import {CameraRoll} from '@react-native-community/cameraroll'
// const images = [
//   {
//     // Simplest usage.
//     url: 'http://121.36.226.216/api/ems/attachments/device_type/2020111314263641582753488.png',
//     props: {
//       // headers: ...
//     },
//   },

// ];
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalViable: false,
      animating: false,
      imageIndex:0,
    };
  }
  show = (index) => {
    this.setState({
      imageIndex:index,
      modalViable: true,
      animating: true,
    });
  };
  hide = () => {
    this.setState({
      modalViable: false,
    });
  };
  savePhoto() {
    let index = this.state.imageIndex;
    let url = this.props.images[index];
    // let promise = CameraRoll.saveToCameraRoll(url);
    // promise.then(function (result) {
    //    alert("已保存到系统相册")
    // }).catch(function (error) {
    //     alert('保存失败！\n' + error);
    // });
}
  render() {
    const {modalViable,imageIndex} = this.state;
    const {images} = this.props;
    return (
      <Modal
        animationType={'fade'}
        visible={modalViable}
        transparent={false}>
          <ImageViewer
            enableImageZoom={true}
            useNativeDriver={true}
            saveToLocalByLongPress={true}
            index={imageIndex}
            menuContext={{ "saveToLocal": "保存图片", "cancel": "取消" }}
            onSave={(url) => { this.savePhoto(url) }}
            onClick={() => {
              this.setState({
                modalViable: !modalViable,
              });
            }}
            imageUrls={images}
          />
      </Modal>
    );
  }
}
