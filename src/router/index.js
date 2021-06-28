import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Toast from 'react-native-easy-toast';
import {View} from 'react-native';
import Loading from './../components/Loading';
import {IconFont} from './../global.components';

import {Home, Me, Application, Demo} from './routes.js';
import {
  Login,
  Transition,
  Error_400,
  Error_401,
  Error_404,
  Error_500,
  Error_403,
  Error_intenet,
  WelCome,
  RegisterStep1,
  RegisterStep2,
  ForgetStep1,
  ForgetStep2,
  My_Yaoqing
} from './routes.js';

import {
  DmIndex,
  DmHome,
  DmSuperHome,
  DmHome_WarnHandleDetail,
  DmList,
  Dm_Repair,
  Dm_de,
  Dm_PersonManage,
  Dm_CompanyManageInfo,
  Dm_CompanyManageVerify,
  Dm_CompanyManage,
  Dm_PersonManageInfo,
  Dm_PersonManageVerify,
  Dm_WarnManage,
  Dm_RepairManage,
  Dm_RepairDetail,
  Weekly,
  Dm_MaintainMange,
  Dm_MaintainMangeDetail,
  Dm_MaintainMangeDone,
  My_AccountType,
  My_Aboutus,
  My_BaseInfo,
  Privacy,
  Userservice,
  My_Feeback,
  My_IndustryType,
  My_Share,
  benderFuHeDetail,
  Solution,
} from './routes';
import {
  FuheDetail,
  DeviceDetail,
  JiadongDetail,
  WorkDetail,
  Webview,
  Modalinfo,
  MessageDetail,
  Pdf,
  Energy_SuperHome,
  Energy_Home,
  Energy_index,
  Energy_list,
  Energy_detail,
  Energy_extra,
  Energy_more,
  Statis_more,
  DmNewIndex,
  Health_Home,
  Health_index,
  Health_list,
  Baoyang,
  Jinji,
  Shukong,
  Guzhangpaicha,
  GuzhangDetail,
  DeviceHealthDetail,
  Baoyanggenzong,
  Shukongjiance,
  Jinjibaojing,
  Remote_index,
  Remote_List,
  Remote_Vertify,
  repairFeeback
} from './routes';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

let screenOptions = {
  title: '',
  headerStyle: {
    height: 0,
  },
  headerBackImage: () => <></>,
};
// 路由配置
export default function () {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="welcome">
        <Stack.Screen
            name="remote_list"
            component={Remote_List}
            options={screenOptions}
          />
            <Stack.Screen
            name="rmote_vertify"
            component={Remote_Vertify}
            options={screenOptions}
          />
        <Stack.Screen
            name="shukongList"
            component={Shukong}
            options={screenOptions}
          />
          <Stack.Screen
            name="jinjiList"
            component={Jinji}
            options={screenOptions}
          />
             <Stack.Screen
            name="repairFeeback"
            component={repairFeeback}
            options={screenOptions}
          />
          <Stack.Screen
            name="jinjibaojing"
            component={Jinjibaojing}
            options={screenOptions}
          />
        <Stack.Screen
            name="shukongjiance"
            component={Shukongjiance}
            options={screenOptions}
          />
        <Stack.Screen
            name="baoyanggenzong"
            component={Baoyanggenzong}
            options={screenOptions}
          />
          <Stack.Screen
            name="deviceDetail"
            component={DeviceHealthDetail}
            options={screenOptions}
          />
          <Stack.Screen
            name="guzhangDetail"
            component={GuzhangDetail}
            options={screenOptions}
          />
          <Stack.Screen
            name="welcome"
            component={WelCome}
            options={screenOptions}
          />
          <Stack.Screen
            name="newHome"
            component={DmNewIndex}
            options={screenOptions}
          />
          <Stack.Screen
            name="tabPages"
            component={TabPages}
            options={screenOptions}
          />
          <Stack.Screen
            name="login"
            component={Login}
            options={screenOptions}
          />
          <Stack.Screen
            name="transition"
            component={Transition}
            options={screenOptions}
          />
          <Stack.Screen
            name="error_400"
            component={Error_400}
            options={screenOptions}
          />
          <Stack.Screen
            name="error_401"
            component={Error_401}
            options={screenOptions}
          />
          <Stack.Screen
            name="error_403"
            component={Error_403}
            options={screenOptions}
          />
          <Stack.Screen
            name="error_404"
            component={Error_404}
            options={screenOptions}
          />
          <Stack.Screen
            name="error_500"
            component={Error_500}
            options={screenOptions}
          />
          <Stack.Screen
            name="error_intenet"
            component={Error_intenet}
            options={screenOptions}
          />
          <Stack.Screen
            name="register1"
            component={RegisterStep1}
            options={screenOptions}
          />
          <Stack.Screen
            name="register2"
            component={RegisterStep2}
            options={screenOptions}
          />
          <Stack.Screen
            name="forget1"
            component={ForgetStep1}
            options={screenOptions}
          />
          <Stack.Screen
            name="forget2"
            component={ForgetStep2}
            options={screenOptions}
          />

          <Stack.Screen
            name="dmIndex"
            component={DmIndex}
            options={screenOptions}
          />
          <Stack.Screen
            name="dmHome"
            component={DmHome}
            options={screenOptions}
          />
          <Stack.Screen
            name="dmSuperHome"
            component={DmSuperHome}
            options={screenOptions}
          />
          <Stack.Screen
            name="dmHome_WarnHandleDetail"
            component={DmHome_WarnHandleDetail}
            options={screenOptions}
          />
          <Stack.Screen
            name="dmList"
            component={DmList}
            options={screenOptions}
          />

          <Stack.Screen
            name="dm_PersonManage"
            component={Dm_PersonManage}
            options={screenOptions}
          />
          
          <Stack.Screen
            name="weekly"
            component={Weekly}
            options={screenOptions}
          />

          <Stack.Screen
            name="dm_CompanyManage"
            component={Dm_CompanyManage}
            options={screenOptions}
          />
          <Stack.Screen
            name="dm_PersonManageInfo"
            component={Dm_PersonManageInfo}
            options={screenOptions}
          />
          <Stack.Screen
            name="dm_CompanyManageInfo"
            component={Dm_CompanyManageInfo}
            options={screenOptions}
          />
          <Stack.Screen
            name="dm_PersonManageVerify"
            component={Dm_PersonManageVerify}
            options={screenOptions}
          />
          <Stack.Screen
            name="dm_CompanyManageVerify"
            component={Dm_CompanyManageVerify}
            options={screenOptions}
          />

          <Stack.Screen
            name="dm_WarnManage"
            component={Dm_WarnManage}
            options={screenOptions}
          />

          <Stack.Screen
            name="dm_Repair"
            component={Dm_Repair}
            options={screenOptions}
          />
          <Stack.Screen
            name="dm_de"
            component={Dm_de}
            options={screenOptions}
          />
          <Stack.Screen
            name="solution"
            component={Solution}
            options={screenOptions}
          />

          <Stack.Screen
            name="dm_RepairManage"
            component={Dm_RepairManage}
            options={screenOptions}
          />
          <Stack.Screen
            name="dm_RepairDetail"
            component={Dm_RepairDetail}
            options={screenOptions}
          />
          <Stack.Screen
            name="dm_MaintainMange"
            component={Dm_MaintainMange}
            options={screenOptions}
          />
          <Stack.Screen
            name="Dm_MaintainMangeDetail"
            component={Dm_MaintainMangeDetail}
            options={screenOptions}
          />
          <Stack.Screen
            name="dm_MaintainMangeDone"
            component={Dm_MaintainMangeDone}
            options={screenOptions}
          />

          <Stack.Screen
            name="my_Aboutus"
            component={My_Aboutus}
            options={screenOptions}
          />
          <Stack.Screen
            name="my_AccountType"
            component={My_AccountType}
            options={screenOptions}
          />

          <Stack.Screen
            name="my_BaseInfo"
            component={My_BaseInfo}
            options={screenOptions}
          />
          <Stack.Screen
            name="my_Feeback"
            component={My_Feeback}
            options={screenOptions}
          />
          <Stack.Screen
            name="my_IndustryType"
            component={My_IndustryType}
            options={screenOptions}
          />
          <Stack.Screen
            name="my_share"
            component={My_Share}
            options={screenOptions}
          />
           <Stack.Screen
            name="my_yaoqing"
            component={My_Yaoqing}
            options={screenOptions}
          />
          
          <Stack.Screen
            name="privacy"
            component={Privacy}
            options={screenOptions}
          />
          <Stack.Screen
            name="userservice"
            component={Userservice}
            options={screenOptions}
          />
          <Stack.Screen
            name="FuheDetail"
            component={FuheDetail}
            options={screenOptions}
          />
          <Stack.Screen
            name="benderFuHeDetail"
            component={benderFuHeDetail}
            options={screenOptions}
          />

          <Stack.Screen
            name="DeviceDetail"
            component={DeviceDetail}
            options={screenOptions}
          />
          <Stack.Screen
            name="JiadongDetail"
            component={JiadongDetail}
            options={screenOptions}
          />
          <Stack.Screen
            name="WorkDetail"
            component={WorkDetail}
            options={screenOptions}
          />
          <Stack.Screen
            name="home_Webview"
            component={Webview}
            options={screenOptions}
          />

          <Stack.Screen
            name="messageDetail"
            component={MessageDetail}
            options={screenOptions}
          />

          <Stack.Screen
            name="home_Modalinfo"
            component={Modalinfo}
            options={screenOptions}
          />
          <Stack.Screen
            name="energe"
            component={Energy_index}
            options={screenOptions}
          />
          <Stack.Screen
            name="energy_super"
            component={Energy_SuperHome}
            options={screenOptions}
          />
          <Stack.Screen
            name="energe_home"
            component={Energy_Home}
            options={screenOptions}
          />
          <Stack.Screen
            name="health_home"
            component={Health_Home}
            options={screenOptions}
          />
          <Stack.Screen
            name="health"
            component={Health_index}
            options={screenOptions}
          />
           <Stack.Screen
            name="remote"
            component={Remote_index}
            options={screenOptions}
          />
          <Stack.Screen
            name="health_list"
            component={Health_list}
            options={screenOptions}
          />
          <Stack.Screen
            name="baoyang"
            component={Baoyang}
            options={screenOptions}
          />
          <Stack.Screen
            name="guzhangpaicha"
            component={Guzhangpaicha}
            options={screenOptions}
          />

          <Stack.Screen
            name="energe_list"
            component={Energy_list}
            options={screenOptions}
          />
          <Stack.Screen
            name="energe_detail"
            component={Energy_detail}
            options={screenOptions}
          />
          <Stack.Screen
            name="energe_extra"
            component={Energy_extra}
            options={screenOptions}
          />
          <Stack.Screen
            name="energe_more"
            component={Energy_more}
            options={screenOptions}
          />
          <Stack.Screen
            name="statis_more"
            component={Statis_more}
            options={screenOptions}
          />

          <Stack.Screen name="Pdf" component={Pdf} options={screenOptions} />
        </Stack.Navigator>

        <Loading
          ref={(ref) => {
            global.mLoadingComponentRef = ref;
          }}
        />

        <Toast
          ref={(ref) => {
            global.toastCompos = ref;
          }}
          position="bottom"
          fadeInDuration={300}
          fadeOutDuration={300}
          opacity={0.75}
        />
        {/** 全局Toast */}
      </NavigationContainer>
    </>
  );
}

// 主屏幕页面
function TabPages() {
  let flag = JSON.parse(sto.getValue('isUpdate'));
  return (
    <Tab.Navigator
      initialRouteName="home"
      labeled={true}
      shifting={false}
      activeColor="#4e83c2"
      inactiveColor="#999"
      barStyle={{
        backgroundColor: '#f8f8f8',
      }}>
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({color}) => (
            <IconFont size={22} icon={'\ue65d'} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="application"
        component={Application}
        options={{
          tabBarLabel: '应用',
          tabBarIcon: ({color}) => (
            <IconFont size={22} icon={'\ue768'} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="me"
        component={Me}
        options={{
          tabBarLabel: '个人',
          tabBarIcon: ({color}) => (
            <>
              {flag && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 4,
                    backgroundColor: 'red',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                  }}></View>
              )}
              <IconFont size={22} icon={'\ue60f'} color={color} />
            </>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
