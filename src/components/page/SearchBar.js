import React,{ useState } from "react";
import {View,Text,Image,TouchableOpacity, TextInput} from "react-native";
import { $fns, $myTheme } from "../../global.utils";
import { IconFont,UiGap } from "../../global.components";

export default function(props){

    let { 
        placeholder = "请输入设备/节点编号", 
        onPress = () => {}
    } = props;
    
    let [_value,_setValue] = useState('');

    return (
        <View style={{ backgroundColor:"#fff" }}>
            <View style={{ flexDirection:"row", padding:12, paddingTop:6, paddingBottom:6, borderTopWidth:0.5, borderTopColor:"#ddd" }}>
                <View style={{ flex:1, flexDirection:"row", alignItems:"center" }}>
                    <IconFont icon={"\ue67b"} size={20} color="#666" />
                    <TextInput 
                        placeholder={placeholder}
                        style={{ flex:1, marginLeft:10, height:30, paddingVertical: 0 }} 
                        value = {_value}
                        onChangeText = {(e) => _setValue(e)}
                    />
                </View>

                <TouchableOpacity
                    style={{ backgroundColor:$myTheme.mainBlue, color:"#fff", borderRadius:30, alignItems:"center", justifyContent:"center", width:60 }}
                    onPress = {() => {
                        onPress(_value);
                    }}
                >
                    <Text style={{ color:"#fff" }}>确定</Text>
                </TouchableOpacity>
            </View>
        
            <UiGap />
        </View>

    );

}


