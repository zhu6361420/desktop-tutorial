import React from "react";
import {View,Text,ActivityIndicator, TouchableOpacity} from "react-native";
import {Button} from "react-native-elements";


export default function(props){

    let { 
        title   = "", 
        style   ={}, 
        buttonStyle = {},
        containerStyle = {}, 
        onPress = null 
    } = props;

    return (

        <View style={{ alignItems:"center", ...style  }}>

            <Button 
                title= {title}
                containerStyle={{ borderRadius:25, width:"100%", ...containerStyle  }} 
                buttonStyle={{ backgroundColor:"#4e83c2", ...buttonStyle }} 
                onPress = {() => {
                    props.onPress && props.onPress();
                }}      
            />

        </View>
    );
}