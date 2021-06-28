import React from "react";
import {View,Text, FlatList, StyleSheet, TouchableOpacity} from "react-native";
import {IconFont, UiHeader} from "../../../../../global.components";
import { $fns } from "../../../../../utils/fns";
import Pdf from 'react-native-pdf';
import {$source}from '../../../../../global.utils'
import { $ui } from "../../../../../utils/utils.ui";
export default class App extends React.Component{
    constructor(props){
        super(props);
        this.state={
            // pdfUrl:''
        }
    }
    componentDidMount(){
        // this._navListener = this.props.navigation.addListener('focus', () => {
        //     this.setState({
        //         pdfUrl:url
        //     })
        // })

    }

    render(){
        const {url,isCaozuo} = this.props.route.params;
        return (
            <>
                <UiHeader 
                    title="PDF详情"
                    onBack  = {() => {
                        $fns.route({
                            context : this,
                            type : "back"
                        });
                    }}
                />
                
                <View style={{ flex:1 }}>
                    <Pdf
                        // source={isCaozuo?require("../../../../../assets/files/亚威智云-操作手册V1.0.7348039a.pdf"):{uri:`https://platform.yaweicloud.com${url}` }}
                        // source={isCaozuo?{uri:"https://platform.yaweicloud.com/auth-login/static/亚威智云-操作手册V1.0.7348039a.pdf"}:{uri:`${$source.url}${url}` }}
                        source={isCaozuo?{uri:`${$source.url}/auth-login/docV1.0.pdf`,cache:true}:{uri:encodeURI(`${$source.url}${url}`),cache:true }}                        style={{ flex: 1 }}
                        onError={(err)=>{
                            $ui.toast("文件不存在或文件格式有误,请稍后再试")
                            $fns.route({
                                context : this,
                                type : "back"
                            });
                        }}
                    />
                </View>
            </>
        );
    }
    componentDidMount(){
        let {params} = this.props.route;
        this.setState({
            web_url : decodeURIComponent(params.web_url)
        });
    }

}

let ss = StyleSheet.create({
    flexRow: { flexDirection:"row", alignItems:"center" },
    ball : { width:10, height:10, backgroundColor:"red", marginRight:10, borderRadius:5, marginVertical:10 },
});
