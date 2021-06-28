import React,{ useState } from "react";
import {View,Text, ImageBackground} from "react-native";
import { $fns, $myTheme } from "../../global.utils";

export default function(props){

    let {title = "", msg = ""} = props;

    return (
        <View style={{ paddingTop:10, paddingBottom:10, backgroundColor:"#fff", alignItems:"center", justifyContent:"center" }}>
            <ImageBackground
                source={require("./../../assets/imgs/icon_num_tag.png")}
                style={{ width:$fns.size(520), height:80, paddingTop:25, alignItems:"center" }}
                resizeMode="stretch"
            >
                <Text style={{ fontSize:14, color:$myTheme.mainBlue }}>{ title }：{msg}</Text>
            </ImageBackground>
        </View>
    );

}

