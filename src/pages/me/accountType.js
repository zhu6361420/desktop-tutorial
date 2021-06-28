import React from "react";
import {View,Text,Image,Modal,ScrollView, TextInput} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {IconFont, UiHeader, FormItem, UiGap, LinkItem} from "../../global.components";
import {$myTheme, $source} from "../../global.utils";
import { $fns } from "../../utils/fns";


export default class App extends React.Component{

    state = {
        curTypeIndex : 0
    }

    render(){

        return (
            <>
                <UiHeader 
                    title="企业账号"
                    onBack  = {() => {
                        $fns.route({
                            context : this,
                            type : "back"
                        });
                    }}
                    right = {(
                        <TouchableOpacity style={{ width:44, height:44, alignItems:"center", justifyContent:"center" }}>
                            <Text style={{ color:"#fff", fontSize:15 }}>保存</Text>
                        </TouchableOpacity>
                    )}
                />
                
                <ScrollView style={{ backgroundColor:$myTheme.mainBgGray, flex:1 }}>
                    <View style={{ backgroundColor:"#72bae7", paddingLeft:20, paddingRight:20,paddingTop:10, paddingBottom:10 }}>
                        <Text style={{ color:"#fff", lineHeight:20 }}>账号类型的选择对您的账号归属有很大影响，后续也会影响到您获取发票，请谨慎选择。</Text>
                    </View>
                    
                    <View style={{ backgroundColor:"#fff", paddingLeft:12, paddingRight:12}}>
                        <TouchableOpacity style={{ height:50, flexDirection:"row", alignItems:"center", justifyContent:"space-between", borderBottomWidth:0.5, borderBottomColor:"#ddd" }}
                            onPress = {() => {
                                this.setState({
                                    curTypeIndex : 0
                                });
                            }}
                        >
                            <Text style={{ fontSize:16 }}>个人账号</Text>
                            { this.state.curTypeIndex == 0 && (<IconFont icon={"\ue61c"} size={24} color={$myTheme.mainBlue} />) }
                        </TouchableOpacity>

                        <View style={{ paddingTop:16, }}>
                            <TouchableOpacity style={{ flexDirection:"row" }}
                                onPress = {() => {
                                    this.setState({
                                        curTypeIndex : 1
                                    });
                                }}
                            >
                                <View style={{ flex:1 }}>
                                    <Text style={{ fontSize:16, marginBottom:6, marginBottom:10 }}>企业账号</Text>
                                    <Text style={{ fontSize:13, color:"#666", marginBottom:4 }}>包括企业、政府、事业单位、团队、组合</Text>
                                </View>

                                { this.state.curTypeIndex == 1 && (<IconFont icon={"\ue61c"} size={24} color={$myTheme.mainBlue} />) }
                            </TouchableOpacity>
                            <View style={{ paddingTop:10, paddingBottom:5, flexDirection:"row", alignItems:"center" }}>
                                <View style={{ flex:1 }}>
                                    <TextInput placeholder="姓名" style={{ height:40, fontSize:16, color:"#000"}} />
                                </View>

                                <View style={{ flexDirection:"row", alignItems:"flex-end" }}>
                                    <Text style={{ fontSize:12, color:"#999" }}>请输入姓名</Text>
                                    <IconFont icon={"\ue641"} size={24} color={"#999"} />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
              
            </>
        );
    }

}
