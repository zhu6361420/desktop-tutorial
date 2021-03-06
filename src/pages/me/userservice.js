import React from 'react';
import {Text, View, ScrollView, TouchableOpacity, StatusBar,DeviceEventEmitter} from 'react-native';
import {$fns} from '../../global.utils';
import {UiHeader} from '../../global.components';
const textCol = [
    {
      title: '一、接受条款',
      children: [
        '（1）本协议内容包括协议正文及所有亚威智云平台已经发布或将来可能发布的各类规则、规定、帮助等（以下合称”规则”）。所有规则为协议不可分割的一部分，与协议正文具有同等法律效力。',
        '（2）以任何方式进入亚威智云平台并使用服务即表示您已充分阅读、理解并同意接受本协议的条款和条件(以下合称“条款”)。',
        '（3）亚威智云平台有权根据业务需要酌情修订”规则”、“条款”，并以网站公告的形式进行更新，不再向您单独通知。经修订的”规则”、“条款”一经在亚威智云平台公布，即产生效力。如您不同意相关修订，请您立即停止使用“服务”。如您继续使用“服务”，则将视为您已接受经修订的“条款”，当您与亚威智云平台发生争议时，应以最新”规则”、“条款”为准。'
      ],
    },
    {
      title: '二、服务说明',
      children: [
        '亚威智云平台目前经由其产品组合，向用户提供存取丰富的网上资源的诸多服务，包括各种信息工具、网上论坛、个人化内容等（以下简称“本服务”）。除非本服务条款另有其它明示规定，增加或强化目前本服务的任何新功能，包括所推出的新产品，均受到本服务条款之规范。您了解并同意，本服务仅依其当前所呈现的状况提供，对于任何用户通讯或个人化设定之时效、删除、传递错误、未予储存或其它任何问题，亚威智云平台均不承担任何责任。亚威智云平台保留不经事先通知为维修保养、升级或其它目的暂停本服务任何部分的权利。为使用本服务，您必须能够自行经有法律资格对您提供互联网接入服务的第三方，进入国际互联网，并应自行支付相关服务费用。此外，您必须自行配备及负责与国际联网连线所需之一切必要装备，包括计算机、数据机或其它存取装置。',
      ],
    },
    {
      title: '三、用户社区说明',
      children: [
        '您享有言论自由权利，并适度拥有修改、删除自己发表的文章的权利。您在相关讨论区发表文章时，除遵守本条款外，还应遵守亚威智云平台的相关规定。未经亚威智云平台同意，禁止在亚威智云平台内发布任何形式的广告。您发表的文章和评论，仅代表您本人观点，与亚威智云平台立场无关。亚威智云平台有权将在亚威智云平台发表的文章或言论自行使用或者与其他人合作使用于其他用途，包括但不限于网站、电子杂志、杂志、刊物等，使用时需为作者署名，以发表文章时注明的署名为准。文章有附带版权声明者除外。',
        '任何转载、引用发表于本社区的版权文章及言论须符合以下规范：',
        '（1）用于非商业、非盈利、非广告性目的时需注明作者及文章及图片的出处为“亚威智云平台网站”或“亚威智云平台网址链接”。',
        '（2）用于商业、盈利、广告性目的时需征得文章或图片原作者的同意，并注明作者姓名、授权范围及原作出处“亚威智云平台网站”或“亚威智云平台网址链接”。',
        '（3）任何文章或图片的修改或删除均应保持作者原意并征求原作者同意，并注明授权范围。您与亚威智云平台用户之间通过社区相识、交往中所发生或可能发生的任何心理、生理上的伤害和经济上的纠纷与损失，亚威智云平台不承担任何责任。您可以及时与亚威智云平台的管理人员联系。本社区用户因为违反本社区规定而触犯中华人民共和国法律的，责任自负，亚威智云平台不承担任何责任。亚威智云平台因系统维护或升级而需暂停服务时，将事先公告。若因硬件故障或其它不可抗力而导致暂停服务，于暂停服务期间造成的一切不便与损失，亚威智云平台不承担任何责任。',
      ],
    },
    {
      title: '四、遵守法律',
      children: [
        '您同意遵守《中华人民共和国合同法》、《中华人民共和国著作权法》及其实施条例、《全国人民代表大会常务委员会关于维护互联网安全的决定》（“人大安全决定”）、《中华人民共和国保守国家秘密法》、《中华人民共和国电信条例》（“电信条例”）、《中华人民共和国计算机信息系统安全保护条例》、《中华人民共和国计算机信息网络国际联网管理暂行规定》及其实施办法、《计算机信息系统国际联网保密管理规定》、《互联网信息服务管理办法》、《计算机信息网络国际联网安全保护管理办法》、《互联网电子公告服务管理规定》（“电子公告规定”）等相关中国法律法规的任何及所有的规定，并对以任何方式使用您的密码和您的帐号使用本服务的任何行为及其结果承担全部责任。如违反《人大安全决定》有可能构成犯罪，被追究刑事责任。《电子公告规定》则有明文规定，上网用户使用电子公告服务系统对所发布的信息负责。《电信条例》也强调，使用电信网络传输信息的内容及其后果由电信用户负责。在任何情况下，如果亚威智云平台有理由认为您的任何行为，包括但不限于您的任何言论和其它行为违反或可能违反上述法律和法规的任何规定，亚威智云平台可在任何时候不经任何事先通知终止向您提供服务。',
      ],
    },
    {
      title: '五、您的注册义务',
      children: [
        '为了能使用本服务，您同意以下事项∶依本服务注册表之提示提供您本人真实、正确、最新及完整的资料（以下简称“登记资料”）；及随时更新登记资料，确保其为真实、正确、最新及完整的资料。若您提供任何错误、不实、过时或不完整或具误导性的资料；或者亚威智云平台有理由怀疑前述资料为错误、不实、过时或不完整或具误导性的，亚威智云平台有权暂停或终止您的帐号，并拒绝您于现在和未来使用本服务之全部或任何部分。亚威智云平台十分关心所有用户（特别是儿童）的安全及隐私。请记住，本服务设计之目的在于符合广大用户的需要。因此本服务及“内容”（如后述第六项所定义）是否适合于您的子女，您身为定监护人有责任加以判断。亚威智云平台无须对任何用户的任何登记资料承担任何责任，包括但不限于鉴别、核实任何登记资料的真实性、正确性、完整性、适用性及是否为最新资料的责任。',
      ],
    },
    {
      title: '六、亚威智云平台隐私权政策',
      children: [
        '您提供的登记资料及亚威智云平台保留的有关您的若干其它资料将受到中国有关隐私的法律和本亚威智云平台《隐私权政策》之规范。请访问亚威智云平台查阅亚威智云平台完整的隐私权政策。',
      ],
    },
    {
      title: '七、提供者之责任',
      children: [
        '您提供的登记资料及亚威智云平台保留的有关您的若干其它资料将受到中国有关隐私的法律和本亚威智云平台《隐私权政策》之规范。请访问亚威智云平台查阅亚威智云平台完整的隐私权政策。',
      ],
    },
    {
      title: '八、账号安全',
      children: [
        '当您完成您的注册程序及本服务的登记程序之后，并且完成账号安全的确认以及其他相关操作。您得到一个密码及帐号。您应对所有用您的密码及帐号的活动负完全的责任。您同意：',
        '（1）您的亚威智云平台帐号遭到未获授权的使用，或者发生其它任何安全问题时，您将立即通知亚威智云平台；',
        '（2）如果您未保管好自己的帐号和密码，因此而产生的任何损失或损害，亚威智云平台无法也不承担任何责任；',
        '（3）每个用户都要对其帐号中的所有行为和事件负全责。如果您未保管好自己的帐号和密码而对您、亚威智云平台或第三方造成的损害，您将负全部责任。',
        '（4）如果您在其他人的产品页面发布筹资信息，我们将删除您所发布的信息，并且给予警告甚至对账号进行删除。',
      ],
    },
    {
      title: '九、知识产权',
      children: [
        '（1）版权通知亚威智云平台是一个创新型的网站，会尊重他人的知识产权，我们也要求我们的用户能够尊重他人的知识产权。如果发生侵犯版权的情况，可以按照版权条例移除相关的信息。如果您认为您的作品被别人抄袭，或者别人侵犯了您的版权，请您向亚威智云平台提供一份书面通知，其中包含至少以下信息（或者可以按照中国版权条例的相关要求提供）：版权人或者授权代理人的电子签名或者手写签名，联系方式：地址、电话、电邮等。您所申报的被侵权作品的描述。被侵权的部分在亚威智云平台网站上所在的位置，包括链接、图片，并且进行适当的标注。表明被侵权的部分，您从未对其授权的说明书。声明您所陈述的所有信息都是准确的，并且您是版权人或受版权人授权的代理人，否则愿意承担伪证罪的责任。如果您认为您的作品被错误的移除或者失效了，请向我们提供一份书面的应答通知，通知内容至少包含如下信息：本服务的订阅者手写或电子版签名以及联系方式：地址、电话、电邮等。说明被移除或禁用的部分在网站上曾经的位置。说明用户出于诚意认为该材料的移除或者是小是由于失误，否则愿意承担伪证罪的责任。申明用户同意服从其地址所在地区法庭的司法管辖，或者能找到服务提供者的任何国内司法区域的管辖（如果此用户的地址不在中国国内）。声明用户将接受按照法律要求提供版权通知的人或其代理的诉讼传票。如果您无法满足以上全部的要求，您的申请或要求将可能被视为无效，我们有可能会无视此类不完整或者不准确的通知，并且不受任何法律追究。亚威智云平台提供的网络服务中包含的任何文本、图片、图形、音频和/或视频资料均受版权、商标和/或其它财产所有权法律的保护，未经相关权利人同意，上述资料均不得在任何媒体直接或间接发布、播放、出于播放或发布目的而改写或再发行，或者被用于其他任何商业目的。所有这些资料或资料的任何部分仅可作为私人和非商业用途而保存在某台计算机内。亚威智云平台不就由上述资料产生或在传送或递交全部或部分上述资料过程中产生的延误、不准确、错误和遗漏或从中产生或由此产生的任何损害赔偿，以任何形式，向用户或任何第三方负责。',
        '（2）产品发布者的知识产权本服务使您能在本站上面上传您的内容，我们将不会拥有您的内容所有权。然后，亚威智云平台需要如下的许可来展开服务，因为这些部分的服务对于您的产品成功来说是非常有必要的。您在这里授予亚威智云平台全球性、非独占、免版税的权利，并且允许亚威智云平台代表您去：使用、展示或执行本服务（如：使用、传输、播放、复制、展示、刊登、推广、销售、传播，或者对该内容进行开发，以及所有相关有版权的作品或者数据，包括但不限于本服务相关联的摄影、平面和描述文本）；允许其他用户进行传递、播放、下载、展示、刊登、传播、收集，或者使用该内容和艺术作品；使用和发布，并且允许他人使用和发布您和您团队中成员的名字、商标等，以及与本服务的条款相关联的个人和生产材料。您同意支付由于您向本服务提交的内容或亚威智云平台根据使用条款对该内容的使用而应付给任何个人或团体的所有版权和其他金额。为使亚威智云平台能如上所述使用您的内容，您特此授权给亚威智云平台全球性、非独占、终身、免版税、可授权和可转让的权利，去使用、再版、复制和展示您的商标、广告语、标识或类似的仅与本服务相关联的专属权。',
        '（3）用户的知识产权本服务可能会使用户有权增添、创造、上传、提交、传播、手机，或向本站发布内容、视频、音频、网站内评论、数据、文本、摄影、软件、脚本、平面设计或其他信息。通过在本站提交用户的内容时，您即：承认您在本站提交任何用户内容时，您是在发布该内容，且您可能会因这些内容相关的ID而被公开的辨认出身份；当您在本站提交任何用户内容时，您即授予亚威智云平台全球性、非独占、终身的、不可撤销的、无版税、完全付讫、可授权可转让的权利去使用、编辑、再版、传播、衍生、展示、表现，或者完全开发与本站、本服务相关（及其继承人和受让人）的业务相关的用户内容。包括但不限于以任何媒介形式、通过任何媒体渠道（包括但不限于第三方网站）推广和在传播本站全部或部分内容（及其衍生产品）或本服务。借此您也将并也应授权本站及本服务的每个用户非独占的许可，让他们通过本站和本服务来获取您的用户内容，并且处于仅为个人且非商业化的目的使用、编辑、修改、再版、传播、衍生、展示和表现此用户内容。为了明确，授予亚威智云平台的上述许可并不影响您对您的用户内容的其他所有权或许可权，包括对您用户内容中的材料授予附加许可的权利，否则除非经过书面同意；您有全权去代表任一及全部您用户页面中内容的任何权利、名称或利益的拥有者来使用此内容，且如上文所述授予许可；被允许使用每个可识别的个人的名字等等，及使用此人的可识别信息或个人信息，作为与使用条款保持一致；您有权利将所有上文提及的用户内容权利授予亚威智云平台及本服务的所有用户；您同意为您向本服务提交的任何用户内容而支付所有您应付给任何个人或团体的版税和其他金额。亚威智云平台对此用户内容的使用或其他开发，以及本站、本服务用户在符合此协议的前提下对此用户内容的使用或其他开发，将不会侵犯或违反任何第三方权利，包括但不限于隐私权、宣传权、版权、合同权利，或任何其他知识产权或专属权。明白亚威智云平台应享有删除、编辑、修改、转制、摘录，或翻译您提交的任何材料、内容或信息；且所有通过本站公开发布或私下传递的信息都仅仅是其原创者的单方面责任，亚威智云平台将不会为任何内容中的任何错误或遗漏而被追究责任；亚威智云平台不能保证您可能在使用本服务过程中与之互动的任何其他用户的身份。亚威智云平台不为任何用户内容背书，也无法控制任何用户内容。亚威智云平台不能保证用户提供的关于自己的任何数据的真实可靠性。您认可您使用本服务获取的所有内容风险自负，且您将会对由此给任何一方造成的任何伤害或损失付单方面责任。',
      ],
    },
    {
      title: '十、用户行为',
      children: [
        '用户应同意将不会利用本服务进行任何违法或不正当的活动，包括但不限于下列行为∶',
        '（1）上载、张贴、发送电子邮件或以其它方式传送含有下列内容之一的信息：反对宪法所确定的基本原则的；危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；损害国家荣誉和利益的；煽动民族仇恨、民族歧视、破坏民族团结的；破坏国家宗教政策，宣扬邪教和封建迷信的；散布谣言，扰乱社会秩序，破坏社会稳定的；散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；侮辱或者诽谤他人，侵害他人合法权利的；含有虚假、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容；含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或禁止的其它内容的；',
        '（2）以任何方式危害未成年人的利益；',
        '（3）冒充任何人或机构，包含但不限于亚威智云平台员工，或以虚伪不实的方式陈述或谎称与任何人或机构有关；',
        '（4）伪造标题或以其它方式操控识别资料，以伪造经由本服务传送之任何内容之来源；',
        '（5）将依据任何法律或合约或法定关系（例如由于雇佣关系和依据保密合约所得知或揭露之内部资料、专属及机密资料）知悉但无权传送之任何内容加以上载、张贴、发送电子邮件或以其它方式传送；',
        '（6）将侵害他人著作权、专利权、商标权、商业秘密、或其它专属权利（以下简称“专属权利”）之内容加以上载、张贴、发送电子邮件或以其它方式传送；',
        '（7）将任何广告信函、促销资料、“垃圾邮件”、“滥发信件"、“连锁信件”、“直销”或其它任何形式的劝诱资料加以上载、张贴、发送电子邮件或以其它方式传送，惟专供前述目的使用之区域（例如购物室），按照有关适用指引或规则进行的行为不在此限；',
        '（8）将设计目的在于干扰、破坏或限制任何计算机软件、硬件或通讯设备功能之计算机病毒（包括但不限于木马程序(Trojan horses)、蠕虫(worms)、定时炸弹、删除蝇(cancelbots)（以下简称“病毒”））或其它计算机代码、档案和程序之任何资料，加以上载、张贴、发送电子邮件或以其它方式传送；',
        '（9）破坏正常的对话流程、造成荧屏快速移动，或使本服务其它用户无法输入，或对其它用户参加即时交流的能力产生负面影响；',
        '（10）干扰或破坏本服务或与本服务相连线之服务器和网络，或违反任何关于本服务连线网络之规定、程序、政策或规范；',
        '（11）跟踪或以其它方式骚扰他人；',
        '（12）故意或非故意地违反任何适用的当地、国家和国际法律；',
        '（13）未经合法授权而截获、篡改、收集、储存或删除他人个人信息、电子邮件或其它数据资料，或将获知的此类资料用于任何非法或不正当目的。您已认可亚威智云平台未对本服务内容加以任何事先审查，对用户的使用行为也无法进行全面控制，您使用任何内容时，包括依赖前述内容之正确性、完整性或实用性时，您同意将自行加以判断并承担所有风险，而不依赖于亚威智云平台。但亚威智云平台及其指定人有权（但无义务）依其自行之考虑，拒绝和删除可经由本服务提供之违反本条款的或其它引起亚威智云平台反感的任何内容。您了解并同意，亚威智云平台依据法律法规的要求，或基于诚信为了以下目的或在合理必要范围内，认定必须将内容加以保存或揭露时，得加以保存或揭露：遵守法律程序；执行本服务条款；回应任何第三人提出的权利主张；保护亚威智云平台、其用户及公众之权利、财产或个人安全；或其它亚威智云平台认为有必要的情况。您了解并同意经由本服务之技术处理及传送，您提供的任何内容；经由各个网路加以传送且为了符合及配合连线网路或装置之技术要求而进行改变。',
      ],
    },
    {
      title: '十、用户行为',
      children: [
        '为保障您的信息安全，我们努力采取各种合理的物理、电子和管理方面的安全措施来保护您的信息，使您的信息不会被泄漏、毁损或者丢失，包括但不限于SSL、 信息加密存储、数据中心的访问控制。我们对可能接触到您的信息的员工也采取了严格管理，包括但不限于根据岗位的不同采取不同的权限控制，与他们签署保密协议，监控他们的操作情况等措施。亚威平台会按现有技术提供相应的安全措施来保护您的信息，提供合理的安全保障，亚威平台将尽力做到使您的信息不被泄漏、 毁损或丢失。',
        '您的账户均有安全保护功能，请妥善保管您的账户及密码信息。亚威平台将通过向其它服务器备份、对用户密码进行加密等安全措施确保您的信息不丢失，不被滥用和变造。尽管有前述安全措施，但同时也请您理解在信息网络上不存在“完善的安全措施”。',
        '在使用亚威平台服务进行网上交易时，您不可避免的要向交易对方或潜在的交易对方披露自己的个人信息，如联络方式或者邮政地址。请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。如您发现自己的个人信息泄密，尤其是你的账户及密码发生泄露，请您立即联络亚威平台客服，以便亚威平台采取相应措施。',
      ],
    },
    {
      title: '十一、国际使用之特别警告',
      children: [
        '您已了解国际互联网的无国界性，同意遵守当地所有关于网上行为及内容之法律法规。您特别同意遵守有关从中国或您所在国家或地区输出信息之传输的所有适用法律法规。',
      ],
    },
    {
      title: '十二、在亚威智云平台张贴的公开信息',
      children: [
        '（1）在本服务条款中，“本服务公开使用区域”系指一般公众可以使用的区域。',
        '（2）您同意已就您于本服务公开使用区域及本服务其它任何公开使用区域张贴之内容，或包括照片、图形或影音资料等内容，授予亚威智云平台全球性、免许可费及非独家的使用权，亚威智云平台可以为了展示、散布及推广张贴前述内容之特定服务目的，将前述内容复制、修改、改写、改编或出版，对于照片及图形资料的上述使用，仅为张贴该照片或图形于本服务之目的而为之。在您将前述内容放入本服务期间，使用权持续有效；若您将前述内容自本服务中删除，则使用权于删除时终止。',
        '（3）您同意已就您于本服务其它公开使用区域张贴的其它内容，授予亚威智云平台免许可费、永久有效、不可撤销、非独家及可完全再授权之权利在全球使用、复制、修改、改写、改编、发行、翻译、创造衍生性著作，及将前述内容（部分或全部）加以散布、表演、展示，及放入利用任何现在已知和未来开发出之形式、媒体和科技之其它著作物当中。',
      ],
    },
    {
      title: '十三、赔偿',
      children: [
        '您同意，如因您违反本协议或经在此提及而纳入本协议的其他文件，或因您违反法律侵害了第三方的合法权利，或因您违反法律须承担行政或刑事责任，而使第三方或行政、司法机关对亚威智云平台及其子公司、关联公司、分公司、董事、职员、代理人提出索赔或处罚要求（包括司法费用和其他专业人士的费用），您必须全额赔偿给亚威智云平台及其子公司、关联公司、分公司、董事、职员、代理人，并使其等免遭损失。',
      ],
    },
    {
      title: '十四、禁止商业行为',
      children: [
        '您同意不对本服务任何部分或本服务之使用或获得，进行复制、拷贝、出售、转售或用于任何其它商业目的。',
      ],
    },
    {
      title: '十五、关于使用及储存之一般措施',
      children: [
        '您承认关于本服务的使用亚威智云平台有权制订一般措施及限制，包含但不限于本服务将保留所张贴内容或其它上载内容之最长期间以及一定期间内您使用本服务之次数上限（及每次使用时间之上限）。通过本服务存储或传送之任何信息、通讯资料和其它内容，如被删除或未予储存，您同意亚威智云平台毋须承担任何责任。您亦同意，长时间未使用的帐号，亚威智云平台有权关闭。您也同意，亚威智云平台有权依其自行之考虑，不论通知与否，随时变更这些一般措施及限制。',
      ],
    },
    {
      title: '十六、服务之修改',
      children: [
        '亚威智云平台有权于任何时间暂时或永久修改或终止本服务（或其任何部分），而无论其通知与否。您同意对于本服务所作的任何修改、暂停或终止，亚威智云平台对您和任何第三人均无需承担任何责任。',
      ],
    },
    {
      title: '十七、终止服务',
      children: [
        '您同意亚威智云平台得基于其自行之考虑，因任何理由，包含但不限于缺乏使用，或亚威智云平台认为您已经违反本服务条款的文字及精神，终止您的密码、帐号或本服务之使用（或服务之任何部分），并将您在本服务内任何内容加以移除并删除。亚威智云平台亦得依其自行之考虑，于通知或未通知之情形下，随时终止本服务或其任何部分。您同意依本服务条款任何规定提供之本服务，无需进行事先通知即可中断或终止，您承认并同意，亚威智云平台可立即关闭或删除您的帐号及您帐号中所有相关信息及文件，及禁止继续使用前述文件或本服务。此外，您同意若本服务之使用被中断或终止或您的帐号及相关信息和文件被关闭或删除，亚威智云平台对您或任何第三人均不承担任何责任。',
      ],
    },
    {
      title: '十八、与广告商进行之交易',
      children: [
        '您通过本服务与广告商进行任何形式的通讯或商业往来，或参与促销活动，包含相关商品或服务之付款及交付，以及达成的其它任何相关条款、条件、保证或声明，完全为您与广告商之间之行为。有关法律法规有明文规定要求亚威智云平台承担责任以外，您因前述任何交易或前述广告商而遭受的任何性质的损失或损害，亚威智云平台均不予负责。',
      ],
    },
    {
      title: '十九、链接',
      children: [
        '“服务”或第三者均可提供与其他网站或资源的链接。由于亚威智云平台并不控制该等网站和资源，您承认并同意，亚威智云平台并不对该等外在网站或资源的可用性负责，且不认可该等网站或资源上或可从该等网站或资源获取的任何内容、宣传、产品、服务或其他材料，也不对其等负责或承担任何责任。您进一步承认和同意，对于任何因使用或信赖从此类网站或资源上获取的此类内容、宣传、产品、服务或其他材料而造成（或声称造成）的任何直接或间接损失，亚威智云平台均不承担责任。',
      ],
    },
    {
      title: '二十、亚威智云平台之专属权利',
      children: [
        '您了解并同意，本服务及本服务所使用之相关软件（以下简称“软件”）含有受到相关知识产权及其它法律保护之专有保密资料。您也了解并同意，经由本服务或广告商向您呈现之赞助广告或信息所包含之内容，亦受到著作权、商标权、服务商标、专利权或其它专属权利之法律保护。未经亚威智云平台或广告商明示授权，您不得修改、出租、出借、出售、散布本服务或软件之任何部份或全部，或据以制作衍生著作，或使用擅自修改后的软件，包括但不限于为了未经授权而使用本服务之目的。亚威智云平台仅授予您个人、不可移转及非专属之使用权，使您得于单机计算机使用其软件之目的码，但您不得（并不得允许任何第三人）复制、修改、创作衍生著作、进行还原工程、反向组译，或以其它方式发现原始码，或出售、转让、再授权或提供软件设定担保，或以其它方式移转软件之任何权利。您同意将通过由亚威智云平台所提供的界面而非任何其它途径使用本服务。',
      ],
    },
    {
      title: '二十一、担保与保证',
      children: [
        '您明确了解并同意∶',
        '（1）本服务条款的任何规定不会免除亚威智云平台对造成您人身伤害的、或因故意或重大过失造成您财产损失的任何责任。',
        '（2）您使用本服务之风险由您个人负担。本服务系依“现状”及“现有”基础提供。亚威智云平台对本服务不提供任何明示或默示的担保或保证，包含但不限于商业适售性、特定目的之适用性及未侵害他人权利等担保或保证。',
        '（3）亚威智云平台不保证以下事项∶本服务将符合您的要求，本服务将不受干扰、及时提供、安全可靠或不会出错，使用本服务取得之结果正确可靠，您经由本服务购买或取得之任何产品、服务、资讯或其它信息将符合您的期望，且软件中任何错误都将得到更正。',
        '（4）是否使用本服务下载或取得任何资料应由您自行考虑且自负风险，因任何资料之下载而导致的您电脑系统之任何损坏或数据流失等后果，由您自行承担。',
        '（5）您自亚威智云平台或经由本服务取得的任何建议或信息，无论是书面或口头形式，除非本服务条款有明确规定，将不构成本服务条款以外之任何保证。',
      ],
    },
    {
      title: '二十二、责任限制',
      children: [
        '您明确了解并同意，基于以下原因而造成的，包括但不限于利润、信誉、应用、数据损失或其它无形损失，亚威智云平台不承担任何直接、间接、附带、特别、衍生性或惩罚性赔偿责任（即使亚威智云平台事先已被告知发生此种赔偿之可能性亦然）：本服务之使用或无法使用；为替换从或通过本服务购买或取得之任何商品、数据、信息、服务，收到的讯息，或缔结之交易而发生的成本；您的传输或数据遭到未获授权的存取或变造；任何第三方在本服务中所作之声明或行为；与本服务相关的其它事宜，但本服务条款有明确规定的除外。',
      ],
    },
    {
      title: '二十三、通知',
      children: [
        '向您发出的通知可经由站内消息、电子邮件、普通邮件和手机短信告之。本服务条款或其它事项有所变更时，本服务一般将向您显示此种通知或与该通知相关之链结。',
      ],
    },
    {
      title: '二十四、用户专属权利',
      children: [
        '亚威智云平台尊重他人知识产权，呼吁用户也要同样尊重知识产权。若您认为您的作品的著作权遭到侵害或您的知识产权被侵犯，请向亚威智云平台之著作权代理人提供以下资料∶著作权或其它知识产权所有人之有权代理人之电子或实体签名。对您主张遭到侵权之作品或知识产权进行的描述。对您主张遭到侵权之作品在网站上所处的位置进行的描述。您的地址、电话号码及电子邮件地址。您一秉善意所作的认为该有争议的使用未经著作权或其它知识产权所有人、其代理人或依照法律授权之声明。您已充分了解做虚假指证的全部法律后果，在此前提下您保证所提供的前述资料均为合法的、正确的，并且您是著作权或知识产权的所有人或已经合法授权有权代理著作权或知识产权的所有人。',
      ],
    },
    {
      title: '二十五、一般条款',
      children: [
        '本服务条款构成您与亚威智云平台之全部协议，并规范您对于本服务之使用行为，并取代您先前与亚威智云平台所达成的全部协议。在您使用相关服务、使用第三方提供的内容或软件时，亦应遵从所适用之附加条款及条件。本服务条款及您与亚威智云平台之关系，均受到中华人民共和国法律管辖。亚威智云平台未行使或执行本服务条款任何权利或规定，不构成对前述权利或权利之放弃。倘本服务条款之任何规定因与中华人民共和国法律抵触而无效，您依然同意应依照法律，努力使该规定所反映之当事人意向具备效力，且本服务条款其它规定仍应具有完整的效力及效果。本服务条款之标题仅供方便而设，不具任何法律或契约效果。',
      ],
    },
    {
      title: '二十六、举报',
      children: [
        '倘发现任何违反本服务条款之事，请通知亚威智云平台相关负责人。',
      ],
    },
    
  ];
export default class App extends React.Component {
  render() {
    return (
        <>
        <UiHeader
        title="服务协议"
        onBack={() => {
          DeviceEventEmitter.emit("EventType");
          $fns.route({
            context: this,
            type: 'back',
          });
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}>

      
          <ScrollView
            style={{
              marginHorizontal: 5,
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
                    marginTop:10,
                    marginBottom: 8,
                    lineHeight: 15,
                  }}>
                  为切实保护用户隐私权，优化用户体验，亚威智云平台（下称“亚威平台”或“我们”）根据现行法规及政策，制定本亚威平台隐私权政策。亚威了解个人信息对客户的重要性，我们力求明确说明我们获取、管理及保护用户个人信息的政策及措施。本隐私权政策包含了我们收集、存储、使用、共享和保护您的个人信息的条款，我们希望通过本隐私权政策向您清晰地介绍我们对您个人信息的处理方式，因此我们建议您完整地阅读本隐私权政策，以帮助您了解维护自己隐私权的方式。
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
                      <View style={{marginTop: 5, paddingLeft: 15}} key={indexs}>
                        <Text style={{fontSize: 10}}>{items}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
     
  
      </View>
   </>
    );
  }
}
