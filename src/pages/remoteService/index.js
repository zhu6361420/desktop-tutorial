import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {UiHeader, IconFont, UiGap} from './../../global.components';
import {$fns} from './../../global.utils';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {isCustomAdmins,isYWAdmin} from '../../utils/data';
const Tab = createMaterialBottomTabNavigator();
import Remote_Vertify from './vertify/index';
import Remote_List from './list/index';
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let data = JSON.parse(sto.getValue('loginData'));
    let roleId = data.userData.roleId;
    return (
      <>
        <Tab.Navigator
          initialRouteName="health"
          labeled={true}
          shifting={false}
          activeColor="#4e83c2"
          inactiveColor="#999"
          barStyle={{
            backgroundColor: '#fff',
          }}>
          <Tab.Screen
            name="remote_list"
            component={Remote_List}
            options={{
              tabBarLabel: '我的申请',
              tabBarIcon: ({color}) => (
                <IconFont size={22} icon={'\ue65d'} color={color} />
              ),
            }}
          />

        {(roleId==6||isYWAdmin())&&(
          <Tab.Screen
            name="rmote_vertify"
            component={Remote_Vertify}
            options={{
              tabBarLabel: '审核',
              tabBarIcon: ({color}) => (
                <IconFont size={22} icon={'\ue65f'} color={color} />
              ),
            }}
          />
        )}  
        </Tab.Navigator>
  
      </>
    );
  }
}
