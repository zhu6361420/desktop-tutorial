import React,{ useState } from "react";
import {View,Text,Image,TouchableOpacity,StyleSheet, NativeModules, StatusBar, Platform} from "react-native";
import { $fns, $myTheme } from "../../global.utils";

export default function(props){

    let { datas = [], onPress = () => {}, selectIndex  = -1} = props;
    let [curIndex,setCurIndex] = useState(selectIndex);

    return (
        <View style={{ flexDirection:"row", backgroundColor:"#fff", alignItems:"center" }}>

        {
            datas.map((item,index) => {
                return (
                    <>
                        <TouchableOpacity 
                            style={[ ss.tagItem, curIndex == index ? { backgroundColor:$myTheme.mainBlue } : null ]}
                            onPress = {() => {
                                setCurIndex(index);
                                onPress(index,item);
                            }}
                            key = {index}
                        >
                            <Text style={[ ss.tagH3, curIndex == index ? {color:"#fff"} :null ]}>{ item.title }</Text>
                            <Text style={[ ss.tagH4, curIndex == index ? {color:"#fff"} :null  ]}>{ item.num }</Text>
                            <Text style={[ ss.tagH5, curIndex == index ? {color:"#fff"} :null  ]}>{ item.state }</Text>
                        </TouchableOpacity>

                        { index != datas.length - 1 ? (<Text style={[ ss.tagLine ]}>|</Text>) : null }
                    </>
                )
            })
        }    
    </View>
    );

}

let ss = StyleSheet.create({
    tagItem : { flex:1, alignItems:"center", paddingTop:8, paddingBottom:8,  },
    tagH3 : { color:$myTheme.mainBlue },
    tagH4 : { color:$myTheme.mainBlue, fontSize:18, marginTop:6, marginBottom:6 },
    tagH5 : { color:$myTheme.mainBlue },
    tagLine : { color:"#ccc", fontSize:20 }
});
