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

const {getUserList} = api;
export default class App extends React.Component {
  state = {
    userList: [],
    flag: 0,
    isHave: false,
    totalPage:0,
    count:1
  };
  componentDidMount() {
    // this._navListener = this.props.navigation.addListener('focus', () => {
        const {flag}=this.props.route.params
        this.getUser(1, flag==1?1:0).then((value) => {
            if(flag==1){
                this.setState({
                    userList: value.arr,
                    totalPage:value.totalPage,
                    flag:1,
                  });
            }
            else{
                this.setState({
                    userList: value.arr,
                    flag:0,
                    isHave:value.arr.length!=0,
                    totalPage:value.totalPage,

                  });
            }
        
          });
    // })
   
  }
  getUser = (pageNum, status) => {
    return $ajax({
      url: getUserList,
      data: {
        args: {status: status},
        pageNum: pageNum,
        pageSize: 10,
      },
      _this: this,
    }).then((value) => {
      let arr = [];
      let totalPage=0;
      if (value.code == 200) {
        const {list} = value.data;
        arr = list.map((item) => ({
          id: item.id,
          username: item.username,
          mobile: item.mobile,
          email: item.email,
          groupName: status == 1 ? item.groupName : '',
          roleName: status == 1 ? item.role.name : '',
        }));
        totalPage=value.data.totalPage
        console.log(pageNum)
        console.log(totalPage)
        console.log(arr)
      }
      return {arr,totalPage};
    });
  };
  getIndex = (index) => {
    this.getUser(1, index).then((value) => {
      if (index == 0 && value.arr.length != 0) {
        this.setState({
          userList: value.arr,
          flag: index,
          isHave:true,
          totalPage:value.totalPage,
          count:1
        });
      } else {
        this.setState({
          userList: value.arr,
          flag: index,
          totalPage:value.totalPage,
          count:1
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
        this.getUser(this.state.count + 1,this.state.flag).then((data) => {
          let col = this.state.userList;
          let c = this.state.count;
          this.setState(
            {
              userList: col.concat(data.arr),
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
    const {userList, isHave} = this.state;
    return (
      <>
        <UiHeader
          title="人员管理"
          onBack={() => {
            $fns.route({
              context: this,
              type: 'popTop',
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
        {userList.length != 0 ? (
          <FlatList
            style={{padding: 12}}
            data={userList}
            onMomentumScrollEnd={this._contentViewScroll}
            renderItem={({item, index}) => {
              return (
                <ImageBackground
                  resizeMode="stretch"
                  style={{
                    width: '100%',
                    height: 140,
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
                            ? 'dm_PersonManageVerify'
                            : 'dm_PersonManageInfo',
                        params: {itemInfo: item, flag: this.state.flag},
                      });
                    }}>
                    <ArrowPane style={{backgroundColor: 'rgba(0,0,0,0)'}}>
                      <MsgRow
                        title="用户名："
                        msg={item.username}
                        border={false}
                        align="left"
                        rowHeight={30}
                      />

                      <MsgRow
                        title="手机号："
                        msg={item.mobile}
                        border={false}
                        align="left"
                        rowHeight={30}
                      />

                      <MsgRow
                        title="邮箱："
                        msg={item.email}
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
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>暂无人员信息</Text>
          </View>
        )}
      </>
    );
  }
}

let ss = StyleSheet.create({
  msgBox: {borderRadius: 6, padding: 20, paddingRight: 6},
  msgArrow: {position: 'absolute', right: 10, top: '50%'},
});
