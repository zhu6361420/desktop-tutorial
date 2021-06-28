import React from "react";
import {View,Text,Image,TouchableWithoutFeedback,StyleSheet} from "react-native";
import IconFont from "./../IconFont";
import { $fns, $myTheme } from "./../../global.utils";
import LinearGradient from 'react-native-linear-gradient';

export default function(props){

    let {   
        title   = "", 
        title2  = "", 
        bgImg   = null, 
        bgSize  = {width:50, height:50},
        style   = {},
        onPress = () => {},
        header=null,
        isRow=false,
    } = props;

    return (
        
        <TouchableWithoutFeedback 
            
            onPress = {() => onPress()}
        >
            <View style={{ backgroundColor:"#fff", marginBottom:16, borderRadius:6, ...style }}>
                <View style={{ height:40, flexDirection:"row", paddingLeft:12, paddingRight:12, alignItems:"center", }}>
                {header}
                </View>
                
                <View style={{ padding:10, borderTopWidth:0.5, borderTopColor:"#ddd", flexDirection:"row", alignItems:"center" }}>
                    
                 {bgImg&&( <Image source={ bgImg } resizeMode="contain" style={{ width:90, height:80, marginRight:10 }} />)}  
                    
                    <View style={{ flex:1,flexDirection:isRow?'row':'column'}}>
                        { props.children }
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>

    );

}

let ss = StyleSheet.create({
    flexRowCenter : { flexDirection:"row", alignItems:"center", marginBottom:6 }
});
