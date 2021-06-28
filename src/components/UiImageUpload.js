import React from "react";
import {View, Text,  TouchableOpacity, StyleSheet, Image} from "react-native";
import { IconFont, UiGallery} from "../global.components";
import {$myTheme, $ui } from "./../global.utils";
import ImagePicker from 'react-native-image-picker';


function pickImage(params) {

    const options = {
        title: '请选择头像',
        storageOptions: {
            skipBackup: true,
        },
        chooseFromLibraryButtonTitle: "从相册中选择",
        takePhotoButtonTitle: "拍照",
        cancelButtonTitle: "取消",
        mediaType: "photo",
        cameraType:'back',
        maxWidth: 1080,
        quality: 0.5
    };

    // 参数合并
    Object.assign(options, params);

    return new Promise((resolve, reject) => {
        // 选择图片
        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                // 取消操作
                resolve({
                    code: "cancel"
                });
            } else if (response.error) {
                // 出错提示
                reject(response.error);
            } else if (response.customButton) {
                // 自定义按钮
                resolve({
                    code: "custom",
                    data: response.customButton
                });
            } else {
                // 图片选择  
                resolve({
                    code: "ok",
                    data: response
                });

            }
        });
    });
}

export default class App extends React.Component{

    state = {
        picArr : []
    }

    // 图片选择
    onPickerStart(){

        let {onDone = () => {},url} = this.props;

        pickImage().then(res => {
            
            if(res.code == "ok"){
                // ====== 此处执行ajax操作 ======

                // ====== 上传成功执行 ======
                var tempArr = this.state.picArr;
                tempArr.push({
                    uri : res.data.uri,
                    path:res.data.uri
                    // "https://shop-1256307732.cos.ap-guangzhou.myqcloud.com/4b4af202008162003437513.jpg"
                });

                // 上传完成后入数组
                this.setState({
                    picArr : tempArr
                },() => {
                    onDone(this.state.picArr);
                });

            }

        }).catch(res => {
            console.log(res);
        });
    }

    render(){
        return (
            <>
                <View style={[ ss.inputBox ]}>
                    <Text style={{ fontSize:15 }}>上传图片</Text>

                    <View style={[ uploadBox.box ]}>

                        {
                            this.state.picArr.map((item,index) => {
                                return (
                                    <View style={[ uploadBox.picItem ]} key={index}>
                                        <TouchableOpacity
                                            onPress = {() => {
                                                
                                            }}
                                        >
                                            <Image source={{uri: item.uri} } style={{ width:80, height:80 }} />
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity 
                                            style={{ position:"absolute", top:5, right:5, fontSize:14 }}
                                            onPress = {() => {
                                                
                                                $ui.confirm("确认删除？",() => {
                                                    var tempArr = this.state.picArr;
                                                    tempArr.splice(index,1);
                                                    this.setState({
                                                        picArr : tempArr
                                                    });
                                                });

                                            }}
                                        >
                                            <IconFont icon={'\ue608'} size={20} color="red" />
                                        </TouchableOpacity>
                                    </View> 
                                )
                            })
                        }

                        <TouchableOpacity 
                            style={[ uploadBox.addItem ]}
                            onPress = {() => {
                                this.state.picArr.length>4?$ui.toast("图片最多只能上传5张"):this.onPickerStart();
                            }}
                        >
                            <IconFont icon={'\ue632'} size={30} color="#ddd" />
                        </TouchableOpacity>
                    </View>
                </View>


            </>
        );
    }

}

let ss = StyleSheet.create({
    linkBox : { backgroundColor:"#fff", paddingLeft:10, marginBottom:6, paddingRight:6 },
    mainRow : { height:50, alignItems:"center", flex:1, flexDirection:"row", justifyContent:"flex-end" },
    form_item_input : { height:40, fontSize:14, textAlign: "right", flex:1 } ,
    inputBox : { backgroundColor:"#fff", paddingTop:15, paddingBottom:15, marginBottom:6, paddingLeft:0, paddingRight:10 }
});

let uploadBox = StyleSheet.create({
    box     : { flexDirection:"row", flexWrap:"wrap", paddingTop:15 },
    addItem : { width:90, height:90, borderWidth:1, borderColor:"#ddd", alignItems:"center", justifyContent:"center",  },
    picItem : { width:90, height:90, borderWidth:1, borderColor:"#ddd", alignItems:"center", justifyContent:"center", marginRight:8, marginBottom:8 }
});