import React from "react";
import {View,Text,Image, FlatList, TouchableOpacity } from "react-native";
import {UiHeader, IconFont} from "../../global.components";
import {$myTheme, $source} from "../../global.utils";
import { $fns } from "../../utils/fns";

export default class App extends React.Component{

    state = {
        dataLs : [
            {title : "采矿业"},
            {title : "建筑业"},
            {title : "通讯行业"},
            {title : "采矿业22"},
            {title : "采矿业33"},
            {title : "采矿业44"},
            {title : "采矿业55"},
            {title : "采矿业66"},
            {title : "采矿业77"},
            {title : "采矿业88"}
        ],

        curTypeIndex : -1
    };

    render(){

        return (
            <View style={{ flex:1 }}>
                <UiHeader 
                    title   ="行业类型" 
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
                
                <FlatList
                    style   = {{ flex:1, backgroundColor:$myTheme.mainBgGray }}
                    data    ={ this.state.dataLs }
                    renderItem={({item,index}) => (
                        <TouchableOpacity 
                            style={{ flexDirection:"row", alignItems:"center", borderBottomColor:"#ddd", borderBottomWidth:0.5, height:48, paddingLeft:12, paddingRight:12, backgroundColor:"#fff", justifyContent:"space-between" }}
                            onPress = {() => {
                                this.setState({
                                    curTypeIndex : index
                                });
                            }}
                        >
                            <Text style={{ fontSize:14 }}>{ item.title }</Text>
                            { this.state.curTypeIndex == index && (<IconFont icon={"\ue61c"} size={24} color={$myTheme.mainBlue} />) }
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item,index) => "xx_" + index}
                />
                
                
            </View>
        );

    }

}



