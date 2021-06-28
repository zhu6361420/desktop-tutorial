import React,{useState} from "react";
import {View,Text, TouchableOpacity, StyleSheet} from "react-native";
import {$myTheme} from "../global.utils";

export default function(props){
     
    let { datas = [],curTabIndex, onChange = ()=>{} } = props;
    let [activeIndex, setActiveIndex] = useState(curTabIndex);
    //  onChange=(index)=>{
    //      props.parent.getIndex(index)
    //  }
    return (

        <View style={{ height:50, flexDirection:"row", justifyContent:"space-between", backgroundColor:"#fff" }}>
            
            {
                datas.map((item,index) => {
                    return (
                        <TouchableOpacity 
                            style={ ss.item } 
                            key={index}
                            onPress = {() => {
                                setActiveIndex(index)
                                onChange(index);
                            }}
                        >
                            <Text style={[ ss.title , curTabIndex == index ? {color: $myTheme.mainBlue} : { color: "#555" } ]}>{ item.title }</Text>
                            <View style={ curTabIndex == index ? ss.line : '' }></View>
                            { item.dot ? (<View style={{ width:8, height:8, borderRadius:4, backgroundColor:"red", position:"absolute", top:8, right:4 }}></View>) : null }
                        </TouchableOpacity>
                    )
                })
            }
           
        </View>
    );
}

let ss = StyleSheet.create({
    item : { height:50, alignItems:"center", justifyContent:"center", paddingLeft:10, paddingRight:10 },
    title : {  fontSize:16,  },
    line : { height:3, left:0, right:0, position:"absolute", bottom:1, backgroundColor:"#0d91fe" }
});