import React,{ useState } from "react";
import {View,Text,Image,TouchableOpacity,StyleSheet, NativeModules, StatusBar, Platform} from "react-native";
import { $fns, $myTheme } from "../../global.utils";

// 留言信息
export default function LeaveMsg (props){

    let {  
        data  = {}, 
        onPress = () => {} 
    } = props;

    return (
        <View style={{ borderBottomColor:"#ddd", borderBottomWidth:0.5, paddingBottom:10, marginBottom:6 }}>
            <View style={{ flexDirection:"row", marginBottom:10, paddingTop:10 }}>
                <View style={{ flexDirection:"row", flex:1 }}>
                    <Text style={{ color:"#777", width:60 }}>养护人：</Text>
                    <Text>{ data.uname }</Text>
                </View>

                <Text style={{ color:"#777" }}>{ data.time }</Text>

                {
                    data.redDot && (<View style={{ width:10, height:10, borderRadius:5, backgroundColor:"red", position:"absolute", top:0, right:0, }}></View>)
                }
            </View>

            <View style={{ flexDirection:"row" }}>
                <Text style={{ color:"#777", width:60 }}>留言：</Text>
                <View style={{ flex:1 }}>
                    <Text style={{ lineHeight:20 }}>{ data.msg }</Text>
                </View>
            </View>
        </View>
    );
}