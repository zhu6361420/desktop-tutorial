import React from "react";
import {TouchableOpacity, StatusBar, Platform, View } from "react-native";
import IconFont from "./IconFont";
import {Header} from "react-native-elements";
import { $myTheme } from "../global.utils";

export default class App extends React.Component{
    constructor(props) {
        super(props);
      }
      componentDidMount(){
        Platform.OS !== 'ios' && StatusBar.setTranslucent(true);
        Platform.OS !== 'ios' && StatusBar.setBackgroundColor('transparent');
      }

   render(){
    let { 
        title = "" , 
        right = null, 
        hasBack = true, 
        onBack = null, 
        main  = null 
    } = this.props;
    return (
        <View
            style = {{ backgroundColor:$myTheme.mainBlue }}
        >
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content" />
            <Header
                barStyle = "light-content"
                placement={main?"left":'center'}
                backgroundColor= {$myTheme.mainBlue}
                containerStyle = {{  borderBottomWidth:0 ,}}
                leftComponent={
                    hasBack ? (
                        <TouchableOpacity style={ { left:0, width:44, height:44,  justifyContent:"center",  }} onPress={() => {
                            onBack();
                        }}>
                            <IconFont icon={'\ue78a'} size={20} color="#fff" />
                        </TouchableOpacity>
                        
                    ) : null
                }
                centerComponent={
                    main ? main : { text: title, style: { color: '#fff', fontSize:18 } }
                }
                rightComponent={ (right) }
            />
        </View>
    );
   }  
 

}

