import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Button,
  TextInput,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import UiImageUpload from '../../../../components/UiImageUpload';
import {
  IconFont,
  UiHeader,
  UiTabs,
  MsgPane,
  MsgRow,
  ArrowPane,
  MsgPaneS2,
  MyButton,
  FormItem,
  UiDateTimePicker,
  UiGap,
  
} from '../../../../global.components';
import {$myTheme, api, $ui, $ajax} from '../../../../global.utils';
import {$fns} from '../../../../utils/fns';
import {maintainTypeOption} from '../../../../utils/data';
import moment from 'moment';
import {default as CityPicker} from '../../../../components/picker/index';
const {
  curingFindByPage,
  getRepairList,
  getRepaiDetail,
  createRepair,
  batchMaintenance,
} = api;
// 确认框
function Confirm(props) {
  let {isShow = false, onClose = () => {}, onOK = () => {}} = props;

  return (
    <Modal
      visible={isShow}
      transparent
      statusBarTranslucent
      animationType="fade"
      title="消耗量">
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}>
        <View
          style={{
            width: $fns.getWindowWidth() - 60,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 20,
            borderRadius: 4,
          }}>
          <View
            style={{
              paddingHorizontal: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../../../assets/imgs/icon_confirm.png')}
              style={{width: 160, height: 160}}
            />
            <View style={{paddingHorizontal: '10%'}}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#444',
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                您确认多个养护计划标注为已处理么？
              </Text>
            </View>
          </View>

          <View
            style={{
              borderTopColor: '#eee',
              borderTopWidth: 0.5,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                height: 50,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                onClose();
              }}>
              <Text style={{fontSize: 15}}>取消</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 50,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderLeftWidth: 0.5,
                borderLeftColor: '#eee',
              }}
              onPress={() => {
                onOK();
              }}>
              <Text style={{fontSize: 15, color: $myTheme.mainBlue}}>确认</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// 成功提示
function SuccessTips(props) {
  let {isShow = false, onClose = () => {}} = props;

  return (
    <Modal visible={isShow} transparent statusBarTranslucent>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />

        <View
          style={{
            width: $fns.getWindowWidth() - 60,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            borderRadius: 4,
          }}>
          <Image
            source={require('../../../../assets/imgs/icon_ok.png')}
            style={{width: 160, height: 160}}
          />
          <Text
            style={{fontSize: 20, color: $myTheme.mainBlue, marginBottom: 10}}>
            报修成功
          </Text>
          <TouchableOpacity onPress={() => onClose()}>
            <Text style={{fontSize: 15, color: '#eaa41e'}}>查看报修列表</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default class App extends React.Component {
  state = {
    curTabIndex: 0,
    isShowSuccess: false,
    isShowConfirm: false,
    maintainList: [],
    totalPage: 0,
    totalPages:0,
    indexCol: [],
    idCols: [],
    isShow: false,
    repairList: [],
    picList: [],
    name: '',
    description: '',
    errDate: null,
    count: 1,
    counts: 1,
    selectCityName:''
  };
  componentDidMount() {
    const {id, sequence, deviceTypeId} = this.props.route.params;
    $ajax({
      url: getRepairList,
      data: {
        args: {
          creatorId: null,
          deviceTypeId: null,
          endTime: null,
          machineSequence: sequence,
          ownerId: null,
          repairId: null,
          startTime: null,
          dataSource:0
        },
        pageNum: 1,
        pageSize: 10,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        const {list, totalPage} = value.data;
        const arr = list.map((item) => ({
          id: item.id,
          repairId: item.repairId,
          deviceComponentName: item.deviceComponentName,
          creator: item.creator,
          occurredTime: item.occurredTime,
          createTime:item.createTime,
          maintenanceStatusCode:item.maintenanceStatusCode,
          maintenanceStatusDesc: item.maintenanceStatusDesc,
        }));
        this.setState({
          repairList: arr,
          totalPage: totalPage,
        });
      }
    });
    $ajax({
      url: curingFindByPage,
      data: {
        args: {
          machineSequence: sequence,
        },
        pageNum: 1,
        pageSize: 10,
      },
      hasLoading: true,
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let {list, totalPage} = value.data;
        let idCols=[];
        if(list.length!=0){
          list.map((item) =>{
            if(item.status==0){
              idCols.push(item.id)
            }
          })
        }
        this.setState({
          maintainList: list,
          idCols: idCols,
          totalPages: totalPage,
        });
      }
    });
    // this.getMaintainList(sequence).then();
  }
  getReparList = (pageNum) => {
    const {id, sequence, deviceTypeId} = this.props.route.params;
    return $ajax({
      url: getRepairList,
      data: {
        args: {
          machineSequence: sequence,
          dataSource:0
        },
        pageNum: pageNum,
        pageSize: 10,
      },
      _this: this,
    }).then((value) => {
      let arr = [];
      if (value.code == 200) {
        const {list, totalPage} = value.data;
        arr = list.map((item) => ({
          id: item.id,
          repairId: item.repairId,
          deviceComponentName: item.deviceComponentName,
          creator: item.creator,
          // occurredTime: item.occurredTime,
          maintenanceStatusCode:item.maintenanceStatusCode,
          createTime:item.createTime,
          maintenanceStatusDesc: item.maintenanceStatusDesc,
        }));
      }
      return arr;
    });
  };

  getMaintainList = (pageNum) => {
    const {id, sequence, deviceTypeId} = this.props.route.params;
   return $ajax({
      url: curingFindByPage,
      data: {
        args: {
          machineSequence: sequence,
        },
        pageNum: pageNum,
        pageSize: 10,
      },
      hasLoading: true,
      _this: this,
    }).then((value) => {
      let arr = [];
      let idCols=[]
      if (value.code == 200) {
        let {list, totalPage} = value.data;
        if(list.length!=0){
          list.map((item) =>{
            if(item.status==0){
              idCols.push(item.id)
            }
          })
        }      
        arr=list;
        // this.setState({
        //   maintainList: list,
        //   idCols: idCols,
        //   // totalPage: totalPage,
        // });
      }
      return {arr,idCols};
    });
  };
  selectRows = (id) => {
    let col = this.state.indexCol;
    if (col.indexOf(id) == -1) {
      col.push(id);
    } else {
      col.splice(col.indexOf(id), 1);
    }
    this.setState({
      indexCol: col,
    });
  };
  showDetail = (id) => {
    $ajax({
      url: getRepaiDetail,
      data: {
        __tailPath: id,
      },
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        let detail = value.data;
        console.log(detail)
        $fns.route({
          context: this,
          routeName: 'dm_RepairDetail',
          params: {
            id: detail.id,
          },
        });
      } else {
        $ui.toast('查询失败，请稍后重试');
      }
    });
  };
  submit = () => {
    const {id, sequence, deviceTypeId} = this.props.route.params;
    const {description, errDate,selectCityName, picList, name} = this.state;
    // if (name == '' || name == null) {
    //   return $ui.toast('请输入故障部件');
    // }
    // if (errDate == '' || errDate == null) {
    //   return $ui.toast('请选择故障发生时间');
    // }
    if (description == '' || description == null) {
      return $ui.toast('请输入故障描述');
    }
    if (selectCityName == '' || selectCityName == null) {
      return $ui.toast('请选择设备地址');
    }
    let formData = new FormData();
    
    formData.append('machineId', id);
    formData.append('deviceComponentName', name);
    formData.append(
      'occurredTime',
      moment().format('YYYY-MM-DD HH:mm:ss'),
    );
    formData.append('province', selectCityName.split(' ')[0]);
    formData.append('city', selectCityName.split(' ')[1]);

    formData.append('memo', description);
    formData.append('machineSequence', sequence);
    formData.append('transId', '');
    formData.append('dataSource', 1);
    picList.map((file, i) =>
      formData.append(`picFiles[${i}]`, {
        uri: file.path,
        type: 'image/jpeg',
        name: 'image.jpg',
      }),
    );
    $ajax({
      url: createRepair,
      data: {
        formData: formData,
      },
      _this: this,
      fm: true,
    }).then((value) => {
      if (value.code == 200) {
        this.setState({
          isShowSuccess: true,
        });
        this.setState({
          name: null,
          errDate: null,
          description: null,
          picList: [],
        });
        // $ui.toast(value.data);
      }
    });
  };
  close = () => {
    this.setState(
      {
        isShowSuccess: false,
        curTabIndex: 1,
      },
      () => {
        this.getReparList(1).then((data) => {
          this.setState({
            repairList: data,
            count: 1,
          });
        });
      },
    );
  };
  _contentViewScroll = (e) => {
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    if (offsetY + oriageScrollHeight + 10 >= contentSizeHeight) {
      if (this.state.count < this.state.totalPage) {
        this.getReparList(this.state.count + 1).then((data) => {
          let col = this.state.repairList;
          let c = this.state.count;
          this.setState({
            repairList: col.concat(data),
            count: c + 1,
          });
        });
      }
    }
  };
  _contentViewScrolls = (e) => {
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    if (offsetY + oriageScrollHeight + 10 >= contentSizeHeight) {
      if (this.state.counts < this.state.totalPages) {
        this.getMaintainList(this.state.counts + 1).then((data) => {
          let col = this.state.maintainList;
          let idcol=this.state.idCols;
          let c = this.state.counts;
          this.setState({
            maintainList: col.concat(data.arr),
            idCols:idcol.concat(data.idCols),
            counts: c + 1,
          });
        });
      }
    }
  };
  batchMaintenance = () => {
    const {id, sequence, deviceTypeId} = this.props.route.params;
    const {indexCol} = this.state;
    $ajax({
      url: batchMaintenance,
      data: indexCol,
      _this: this,
    }).then((value) => {
      if (value.code == 200) {
        this.setState({
          isShowConfirm: false,
          isShow: false,
          indexCol: [],
        });
        this.getMaintainList(1).then((data)=>{
            this.setState({
              maintainList: data.arr,
              idCols:data.idCols,
              counts:1,
            })
        });
        $ui.toast(value.data);
      }
    });
  };
  getMaintain = (item) => {
    const {id, sequence, deviceTypeId,deviceTypeName,outside} = this.props.route.params;
    $fns.route({
      context: this,
      type: outside?'replace':'push',
      routeName:
        item.status == 0 ? 'dm_MaintainMangeDone' : 'Dm_MaintainMangeDetail',
      params: {
        maintainDetail: item,
        deviceId: id,
        deviceSequence: sequence,
        deviceTypeId: deviceTypeId,
        deviceTypeName: deviceTypeName,
        outside:true
      },
    });
  };
  getColor(code){
    let color="";
     switch(code){
       case "-1":
        color= '#f50';
        break;
        case "0":
        color= '#2db7f5';
        break;
        case "1":
        color= '#108ee9';
        break;
        case "2":
        color= '#108ee9';
        break;
        case "3":
        color= '#108ee9';
        break;
        case "4":
        color= '#108ee9';
        break;
        case "5":
        color= '#87d068';
        break;
     }
     return color
  }
  render() {
    let {
      curTabIndex,
      isShowSuccess,
      maintainList,
      isShowConfirm,
      indexCol,
      isShow,
      idCols,
      name,
      description,
    } = this.state;
    const {id, sequence, deviceTypeName} = this.props.route.params;
    return (
      <>
        <UiHeader
          title="维修保养"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
          right={() => {
            return (
              <TouchableOpacity
                style={{
                  width: 44,
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  backgroundColor:
                    curTabIndex == 0 && maintainList.length != 0
                      ? '#0f6fa9'
                      : '#1c83c6',
                  // backgroundColor: '#207eb5',
                  borderRadius: 8,
                }}
                onPress={() => {
                  this.setState({
                    isShow: !this.state.isShow,
                    indexCol: [],
                  });
                }}>
                {curTabIndex == 0 && maintainList.length != 0 && (
                  <Text style={{color: 'white', fontSize: 15}}>
                    {isShow ? '取消' : '选择'}
                  </Text>
                )}
              </TouchableOpacity>
            );
          }}
        />
        <View style={{paddingHorizontal: 12, backgroundColor: '#fff'}}>
          <UiTabs
            datas={[
              {title: '养护列表'},
              {title: '报修列表'},
              {title: '在线报修'},
            ]}
            curTabIndex={this.state.curTabIndex}
            onChange={(e) => {
              this.setState({
                curTabIndex: e,
              });
            }}
          />
        </View>

        {curTabIndex == 0 && (
          <View style={{padding: 12, flex: 1}}>
            {maintainList.length == 0 ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 16}}>暂无养护信息</Text>
              </View>
            ) : (
              <ScrollView style={{flex: 1}}
              onMomentumScrollEnd={this._contentViewScrolls}>
                {maintainList.map((item, index) => (
                  <MsgPane
                    key={index}
                    title="设备编号"
                    title2={item.machineSequence}
                    bgSize={{width: 140, height: 100}}
                    style={{marginBottom: 10, borderRadius: 0}}
                    onPress={() => this.getMaintain(item)}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View style={{flex: 1}}>
                        <ArrowPane style={{backgroundColor: 'none'}}>
                          <MsgRow
                            title="养护类型："
                            msg={maintainTypeOption[item.type].label}
                            align="left"
                            border={false}
                            rowHeight={30}
                          />

                          <MsgRow
                            title="责任人："
                            msg={item.dutierName}
                            align="left"
                            border={false}
                            rowHeight={30}
                          />

                          <MsgRow
                            title="预计养护日期："
                            msg={item.maintainDate}
                            align="left"
                            border={false}
                            rowHeight={30}
                          />

                          <MsgRow
                            title="养护状态："
                            msg={item.status == 0 ? '待处理' : '已处理'}
                            msgColor={item.status == 0 ? '#fe4545' : '#35cc8a'}
                            align="left"
                            border={false}
                            rowHeight={30}
                          />
                        </ArrowPane>
                      </View>

                      <TouchableOpacity
                        onPress={() => this.selectRows(item.id)}>
                        {isShow&&item.status==0 ? (
                          indexCol.indexOf(item.id) != -1 ? (
                            <IconFont
                              icon={'\ue626'}
                              size={35}
                              color="#1c84c6"
                            />
                          ) : (
                            <IconFont
                              icon={'\ue61a'}
                              size={35}
                              color="#1c84c6"
                            />
                          )
                        ) : null}
                      </TouchableOpacity>
                    </View>
                  </MsgPane>
                ))}
              </ScrollView>
            )}
          </View>
        )}

        {curTabIndex == 1 && (
          <View style={{padding: 12, flex: 1}}>
            {this.state.repairList.length == 0 ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 16}}>暂无报修信息</Text>
              </View>
            ) : (
              <ScrollView
                style={{flex: 1}}
                onMomentumScrollEnd={this._contentViewScroll}>
                {this.state.repairList.map((item, index) => (
                  <MsgPane
                    key={index}
                    title="流水号"
                    title2={item.repairId==null?'暂无':item.repairId}
                    onPress={() => this.showDetail(item.id)}>
                    <ArrowPane>
                      {item.deviceComponentName!=''&&(
                        <MsgRow
                        title="故障部件："
                        msg={item.deviceComponentName}
                        border={false}
                        align="left"
                        rowHeight={30}
                      />
                      )}

                      <MsgRow
                        title="报修人："
                        msg={item.creator}
                        border={false}
                        align="left"
                        rowHeight={30}
                      />

                      <MsgRow
                        title="报修时间："
                        msg={item.createTime}
                        border={false}
                        align="left"
                        rowHeight={30}
                      />

                      <MsgRow
                        title="当前状态："
                        msg={item.maintenanceStatusDesc}
                        border={false}
                        align="left"
                        rowHeight={30}
                        msgColor={this.getColor(item.maintenanceStatusCode)}
                      />
                    </ArrowPane>
                  </MsgPane>
                ))}
              </ScrollView>
            )}
          </View>
        )}

        {curTabIndex == 2 && (
          <>
            <ScrollView
              style={{flex: 1, backgroundColor: '#fafafa', paddingTop: 12}}>
              <View
                style={{
                  paddingLeft: 12,
                  paddingRight: 12,
                  backgroundColor: '#fff',
                }}>
                <FormItem
                  title="设备编号"
                  slot={
                    <View style={[ss.formMain]}>
                      <Text style={[ss.formTxt]}>{sequence}</Text>
                    </View>
                  }
                />
                <FormItem
                  title="设备地址"
                  slot={
                    <TouchableOpacity
                      style={[ss.formMain]}
                      onPress={() => {
                        this.refs.locationCompos.pickerType();
                      }}>
                      <Text>
                        {this.state.selectCityName ? this.state.selectCityName : '请选择地址'}
                      </Text>
                      <IconFont icon={'\ue621'} size={16} color="#999" />
                    </TouchableOpacity>
                  }
                />
                <FormItem
                  title="设备型号"
                  slot={
                    <View style={[ss.formMain]}>
                      <Text style={[ss.formTxt]}>{deviceTypeName}</Text>
                    </View>
                  }
                />

                <FormItem
                  title="设备部件"
                  slot={
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        height: 40,
                      }}>
                      <TextInput
                        style={{
                          flex: 1,
                          fontSize: 15,
                          textAlign: 'right',
                          color: '#777',
                        }}
                        value={name}
                        placeholder="请输入故障部件"
                        onChangeText={(res1) => {
                          this.setState({
                            name: res1,
                          });
                        }}
                      />
                    </View>
                  }
                />
              </View>

              <UiGap />

              <View
                style={{
                  paddingLeft: 12,
                  paddingRight: 12,
                  backgroundColor: '#fff',
                }}>
                {/* <FormItem
                  title="故障时间"
                  slot={
                    <TouchableOpacity
                      style={[ss.formMain]}
                      onPress={() => {
                        this.refs.dateTimeRef.show();
                      }}>
                      <Text>
                        {this.state.errDate ? this.state.errDate : '请选择时间'}
                      </Text>
                      <IconFont icon={'\ue621'} size={16} color="#999" />
                    </TouchableOpacity>
                  }
                /> */}

                <View
                  style={{
                    paddingTop: 12,
                    paddingBottom: 12,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#ddd',
                  }}>
                  <Text style={{fontSize: 15, marginBottom: 6}}>故障描述</Text>
                  <TextInput
                    placeholder="请描述故障情况，200字内"
                    multiline={true}
                    onChangeText={(res) => {
                      this.setState({
                        description: res,
                      });
                    }}
                    value={description}
                    style={{
                      width: '100%',
                      height: 80,
                      padding: 10,
                      backgroundColor: '#f4f4f4',
                      textAlignVertical: 'top',
                    }}
                  />
                </View>

                <View style={{paddingBottom: 10}}>
                  <UiImageUpload
                    onDone={(res) => {
                      // 成功上传回调上传成功的数据
                      this.setState({
                        picList: res,
                      });
                    }}
                  />
                  <Text style={{fontSize: 13, color: '#666', marginTop: 8}}>
                    请上传故障现场图片，图片大小不能超过10M，数量不能超过5张
                  </Text>
                </View>
              </View>

              <MyButton onPress={this.submit} title="发送" />
            </ScrollView>

            {/* <UiDateTimePicker
              min="2018"
              ref="dateTimeRef"
              currentDate={this.state.errDate}
              onComfirm={(e) => {
                this.setState({
                  errDate: e,
                });
              }}
            /> */}
            {/** 日历面板  */}
          </>
        )}

        {curTabIndex == 0 && isShow && (
          <View
            style={{
              height: 50,
              backgroundColor: '#fff',
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: 20,
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    indexCol: indexCol.length == 0 ? idCols : [],
                  });
                }}>
                {indexCol.length == 0 ? (
                  <IconFont icon={'\ue61a'} size={24} color="#1c84c6" />
                ) : (
                  <IconFont icon={'\ue626'} size={24} color="#1c84c6" />
                )}
              </TouchableOpacity>
              <Text style={{paddingLeft: 4, fontSize: 16}}>
                全选（{indexCol.length}）
              </Text>
            </View>

            <TouchableOpacity
              style={{
                paddingHorizontal: 6,
                paddingVertical: 6,
                backgroundColor: '#1c84c6',
                borderRadius: 4,
              }}
              onPress={() => {
                this.setState({
                  isShowConfirm: true,
                });
              }}>
              <Text style={{color: '#fff', fontSize: 15}}>批量处理</Text>
            </TouchableOpacity>
          </View>
        )}
        {/** footer */}

        <SuccessTips isShow={isShowSuccess} onClose={this.close} />
        {/** 成功对话框 */}

        <Confirm
          isShow={isShowConfirm}
          onOK={this.batchMaintenance}
          onClose={() => {
            this.setState({
              isShowConfirm: false,
            });
          }}
        />
         <CityPicker
          ref="locationCompos"
          title="企业所在省市"
          cback={(data) => {
            this.setState({
              selectCityName: data,
            });
          }}
          type="provincialUrban"
        />
        {/** 确认对话框 */}
      </>
    );
  }
}
let ss = StyleSheet.create({
  formMain: {
    height: 40,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  formTxt: {fontSize: 16, color: '#777'},
});
