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
        onPress = () => {}
    } = props;

    return (
        
        <TouchableWithoutFeedback 
            
            onPress = {() => onPress()}
        >
            <View style={{ backgroundColor:"#fff", marginBottom:16, borderRadius:6, ...style }}>
                <View style={{ height:40, flexDirection:"row", paddingLeft:12, paddingRight:12, alignItems:"center" }}>
                    {/* <View style={{ width:5, height:20, backgroundColor:"#4ea2e0", marginRight:6 }}></View> */}
                    <LinearGradient 
                        colors={['#80c0fe', '#288efc']} 
                        useAngle={true} 
                        angle={-45} 
                        style={{ width:5, height:20, marginRight:6 }}
                    >
                       
                    </LinearGradient>
                    <Text>{title}：</Text>
                    <Text style={{ color:$myTheme.mainBlue, flex:1, }} numberOfLines={1} ellipsizeMode="tail">{title2}</Text>
                </View>
                
                <View style={{ padding:10, borderTopWidth:0.5, borderTopColor:"#ddd", flexDirection:"row", alignItems:"center" }}>
                    
                 {bgImg&&( <Image source={ bgImg } resizeMode="contain" style={{ width:90, height:80, marginRight:10 }} />)}  
                    
                    <View style={{ flex:1 ,}}>
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
