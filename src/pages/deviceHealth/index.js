import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet,Image} from 'react-native';
import {UiHeader, IconFont, UiGap} from './../../global.components';
import {$fns} from './../../global.utils';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {isYWAdmin,} from '../../utils/data';
const Tab = createMaterialBottomTabNavigator();
import Health_Home from '../deviceHealth/home/index';
import Health_List from './list';
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
            name="health_home"
            component={Health_Home}
            options={{
              tabBarLabel: '总览',
              tabBarIcon: ({color}) => (
                <IconFont size={22} icon={'\ue698'} color={color} />
              ),
            }}
          />

          <Tab.Screen
            name="health_list"
            component={Health_List}
            options={{
              tabBarLabel: '列表',
              tabBarIcon: ({color}) => (
                <IconFont size={22} icon={'\ue6a7'} color={color} />
              ),
            }}
          />
      
        </Tab.Navigator>
        <View style={{position:'absolute',bottom:15,left:'50%',marginLeft:-25, width: 56,
                height: 56,backgroundColor:'#f1f1f1',borderBottomLeftRadius:25,borderBottomRightRadius:25,alignItems:'center'}}>
            <TouchableOpacity
            onPress={()=>{
              $fns.route({
                context: this,
                type: 'navigate',
                routeName:'guzhangpaicha'
              })
            }
            }
              style={{
                width: 50,
                height: 50,
                // borderColor: 'red',
                // borderWidth: 1,
                borderRadius: 25,
                backgroundColor:'#21CCA9',
                alignItems:'center',justifyContent:'center'
              }}>
              <Image style={{ width:25, height:25, }}source={require('../../assets/imgs/Search_icon.png')}/> 
                 </TouchableOpacity>
          </View>
      </>
    );
  }
}
