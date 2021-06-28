import {$fns}   from "./utils/fns";
import {$ajax}  from "./utils/utils.fetch";
import {$ui}    from "./utils/utils.ui";
import {api}from "./services/services.api";
let $myTheme = {
    mainBlue : "#1c83c6",
    mainGray : "#777",
    mainBgGray: "#f6f6f6"
}

let $source = {
    //url:"http://121.36.226.216",
    url:'https://platform.yaweicloud.com',
    bundleId    : "com.ywcc.mobileApp",
    checkVersion : 0 //0:非强制更新 2:强制更新 (发布前注意修改)
}
export {$fns, $ajax,  $myTheme, $ui, $source,api };