import React,{ useState } from "react";
import {View,Text,Image,TouchableOpacity,StyleSheet, NativeModules, StatusBar, Platform} from "react-native";
import { $fns, $myTheme } from "./../../global.utils";

export default function(props){

    let {onPress = () => {}} = props;
    let [curIndex,setCurIndex] = useState(0);

    return (
        <View style={[ ss.tabBox ]}>
            
            {
                props.datas.map((item,index) => {
                    return (
                        <TouchableOpacity
                            key = {index}
                            style={[ ss.tabItem, curIndex == index ? { borderBottomColor: $myTheme.mainBlue, borderBottomWidth:4 } : null ]}
                            onPress = {() => {
                                setCurIndex(index);
                                onPress(index,item);
                            }}
                        >
                            <Text style={[ ss.tabH4, curIndex == index ? { color:$myTheme.mainBlue } : { color:"#666" } ]}>{ item.num }</Text>
                            <Text style={[ ss.tabH5, curIndex == index ? { color:$myTheme.mainBlue } : { color:"#666" } ]}>{ item.title }</Text>
                        </TouchableOpacity>
                    )
                })
            }

           
        </View>
    );

}

let ss = StyleSheet.create({
    tabBox : { flexDirection:"row", paddingLeft:"15%", paddingRight:"15%", justifyContent:"space-between", backgroundColor:"#fff" },
    tabItem : { paddingLeft:20, paddingRight:20, alignItems:"center", paddingTop:10, paddingBottom:10, },
    tabH4 : { fontSize:28, color:"#666", marginBottom:4 },
    tabH5 : { fontSize:16, color:"#666" },
});
