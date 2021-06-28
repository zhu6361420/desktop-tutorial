// import React from 'react';
// import {Text, View, Image, TouchableOpacity, StatusBar} from 'react-native';
// import {$fns} from '../../global.utils';

// export default class App extends React.Component {
//   render() {
//     return (
//       <View
//         style={{
//           flex: 1,
//           alignItems: 'center',
//           justifyContent: 'center',
//           backgroundColor: '#fff',
//         }}>
//         <View
//           style={{
//             flex: 5,
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: '#fff',
//           }}>
//           <StatusBar
//             backgroundColor="#fff"
//             translucent
//             barStyle="dark-content"
//           />

//           <Image
//             source={require('../../assets/imgs/welcome.png')}
//             style={{width: 280, height: 340}}
//             resizeMode="contain"
//           />
//         </View>
//         <View
//           style={{
//             flex: 1,
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: '#fff',
//           }}>
//           <Text style={{color:'#b8b8b8'}}>亚威智云提供云计算服务</Text>
//           <Text style={{color:'#b8b8b8'}}>www.yaweicloud.com</Text>
//         </View>
//       </View>
//     );
//   }

//   componentDidMount() {
//     setTimeout(() => {
//         $fns.route({
//             type    : "replace",
//             context : this,
//             routeName : "tabPages"
//         });
//     }, 1200);
//   }
// }


import React from 'react';
import {Text, StyleSheet, View, Dimensions} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {$fns} from '../../global.utils';

export default class Home extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
        $fns.route({
          type    : "replace",
          context : this,
          routeName : "tabPages"
        });
    }, 1500);
  }
  render() {
    return (
      <View >
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});