import Home             from "../pages/home";
import Application      from "./../pages/application";
import Me               from "./../pages/me";

import Login            from "./../pages/login/login";
import Error_400 from "../pages/exception/400";
import Error_401 from "../pages/exception/401";
import Error_403 from "../pages/exception/403";
import Error_404 from "../pages/exception/404";
import Error_500 from "../pages/exception/500";
import Transition from "../pages/exception/transition";
import Error_intenet from "../pages/exception/intenet_error";
import WelCome from "../pages/welcome/index";
import RegisterStep1    from "./../pages/login/register_step1";
import RegisterStep2    from "./../pages/login/register_step2";
import ForgetStep1      from "./../pages/login/forget_step1";
import ForgetStep2      from "./../pages/login/forget_step2";

import My_AccountType   from "../pages/me/accountType";

import My_Aboutus        from "./../pages/me/aboutus";
import My_BaseInfo       from "./../pages/me/baseInfo";
import Privacy           from "./../pages/me/privacy";
import Userservice       from "./../pages/me/userservice";
import My_Feeback        from "./../pages/me/feeback";
import My_IndustryType   from "./../pages/me/industryType";
import My_Share          from "./../pages/me/share";
import My_Yaoqing          from "./../pages/me/yaoqingma";
import DmNewIndex          from "./../pages/deviceManage/home/home";
import DmIndex          from "./../pages/deviceManage/index";
import DmHome           from "./../pages/deviceManage/home/index";
import DmSuperHome           from "./../pages/deviceManage/home/super_index";
import DmHome_WarnHandleDetail     from "./../pages/deviceManage/list/deviceDetail/components/warnManageDetail";
import DmList           from "./../pages/deviceManage/list";

import Dm_PersonManage    from "./../pages/deviceManage/list/deviceDetail/components/personManage";
import Dm_CompanyManage    from "./../pages/deviceManage/list/deviceDetail/components/companyManage";
import repairFeeback   from "./../pages/deviceManage/list/deviceDetail/components/repairFeeback";
import Dm_PersonManageInfo    from "./../pages/deviceManage/list/deviceDetail/components/personManageInfo";
import Dm_PersonManageVerify   from "./../pages/deviceManage/list/deviceDetail/components/personManageVerify";
import Dm_CompanyManageVerify   from "./../pages/deviceManage/list/deviceDetail/components/companyManageVerify";
import Dm_CompanyManageInfo    from "./../pages/deviceManage/list/deviceDetail/components/companyManageInfo";
import Weekly    from "./../pages/deviceManage/list/deviceDetail/components/weekly";
import Dm_WarnManage    from "./../pages/deviceManage/list/deviceDetail/components/warnManage";
import Dm_RepairManage    from "./../pages/deviceManage/list/deviceDetail/components/repairManage";
import Dm_Repair    from "./../pages/deviceManage/list/Repair/index";
import Dm_de    from "./../pages/deviceManage/list/deviceDetail/components//spareList";
import Dm_RepairDetail    from "./../pages/deviceManage/list/deviceDetail/components/repairDetail";
import Dm_MaintainMange    from "./../pages/deviceManage/list/deviceDetail/components/maintainMange";
import Dm_MaintainMangeDetail    from "./../pages/deviceManage/list/deviceDetail/components/maintainMangeDetail";
import Dm_MaintainMangeDone    from "./../pages/deviceManage/list/deviceDetail/components/maintainMangeDone";
import FuheDetail        from "./../pages/deviceManage/list/deviceDetail/components/fuheDetail";
import benderFuHeDetail        from "./../pages/deviceManage/list/deviceDetail/components/benderFuHeDetail";
import DeviceDetail      from "./../pages/deviceManage/list/deviceDetail";
import JiadongDetail     from "./../pages/deviceManage/list/deviceDetail/components/jiadongDetail";
import WorkDetail        from "./../pages/deviceManage/list/deviceDetail/components/workDetail";
import Webview              from "./../pages/home/components/webview";
import Modalinfo              from "./../pages/home/components/modalinfo";
import MessageDetail              from "./../pages/home/components/messageDetail";
import Solution              from "./../pages/home/components/solution";
import Pdf                  from "./../pages/deviceManage/list/deviceDetail/components/pdf";
//-----能耗管理-----
import Energy_SuperHome from "../pages/energyManage/home/super_index"
import Energy_Home from "../pages/energyManage/home/index"
import Energy_index from "../pages/energyManage/index"
import Energy_list from "../pages/energyManage/list"
import Energy_detail from "../pages/energyManage/list/energyDetail/index"
import Energy_extra from "../pages/energyManage/home/extra/adminMore";
import Energy_more from "../pages/energyManage/home/extra/more";
import Statis_more from "../pages/energyManage/home/extra/statisMore";

import Health_Home from "../pages/deviceHealth/home/index";
import Health_index from "../pages/deviceHealth/index"
import Health_list from "../pages/deviceHealth/list";
import Baoyang from "../pages/deviceHealth/component/baoyang";
import Jinji from "../pages/deviceHealth/component/jinji";
import Shukong from "../pages/deviceHealth/component/shukong";
import Guzhangpaicha from "../pages/deviceHealth/component/guzhangpaicha";
import GuzhangDetail from "../pages/deviceHealth/component/guzhangDetail";
import DeviceHealthDetail from "../pages/deviceHealth/list/deviceDetail/index";
import Baoyanggenzong from "../pages/deviceHealth/list/deviceDetail/component/baoyanggenzong";
import Shukongjiance from "../pages/deviceHealth/list/deviceDetail/component/shukongjiance";
import Jinjibaojing from "../pages/deviceHealth/list/deviceDetail/component/jinjibaojing";

import Remote_index from "../pages/remoteService/index";

import Remote_List from "../pages/remoteService/list/index";
import Remote_Vertify from "../pages/remoteService/list/index";





export {
    Remote_List,Remote_Vertify, Remote_index,  Health_Home,Health_index ,Health_list ,Baoyang,Jinji,Shukong, Guzhangpaicha,GuzhangDetail,DeviceHealthDetail,Baoyanggenzong,Shukongjiance,Jinjibaojing
}
export { 
    Home, Application, Me,repairFeeback,
    Login,Transition, Error_400,Error_401,Error_403,Error_404,Error_500,Error_intenet,WelCome,RegisterStep1, RegisterStep2, ForgetStep1, ForgetStep2,
    DmIndex,DmNewIndex,Weekly,
    DmHome,DmSuperHome, DmHome_WarnHandleDetail,
    DmList, Dm_PersonManage,Dm_CompanyManage,Dm_CompanyManageInfo, Dm_PersonManageInfo,Dm_CompanyManageVerify, Dm_PersonManageVerify, Dm_WarnManage, Dm_RepairManage,Dm_RepairDetail,
    Dm_MaintainMange,Dm_MaintainMangeDetail,Dm_MaintainMangeDone,
    Dm_Repair,Dm_de,
    My_AccountType, My_Aboutus, My_BaseInfo,Privacy,Userservice,My_Feeback, My_IndustryType,My_Share,My_Yaoqing,
    DeviceDetail,FuheDetail,JiadongDetail,WorkDetail,benderFuHeDetail, Webview,Modalinfo,Solution,MessageDetail, Pdf,Energy_SuperHome,Energy_Home,Energy_index,Energy_list,Energy_detail,Energy_extra,Energy_more,Statis_more
}
