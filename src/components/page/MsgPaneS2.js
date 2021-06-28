import React, {useState} from "react";
import {View,Text,Image,TouchableOpacity,StyleSheet} from "react-native";
import IconFont from "../IconFont";
import { $fns, $myTheme } from "../../global.utils";

//let bgImg = require("./../../assets/imgs/icon_yanghu.png");
let bgImg = null;

export default function MsgPaneS2(props){

    let { title = "", num = 0, bgImg = null, onPress = () => {}, isOpen = true } = props;
    let [isShow, setIsShow] = useState(isOpen);

    return (
        
        <View style={{ backgroundColor:"#fff", marginBottom:16, borderRadius:6 }}>
            <View style={{ height:40, flexDirection:"row", paddingLeft:12, paddingRight:12, alignItems:"center" }}>
                <View style={{ flexDirection:"row", alignItems:"center", flex:1 }}>
                    <View style={{ width:5, height:20, marginRight:6, backgroundColor:"#4ea2e0" }}></View>
                    <Text style={{ fontSize:16  }}>{title}</Text>
                </View>

                <TouchableOpacity 
                    style={{ flexDirection:"row", alignItems:"center", height:40, paddingLeft:10, justifyContent:"flex-end" }}
                    onPress = {() => { 
                        onPress();
                        setIsShow( !isShow );
                    }}
                >
                    {
                        num ? (
                        <View style={{ backgroundColor:"#ed5564", borderRadius:10, paddingLeft:12, paddingRight:12, height:20, justifyContent:"center", marginRight:6 }}>
                            <Text style={{ color:"#fff" }}>{num}</Text>
                        </View>) : null
                    }
                    <View style={{ transform:[ isShow ? { rotate : "180deg" } : { rotate : "360deg" }] }}>
                        <IconFont icon={"\ue61b"} size={20} color={$myTheme.mainBlue} />
                    </View>
                </TouchableOpacity>
            </View>

            <View 
                style={{ padding:10, paddingTop:0, paddingBottom:0, borderTopWidth:0.5, borderTopColor:"#ddd" }}
                
            >
                {
                    bgImg && (<Image source={ bgImg } resizeMode="stretch" style={{ width:60, height:80, position:"absolute", right:0, bottom:"10%" }} />)
                }
                
                { isShow ? (
                    <View style={{ flex:1 }}>
                        { props.children }
                    </View>
                ):null }
            </View>
        </View>

    );
}


