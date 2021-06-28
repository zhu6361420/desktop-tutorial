import React,{ useState } from "react";
import {View,Text,StyleSheet, Platform} from "react-native";
import { $fns, $myTheme } from "../../global.utils";
import  IconFont  from "../IconFont";

export default function(props){

    let { datas = [], curIndex = 0 } = props;

    return (
        <View style={{ paddingLeft:"5%", paddingRight:"5%", backgroundColor:"#fff", flexDirection:"row", justifyContent:"space-between" }}>
            
            {
                datas.map((item,index) => {
                    return (
                        <View style={[ ss.verifyItem ]} key={index}>
                            <IconFont icon={ curIndex >= index ? '\ue60a' : '\ue62d'} size={32}  style={{ backgroundColor:"#fff", color: curIndex >= index ? $myTheme.mainBlue: $myTheme.mainGray }} />
                            <Text style={[ ss.verifyTxt, { color: curIndex >= index ? $myTheme.mainBlue: $myTheme.mainGray } ]}>{ item.title1 }</Text>
                            { item.title2 ? (<Text style={[ ss.verifyTxt, { color: curIndex >= index ? $myTheme.mainBlue: $myTheme.mainGray } ]}>{ item.title2 }</Text>) : null }
                        </View>
                    )
                })
            }

            <View style={{ position:"absolute", height:1, borderBottomColor:"#777", 
            borderBottomWidth:1, position:"absolute", top:36, left:"26%", right:"26%",  backgroundColor:'transparent' }}></View>
        </View>
    );

}

let ss = StyleSheet.create({
    verifyItem : { alignItems:"center", paddingTop:20, paddingBottom:20, zIndex:1, flex:1 },
    verifyTxt : { marginTop:10, color:$myTheme.mainGray }
});
