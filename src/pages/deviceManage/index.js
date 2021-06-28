import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { UiHeader, IconFont, UiGap } from "./../../global.components";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {isYWAdmin } from '../../utils/data'
const Tab = createMaterialBottomTabNavigator();
import DmHome  from "./home/index";
import DmSuperHome  from "./home/super_index";
import DmList  from "./list";
import DmNewHome from './home/home'
export default class App extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        let data=JSON.parse(sto.getValue('loginData'));
        let roleId=data.userData.roleId;
                return (
            <>

                <Tab.Navigator
                    initialRouteName = "newHome"
                    labeled     = {true}
                    shifting    = {false}
                    activeColor ="#4e83c2"
                    inactiveColor="#999"
                    barStyle    ={{
                        backgroundColor : "#fff",
                    }}
                >
                    <Tab.Screen
                        // name        ={roleId==1?'dmSuperHome':"dmHome"}
                        // component   ={roleId==1?DmSuperHome:DmHome}
                        name={'newHome'}
                        component={DmNewHome}
                        options={{
                            tabBarLabel: '总览',
                            tabBarIcon: ({ color }) => (
                                <IconFont size={22} icon={'\ue65d'} color={color} />
                            ),
                        }}

                        
                    />

                    <Tab.Screen
                        name="dmList"
                        component={DmList}
                        options     ={{
                            tabBarLabel: '列表',
                            tabBarIcon: ({ color }) => (
                                <IconFont size={22} icon={'\ue65f'} color={color} />
                            ),
                        }}
                    /> 
                 

                   
                    
                </Tab.Navigator>
            </>
        );
    }

}



