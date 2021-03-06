<template>
<div v-if="canShow" class="preview-body">
	<p class="title">居住房屋租赁合同</p>
	<div class="rules-box">
		<p class="info">
			<span class="info-name">甲方（出租人）：</span>
			<span class="info-text">上海律阳资产管理有限公司</span>
		</p>
		<p class="info">
			<span class="info-name">乙方（承租人）：</span>
			<span class="info-text">{{info.CustomerName}}</span>
		</p>
		<p class="info info-text">根据《中华人民共和国合同法》等有关法律、法规的规定，甲、乙双方在平等、自愿、公平和诚实信用的基础上，经协商一致，就乙方承租甲方可依法出租的房屋事宜，订立本合同。</p>
	</div>
	<p class="sub-title">【条款内容】</p>
	<div class="rules-box">
		<p class="rules-title">第一条 出租房屋情况和租赁用途</p>
		<p class="text">甲方将坐落在<span class="fill">{{info.HouseName}}</span>（简称该房屋）出租给乙方。该房屋建筑面积为<span class="fill">{{info.Area}}</span>平方米。</p>
		<p class="text">1-2. 乙方向甲方承诺，承租该房屋仅用作居住使用。</p>
		<p class="text">1-3. 租赁期间，乙方可使用的该房屋公用或合用部位的使用范围，现有的装修、附属设施、设备状况以及需约定的有关事项，将于由甲、乙双方在房屋交接日分别在<span class="red">“寓多多租房”</span> 平台系统确认后，生成的<strong>《家具家电清单》</strong>中列明，该清单将作为甲方交付该房屋和本合同终止时乙方返还该房屋的验收依据。</p>
	</div>
	<div class="rules-box">
		<p class="rules-title">第二条 交付日期和租赁期限</p>
		<p class="text">2-1. 甲、乙双方约定，该房屋租赁期起止时间<span class="fill">{{info.StartDate}} 至 {{info.EndDate}}</span></p>
		<p class="text">2-2. 双方同意，甲方于<span class="fill">{{info.StartDate}}</span>前将该房屋交付给乙方，由乙方进行验收。逾期交付的，每逾期一日，则甲方需向乙方支付承租房屋日租金<span class="fill red">壹</span>倍的违约金。</p>
	</div>
	<div class="rules-box">
		<p class="rules-title">第三条 租金及支付方式</p>
		<p class="text">3-1.乙方于<span class="fill">{{info.ContractDate}}</span>支付定金<span class="fill">{{info.DingJin}}</span>元，此定金转为首期租金的一部分。</p>
		<p class="text">3-2. 甲、乙双方约定，在租赁期间内，该房屋的房屋押金为<span class="fill">{{info.ZongYaJin}}</span>（含其他押金）元，月租金<span class="fill">{{info.MonthlyRent}}</span>元。最后一期租期不足期的，以实际居住天数计算该期租金。在租赁期间内，未经双方协商一致，任何一方不得擅自调整租金标准。</p>
		<p class="text">3-3. 甲、乙双方约定，乙方应根据<span class="fill">提前{{info.AdvanceDays}}天收租</span> 的支付方式，分别于<span class="fill">{{info.PayDetail}}</span>（乙方系统账户中显示的最晚支付日与本合同约定不一致的，以系统显示的日期为准）支付该房屋租金及周期性费用。截止当期租金到期日最晚付款日乙方仍未支付的，每逾期一日，则乙方需向甲方支付承租房屋日租金  壹  倍的违约金。</p>
		<p class="text">
			3-4. 该房屋租赁期满后，甲乙双方协商一致续租的，则房屋押金自动转为该房屋续租押金，不足部分（若有）由乙方补足。租赁期满后甲、乙双方确认不续租或本合同解除后，房屋押金除用以抵扣应由乙方承担但尚未交纳的费用（包括但不限于<span class="red"> 租金、违约金，水电煤，钥匙</span>等本合同约定由乙方承担的费用）外，剩余部分（若有）应无息退还乙方。
		</p>
	</div>
	<div class="rules-box">
		<p class="rules-title">第四条 其他相关费用</p>
		<p class="text">
			4-1. 租赁期限内，该房屋所发生的：<strong>水费、电费、煤气费、有线电视费、物业费、网络宽带费、室内设施维修材料费（人为损坏）
			等一切由乙方实际使用而产生的费用均有乙方承担，</strong>甲方承担的费用为：<strong>物业费</strong>
		</p>
		<p class="text">4-2.租赁期限内，对 <strong>水费、电费、煤气费做如下特别约定：</strong>（可选合租或整租）</p>
		<p class="text">（合租）按人均摊 ： 甲方负责计算每月该房屋所有水、电、燃气实际消费总和，再分配到每个人。所有水电燃气在国家规定的价格基础上甲方分别再另行加收水、天然气1 元/字、电0.2  元/字，（所有出账账单由甲方支付，多加的额外费用即为甲方的人员维护成本费用）水、电、天然气费用收取方式：甲方统一收取，乙方应向甲方按时支付，逾期产生滞纳金由乙方承担。逾期超过10日，则视为乙方违约。</p>
		<p class="text">（整租）因目前上海市的水费、电费、燃气费已经纳入了产权人的征信信誉，乙方必须在出具账单的当月内按时缴纳使用的水、电、燃气费用，不按时缴纳的视为违约处理。</p>
	</div>
	<div class="rules-box">
		<p class="rules-title">第五条 房屋使用要求和维修责任</p>
		<p class="text">5-1. 甲方应确保该房屋交付时符合规定的安全条件。租赁期间，乙方发现该房屋及本合同附件中列明的附属设施、设备有损坏或故障时，应及时通知甲方修复；甲方应在接到乙方通知后的<span class="red">7日内</span> 进行维修或委托乙方进行维修。 </p>
		<p class="text">甲方逾期不维修、也不委托乙方进行维修的，乙方可代为维修，费用由甲方承担。 </p>
		<p class="text">5-2. 乙方应对该房屋的使用安全负责。租赁期间，乙方应合理使用并爱护该房屋及其附属设施、设备，因乙方使用不当或不合理使用，致使该房屋及其附属设施、设备损坏或发生故障的，乙方应负责修复。 </p>
		<p class="text">乙方不维修的，甲方可代为维修，费用由乙方承担。 </p>
		<p class="text">5-3. 租赁期间，甲方应定期对该房屋进行检查、养护，保证该房屋及其附属设施、设备处于正常的可使用和安全的状态。甲方应在检查养护前<span class="red">3日</span>通知乙方。检查养护时，乙方应予以配合。甲方应减少对乙方使用该房屋的影响。 </p>
		<p class="text">5-4. 租赁期间，甲方可以授权第三方机构察看房屋安全情况。乙方违反国家和本市有关房屋租赁的规定，致使房屋在使用过程中出现安全隐患，被管理部门责令改正的，第三方机构可以代为整改，并可采取必要措施，保证房屋使用安全，因此产生的损失，由乙方承担。</p>
	</div>
	<div class="rules-box">
		<p class="rules-title">第六条 转租、承租权转让和交换</p>
		<p class="text">6-1. 租赁期间，乙方无转租权。 </p>
		<p class="text">6-2. 租赁期间，乙方不得将该房屋转让给他人承租或与他人承租的居住房屋进行交换。 </p>
	</div>
	<div class="rules-box">
		<p class="rules-title">第七条 放弃优先购买权</p>
		<p class="text">7-1.乙方放弃对该房屋的优先购买权。 </p>
	</div>
	<div class="rules-box">
		<p class="rules-title">第八条 续租</p>
		<p class="text">8-1. 该房屋租赁期限届满、乙方需继续承租的，乙方应于租赁期限届满前三十日内在<span class="red">＂寓多多租房＂</span> 平台提出续租申请，经甲、乙双方协商一致后，由甲方录入续租租约。乙方支付续租账单（包括但不限于支付租金或补足续租押金）即视为乙方已完全了解续租租期、续租租金等重要信息并确认该续租合同，与甲方建立房屋租赁关系。乙方不续租的，甲方有权在租赁期限届满前三十日内带人看房，乙方需给予配合。</p>
	</div>
	<div class="rules-box">
		<p class="rules-title">第九条 房屋返还</p>
		<p class="text">9-1. 除甲方同意乙方续租外，乙方应在本合同的租期届满后 当日内返还该房屋。 </p>
		<p class="text">9-2. 乙方未经甲方书面同意逾期返还该房屋的，每逾期一日，乙方应按该房屋日租金的<span class="fill">叁</span>倍向甲方支付房屋占用费。 </p>
		<p class="text">9-3. 除本合同附件另有约定外，乙方返还该房屋时，该房屋及其装修、附属设施和设备应当符合正常使用后的状态。经甲方书面验收认可后，相互结清各自应当承担的费用。 </p>
	</div>
	<div class="rules-box">
		<p class="rules-title">第十条 解除本合同的条件</p>
		<p class="text">10-1. 甲、乙双方同意在租赁期内，有下列情形之一的，本合同解除，双方互不担责： </p>
		<p class="text">（一）该房屋占用范围内的土地使用权依法提前收回的； </p>
		<p class="text">（二）该房屋因公共利益需要被依法征收的； </p>
		<p class="text">（三）该房屋因城市建设需要被依法列入房屋拆迁许可范围的； </p>
		<p class="text">（四）该房屋因不可抗力原因毁损、灭失，致使乙方不能正常使用的； </p>
		<p class="text">（五）签订本合同时，甲方已告知乙方该房屋已设定抵押，租赁期间被处分的； </p>
		<p class="text">（六）甲乙双方协商一致解除本合同的。 </p>
		<p class="text">10-2. 甲、乙双方同意，甲方有下列情形之一的，乙方可书面通知甲方解除本合同，并有权要求甲方赔偿损失。 </p>
		<p class="text">（一）甲方未按合同约定按时交付该房屋，经乙方书面催告后<span class="red"> 3 </span>日内仍未交付的； </p>
		<p class="text">（二）甲方交付的该房屋不符合本合同约定或存在重大质量缺陷，致使乙方不能正常使用的；</p>
		<p class="text">10-3. 甲、乙双方同意，乙方有下列情形之一的，甲方可书面通知乙方解除本合同，并有权要求乙方赔偿损失。 </p>
		<p class="text">（一）乙方擅自改变房屋居住用途的； </p>
		<p class="text">（二）因乙方原因造成房屋结构损坏的； </p>
		<p class="text">（三）乙方擅自转租该房屋、转让该房屋承租权或与他人交换各自承租的房屋的； </p>
		<p class="text">（四）乙方擅自增加承租同住人，或人均承租建筑面积、使用面积低于规定标准的（居住房屋人均建筑面积不低于10平方米，且人均使用面积不低于7平方米）； </p>
		<p class="text">（五）乙方利用承租的居住房屋从事违法违规活动的； </p>
		<p class="text">（六）乙方逾期不支付本合同项下约定由乙方承担的费用的（包括但不限于房屋押金、租金、水电煤费用等）； </p>
		<p class="text">（七）乙方擅自将该房屋钥匙交付或配给非居住人员的； </p>
		<p class="text">（八）乙方隐瞒、漏报、谎报自身传染性疾病或隐性疾病的；</p>
		<p class="text">（九）乙方在未承租的房间堆放私人物品的。 </p>
		<p class="text">（十）若乙方未支付房租逾期超过七日，则视为乙方自动退租，构成违约，甲方有权收回房屋，房屋内物品经由甲方告知后仍未搬离的，甲方视为乙方丢弃直接处理还一并追究乙方违约责任。</p>
	</div>
	<div class="rules-box">
		<p class="rules-title">第十一条 违约责任</p>
		<p class="text">11-1. 该房屋交付验收时，现有的装修、附属设施、设备存在缺陷，影响乙方正常使用的，甲方应自交付之日起的<span class="red">7 </span>  日内进行修复。逾期不修复的，甲方同意减少该房屋的租金并变更相关条款和附件内容。 </p>
		<p class="text">11-2. 乙方未征得甲方书面同意或者超出甲方书面同意的范围擅自装修房屋或者增设附属设施的，甲方可以要求乙方恢复房屋原状并赔偿损失。 </p>
		<p class="text">11-3. 租赁期间，非本合同约定的情况，甲方提前解除合同，甲方应向乙方支付一个月房屋租金作为违约金。若违约金不足抵付乙方损失的，甲方还应负责赔偿。 </p>
		<p class="text">11-4. 租赁期间，非本合同约定的情况，乙方中途擅自退租的，乙方应向甲方支付一个月房屋租金作为违约金。若违约金不足抵付甲方损失的，乙方还应负责赔偿。 </p>
		<p class="text">11-5. 租赁期间，甲方有本合同第10-2条约定情形之一的，应向乙方支付一个月房屋租金作为违约金，若违约金不足抵付乙方损失的，甲方还应负责赔偿。 </p>
		<p class="text">11-6. 租赁期间，乙方有本合同第10-3条约定情形之一的，应向甲方支付一个月房屋租金作为违约金，若违约金不足抵付甲方损失的，乙方还应负责赔偿。 </p>
	</div>
	<div class="rules-box">
		<p class="rules-title">第十二条 解决争议的方式</p>
		<p class="text">12-1. 本合同由中华人民共和国法律、法规管辖。 </p>
		<p class="text">12-2. 双方在履行本合同过程中若发生争议的，甲、乙双方可协商解决或者向人民调解委员会申请调解，也可选择下列第二种方式解决： </p>
		<p class="text">（一）提交当地仲裁委员会仲裁； </p>
		<p class="text">（二）依法向人民法院提起诉讼。 </p>
	</div>
	<div class="rules-box">
		<p class="rules-title">第十三条 其他条款</p>
		<p class="text">13-1. 本合同未尽事宜，经甲、乙双方协商一致，可订立补充条款。本合同补充条款及附件，为本合同不可分割的一部分。 </p>
		<p class="text">13-2. 甲方联系地址：<span class="fill">徐汇区钦州北路953号512室</span>，乙方联系地址：<span class="fill">{{info.CustomerAddress}}</span>，甲、乙双方向前述对方联系地址以挂号信方式邮寄法律文书的，即视为法律文书已经通知并送达对方。</p>
		<p class="text">13-3. <strong>本合同为电子合同，经乙方在本系统点击”确认签署“或支付本合同项下账单（该房屋租金及/或押金账单）后生效。</strong></p>
		<p class="text">13-4. 本合同生效后，甲、乙双方对合同内容的变更或补充应另行订立电子合同，作为本合同的附件。本合同附件与本合同具有同等法律效力。 </p>
	</div>
	<div class="rules-box">
		<p class="rules-title">其它内容</p>
		<p class="text">备注及补充条款：<span class="fill">{{info.ContractRemark}}</span></p>
	</div>
	<div class="rules-box">
		<p class="big-img">
			<img :src="info.ContractPhoto?info.ContractPhoto[0]:''">
		</p>
		<p class="big-img">
			<img :src="info.ContractPhoto?info.ContractPhoto[1]:''">
		</p>
	</div>
	<div class="rules-box rules-signature">
		<p class="info">
			<span class="info-name">甲方：</span>
			<span class="info-text">上海律阳资产管理有限公司</span>
		</p>
		<p class="info">
			<span class="info-name">经营许可证号：</span>
			<span class="info-text">41000000201705270030 </span>
		</p>
		<p class="info">
			<span class="info-name">经办人：</span>
			<span class="info-text">{{info.SysName}}</span>
		</p>
		<p class="info">
			<span class="info-name">客服电话：</span>
			<span class="info-text">400-025-6788</span>
		</p>
		<p class="info info-img">
			<span class="info-name">甲方盖章：</span>
			<img class="stamp" src="http://testapi.yudoodoo.com/wap/static/img/stamp.png"/>
		</p>
		<p class="info">
			<span class="info-name">日期：</span>
			<span class="info-text">{{info.ContractDate}}</span>
		</p>
	</div>
	<div class="rules-box rules-signature">
		<p class="info">
			<span class="info-name">乙方：</span>
			<span class="info-text">{{info.CustomerName}}</span>
		</p>
		<p class="info">
			<span class="info-name">证件类型：</span>
			<span class="info-text">{{setIDType(info.CardType)}}</span>
		</p>
		<p class="info">
			<span class="info-name">证件号码：</span>
			<span class="info-text">{{info.IdCardNo}}</span>
		</p>
		<p class="info">
			<span class="info-name">联系电话：</span>
			<span class="info-text">{{info.Mobile}}</span>
		</p>
		<p class="info info-img">
			<span class="info-name">乙方签名：</span>
			<img class="stamp stamp2" :src="info.CustomerSignature?info.CustomerSignature:''"/>
		</p>
		<p class="info">
			<span class="info-name">日期：</span>
			<span class="info-text">{{info.ContractDate}}</span>
		</p>
	</div>
</div>
</template>
<script>
import Vue from 'vue'
import vHeader from '../components/Header'
import tip from '../components/Toptip'
import { getUrlParams } from '../common/util'
import { contract } from '../common/api'
import BeiAn from '../components/BeiAn'

export default {
    data() {
        return {
            msg: "ContractPreview",
            info: {},
            uid: this.isLogin(),
            conId: getUrlParams('conId'),
            canShow: false //是否显示合同
        }
    },
    created() {
        this.setTitle('房屋租赁合同')
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            let _this = this
            //获取用户id判断是否登录
            if(!_this.uid){
                _this.goLogin()
                return
			}
            if(!_this.conId){
				_this.$vux.toast.text('合同ID获取失败', 'middle')
				_this.hideLoading()
                return
            }
            let data = {
                userid: _this.uid,
                contractid: _this.conId
            }
            //调接口使用数据
            // data = {
            //     userid: 'Tk9m*gZIFyY-',
            //     contractid: '1'
            // }
            contract(data).then(function(res){
                _this.hideLoading()
                if(res.ReturnCode == '0'){
                    _this.info = res.Data
                    _this.canShow = true
                }else if(res.ReturnCode == '110'){
                    _this.$vux.toast.text('没有当前合同编号的合同', 'middle')
                }else{
                    _this.$vux.toast.text('系统错误', 'middle')
                }
            })
        },
        //证件类型：1：身份证;2：护照；3：台胞证；4：港澳通行证
        setIDType(int) {
            let typeArr = ['', '身份证', '护照', '台胞证','港澳通行证']
            return typeArr[int]
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../assets/css/pages/contractPreview";
</style>

