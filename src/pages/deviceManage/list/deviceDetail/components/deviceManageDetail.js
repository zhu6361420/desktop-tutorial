import React, {useState} from "react";
import { Text, View,  StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import { UiHeader, MsgRow } from "../../../../../global.components";
import { $fns, $myTheme, $source } from "../../../../../global.utils";

export default class App extends React.Component{

    render(){

        return (
            <>
               
                <UiHeader
                    title = "设备详情"
                    onBack={() => {
                        $fns.route({
                            context : this,
                            type : "back"
                        });
                    }} 
                />

                <ScrollView style={{ flex:1, padding:12 }}>

                    <View style={[ ss.msgBox ]}>
                        <MsgRow 
                            title   = "设备编号"
                            msg     = "PBA30000000011"
                            titleColor = "#fff"
                            msgColor = "#fff"
                        />

                        <MsgRow 
                            title   = "设备型号"
                            msg     = "PAB01"
                            titleColor = "#fff"
                            msgColor = "#fff"
                        />

                        <MsgRow 
                            title   = "设备别名"
                            msg     = "A车间03"
                            titleColor = "#fff"
                            msgColor = "#fff"
                        />

                        <MsgRow 
                            title   = "设备部件"
                            msg     = "齿轮齿条"
                            titleColor = "#fff"
                            msgColor = "#fff"
                        />
                    </View>

                    <View style={{ marginTop:-10, zIndex:2, flexDirection:"row", justifyContent:"center" }}>
                        <Image source = {require("./../../../assets/imgs/icon_tag_tail.png")} style={{ width:20, height:70, marginRight:200 }} resizeMode="stretch" />
                        <Image source = {require("./../../../assets/imgs/icon_tag_tail.png")} style={{ width:20, height:70 }} resizeMode="stretch" />
                    </View>

                    <View style={[ ss.msgBox,{ marginTop:-10, marginBottom:20 } ]}>
                        <MsgRow 
                            title   = "节点编号"
                            msg     = "00000011"
                            titleColor = "#fff"
                            msgColor = "#fff"
                        />

                        <MsgRow 
                            title   = "报警分类"
                            msg     = "报警*1"
                            titleColor = "#fff"
                            msgColor = "#fff"
                        />

                        <MsgRow 
                            title   = "可见分组"
                            titleColor = "#fff"
                            slot    = {(
                                <View style={{ flexDirection:"row" }}>
                                    <View style={ss.msgTag}>
                                        <Text style={{ color:"#fff" }}>技术部</Text>
                                    </View>

                                    <View style={ss.msgTag}>
                                        <Text style={{ color:"#fff" }}>项目部</Text>
                                    </View>
                                </View>
                            )}
                        />

                        <MsgRow 
                            title   = "出厂日期"
                            msg     = "2020年3月30日"
                            titleColor = "#fff"
                            msgColor = "#fff"
                            
                        />

                        <MsgRow 
                            title   = "维保日期"
                            msg     = "2020年3月30日"
                            titleColor = "#fff"
                            msgColor = "#fff"
                        />

                        <MsgRow 
                            title   = "创建人"
                            msg     = "PBA30000000011"
                            titleColor = "#fff"
                            msgColor = "#fff"
                        />

                        <MsgRow 
                            title   = "创建时间"
                            msg     = "2020年3月30日"
                            titleColor = "#fff"
                            msgColor = "#fff"
                        />
                    </View>

                </ScrollView>
                
            </>
        );
    }

}

let ss = StyleSheet.create({
    msgBox : { backgroundColor:"#1c83c6", padding:6, borderRadius:6, paddingBottom:30 },
    msgItem: { marginBottom:6 },
    msgLbl : { color:"#666" },
    msgTag : { padding:8, paddingTop:4, paddingBottom:4, backgroundColor:"#eee", borderRadius:20, backgroundColor:"#04cd5d", marginLeft:10 },
    flexRowCenter : { flexDirection:"row", alignItems:"center", marginBottom:10 }
});
