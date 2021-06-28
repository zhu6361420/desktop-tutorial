import React,{useState} from "react";
import {View,Text, TouchableOpacity, StyleSheet, Modal} from "react-native";
import {$myTheme} from "../global.utils";

export default function(props){

    let { datas = [], onChange = ()=>{} } = props;
    let [isShow, setIsShow] = useState(0);

    return (

        <Modal style={{ flex:1 }} visible = { isShow } transparent animationType="slide" >
            <View style={{ flex:1, backgroundColor:"rgba(0,0,0,0.5)", alignItems:"center", justifyContent:"center" }}>
                
                <View>
                    <TouchableOpacity style={{ alignSelf:"flex-end", marginBottom:6 }}
                        onPress = {() => {
                            setIsShow(false);
                        }}
                    >
                        <IconFont icon={"\ue628"} size={32} color="#fff" />
                    </TouchableOpacity>
                    <View style={{ width:240, backgroundColor:"#fff", borderRadius:4, padding:14 }}>
                        
                        <View style={{ borderLeftWidth:4, borderLeftColor:$myTheme.mainBlue, paddingLeft:10, 
                            marginBottom:8, paddingTop:4, paddingBottom:4 }}>
                            <Text style={{ fontSize:15, fontWeight:"bold" }}>账号类型选择</Text>
                        </View>

                        <TouchableOpacity style={[ ss.linkRow ]}>
                            <Text style={[ ss.linkTxt ]}>企业类型账号</Text>
                            <IconFont icon={"\ue643"} size={16} color="#aaa" style={{ marginRight:0 }} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[ ss.linkRow ]}>
                            <Text style={[ ss.linkTxt ]}>个人类型账号</Text>
                            <IconFont icon={"\ue643"} size={16} color="#aaa"  style={{ marginRight:0 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        
    );
}


let ss = StyleSheet.create({
    mainBox : { paddingLeft:12, paddingRight:12, backgroundColor:"#fff", marginBottom:10 },
    mainRow : { flex:1, height:30, flexDirection:"row", justifyContent:"flex-end",  alignItems:"center" },

    linkRow : { height:35, flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
    linkTxt : { fontSize:14, color:"#555" }
});

