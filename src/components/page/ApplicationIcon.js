import React,{ useState } from "react";
import {View,Text, Image,} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import IconFont from "./../IconFont";
export default function(props){

    let {
        title   = "", 
        sizeMode= "defalut",
        style   = {},
        onPress = null,
        width=60,
        imgWidth=30,
        imgHeight=30,
        icon
    } = props;

    // var width   = 60;
    var size    = 33;
    var showTitle = true;
    var border  = false;

    if(sizeMode == "small"){
        width   = 35;
        size    = 22;
        showTitle = false;
        border  = true;
    }

    let icons = {

        "权限管理"  : {
            color : "#1c84c6",
            icon  : "\ue613"
        },
      
        "更多"  : {
            color : '#999',
            icon  : "\ue744"
        },
    }
   
    let target  = icons[title];
    let borderStyle  = { backgroundColor:"#f0f0f0", borderRadius:width/2, width:width, height:width, justifyContent:"center", alignItems:"center" }; 
     
    return (
        <TouchableOpacity 
            style={[ {alignItems:"center", width:width, justifyContent:"center",  ...style}, border ? borderStyle : null ]}
            onPress = {() => {
                onPress && onPress();
            }}
        >
            {/* {title=='权限管理'&&(<IconFont icon = {"\ue613"} color= { target.color } size = {size} />)}  */}
           <Image source={ {uri: icon} }style={{width:imgWidth,height:imgHeight}}/>
            { showTitle && ( <Text style={{ textAlign:'center',marginTop:5, fontSize:13 }}>{ title}</Text> ) }
        </TouchableOpacity>
    );

}

