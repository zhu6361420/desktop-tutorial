const api={
login:'/auth/user/login4App',
sendResetPassword:'/auth/sms/sendResetPassword',//发送重置密码验证码
resetPassword:'/auth/user/resetPassword',//重置密码
countUser:'/auth/user/countUser',//用户数量
find:'/ems/sandtable/find',//首页信息
register:'/auth/user/register',//公司注册
registerIndividual:'/auth/user/registerIndividual',//个人注册

getDeviceTag:'/auth/push/getDevice',//获取设备Tag
updateTag:'/auth/push/updateTag',//增加tag
findMsgByPage:'/auth/message/findMsgByPage',//消息列表
countUnReadMsg:'/auth/message/countUnReadMsg',//是否有新消息
readOneMsg:'/auth/message/readOneMsg',//读消息
readAllMsg:'/auth/message/readAllMsg',//一键已读
findRecordByPage:'/ems/controlPlc/findRecordByPage',//秘钥申请列表
checkRecord:'/ems/controlPlc/checkRecord',//审核
curingFindByPage:'/ems/maintenance/findByPage',//养护计划列表
alarmCurrent:'/ems/alarmCurrent/paging',//当前报警
getMachineLists:'/ems/machine/findByPageForReal',//获取设备列表
getMachineType:'/ems/deviceType/findMachines',//查找设备类型
getAlarmList:'/ems/alarmCurrent/paging',//查找报警列表
getUserList:'/auth/user/findByPage',//人员列表
getGroup:'/auth/group/findByFirm',//分组列表
getRole:'/auth/role/findByFirm',//角色列表
activate:'/auth/user/activate',//激活用户
getAlramDetail:'/ems/alarmCurrent/details',//报警详情
resolve:'/ems/alarmCurrent/resolve',//标注已解决
getRepairList:'/ems/repair/findByPage',//报修列表
getRepaiDetail:'/ems/repair/find/',//报修详情
createRepair:'/ems/repair/create',//创建报修
//设备详情
getMachineStatus:'/ems/statement/findMachineOperationOverview',//设备状态
getJiaDong:'/ems/statement/findMachineWorkingRatio',//有效运行率
getFuHe:'/ems/statistics/findPieceCount',//设备负荷
getWeekly:'/ems/statistics/findCompanyDataWeek',//一周小结
getBendFuHe:'/ems/machineBend/findBend',//折弯负荷
getMaintainCompelteRate:'/ems/maintenance/findMaintainCompelteRate',//养护完成率及未完成次数
getChiLunHealth:'/epm/predict/findComponentsHealth',//齿轮齿条健康
AlarmLevel:'/ems/alarmCurrent/countUnresolveAlarmToday',//报警等级
getStockList:'/ems/sparePart/findByPageForFirmAdmin',//备品备件库存
consumeSpare:'/ems/sparePart/updateConsumForFirmAdmin',//备品备件消耗
getEveryMonthElectric:'/energy/energyData/findEnergycData',//每月能耗
getPdfList:'/ems/electronic/findByPage',//pdf列表
getWorkRation:'/ems/machine/findMachineWorkingRatioHistory',//设备有效运行率
getMaintainDetail:'/ems/maintenance/find',//查找养护详情
getContent:'/ems/maintenance/findContent',//查找养护内容
updateMaintain:'/ems/maintenance/update',//处理养护
getRunStatus:'/ems/deviceMonitor/findDeviceOperating',//运行时序
getFuheDetail:'/ems/deviceMonitor/findDeviceProduction',//负荷详情
JiaDongStatistic:'/ems/statistics/findWorkingRatioStatistics',//设备有效运行率统计雷达图
getFirmEnery:'/ems/energyData/findFirmEnery',//公司日能耗
gerEnergyDailyTop:'/ems/energyData/findEnergyDailyTop',//今日排行
getMaintainCompelteNum:'/ems/maintenance/findMaintainCompelteNum',//养护完成数
createMaintain:'/ems/mcomment/create',//创建留言
getCommentByPage:'/ems/mcomment/findCommentByPage',//查询留言
batchMaintenance:'/ems/maintenance/batchMaintenance',//批量处理
getMonthWorkingRadio:'/ems/statistics/findMachineAvgMonthlyWorkingRatio',//查询公司每月平均有效运行率
getDayWorkingRadio:'/ems/statistics/findMachineAvgWorkingRatio',//查询公司每日平均有效运行率
getDeviceTypeRadio:'/ems/statistics/findWorkingRatioByDeviceTypeAvg',//设备类型有效运行率
getTopJiaDong:'/ems/statistics/findDurationDaily',
getAlarmTypeSummary:'/ems/alarmCurrent/findAlarmTypeSummary',//设备类型报警
getFirmAlarmTop:'/ems/machine/findFirmAlarmOrder',//公司前十报警
//公司审核
getApproveList:'/auth/firm/findApprovingListByPage',//公司审核列表
getAllCompany:'/auth/firm/findApprovedListByPage',//查找全部公司
getFirmList:'/auth/firm/findFuzzyApprovedByFirmName',//模糊查询公司
getGroupList:'/auth/group/findByPage',//部门列表
createMessage:'/auth/message/createMessage',//创建反馈
getMenus:'/auth/app/findTree',//查找菜单
getFirmMenu:'/auth/firm/find',
getVersion:'/auth/versionManage/findVersion',//查找app版本
updateApp:'/auth/firm/approve',//更新公司APP
updateCompany:'/auth/firm/update',//更新公司信息
getYearJiaDong:'/ems/statistics/findDurationMonth',//设备年有效运行率统计
//ios
iosUpdateUrl:'https://itunes.apple.com/lookup?bundleId=',//更新地址
//获取小程序
getMinProgram:'/auth/miniPro/findMiniProgramsList',
//获取解决方案
getSolution:'/craft/iinfo/find',

//能耗管理
getDeviceAndFirmInEnergyApp:'/energy/EnergyPrice/getDeviceAndFirmInEnergyApp',//接入设备和公司总数
getMachineEnergeList:'/energy/EnergyPrice/getMachineConsumeRangeWithDate',//设备能耗列表、
// getFirmEneryTop:'/energy/energyData/findEnergyShowData',//公司能耗排行
getFirmEneryTop:'/energy/EnergyPrice/getFirmConsumeRangeWithDate',//公司能耗排行
getDeviceTypeConsume:'/energy/EnergyPrice/getDeviceTypeConsumeData',//设备类型平均能效
getEnergyByYear:'/energy/energyData/findEnergycDataByYear',//近三年能耗
getNumberType:'/energy/EnergyPrice/getNumberOfType',//电价配置分布
getEveryDayEnergy:'/energy/newGateway/findEnergycData',//单台设备每日能耗
getEveryCharge:'/energy/EnergyPrice/getConsumeWithDate',//单台设备每日电费
getEveryElectric:'/energy/newGateway/findElectricData',//单台设备电流
getFirmEnergyDetail:'/energy/EnergyPrice/getDFirmDetailInEnergyApp',//企管查看接入天数和当月
getConsumeMonth:'/energy/EnergyPrice/getConsumeWithDateMonth',//月电费统计
getConsumeYear:'/energy/EnergyPrice/getConsumeWithDateYear',//年电费统计
getConsumeWithDateDailyForAll:'/energy/EnergyPrice/getConsumeWithDateDailyForAll',//公司月度电费每日统计
// getMachineEnergeList'/energy/EnergyPrice/getMachineConsumeRangeWithDate',//设备列表

getInvitationCode:'/auth/user/getInvitationCode',//获取邀请码

findByPageForRealEquals:'/ems/machine/findByPageForRealEquals',//二维码
createFeedback:'/ems/repair/createFeedback',
createMessageNoToken:'/auth/message/createMessageNoToken',
}
export {api}