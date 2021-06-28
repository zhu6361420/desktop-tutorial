import React from "react";
import {View,Text, TouchableOpacity } from "react-native";
import IconFont from "./IconFont";

export default function CellItem(props){
    
    let { 
        title   = "", 
        icon    = "", 
        color   ="",
        onPress = ()=>{} 
    } = props;

    return (
        <TouchableOpacity 
            style={{ paddingTop:10, paddingBottom:10, alignItems:"center", marginRight:20 }}
            onPress = {() => { onPress() } }
        >
            <IconFont icon={icon} size={40} style={{ color:color }} />
            <Text style={{ fontSize:13, marginTop:10 }}>{ title }</Text>
        </TouchableOpacity>
    );
}

