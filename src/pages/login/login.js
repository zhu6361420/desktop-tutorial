import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  StatusBar,
  Modal,
  ScrollView,
  BackHandler,
  PermissionsAndroid,
  DeviceEventEmitter
} from 'react-native';
import {IconFont, BackBtn, MyButton} from '../../global.components';
import {$fns} from '../../utils/fns';
import {$ajax, $ui} from '../../global.utils';
import {api} from '../../global.utils';
import pattern from '../../utils/pattern';
const {login} = api;
const textCol = [
  {
    title: '本隐私权政策将帮助您了解以下内容：',
    children: [
      '一、适用范围',
      '二、我们如何收集信息',
      '三、我们如何使用信息',
      '四、我们如何共享信息',
      '五、Cookie 和网络 Beacon 的使用',
      '六、信息存储',
      '七、您的个人信息保护',
    ],
  },
  {
    title: '一、适用范围',
    children: [
      '本隐私权政策适用于亚威平台提供的所有服务，您访问亚威平台网站或登陆相关客户端使用亚威平台提供的服务，均适用本隐私权政策。需要特别说明的是，本隐私权政策不适用于其他第三方向您提供的服务。亚威平台和服务可能包括第三方的产品和服务，以及第三方网站的链接。当您使用这些产品或服务时，也可能收集您的信息。因此，我们强烈建议您花时间阅读该第三方的隐私权政策，就像阅读我们的政策一样。我们不对第三方如何使用他们向您收集的个人信息负责，也不能控制其使用。我们的隐私权政策不适用通过我们的服务链接的其他网站。',
    ],
  },
  {
    title: '二、我们如何收集信息',
    children: [
      '为了向您提供我们的服务，我们会要求您提供本平台为您服务所必需的个人信息。如果您不提供个人信息，我们可能无法向您提供我们的产品或服务。“个人信息”指以电子或者其他方式记录的能够单独或者与其他信息结合识別特定自然人身份或者反映特定自然人活动情况的各种信息。我们收集信息的方式如：',
      '1.  您向我们提供的信息：当您使用亚威平台提供的相关服务时填写或提交的信息，包括但不限于您的公司名称、公司信息、联系人、公司证照、电话号码、电子邮箱、地址、设备运行数据及相关附加信息。',
      '2.  在您使用服务过程中收集的信息：为了提供并优化您需要的服务，我们会收集您使用服务的相关信息，这类信息包括：在您使用平台服务，或访问平台网页时，平台自动接收并记录的您的浏览器和计算机上的信息，包括但不限于您的IP地址、浏览器的类型、使用的语言、 访问日期和时间、软硬件特征信息及您需求的网页记录等数据；如您下载或使用平台或其关联公司客户端软件，或访问移动网页使用平台服务时，平台可能会读取与您位置和移动设备相关的信息，包括但不限于设备型号、设备识别码、操作系统、分辨率、电信运营商等。',
      '除上述信息外，我们还可能为了提供服务及改进服务质量的合理需要而收集您的其他信息，包括您与我们的客户服务团队联系时您提供的相关信息，您参与问卷调查时向我们发送的问卷答复信息，以及您与亚威平台的关联方、平台合作伙伴之间互动时我们收集的相关信息。与此同时，为提高您使用平台提供的服务的安全性，更准确地预防钓鱼网站欺诈和木马病毒，我们可能会通过了解一些您的网络使用习惯、您常用的软件信息等手段来判断您账户的风险，并可能会记录一些我们认为有风险的URL。',
      '3.  来自第三方的信息：我们可能会从第三方合作伙伴获得您的信息。为了给您提供更好、更优、更加个性化的服务，或共同为您提供服务，或为了预防互联网欺诈的目的，亚威平台的关联方、合作伙伴会依据法律的规定或与您的约定或征得您同意的前提下，向本平台分享您的个人信息。',
    ],
  },
  {
    title: '三、我们如何使用信息',
    children: [
      '因收集您的信息是为了向您提供服务及提升服务质量的目的，为了实现这一目的，我们会把您的信息用于下列用途',
      '1.  向您提供您使用的各项服务，并维护、改进这些服务。',
      '2.  向您推荐您可能感兴趣的内容，包括但不限于向您发出产品和服务信息，或通过系统 向您展示个性化的第三方推广信息，或者在征得您同意的情况下与亚威平台的合作 伙伴共享信息以便他们向您发送有关其产品和服务的信息。',
      '3.  我们可能使用您的个人信息以预防、发现、调查欺诈、危害安全、非法或违反与我们 或其关联方协议、政策或规则的行为，以保护您、其他我们用户，或我们或其关联方的 合法权益。',
      '4.  我们可能会将来自某项服务的个人信息与来自其他服务的信息结合起来，用于为了给 您提供更加个性化的服务使用，例如让您拥有更广泛的社交圈的需要而使用、共享或披露。',
      '5.  经您许可的其他用途。',
    ],
  },
  {
    title: '四、我们如何共享信息',
    children: [
      '我们对您的信息承担保密义务，不会为满足第三方的营销目的而向其出售或出租您的任何信息，我们会在下列情况下才将您的信息与第三方共享：',
      '1.  事先获得您的同意或授权。',
      '2.  根据法律法规的规定或行政或司法机构的要求。',
      '3.  向亚威平台的关联方分享您的个人信息。',
      '4.  向可信赖的合作伙伴提供您的个人信息，让他们根据我们的指示并遵循我们的隐私权 政策以及其他任何相应的保密和安全措施来为我们处理这些信息。',
      '5.  如您出现违反中国有关法律、法规或者亚威平台相关协议或相关规则的情况，需要向 第三方披露。',
      '6.  为维护亚威平台及其关联方或用户的合法权益。',
    ],
  },
  {
    title: '五、Cookie 和网络 Beacon 的使用',
    children: [
      '为使您获得更轻松的访问体验，您访问亚威平台相关网站或使用亚威平台提供的服务时，我们可能会通过小型数据文件识别您的身份，这么做是帮您省去重复输入注册信息的步骤，或者帮助判断您的账户安全。这些数据文件可能是Cookie，Flash Cookie，或您的浏览器或关联应用程序提供的其他本地存储（统称“Cookie”）。',
      '请您理解，我们的某些服务只能通过使用“Cookie”才可得到实现。如果您的浏览器或浏览器附加服务允许，您可以修改对Cookie的接受程度或者拒绝亚威平台的Cookie，但这一举动在某些情况下可能会影响您安全访问亚威平台相关网站和使用亚威平台提供的服务。',
      '网页上常会包含一些电子图象（称为"单像素" GIF 文件或 "网络 beacon"），使用网络beacon可以帮助网站计算浏览网页的用户或访问某些cookie，我们会通过网络beacon收集您浏览网页活动的信息， 例如您访问的页面地址、您先前访问的援引页面的位址、您停留在页面的时间、您的浏览环境以及显示设定等。',
    ],
  },
  {
    title: '六、信息存储',
    children: [
      '亚威平台收集的有关您的信息和资料将保存在亚威平台及其关联公司的服务器上，这些信息和资料可能传送至您所在国家、地区或亚威平台收集信息和资料所在地并在该地被访问、存储和展示。',
    ],
  },
  {
    title: '七、您的个人信息保护',
    children: [
      '为保障您的信息安全，我们努力采取各种合理的物理、电子和管理方面的安全措施来保护您的信息，使您的信息不会被泄漏、毁损或者丢失，包括但不限于SSL、 信息加密存储、数据中心的访问控制。我们对可能接触到您的信息的员工也采取了严格管理，包括但不限于根据岗位的不同采取不同的权限控制，与他们签署保密协议，监控他们的操作情况等措施。亚威平台会按现有技术提供相应的安全措施来保护您的信息，提供合理的安全保障，亚威平台将尽力做到使您的信息不被泄漏、 毁损或丢失。',
      '您的账户均有安全保护功能，请妥善保管您的账户及密码信息。亚威平台将通过向其它服务器备份、对用户密码进行加密等安全措施确保您的信息不丢失，不被滥用和变造。尽管有前述安全措施，但同时也请您理解在信息网络上不存在“完善的安全措施”。',
      '在使用亚威平台服务进行网上交易时，您不可避免的要向交易对方或潜在的交易对方披露自己的个人信息，如联络方式或者邮政地址。请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。如您发现自己的个人信息泄密，尤其是你的账户及密码发生泄露，请您立即联络亚威平台客服，以便亚威平台采取相应措施。',
    ],
  },
];
function _goPage(_this,router){
  _this.setState({
    isShow:false
  })
  $fns.route({
    context: _this,
    routeName: router,
  });
}
function SuccessTips(props) {
  let {_this= () => {},isShow = false, disAgree = () => {},agreePrivacy=()=>{}} = props;
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
            paddingTop: 20,
            borderRadius: 4,
            maxHeight: $fns.getWindowHeight() * 0.6,
          }}>
          <View
            style={{
              paddingHorizontal: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{paddingHorizontal: '10%'}}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#444',
                  marginBottom: 10,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                服务协议和隐私政策
              </Text>
            </View>
          </View>
          <ScrollView
            style={{
              marginHorizontal: 20,
              // borderWidth: 1,
              //   borderColor: '#e5e5e5',
            }}>
            <View
              style={{
                fontSize: 16,
                color: '#444',
                marginBottom: 10,
                textAlign: 'center',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 10,
                    paddingLeft: 15,
                    marginBottom: 8,
                    lineHeight: 15,
                  }}>
                  为切实保护用户隐私权，优化用户体验，亚威智云平台（下称“亚威平台”或“我们”）根据现行法规及政策，制定本亚威平台
                  <Text style={{color: '#1c83c6'}}
                    onPress={() => {
                      _goPage(_this,'userservice');
                    }}>《服务协议》</Text>
                    和
                  <Text style={{color: '#1c83c6'}} 
                    onPress={() => {
                      _goPage(_this,'privacy');
                    }}>《隐私政策》</Text>
                  。亚威了解个人信息对客户的重要性，我们力求明确说明我们获取、管理及保护用户个人信息的政策及措施。本隐私权政策包含了我们收集、存储、使用、共享和保护您的个人信息的条款，我们希望通过本隐私权政策向您清晰地介绍我们对您个人信息的处理方式，因此我们建议您完整地阅读本隐私权政策，以帮助您了解维护自己隐私权的方式。
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 10,
                    paddingLeft: 15,
                    marginBottom: 8,
                    lineHeight: 15,
                  }}>
                  如您对本隐私权政策有任何疑问，请您及时与我们联系。如果您不同意本隐私权政策任何内容，您应立即停止使用亚威平台服务。当您使用亚威平台提供的任一服务时，即表示您已同意我们按照本隐私权政策来合法使用和保护您的个人信息。
                </Text>
              </View>

              {textCol.map((item,index) => (
                <View style={{marginBottom: 10}} key={index}>
                  <Text style={{fontWeight: 'bold'}}>
                    {item.title}
                  </Text>
                  <View>
                    {item.children.map((items,indexs) => (
                      <View style={{marginTop: 5, paddingLeft: 15}} key={indexs} >
                        <Text style={{fontSize: 10}}>{items}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
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
                disAgree();
              }}>
              <Text style={{fontSize: 15}}>不同意</Text>
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
                agreePrivacy();
              }}>
              <Text style={{fontSize: 15, color: '#1c83c6'}}>同意</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
export default class App extends React.Component {
  state = {
    checked: false,
    safeMode: true,
    account: '',
    password: '',
    isShow:false,
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let data=JSON.parse(sto.getValue('privacy')) ;
    if(data==null||!data){
        this.setState({
          isShow:true
        })
      }
    this.subscription = DeviceEventEmitter.addListener("EventType", (param)=>{
      this.setState({
        isShow:true
      })
    });
  }
  submit = () => {
    if (this.state.account == '') {
      return $ui.toast('请输入账号');
    }
    if (this.state.password == '') {
      return $ui.toast('请输入密码');
    }
    if (!pattern.phone.test(this.state.account)) {
      return $ui.toast('请输入正确手机号码');
    }
    if (
      pattern.phone.test(this.state.account) &&
      this.state.password != '' &&
      this.state.password != null
    ) {
      this.login(this.state.account, this.state.password);
    }
  };
  login(account, password) {
    let {navigation} = this.props;
    let params = {
      url: login,
      data: {
        username: account,
        password: password,
      },
      // type: 'post',
      hasLoadding: true,
      _this: this,
    };
    $ajax(params, navigation).then((value) => {
      if (value.code == 200) {
        const resData = value.data;
        if (resData instanceof Object) {
          const user = resData.user || {};
          const roleId = (user.role || {}).id || null;
          let apps = resData.apps || [];
          // let allApps = resData.allApps || [];
          apps = apps.filter((app) => (app.menus || []).length > 0);
          const userId = user.id || null;
          const username = user.username;
          const email = user.email;
          const phoneNumber = account;
          const firmId = (user.firm || {}).id || null;
          const groupId=(user.group || {}).id || null;
          const firmName = (user.firm || {}).name || null;
          const roleName = (user.role || {}).name || null;
          const industry = (user.firm || {}).industry || null;
          const userData = {
            userId,
            roleId,
            firmId,
            groupId,
            firmName,
            roleName,
            industry,
            username,
            phoneNumber,
            email,
            apps,
            // allApps
          };
          sto.setValue("loginData",JSON.stringify({
            username: account,
            password: password,
            userData: userData,
          }))
          sto.setValue('token',JSON.stringify(value.token))
        }
        $ui.toast('登录成功');
        navigation.replace('tabPages');
      }
    });
  }
  agreePrivacy=()=>{
    this.subscription.remove();
    sto.setValue("privacy",JSON.stringify(true))
    this.setState({
      isShow:false
    })
  }
  disAgree=()=>{

    sto.setValue("privacy",JSON.stringify(false))
    BackHandler.exitApp();
  }
  // async requestMultiplePermission() {
  //   try {
  //     const permissions = [
  //       PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       // PermissionsAndroid.PERMISSIONS.CAMERA
  //     ];
  //     //返回得是对象类型
  //     const granteds = await PermissionsAndroid.requestMultiple(permissions);
  //   } catch (err) {
  //     this.showMessage(err.toString());
  //   }
  // }
  showMessage(data) {
    $ui.toast(data)
  }
  render() {
    let {navigation} = this.props;
    const {account, password,isShow} = this.state;
    return (
      < >
      <View style={{backgroundColor: '#fff',flex:1}}>
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <SuccessTips _this={this} isShow={isShow} disAgree={this.disAgree} agreePrivacy={this.agreePrivacy} />
        <KeyboardAvoidingView
          enabled={true}
          behavior="position"
          style={{backgroundColor: '#fff', height:'auto'}}
          >
          <Image
            source={require('./../../assets/imgs/login_pic.jpg')}
            resizeMode="stretch"
            style={{width: '100%', height: 280}}
          />
          <View style={{paddingLeft: 30, paddingRight: 30}}>
            <View style={[ss.logo]}>
              <Image
                source={require('./../../assets/imgs/logo1.png')}
                style={{width: 90, height: 40}}
              />
            </View>

            <View style={[ss.inputBox]}>
              <TextInput
                placeholder="请输入账号"
                autoComplete="off"
                placeholderTextColor="#666"
                style={[ss.txtInput]}
                value={account}
                onChangeText={(text) => {
                  this.setState({
                    account: text,
                  });
                }}
              />
            </View>

            <View style={[ss.inputBox]}>
              <TextInput
                placeholder="请输入账号"
                autoComplete="off"
                placeholderTextColor="#666"
                style={[ss.txtInput]}
                textContentType="password"
                keyboardType="default"
                secureTextEntry={this.state.safeMode}
                placeholder="密码"
                value={password}
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
              />
              <TouchableOpacity
                style={{
                  width: 45,
                  height: 45,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  this.setState({
                    safeMode: !this.state.safeMode,
                  });
                }}>
                {this.state.safeMode ? (
                  <IconFont icon={'\ue668'} size={26} color="#777" />
                ) : (
                  <IconFont icon={'\ue625'} size={26} color="#777" />
                )}
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                paddingTop: 10,
                paddingBottom: 20,
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push('register1');
                }}>
                <Text style={{fontSize: 16, color: '#4e83c2'}}>立即注册</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push('forget1');
                }}>
                <Text style={{fontSize: 16, color: '#4e83c2'}}>忘记密码？</Text>
              </TouchableOpacity>
            </View>

            <MyButton
              title="登录"
              outterStyle={{paddingLeft: 0, paddingRight: 0}}
              buttonStyle={{borderRadius: 26}}
              onPress={this.submit}
            />

            <View style={[ss.tips]}>
              <Text style={{color: '#999'}}>还没账号？点击</Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push('register1');
                }}>
                <Text style={{color: '#4e83c2'}}>立即注册</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        </View>
      </>
    );
  }
}

let ss = StyleSheet.create({
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  inputBox: {
    height: 45,
    marginBottom: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  txtInput: {backgroundColor: '#fff', height: 40, fontSize: 16, flex: 1},
  btnInput: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: '#4e83c2',
  },
  tips: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
});
