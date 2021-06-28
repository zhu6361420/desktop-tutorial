import React,{ useState } from "react";
import {View,Text, Image,} from "react-native";
import * as Progress from 'react-native-progress';
export default function(props){

    let {
        progress=0,
        color=null,
        status='',
    } = props;

    return (
        <View style={{width: 84, alignItems: 'center'}}>
        <Progress.Circle
          size={75}
          progress={progress/100}
          color={color}
          borderWidth={0}
          formatText={(e) => {
            return (
              <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <Text style={{fontSize: 20, color: color}}>
                  {progress}
                </Text>
                <Text>%</Text>
              </View>
            );
          }}
          showsText={true}
          unfilledColor="#ddd"
          thickness={6}
        />
        <Text
          style={{
            fontSize: 12,
            color: '#444',
            marginTop: 6,
            marginBottom: 8,
          }}>
          {status}
        </Text>
      </View>
    );

}

