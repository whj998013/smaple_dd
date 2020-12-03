<template>
  <div>
    <tab id="nav" v-model.number="tabIndex">
      <tab-item  @on-item-click="go('/proof/prooftask')">当前打样</tab-item>
      <tab-item @on-item-click="go('/proof/oldProofTask')">历史打样</tab-item>
    </tab>
    <div id="main">
      <router-view keep-alive></router-view>
    </div>
    <div v-transfer-dom>
      <popup v-model="showPopup" height="100%">
        <div class="popup1">
          <proofView ref="pv"></proofView><br>
          <x-button type="default" @click.native="closePopup">关闭</x-button>
          <x-button v-if="currnetProof.ProofStatusText=='打样中'" type="primary" @click.native="submitProof(currnetProof)">发起交样审批</x-button>
          <br>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="将提交样衣接收审批" @on-confirm="finshProof">
        <p style="text-align:center;">是否继续？</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import dd from "dingtalk-jsapi";
import { Tab, TabItem, Popup, TransferDom, XButton, Confirm } from "vux";
import proofView from "./proofView";
import { debug } from 'util';
import { connect } from 'net';

export default {
  directives: {
    TransferDom
  },
  components: {
    Tab, TabItem, Popup, XButton, proofView, Confirm
  },
  data() {
    return {
      tabIndex:0,
      msg: "Hello World!",
      isdd: true,
      showPopup: false,
      showConfirm: false,
      currnetProof: {},
    };
  },
  methods: {

    //关闭详情
    closePopup() {
      this.showPopup = false;
    },
    //路由跳转
    go(url) {
      this.$router.push(url);
    },
    //扫码
    scanCode() {
      let _this = this;
      dd.biz.util.scan({
        type: "all", // type 为 all、qrCode、barCode，默认是all。
        onSuccess: function (data) {
          //onSuccess将在扫码成功之后回调
          console.log(data);
          _this.getProofByBh(data.text);

        },
        onFail: function (err) {
        
        }
      })
    },
    getProofByBh(bh) {
      console.log(bh);
      this.$util.get("apiaction/ProofMange/GetProofOrderByBh/" + parseInt(bh)).then(re => {
        console.log(re);
        this.showProof(re.data);
      }).catch(err => {
         this.$vux.alert.show({
            title: '错误',
            content: '未找到该包号的打样单信息，该打样单也许未通过钉钉打样系统生成。'
          })
      });

    },

    //显示打样信息
    showProof(val) {
      this.currnetProof = val;
      this.showPopup = true;
      this.$refs.pv.show(val);

      console.log("showproof", val);
    },
    ///交样审批
    submitProof(val) {
      this.currnetProof = val;
      this.showConfirm = true;
    },
    tabChange(val){
        //debugger;
        this.tabIndex=val;
    },
    ///确认提交交样申请
    finshProof() {
      
      this.$util.get("apiaction/ProofMange/FinshProof/" + this.currnetProof.ProofOrderId).then(
        re => {
          this.$vux.alert.show({
            title: '成功',
            content: '已发出交样审批，请在钉钉审批中进行后续操作。'
          });
          this.currnetProof.ProofStatusText="交样";
          this.showPopup=false;
        }).catch(err => {
          //debugger;
          console.log("err", err.response.data.Message);
          
        })
    }

  },
  mounted() {
    let _this = this;
    if (dd.other) this.isdd = false;
    else {
      dd.biz.navigation.setRight({
        show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
        control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
        text: "扫码交样", //控制显示文本，空字符串表示显示默认文本
        onSuccess: function (result) {
          //如果control为true，则onSuccess将在发生按钮点击事件被回调
          
          _this.scanCode();
        }
      });
      dd.biz.navigation.setTitle({
        title: "打样管理" //控制标题文本，空字符串表示显示默认文本
      });
    }
    this.$bus.$on("ShowProof", this.showProof);
    this.$bus.$on("submitProof", this.submitProof);
    this.$bus.$on("tabChange", this.tabChange);
    this.$vux.loading.hide();
  }
};
</script>

<style>
#nav {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 400;
}

#main {
  width: 100%;
  margin-top: 35px;
  padding-top: 10px;
}
</style>
