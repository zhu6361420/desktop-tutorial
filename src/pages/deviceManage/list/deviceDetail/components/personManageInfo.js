import React, {useState} from "react";
import { Text, View, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { UiHeader, MsgRow} from "../../../../../global.components";
import { $fns, $myTheme, $source } from "../../../../../global.utils";

export default class App extends React.Component{
  constructor(props){
      super(props)
  }
    render(){
    const {itemInfo,flag}=this.props.route.params
        return (
            <>
               
                <UiHeader
                    title = "个人信息"
                    right = {
                        <TouchableOpacity 
                            style={{ width:40, height:44, alignItems:"center", justifyContent:"center", }}
                            onPress = {() => {
                                $fns.route({
                                    context : this,
                                    routeName : "dm_PersonManageVerify",
                                    params:{itemInfo:itemInfo,flag:flag},
                                    
                                });
                            }}
                        >
                            <Text style={{ color:"#fff" }}>编辑</Text>
                        </TouchableOpacity>
                    }
                    onBack={() => {
                        $fns.route({
                            context : this,
                            type : "back",
                            // params:{
                            //     flag:1
                            // }
                        });
                    }} 
                />

                <ScrollView style={{ flex:1, backgroundColor:"#eee", padding:12 }}>
                    <View>
                        <View style={{ backgroundColor:"#fff", padding:10, borderRadius:4 }}>
                            <MsgRow
                                title   = "用户名："
                                msg     = {itemInfo.username}
                                titleColor  = "#777"
                                msgColor    = "#222"
                            />

                            <MsgRow
                                title   = "手机号"
                                msg     = {itemInfo.mobile}
                                titleColor  = "#777"
                                msgColor    = "#222"
                            />

                            <MsgRow
                                title   = "邮箱"
                                msg     = {itemInfo.email}
                                titleColor  = "#777"
                                msgColor    = "#222"
                            />

                        
                            <MsgRow
                                title   = "部门"
                                titleColor  = "#777"
                                msg     = {itemInfo.groupName}
                                msgColor= "#222"
                            />

                            <MsgRow
                                title   = "角色"
                                titleColor  = "#777"
                                msg     = {itemInfo.roleName}
                                msgColor= "#222"
                            />

                        </View>
                    </View>

                </ScrollView>
                
            </>
        );
    }

}

let ss = StyleSheet.create({
    msgBox : {  borderRadius:6, padding:10 },
    msgRow : { flexDirection:"row", marginTop:5, marginBottom:5, paddingLeft:10 },
    msgItem: { marginBottom:6 },
    msgLbl : { color:"#666", fontSize:15 },
    msgTag : { padding:8, paddingTop:4, paddingBottom:4, backgroundColor:"#eee", borderRadius:4 },
    msgArrow : { position:"absolute", right:10, top:"50%" },
    flexRowCenter : { flexDirection:"row", alignItems:"center", marginBottom:10 }
});
