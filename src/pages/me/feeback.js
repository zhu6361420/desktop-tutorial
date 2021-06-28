import React from "react";
import {View,Text,ScrollView, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { UiHeader} from "../../global.components";
import UiImageUpload from "../../components/UiImageUpload"
import {$myTheme,api,$ajax, $source} from "../../global.utils";
import { $fns } from "../../utils/fns";
import {CheckBox} from "react-native-elements";
import UiButton from "../../components/UiButton";
import { $ui } from "../../utils/utils.ui";
const {createMessage}=api;
export default class App extends React.Component{

    state = {
        curIndex : 0,
        typeArr : [
            "功能建议",
            "用户体验",
            "产品缺陷"
        ],
        isRead : false,
        textValue:'',
        picList:[]
    };
    submit=()=>{
        const{typeArr,curIndex,textValue,picList}=this.state
        let title=typeArr[curIndex]
        let formData = new FormData();
        formData.append('messageTitle', title);
        formData.append('messageCategoryCode', '001');
        formData.append('messageContent',textValue);
        formData.append('messageCategoryDesc',"用户反馈");
        picList.map((file, i) =>
        formData.append(`picFiles[${i}]`, {
          uri: file.path,
          type: 'image/jpeg',
          name: 'image.jpg',
        }),
      );
      $ajax({
        url: createMessage,
        data: {
          formData:  formData,
        },
        _this: this,
        fm: true,
      }).then((value) => {
        if (value.code == 200) {
            $fns.route({
                context : this,
                type : "back"
            });
          $ui.toast("提交反馈成功！");
        }
      });
    }
    render(){

        let {
            curIndex,
            typeArr
        } = this.state;

        return (
            <>
                <UiHeader 
                    title="建议反馈" 
                    onBack  = {() => {
                        $fns.route({
                            context : this,
                            type : "back"
                        });
                    }}
                />
                
                <ScrollView style={{ backgroundColor:"#fafafa" }}>
                    <View style={[ ss.sec ]}>

                        <View style={[ ss.secTitle ]}>
                            <Text style={[ ss.setTitleDot ]}>*</Text>
                            <Text style={[ ss.setTitleTxt ]}>建议类型</Text>
                        </View>

                        <View style={{ flexDirection:"row", justifyContent:"space-between" }}>
                            
                            {
                                typeArr.map((item,index) => (
                                    <TouchableOpacity
                                        key = {index}
                                        style   ={[ ss.tagItem, index == curIndex ? ss.tagItemActive : null ]}
                                        onPress ={() => {
                                            this.setState({
                                                curIndex : index
                                            });
                                        }} 
                                    >
                                        <Text style={[ ss.tagTxt, index == curIndex ? ss.tagItemTxtActive : { color: "#444" } ]}>{ item }</Text>
                                    </TouchableOpacity>
                                ))
                            }

                        </View>
                    </View>

                    <View style={[ ss.sec ]}>
                        <View style={[ ss.secTitle ]}>
                            <Text style={[ ss.setTitleDot ]}>*</Text>
                            <Text style={[ ss.setTitleTxt ]}>内容</Text>
                        </View>

                        <View class="secMain">
                            <TextInput placeholder="请输入您的建议内容" value={this.state.textValue} style={[ ss.secInput ]} onChangeText={(res)=>this.setState({
                                textValue:res
                            })} multiline />
                        </View>

                        <View style={{ flexDirection:"row", justifyContent:"flex-end" }}>
                            <Text>0</Text>
                            <Text>/</Text>
                            <Text>1000</Text>
                        </View>
                    </View>

                    <View style={[ ss.sec, { paddingTop:0 } ]}>
                        <UiImageUpload  
                        onDone={(res) => {
                      // 成功上传回调上传成功的数据
                      this.setState({
                        picList: res,
                      });
                    }} />

                        <Text>格式支持 JPG JPEG PNG，单张不超过8M</Text>
                    </View>

                    <View>
                        <CheckBox
                            containerStyle={{ borderWidth:0 }}
                            textStyle = {{ color:"#888" }}
                            title='已知晓建议内容将会被公开，且未提交敏感信息'
                            checked={this.state.isRead}
                            onPress={() => this.setState({isRead: !this.state.isRead})}
                        />
                    </View>

                    <UiButton 
                        style = {{ width:"100%", paddingLeft:12, paddingRight:12, marginTop:10, marginBottom:30 }}
                        buttonStyle = {{ height:44 }}
                        title = "提交"
                        onPress={()=>!this.state.isRead?$ui.toast("请确认勾选默认条件"):this.submit()}
                    />
        
                </ScrollView>
            </>
        );
    }

}

let ss = StyleSheet.create({
    sec : { backgroundColor:"#fff", padding:12, marginBottom:10 },
    secTitle: { flexDirection:"row", alignItems:"center", marginBottom:8 },
    setTitleDot: { color: "red", fontSize:20 },
    setTitleTxt: { fontSize:15, marginLeft:4 },

    tagItem : { width:"31.5%", height:40, borderRadius:6, alignItems:"center", justifyContent:"center", backgroundColor:"#f5f5f5" },
    tagItemActive: { backgroundColor:"#e6effe" },
    tagItemTxt : { color:"#888" },
    tagItemTxtActive : { color:$myTheme.mainBlue },

    secMain : { backgroundColor:"#fff" },
    secInput : { paddingVertical: 0, height:80, textAlignVertical:"top", fontSize:15 }
});


