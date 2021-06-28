import React from "react";
import {View,Text,Image,TouchableOpacity,StyleSheet, NativeModules, StatusBar, Platform} from "react-native";
import IconFont from "./IconFont";

let ss = StyleSheet.create({
    header : { height:45, alignItems:"center", justifyContent:"center" },
    hd_btn : { width:45, height:45, alignItems:"center", justifyContent:"center", position:"absolute", bottom:0, color:"#fff" },
    title  : { fontSize:18, color:"#fff" }
});

let statusBarHeight = Platform.OS == "android" ? 20 : 44;

export default function(props){

    return (
        
        <TouchableOpacity style={{ width:44, height:44, alignItems:"center", justifyContent:"center", position:"absolute", top:40, left:0}}
            onPress = {() => {
                props.onPress && props.onPress();
            }}
        >
            <IconFont size={24} color="#fff" icon={'\ue78a'} />
        </TouchableOpacity>

    );

}