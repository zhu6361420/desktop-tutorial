import React from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {IconFont, UiHeader} from '../../../global.components';
import {$myTheme, $ajax, api} from '../../../global.utils';
import {$fns} from '../../../utils/fns';
import moment from 'moment';
import {StyleSheet} from 'react-native';
const {findMsgByPage, readAllMsg,readOneMsg} = api;
const imgs = {
  '001': {url: require('../../../assets/imgs/01.png'), color: '#8f82bc'},
  '002': {url: require('../../../assets/imgs/05.png'), color: '#f1b550'},
  '003': {url: require('../../../assets/imgs/04.png'), color: '#4284c6'},
  '004': {url: require('../../../assets/imgs/05.png'), color: '#f1b550'},
};
export default class App extends React.Component {
  state = {
    curTabIndex: 0,
    messageList: [],
    noticeList: [],
    disReadtotal: 0,
    count: 0,
    totalPage: 0,
    counts:0,
    totalPages:0,
  };
  componentDidMount() {
    this.getmessage(1, 1);
  }
  getmessage(flag, pageNum) {
    let data = JSON.parse(sto.getValue('loginData'));
    $ajax({
      url: findMsgByPage,
      data: {
        args: {
          flag: flag,
          userId: data.userData.userId,
          readStatus: null,
        },
        pageNum: pageNum,
        pageSize: 12,
      },
      // hasLoading:false,
      _this: this,
    }).then((value) => {
      let {list,total, totalPage} = value.data;
      console.log(value.data)
      let {messageList,noticeList,count,counts}=this.state;
      if (list.length != 0) {
        if (flag == 1) {
          let disReadtotal = 0;
          list.map((item) => {
            if (item.messageCategoryCode == '004') {
              item.messageContent = JSON.parse(item.messageContent).content;
            }
            if (item.readStatus == 0) {
              disReadtotal += 1;
            }
          });
          this.setState({
            messageList: messageList.concat(list),
            disReadtotal: disReadtotal,
            totalPage: totalPage,
            count:count+1
          });
        } else {
          this.setState({
            noticeList: noticeList.concat(list),
            totalPages:totalPage,
            counts:counts+1
          });
        }
      }
    });
  }
  changeIndex = (index) => {
    this.setState({
      curTabIndex: index,
      messageList: [],
      noticeList: [],
      count:0,
      counts:0,
      totalPage:0,
      totalPages:0
    },()=>{
      this.getmessage(Math.abs(index - 1), 1);
    });
  };
  readAllMsg = () => {
    let data = JSON.parse(sto.getValue('loginData'));
    $ajax({
      url: readAllMsg,
      data: {
        type:1,
        id: data.userData.userId,
      },
      hasLoading: false,
      _this: this,
    }).then((value) => {
      if ((value.code = 200)) {
        this.setState({
          messageList:[]
        },()=>{
          this.getmessage(1, 1);
        })
      }
    });
  };
  _contentViewScroll = (e) => {
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度

    if (offsetY + oriageScrollHeight + 10 >= contentSizeHeight) {
      if(this.state.curTabIndex==0){
        if (this.state.count < this.state.totalPage) {
          this.getmessage(1,this.state.count + 1)
        }
      }
      else{
        if (this.state.counts < this.state.totalPages) {
          this.getmessage(0,this.state.counts + 1)
        }
      }
      
    } else if (offsetY + oriageScrollHeight <= 1) {
      //这个是没有数据了然后给了false  得时候还在往上拉
    } else if (offsetY == 0) {
      //这个地方是下拉刷新，意思是到顶了还在指行，可以在这个地方进行处理需要刷新得数据
    }
  };
  showDetail=(item)=>{
    let data = JSON.parse(sto.getValue('loginData'));
    if(item.readStatus==0){
      $ajax({
        url: readOneMsg,
        data: {
            userId: data.userData.userId,
            sysMessageId:item.id         
        },
        hasLoading:false,
        _this: this,
      }).then((value)=>{
        if(value.code==200){
          this.setState({
            messageList: [],
            count:0,
            totalPage:0,
          },()=>{
            this.getmessage(1,1)
          })
        }
      })
    }
    if(item.messageCategoryCode=="001"){
      $fns.route({
        context: this,
        routeName:'messageDetail',
        params: {messageDetail:item},
      });
    }
 
  }
  render() {
    const {messageList, disReadtotal, curTabIndex, noticeList} = this.state;
    return (
      <>
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <View style={[ss.title]}>
          <TouchableOpacity
            style={[ss.back]}
            onPress={() => {
              $fns.route({
                context: this,
                type: 'back',
              });
            }}>
            <IconFont icon={'\ue78a'} color={'#fff'} size={19} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginRight: 27, height: 44, justifyContent: 'center'}}
            onPress={() => this.changeIndex(0)}>
            <Text style={{color: '#fff', fontSize: 16}}>我的消息</Text>
            {this.state.curTabIndex == 0 && (
              <View style={[ss.bottom_line]}></View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{height: 44, justifyContent: 'center'}}
            onPress={() => this.changeIndex(1)}>
            <Text style={{color: '#fff', fontSize: 16}}>公告列表</Text>
            {this.state.curTabIndex == 1 && (
              <View style={[ss.bottom_line]}></View>
            )}
          </TouchableOpacity>
        </View>

        {curTabIndex == 0 && (
          <>
            {messageList.length!=0&&(
              <>
            <View style={[ss.message]}>
              <Text style={{color: '#777'}}>有{disReadtotal}条新消息</Text>

              <TouchableOpacity style={[ss.yidu]} onPress={this.readAllMsg}>
                <Text style={{color: '#777', fontSize: 12}}>全部已读</Text>
              </TouchableOpacity>
            </View>
              <FlatList
              style={{backgroundColor: '#e5e5e5', padding: 12, paddingTop: 0}}
              data={messageList}
              showsVerticalScrollIndicator={false}
              onMomentumScrollEnd={this._contentViewScroll}
              renderItem={({item, index}) => {
                return (
                  <View key={index} style={[ss.item]}>
                    <View style={{width: 50, height: 50}}>
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          backgroundColor: imgs[item.messageCategoryCode].color,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        {/* <IconFont icon={'\ue655'} color="#fff" size={30} /> */}
                        <Image
                          source={imgs[item.messageCategoryCode].url}
                          style={{width: 30, height: 30}}
                        />
                      </View>
                      {item.readStatus == 0 && (
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: 'red',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                          }}></View>
                      )}
                    </View>

                    <TouchableOpacity style={{flex: 1, paddingLeft: 10}} onPress={()=>this.showDetail(item)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginBottom: 10,
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text style={{fontSize: 15,}}>
                          {item.messageTitle}
                        </Text>
                        <Text style={{fontSize: 12, color: '#777'}}>
                          {item.createTime}
                        </Text>
                      </View>

                      <Text
                        numberOfLines={1}
                        style={{fontSize: 14, color: '#777'}}>
                        {item.messageContent}...
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
              keyExtractor={(item, index) => 'xx_' + index}
            />
            </>
            )}
            {/* {messageList.length!=0&&(
            
            )} */}
            {messageList.length==0&&(
               <View style={{backgroundColor: '#e5e5e5',flex:1, justifyContent:'flex-start', paddingTop:'50%', alignItems: 'center'}}>
                    <Image
                      source={require('../../../assets/imgs/icon_notice_empty.jpg')}
                      style={{width: 240, height: 240}}
                    />
                    <Text style={{fontSize: 16}}>暂无消息</Text>
                  </View> 
            )}
          </>
        )}
        {curTabIndex == 1 && (
          <>
          {noticeList.length!=0&&(
            <FlatList
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: '#e5e5e5', padding: 12, paddingTop: 0}}
            data={noticeList}
            onMomentumScrollEnd={this._contentViewScroll}
            renderItem={({item, index}) => {
              return (
                <View>
                  <View
                    style={{
                      height: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: '#666', fontSize: 13}}>
                      {moment(item.createTime).format('YYYY-MM-DD hh:mm')}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#fff',
                      backgroundColor: '#fff',
                      marginHorizontal: 15,
                      paddingHorizontal: 12,
                      marginBottom: 8,
                    }}>
                    <View
                      style={{
                        height: 44,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee',
                      }}>
                      <Text style={{fontSize: 15}}>{item.messageTitle}</Text>
                      {/* <Text style={{color: '#777', fontSize: 13}}>
                        {moment(item.createTime).format('hh:mm')}
                      </Text> */}
                    </View>
                    <View style={{paddingVertical: 12}}>
                      <Text
                        // numberOfLines={1}
                        style={{fontSize: 14, color: '#666', lineHeight: 20}}>
                        {item.messageContent}
                      </Text>
                    </View>
                  </View>
                  {/* <View style={{padding: 30, alignItems: 'center'}}>
                    <Image
                      source={require('../../../assets/imgs/icon_notice_empty.jpg')}
                      style={{width: 240, height: 240}}
                    />
                    <Text style={{fontSize: 20}}>暂无公告</Text>
                  </View> */}
                </View>
              );
            }}
            keyExtractor={(item, index) => 'xx_' + index}
          />
          )}
          {noticeList.length==0&&(
               <View style={{backgroundColor: '#e5e5e5',flex:1,paddingTop:'50%',  alignItems: 'center',justifyContent:'flex-start', }}>
                    <Image
                      source={require('../../../assets/imgs/icon_notice_empty.jpg')}
                      style={{width: 240, height: 240,}}
                    />
                    <Text style={{fontSize: 16}}>暂无公告</Text>
                  </View> 
            )}
         </>
        )}
      
      </>
    );
  }
}
let ss = StyleSheet.create({
  title: {
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: $fns.getStatusBarHeight() + 44,
    paddingTop: $fns.getStatusBarHeight(),
    backgroundColor: $myTheme.mainBlue,
  },
  back: {
    width: 44,
    height: 44,
    position: 'absolute',
    left: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom_line: {
    height: 3,
    width: '100%',
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  message: {
    flexDirection: 'row',
    height: 43,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#e5e5e5',
  },
  yidu: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  item: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
  },
});
