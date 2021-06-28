import React,{ useState } from "react";
import {View,Text,Image,TouchableOpacity,StyleSheet, NativeModules, StatusBar, Platform} from "react-native";
import { $fns, $myTheme } from "../../global.utils";
import  IconFont from "../IconFont";

export default function(props){

    let { 
        title   = "", 
        icon    = null, 
        more    = "",
        dot=false,
        onPress = () => {},
        arrow=true
    } = props;

    return (
        <TouchableOpacity 
            style={{ flexDirection:"row", paddingLeft:12, paddingRight:6, height:48, borderBottomColor:"#eee", borderBottomWidth:0.5, alignItems:"center" }}
            onPress = {() => {
                onPress()
            }}
        >
            <View style={{ flex:1, flexDirection:"row", alignItems:"center",  }}>
                <IconFont icon={icon} size={20} color={$myTheme.mainBlue} />
                <Text style={{ fontSize:15, marginLeft:6 }}>{ title }</Text>
            </View>

            <View style={{ flexDirection:"row", alignItems:"center" }}>
                <Text style={{ color:"#999",marginRight:4 }}>{ more }</Text>
                {dot&&(<View style={{ width:8, height:8, borderRadius:4, backgroundColor:"red",  }}></View>)}
                
                {
                    arrow?
                    (
                        <IconFont icon={"\ue621"} size={16} color="#aaa" />
                    )
                    :null
                }
            </View>

        </TouchableOpacity>
    );

}


