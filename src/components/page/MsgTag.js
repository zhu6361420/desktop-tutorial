import React from "react";
import {View,Text,Image} from "react-native";
import { $fns } from "./../../global.utils";
export default function MsgTag(props) {
    let {image = {}, title, info} = props;
  
    return (
      <View
        style={{
          width: $fns.getWindowWidth()-25,
          // width: "100%",
          height: 80,
          backgroundColor: '#fff',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          borderRadius: 4,
          marginBottom: 10,
          justifyContent:'space-between'
          // marginRight:10,
  
        }}>
        <View style={{height:60,width:'65%', paddingLeft: 10,justifyContent:'center'}}>
          {/* <Text style={{fontSize: 17, marginBottom: 7}}>{title}</Text> */}
          <Text style={{fontSize: 14, color: '#444'}} numberOfLines={2}>
            {info}
          </Text>
        </View>
        <View style={{width:100}}>
        <Image source={{uri: image}} style={{width:'100%',height:'100%',}} />
        </View>

      </View>
    );
  }