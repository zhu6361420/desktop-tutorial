import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { UiHeader, IconFont, UiGap } from "./../../global.components";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {isYWAdmin } from '../../utils/data'
const Tab = createMaterialBottomTabNavigator();
import Energy_Home  from "../energyManage/home/index";
import Energy_SuperHome  from "../energyManage/home/super_index";
import Energy_List  from "./list";
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
                    initialRouteName = "home"
                    labeled     = {true}
                    shifting    = {false}
                    activeColor ="#4e83c2"
                    inactiveColor="#999"
                    barStyle    ={{
                        backgroundColor : "#fff",
                    }}
                >
                    <Tab.Screen
                        name        ={roleId==1?'energy_super':"energe_home"}
                        component   ={roleId==1?Energy_SuperHome:Energy_Home}
                        options={{
                            tabBarLabel: '总览',
                            tabBarIcon: ({ color }) => (
                                <IconFont size={22} icon={'\ue65d'} color={color} />
                            ),
                        }}

                        
                    />

                    <Tab.Screen
                        name="energe_list"
                        component={Energy_List}
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



