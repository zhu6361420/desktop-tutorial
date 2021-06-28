import React from "react";
import {View,Text,Image,Modal,ScrollView, StyleSheet, TouchableOpacity, ImageBackground,Platform } from "react-native";
import {IconFont, UiHeader, FormItem, UiGap} from "../../global.components";
import {$myTheme, $source} from "../../global.utils";
import { $fns } from "../../utils/fns";


export default class App extends React.Component{

    state = {
        isShow : true
    }

    render(){

        return (
            <>
                <UiHeader 
                    title="分享App"
                    onBack  = {() => {
                        $fns.route({
                            context : this,
                            type : "back"
                        });
                    }}
                />
                {
                    Platform.OS == 'android'
                    ?(
                        <ScrollView style={{ backgroundColor:$myTheme.mainBgGray, flex:1 }}>

                            <View style={{ flex:1, alignItems:"center", justifyContent:"center", paddingTop:80 }}>
                                <Text style={{ fontSize:16, }}>安卓系统扫描下方二维码下载</Text>
                                <ImageBackground
                                    source = {require("./../../assets/imgs/qr_bg.jpg")}
                                    style   = {{ width:240, height:240, marginTop:30, marginBottom:30, alignItems:"center", justifyContent:"center" }}
                                >
                                    <ImageBackground source = { require("./../../assets/imgs/qr_code.jpg")} style={{ width:170, height:170 }} />
                                </ImageBackground>
                                <Text style={{ fontSize:16, }}>苹果系统请前往应用商店搜索“亚威智云”</Text>
                            </View>

                        </ScrollView>
                    )
                    :(
                        <ScrollView style={{ backgroundColor:$myTheme.mainBgGray, flex:1 }}>

                            <View style={{ flex:1, alignItems:"center", justifyContent:"center", paddingTop:80 }}>
                                {/* <Text style={{ fontSize:16, }}>扫描下方二维码下载</Text> */}
                                <ImageBackground
                                    source = {require("./../../assets/imgs/share_qrcode.png")}
                                    style   = {{ width:300, height:300, marginTop:15, marginBottom:30, alignItems:"center", justifyContent:"center" }}
                                >
                                </ImageBackground>
                                <Text style={{ fontSize:16, }}>应用商店搜索“亚威智云”</Text>
                            </View>

                        </ScrollView>
                    )
                }
                
              
            </>
        );
    }

}
