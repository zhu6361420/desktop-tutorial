import React from "react";
import {View,Text,Image,Modal,ScrollView, StyleSheet, TouchableOpacity, ImageBackground,Platform } from "react-native";
import {IconFont, UiHeader, FormItem, UiGap} from "../../global.components";
import {$myTheme,$ajax, $source,api} from "../../global.utils";
import { $fns } from "../../utils/fns";

const {getInvitationCode}=api;
export default class App extends React.Component{

    state = {
        code : '',
    }
      
    componentDidMount(){
        $ajax({
            url: getInvitationCode,
            data: {},
            _this: this,
          }).then((value) => {
            if (value.code == 200) {
             this.setState({
                 code:value.data
             })
            }
          });
    }
    render(){

        return (
            <>
                <UiHeader 
                    title="我的邀请码"
                    onBack  = {() => {
                        $fns.route({
                            context : this,
                            type : "back"
                        });
                    }}
                />
                {
                    Platform.OS == 'android'
                    ?(
                        <ScrollView style={{ backgroundColor:$myTheme.mainBgGray, flex:1 }}>

                            <View style={{ flex:1, alignItems:"center", justifyContent:"center", paddingTop:80 }}>
                                {/* <Text style={{ fontSize:16, }}>我的邀请码</Text> */}
                                <ImageBackground
                                    source = {require("./../../assets/imgs/qr_bg.jpg")}
                                    style   = {{ width:240, height:240, marginTop:30, marginBottom:30, alignItems:"center", justifyContent:"center" }}
                                >
                              <Text style={{ fontSize:26,color:$myTheme.mainBlue,letterSpacing:4 }}>{this.state.code}</Text>
                                </ImageBackground>
                            </View>

                        </ScrollView>
                    )
                    :(
                        <ScrollView style={{ backgroundColor:$myTheme.mainBgGray, flex:1 }}>

                            <View style={{ flex:1, alignItems:"center", justifyContent:"center", paddingTop:80 }}>
                                {/* <Text style={{ fontSize:16, }}>我的邀请码</Text> */}
                                <ImageBackground
                                    source = {require("./../../assets/imgs/qr_bg.jpg")}
                                    style   = {{ width:240, height:240, marginTop:30, marginBottom:30, alignItems:"center", justifyContent:"center" }}
                                >
                              <Text style={{ fontSize:26,color:$myTheme.mainBlue,letterSpacing:4 }}>{this.state.code}</Text>
                                </ImageBackground>
                            </View>

                        </ScrollView>
                    )
                }
                
              
            </>
        );
    }

}
