import React from "react";
import {View,Text,} from "react-native";

export default function(props){

    let { size = 15, color = "#000", icon, bold = false, style = {} } = props;

    return (
        <Text style={{ fontFamily: "fonteditor", fontSize: size, color : color, ...style }}>{icon}</Text>
    );
}