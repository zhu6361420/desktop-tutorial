import { Alert } from 'react-native';

let UI = {};

// 确认框 提示
UI.confirm  = function(msg,confirmCB = ()=>{},cancCB = ()=>{},title="提示",confirmText="确定",cancelText="取消"){    
    Alert.alert( title, msg,
        [
            {   
                text: cancelText, 
                onPress: () => {
                    cancCB();
                },
                style: "cancel"
            },
            { 
                text: confirmText, 
                onPress: () => {
                    confirmCB();
                },
                style : "destructive"
            }
        ]
    );
}

// alert 提示
UI.alert    = function(msg, title="提示", btntext="确定",sureCB = null){
    Alert.alert( title, msg,
        [
            {   
                text: btntext, 
                onPress: () => {
                    sureCB && sureCB();
                }
            },
        ]
    );
}

// toast 提示
UI.toast    = function(msg,time=1500,callback = () => {}){
    global.toastCompos && global.toastCompos.show(msg,1000,callback);
}



export {
    UI as $ui
}


