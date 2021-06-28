import React from "react";
import {View,Text,ActivityIndicator} from "react-native";

export default function(props){
    return (
        <View style={{ height: 46, flexDirection:"row", alignItems:"center", justifyContent:"center" }}>
            <ActivityIndicator color="#999" style={{ marginRight:6 }} />
            <Text style={{ color:"#777" }}>加载中...</Text>
        </View>
    );
}