import {AppRegistry} from 'react-native';
//import App from './App';
import App from './src/router';
import {name as appName} from './app.json';
 import st from './src/utils/staticStorage';
 st.init();
//  CodePush.notifyAppReady()
//  import CodePush from "react-native-code-push";
 // 静默方式，app每次启动的时候，都检测一下更新 'ON_APP_RESUME'
//  const codePushOptions = { checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME };
 // 在组件根节点的地方设置热更新。
//  const App = CodePush(codePushOptions)(_App);
AppRegistry.registerComponent(appName, () => App);