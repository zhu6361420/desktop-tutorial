import React,{ useState } from "react";
import {View,Text, ImageBackground} from "react-native";
import { $fns, $myTheme } from "../../global.utils";
import IconFont from "../IconFont";

export default function(props){

    let {
        style = {}, 
        hasArrow = true
    } = props;

    return (
        <View style={{ backgroundColor:"#fff", borderRadius:6, ...style }}>
            { props.children }
            
            {
                hasArrow && (
                    <View style={{ position:"absolute", right:4, top:"45%" }}>
                        <IconFont icon = {"\ue643"} size={20} color="#999" />
                    </View>
                )
            }
        
        </View>
    );

}

