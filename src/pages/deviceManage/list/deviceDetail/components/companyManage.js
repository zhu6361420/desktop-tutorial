import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  FlatList,
} from 'react-native';

import {
  UiHeader,
  IconFont,
  UiTabs,
  MsgRow,
  ArrowPane,
} from '../../../../../global.components';
import {$fns, $myTheme, $source, $ajax, api} from '../../../../../global.utils';

const {getApproveList,getAllCompany} = api;
export default class App extends React.Component {
  state = {
    companyList: [],
    flag: 0,
    isHave: false,
    count:1,
    totalPage:0
  };
  componentDidMount() {
    this._navListener = this.props.navigation.addListener('focus', () => {
      this.getUser(1,this.state.flag==0?1:0).then((value) => {
        this.setState({
          companyList: value.arr,
          totalPage:value.totalPage,
          isHave: this.state.flag==0&&value.arr.length != 0,
        });
      });
    })

  }
  getUser = (pageNum, status) => {
    let args =
      status == 0
        ? {startTime: '', endTime: '', name: '', status: null}
        : {
            startTime: '',
            endTime: '',
            name: '',
          };
    return $ajax({
      url: status == 0?getAllCompany:getApproveList,
      data: {
        args: args,
        pageNum: pageNum,
        pageSize: 10,
      },
      _this: this,
    }).then((value) => {
      let arr = [];
      let totalPage;
      if (value.code == 200) {
        const {list} = value.data;
        arr = list;
        totalPage=value.data.totalPage;
      }
      return {arr,totalPage};
    });
  };
  getIndex = (index) => {   
    let status = index == 0 ? 1 : 0;
    this.getUser(1, status).then((value) => {
      if (index == 0 && value.arr.length != 0) {
        this.setState({
          companyList: value.arr,
          flag: index,
          isHave: true,
        });
      } else {
        this.setState({
          companyList: value.arr,
          totalPage:value.totalPage,
          flag: index,
        });
      }
    });
  };
  _contentViewScroll = (e) => {
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度

    if (offsetY + oriageScrollHeight+10 >= contentSizeHeight) {
      if (this.state.count < this.state.totalPage) {
        this.getUser(this.state.count + 1,0).then((data) => {
          let col = this.state.companyList;
          let c = this.state.count;
          this.setState(
            {
              companyList: col.concat(data.arr),
              count: c + 1,
            },
          );
        });
      }
    } else if (offsetY + oriageScrollHeight <= 1) {
      //这个是没有数据了然后给了false  得时候还在往上拉
    } else if (offsetY == 0) {
      //这个地方是下拉刷新，意思是到顶了还在指行，可以在这个地方进行处理需要刷新得数据
    }
  };
  render() {
    const {companyList, isHave} = this.state;
    return (
      <>
        <UiHeader
          title="公司管理"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'back',
            });
          }}
        />

        <View
          style={{
            paddingLeft: '25%',
            paddingRight: '25%',
            backgroundColor: '#fff',
          }}>
          <UiTabs
            datas={[
              {title: '待审核', dot: isHave},
              {title: '已审核', dot: false},
            ]}
            curTabIndex={this.state.flag}
            onChange={(index) => {
              this.getIndex(index);
            }}
          />
        </View>
        {companyList.length != 0 ? (
          <FlatList
            style={{padding: 12}}
            data={companyList}
            renderItem={({item, index}) => {
              return (
                <ImageBackground
                  resizeMode="stretch"
                  style={{
                    width: '100%',
                    height: 160,
                    marginBottom: 20,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    style={[ss.msgBox]}
                    onPress={() => {
                      $fns.route({
                        context: this,
                        routeName:
                          this.state.flag == 0
                            ? 'dm_CompanyManageVerify'
                            : 'dm_CompanyManageInfo',
                        params: {itemInfo: item, flag: this.state.flag},
                      });
                    }}>
                    <ArrowPane style={{}}>
                      <MsgRow
                        title="公司名："
                        msg={item.name}
                        border={false}
                        align="left"
                        rowHeight={30}
                      />

                      <MsgRow
                        title="联系人："
                        msg={item.admin.username}
                        border={false}
                        align="left"
                        rowHeight={30}
                      />

                      <MsgRow
                        title="手机号："
                        msg={item.admin.mobile}
                        border={false}
                        align="left"
                        rowHeight={30}
                      />

                      <MsgRow
                        title="邮箱："
                        msg={item.admin.email}
                        border={false}
                        align="left"
                        rowHeight={30}
                      />
                      <MsgRow
                        title="提交审核时间："
                        msg={item.createTime}
                        border={false}
                        align="left"
                        rowHeight={30}
                      />
                    </ArrowPane>
                  </TouchableOpacity>
                </ImageBackground>
              );
            }}
            keyExtractor={(item, index) => 'xx_' + index}
            onMomentumScrollEnd={this._contentViewScroll}
            

          />
        ) : (
          <View
            style={{
              flex: 1,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>暂无公司信息</Text>
          </View>
        )}
      </>
    );
  }
}

let ss = StyleSheet.create({
  msgBox: {borderRadius: 6, padding: 20,paddingTop:20, paddingRight: 6},
  msgArrow: {position: 'absolute', right: 10, top: '50%'},
});
