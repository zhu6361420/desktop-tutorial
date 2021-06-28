import React, {Component} from 'react';
import {SafeAreaView, Text, StyleSheet, View, Modal} from 'react-native';
import {QRScannerRectView} from 'react-native-qrcode-scanner-view';
import {RNCamera} from 'react-native-camera';
import {Button} from 'react-native-elements';
class CodeScan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    };
  }

  static navigationOptions = {
    title: '扫一扫',
  };

  renderTitleBar = () => <Text style={styles.text}>扫一扫</Text>;

  renderMenu = () => <Text style={styles.text} />;

  barcodeReceived = (event) => {
    let {onDone = () => {}} = this.props;
    onDone(event.data);
    this.setState({
      isShow: false,
    });
  };
  show() {
    this.setState({
      isShow: true,
    });
  }

  hide() {
    this.setState({
      isShow: false,
    });
  }
  render() {
    let {isShow} = this.state;

    return (
      <Modal visible={isShow} transparent statusBarTranslucent>
        <SafeAreaView style={{flex: 1}}>
          <RNCamera
            style={styles.preview}
            onBarCodeRead={this.barcodeReceived}
            captureAudio={ false }
            renderFooterView={this.renderMenu}
            scanBarAnimateReverse>
            <QRScannerRectView />
          </RNCamera>
        </SafeAreaView>
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            width: '100%',
            paddingHorizontal: 20,
          }}>
          <Button
            title="关闭扫码"
            containerStyle={{marginBottom: 12}}
            onPress={() => {
              this.setState({
                isShow: false,
              });
            }}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    textAlign: 'center',
    padding: 16,
  },
  preview: {
    flex: 1,
  },
});
export default CodeScan;
