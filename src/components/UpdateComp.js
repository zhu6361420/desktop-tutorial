import React, {Component} from 'react';
import {View, Text, StyleSheet, Modal, TouchableNativeFeedback, Dimensions, } from 'react-native';
import CodePush from "react-native-code-push";
import {ProgressBar } from '@react-native-community/progress-bar-android'
const CodePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL };
// 安卓下的热更新 key
const key = 'CYBey_-_Y8Kh1Lqct3RKaqTfTjTHIG9RdFcf-';
// 屏幕
const win = Dimensions.get('window');
class HotpushModal extends React.Component{
    constructor(props){
        super(props);
        this.syncMessage = '';
        this.state = {
            modalVisible:props.modalVisible,
            isMandatory: false,
            isUpdate: false,
            updateInfo: {},
            progress: 0,
        }
    }
    
    UNSAFE_componentWillMount(){
        // 热更新
        // CodePush.notifyAppReady();
        // 检查更新
        // this.check();
    }

    // 检查更新
    check = () => {
        CodePush.checkForUpdate(key).then((update) => {
            if (!update || update.failedInstall) {
              // 已是最新版
              alert("已经最新版")
              CodePush.notifyAppReady()
            } else {

                this.setState({
                    modalVisible: true, 
                    updateInfo: update, 
                    isMandatory: update.isMandatory
                })
            }
        })
    }

    // 更新版本
    update = () => {
        this.setState({isUpdate: true})
        CodePush.sync(
            {deploymentKey: key, updateDialog: false, installMode: CodePush.InstallMode.IMMEDIATE},
            this.codePushStatusDidChange,
            this.codePushDownloadDidProgress
        )
    }

    // 取消
    onCancel = () => {
        this.setState({
            modalVisible: false
        })
    }

    // 下载状态变化
    codePushStatusDidChange = (syncStatus) => {
        if (this.state.isUpdate) {
            switch(syncStatus) {
              case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                this.syncMessage = 'Checking for update'
                break;
              case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                this.syncMessage = 'Downloading package'
                break;
              case CodePush.SyncStatus.AWAITING_USER_ACTION:
                this.syncMessage = 'Awaiting user action'
                break;
              case CodePush.SyncStatus.INSTALLING_UPDATE:
                this.syncMessage = 'Installing update'
                break;
              case CodePush.SyncStatus.UP_TO_DATE:
                this.syncMessage = 'App up to date.'
                break;
              case CodePush.SyncStatus.UPDATE_IGNORED:
                this.syncMessage = 'Update cancelled by user'
                break;
              case CodePush.SyncStatus.UPDATE_INSTALLED:
                this.syncMessage = 'Update installed and will be applied on restart.'
                break;
              case CodePush.SyncStatus.UNKNOWN_ERROR:
                this.syncMessage = 'An unknown error occurred'
                alert('更新出错，请重启应用！');
                this.setState({modalVisible: false})
                break;
            }
          }
    }

    // 计算下载进度
    codePushDownloadDidProgress = (Progress) => {
        if (this.state.isUpdate) {
            let currProgress = Math.round((Progress.receivedBytes / Progress.totalBytes) * 100)/100;
            if(currProgress >= 1) {
                this.setState({modalVisible: false})
            } else {
                this.setState({
                    progress: currProgress
                })
            }
        }
    }

    render() {
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.state.modalVisible} >
                <View style={styles.content}>
                    {!this.state.isUpdate ? <View style={styles.contentArea}>
                        <Text style={[styles.header,{color:'green'}]}>发现新版本</Text>
                        <View style={styles.updateDes}>
                            <Text style={styles.title}>更新内容</Text>
                            <Text style={[styles.description,{color:'grey'}]}>{this.state.updateInfo.description || '暂无版本介绍'}</Text>
                        </View>
                        {/* 按钮,判断是否强制更新 */}
                        {this.state.isMandatory ? <View style={styles.buttonArea}><TouchableNativeFeedback onPress={this.update}>
                            <View style={[styles.button,{backgroundColor:'black'}]}>
                                <Text style={styles.buttonText}>立即更新</Text>
                            </View></TouchableNativeFeedback></View> : <View style={styles.buttonsArea}>
                            <TouchableNativeFeedback onPress={this.onCancel}>
                                <View style={[styles.buttons,{backgroundColor:'#DB4C40'}]}>
                                    <Text style={[styles.buttonText]}>残忍拒绝</Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={this.update}>
                                <View style={[styles.buttons,{backgroundColor:"green"}]}>
                                    <Text style={styles.buttonText}>立即更新</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>}
                    </View> : <View style={styles.contentArea}>
                        <Text style={[styles.header,{color:"red"}]}>正在更新下载,请稍等</Text>
                        <ProgressBar 
                            color="red"
                            indeterminate={false}
                            progress={this.state.progress}
                            styleAttr='Horizontal'
                            style={styles.progress}
                        ></ProgressBar>
                        <Text style={[styles.header,{color:"green",fontSize:18}]}>{this.state.progress * 100 + '%'}</Text>
                    </View>}
                </View>
            </Modal>
        )
    }
}

export default HotpushModal
const styles = StyleSheet.create({
    content:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    contentArea:{
        // height:400,
        width:300,
        backgroundColor:'#fff',
        borderRadius:20,
        display:'flex',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    header:{
        width:300,
        textAlign:'center',
        fontSize:20,
        marginTop:20,
        marginBottom:20,
    },
    updateDes:{
        width:300,
        paddingLeft:30,
        paddingRight:30,
    },
    title:{
        fontSize:18,
        marginBottom:10,
    },
    description:{
        fontSize:16
    },
    buttonArea:{
        width:300,
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    button:{
        width:150,
        height:40,
        borderRadius:20,
        marginTop:20,
        marginBottom:10,
    },
    buttonText:{
        lineHeight:40,
        color:'#fff',
        fontSize:18,
        textAlign:'center',
    },
    buttonsArea:{
        width:300,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        paddingLeft:10,
        paddingRight:10,
    },
    buttons:{
        width:105,
        height:40,
        borderRadius:20,
        marginTop:20,
        marginBottom:10,
    },
    progress:{
        height:20,
        width:200,
        marginLeft:50,
        marginRight:50,
        borderRadius:10,
    }
});
