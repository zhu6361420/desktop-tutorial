import React from "react";
import {View,Text, FlatList, StyleSheet, TouchableOpacity} from "react-native";
import {IconFont, UiHeader} from "../../../global.components";
import { $fns } from "../../../utils/fns";
import {$ajax, api} from '../../../global.utils';
import { WebView } from 'react-native-webview';
const { findByPageForRealEquals} = api;
export default class App extends React.Component{

    state = {
        web_url : "请检查您的网络"
    }

    render(){

        let { web_url } = this.state;

        return (
            <>
                <UiHeader 
                    title="扫描结果"
                    onBack  = {() => {
                        $fns.route({
                            context : this,
                            type : "back"
                        });
                    }}
                />
                
                <View style={{ flex:1 }}>
                    {  web_url && (<View style={{ flex:1,justifyContent:'center' }} ><Text style={{textAlign:'center',fontSize:16}}>{web_url}</Text></View>) }
                </View>
            </>
        );
    }

    componentDidMount(){
        let {params} = this.props.route;
        let url=decodeURIComponent(params.web_url);
        if(url){
            url=url.substring(url.lastIndexOf("/")+1);
            $ajax({
                url: findByPageForRealEquals,
                data: {
                  args: {
                      deviveTypeId: null,
                      operatingState: null,
                      sequence: url,
                      ownerId: null
                    },
                    pageNum: 1,
                    pageSize: 4,
                },
                hasLoading: true,
                _this: this,
              }).then((value) => {
                if (value.code == 200) {
                  if (value.data.list.length == 1) {
                    $fns.route({
                        context : this,
                        type:"replace",
                        routeName:'DeviceDetail',
                        params: {
                            isScan:true,
                            id: value.data.list[0].id,
                            sequence: value.data.list[0].sequence,
                            deviceTypeId: value.data.list[0].deviceTypeId,
                          },
                    });
                  }
                  else{
                      this.setState({
                        web_url:"未能识别此二维码"
                      })
                  }
                }
              });
        }
       
     
        
        // this.setState({
        //     web_url : decodeURIComponent(params.web_url)
        // },()=>{
        //     console.log(this.state.web_url)
        // });
    }

}

let ss = StyleSheet.create({
    flexRow: { flexDirection:"row", alignItems:"center" },
    ball : { width:10, height:10, backgroundColor:"red", marginRight:10, borderRadius:5, marginVertical:10 },
});
