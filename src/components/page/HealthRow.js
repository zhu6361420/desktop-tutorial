import React from "react";
import {View,Text,StyleSheet} from "react-native";

export default function MsgRow(props){
    let {
        title = "", 
        titleColor = "#777",  
        msg = "", 
        msgColor="#222", 
        align  = "right",
        border = true,
        rowHeight = 38,
        slot = null,
        padding=0,
    } = props;
    
    // 
    return (
        <View style={[{height: rowHeight , paddingLeft:padding, flexDirection:"row", alignItems:"center"}, border ? {borderBottomWidth:0.5, borderBottomColor:"#ddd"} : null ]}>
            <Text style={{ color:titleColor,marginLeft:0, fontSize:15 }}>{ title }</Text>
            <View style={{ flex:1, justifyContent: align == "right" ? "flex-end" : 'flex-start', flexDirection:"row" }}>
                { slot == null ? (<Text numberOfLines={1} style={{ color:msgColor, fontSize:15 }}>{ msg }</Text>) : slot }
            </View>
        </View>
    );
}
