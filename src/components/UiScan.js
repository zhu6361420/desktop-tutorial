import React, {useState } from "react";
import { Text, View, StyleSheet, Modal  } from 'react-native';

import { QRScannerView } from 'react-native-qrcode-scanner-view';
import { Button } from "react-native-elements";

export default class App extends React.Component{

    state = {
        isShow : false
    };

    render(){

        let { isShow } = this.state;
        let {
            onDone = () => {}
        } = this.props;

        return (
            <>

                <Modal 
                    visible= { isShow }
                    transparent
                    statusBarTranslucent
                >
                    <View style={{ flex:1, }}>
                        <QRScannerView
                            ref = "qrRef"
                            renderHeaderView={() => (
                                <></>
                            )}
                            renderFooterView={() => {
                                <></>
                            }}
                            scanBarAnimateReverse={ true }
                            onScanResult={(event) => { 
                                onDone(event.data);
                                this.setState({
                                    isShow : false
                                });
                                //console.log('Type: ' + event.type + '\nData: ' + event.data);
                            }}
                        />

                        <View style={{ position:"absolute", bottom:20, width:"100%", paddingHorizontal:20 }}>
                            <Button 
                                title = "关闭扫码"
                                containerStyle = {{ marginBottom:12 }}
                                onPress = {() => {
                                    this.setState({
                                        isShow : false
                                    });
                                }}
                            />
                        </View>
                    </View>
                
                </Modal>    

            </>
        );
    }

    show(){
        this.setState({
            isShow : true
        });
    }

    hide(){
        this.setState({
            isShow : false
        });
    }

}

let ss = StyleSheet.create({
    linkBox : { backgroundColor:"#fff", paddingLeft:10, marginBottom:6, paddingRight:6 }
});





