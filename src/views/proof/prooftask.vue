<template>
  <div>
    <panel :list="proofList" type="2" @on-click-item="handlePanelClick"></panel>
    <actionsheet v-model="showAction" :menus="menus1" @on-click-menu="handleActionClick" show-cancel></actionsheet>
  </div>
</template>

<script>
import { Panel, Actionsheet } from "vux";
import dd from "dingtalk-jsapi";
export default {
  components: {
    Panel, Actionsheet
  },
  data() {
    return {
      currentProof: undefined,
      proofList: [],
      showAction: false,

      menus1: {
        text: {
          label: "测试",
          type: 'info'
        },
        view: '查看',
        submit: {
          type: 'disabled',
          value:"submit",
          label: '<span style="color:red">发起交样审批</span>',
        },
      }
    };
  },
  methods: {
    handleActionClick(val) {
    // debugger;
      if (val == "view") this.$bus.$emit("ShowProof", this.currentProof);
      if (val == "submit") this.$bus.$emit("submitProof", this.currentProof);
    },


    async getData() {
      let l = await this.$util.get("apiaction/ProofMange/GetProofPlanList");
      this.proofList = this.getShowList(l.data);
    },

    getShowList(ls) {
      let list = ls.map(item => {
        return {
          src: "ddd",
          title: '单号:' + item.ProofOrderId + ' &nbsp(' + item.Dydbh + ')' + '<span style="color:#FF0000;font-size:10px">-' + item.ProofStatusText + "</span>",
          proofId: item.ProofOrderId,
          desc: "款号:" + item.ProofStyle.ProofStyleNo + ", &nbsp客户:" + item.ProofStyle.ClentName + ", &nbsp紧急度:" + item.Urgency
            + " <br>业务:" + item.ProofApplyUserName + ", &nbsp要求交样日期:" + this.$util.getGmtDate(item.RequiredDate),
          obj: item,
        };
      });
      return list;
    },

    handlePanelClick(val) {

      this.currentProof = val.obj;
      this.menus1.text.label = '单号:' + val.obj.ProofOrderId + ' &nbsp(' + val.obj.Dydbh + ')' + "<br><span style='color:#666;font-size:12px;'>款号:" + val.obj.ProofStyle.ProofStyleNo + ", &nbsp客户:" + val.obj.ProofStyle.ClentName + ", &nbsp紧急度:" + val.obj.Urgency
        + " 业务:" + val.obj.ProofApplyUserName + "</span>";
      if (this.currentProof.ProofStatusText != "打样中") {
        this.menus1.submit.type = 'disabled';
        this.menus1.submit.label = ' <span>发起交样审批</span>';
      } else {
        this.menus1.submit.type = '';
        this.menus1.submit.label = '<span style="color:red">发起交样审批</span>';
      }
      this.showAction = true;
     
    }
  },
  mounted() {
    this.getData();
  },
    updated() {
    this.$bus.$emit("tabChange", 0);
  }
};
</script>
<style>
</style>
