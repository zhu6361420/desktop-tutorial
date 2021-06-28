import React from "react";
import {View,Text,ActivityIndicator, TouchableOpacity} from "react-native";
import {Button} from "react-native-elements";
import { $myTheme } from "../../global.utils";

export default function(props){

    let { 
            title = "", 
            outterStyle = {}, 
            buttonStyle = {}, 
            containerStyle = {},  
            onPress = () => {}
    } = props;

    return (

       <View style={{ padding:12,marginBottom:20, ...outterStyle }}>
           <Button 
                title= {title}
                containerStyle={{ borderRadius:6,   ...containerStyle }} 
                buttonStyle={{ height:44, backgroundColor:$myTheme.mainBlue, ...buttonStyle }} 
                onPress = { () => onPress() }      
            />
       </View>

    );
}