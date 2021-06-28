import React from "react";
import {View, Text, StyleSheet} from "react-native";

export default function(props){

    let {title = "", slot = null, border = "",bitian=false} = props;

    return (
        <View style={[ ss.form_item, border == 'none' ? { borderBottomWidth:0 } : null ]}>
            {bitian&&(<Text style={{color:'red',marginRight:1}}>*</Text>)}
            {!bitian&&(<Text style={{marginRight:7}}></Text>)}    
            <Text style={[ ss.form_lbl ]}>{ title }</Text>
            <View style={[ ss.form_item_main ]}>
                { slot }
            </View>
        </View>
    );
}

let ss = StyleSheet.create({
    form_item   : { height:46, borderBottomWidth:0.5, borderBottomColor: "#ddd", flexDirection:"row", alignItems:"center" },
    form_lbl    : { fontSize:15 ,alignItems:'center'},
    form_item_main  : { flex:1, height:30, paddingRight:10, alignItems:"center", flexDirection:"row" },
    form_item_input : { height:30, fontSize:14, textAlign: "right",  paddingVertical: 0 } ,
});