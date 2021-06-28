import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { UiHeader } from "../../../../../global.components";
import { $fns, $ui,$myTheme ,$ajax, api} from "../../../../../global.utils";
const{resolve}=api
const noticeObj={
    0:'无',
    1:'短信',
    2:'邮件',
    3:'短信/邮件',
}

export default class App extends React.Component{
    constructor(props){
        super(props)
    }
    state = {
        curTabIndex : 0
    };
    resolve=(id,status)=>{
        $ajax({
            url:resolve,
            data:{
                ids:[id],
                memo: "",
                status: status
            },_this:this
        }).then(value=>{
            if(value.code==200){
                $ui.toast('标注成功')
                $fns.route({
                    context: this,
                    type:'replace',
                    routeName: 'dm_WarnManage',
                  });
                
            }
            else{
                $ui.toast('标注失败')

            }
        })
    }
    render(){
    const {detailList,id}=this.props.route.params;
      const {liaisons=[],noticeType,dataType,hasMoreData=false}=detailList[0];
      const messages=(detailList[0].messages||[]).filter(item=>Object.keys(item)[0]!=undefined);
        return (  
            <View style={{ flex:1, backgroundColor:"#fff" }}>
                
                <UiHeader title="报警详情" 
                    onBack={() => {
                        $fns.route({
                            context : this,
                            type : "back"
                        });
                    }} 
                />

                
                <View style={[ ss.nTitle ]}>
                <Text style={{ fontSize:16 }}>通知人群：{liaisons.length==0?'无':liaisons.map((item,index)=>{item||'无'})}</Text>
                </View>

                <View style={[ ss.nTitle ]}>
                <Text style={{ fontSize:16 }}>通知方式:{noticeObj[noticeType]||'无'}</Text>
                </View>
                
                <FlatList
                    style ={{ flex:1, paddingLeft:12, paddingRight:12, paddingTop:12, paddingBottom:10 ,marginBottom:10}} 
                    data={messages}
                    renderItem={({item}) => {
                        const key=Object.keys(item)[0];
                        const {summary,grade}=item[key]||{};
                        return (
                            <View style={[ ss.itemBox ]}> 
                                <View style={{ paddingLeft:20, marginBottom:8 }}>
                                    <View style={[ ss.redDot ]}></View>
                        <Text style={{ fontSize:16 }}>{key}</Text>
                                </View>
                                
                                <View style={{ paddingLeft:20 }}>
                        <Text style={{ fontSize:14, color:"#666", lineHeight:20 }}>{summary}</Text>
                                </View>

                                <View style={{ width:1, position:"absolute", left:5, top:0, bottom:0, backgroundColor:"#ddd" }}></View>
                            </View>
                        )
                    }}
                    keyExtractor ={(item,index) => 'xx_' + index}
                />
                
                <View style={{ height:60, flexDirection:"row" }}>
                    <TouchableOpacity  style={{ flex:1, height:60, justifyContent:"center", alignItems:"center", backgroundColor:"#eee" }}
                    onPress={()=>this.resolve(id,1)}>
                        <Text style={{ fontSize:17, color:"#000" }}>标注取消</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flex:1, height:60, justifyContent:"center", alignItems:"center", backgroundColor:$myTheme.mainBlue }}
                     onPress={()=>this.resolve(id,2)}>
                        <Text style={{ fontSize:17, color:"#fff" }}>标注已解决</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }


}



let ss = StyleSheet.create({
    itemBox : { paddingTop:10, paddingBottom:10 },
    nTitle : { height:50, borderBottomWidth:0.5, borderBottomColor:"#ddd", paddingLeft:12, paddingRight:12, flexDirection:"row", alignItems:"center" },
    redDot : { width:10, height:10, borderRadius:6, borderWidth:1, borderColor:"red", position:"absolute", left:0.5, zIndex:1, top:6, backgroundColor:"#fff" },
    flexRowCenter : { flexDirection:"row", alignItems:"center", marginBottom:10 }
});



