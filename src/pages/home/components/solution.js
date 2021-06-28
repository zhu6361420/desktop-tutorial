import React from 'react';
import {WebView} from 'react-native-webview';

import {IconFont, UiHeader} from '../../../global.components';
import {$myTheme,$fns, $ajax, api, $source} from '../../../global.utils';
const {getSolution} = api;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        datailTitle: '',
      datailData: 'https://www.jianshu.com/p/9e6f1569227f',
    };
  }
 
  // prestr(url){
  //     let src=null;
  //     if(url&&url!=''){
  //         let newstr=`src='${$source.url}`;
  //         src=url.replace(/src='/g,newstr);
  //     }
  //     return src;
  // }
  render() {
    const {url,title} = this.props.route.params;
    return (
      <>
        <UiHeader title={title} hasBack={true} onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}/>
        <WebView
          automaticallyAdjustContentInsets={true}
          source={{uri:url}}
        />
      </>
    );
  }
}
