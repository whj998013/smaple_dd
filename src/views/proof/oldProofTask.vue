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
      proofList: [],
      isdd: true,
      showAction: false,
      menus1: {
        text: {
          label: "测试",
          type: 'info'
        },
        view: '查看',
      }
    };
  },
  methods: {
    handleActionClick(val) {
      console.log("action", val);
      if (val == "view") this.$bus.$emit("ShowProof", this.currentProof);
    },
    handlePanelClick(val) {
      this.currentProof = val.obj;
      this.menus1.text.label = '单号:' + val.obj.ProofOrderId + ' &nbsp(' + val.obj.Dydbh + ')' + "<br><span style='color:#666;font-size:12px;'>款号:" + val.obj.ProofStyle.ProofStyleNo + ", &nbsp客户:" + val.obj.ProofStyle.ClentName + ", &nbsp紧急度:" + val.obj.Urgency
        + " 业务:" + val.obj.ProofApplyUserName + "</span>";
      this.showAction = true;
    },

    async getData() {
      let l = await this.$util.get("/ProofMange/GetFinshPlanList");
      this.proofList = this.getShowList(l.data);
    },

    getShowList(ls) {
      let list = ls.map(item => {
        return {
          src: "ddd",
          title: '单号:' + item.ProofOrderId + ' &nbsp(' + item.Dydbh + ')',
          proofId: item.ProofOrderId,
          desc: "款号:" + item.ProofStyle.ProofStyleNo + ", &nbsp客户:" + item.ProofStyle.ClentName + ", &nbsp紧急度:" + item.Urgency
            + " <br>业务:" + item.ProofApplyUserName + ", &nbsp完成日期:" + this.$util.getGmtDate(item.FinshDate),
          obj: item,
        };
      });
      return list;
    },


  },
  mounted() {
    this.getData();

  },
  updated() {
    this.$bus.$emit("tabChange", 1);
  }

};
</script>

<style>
</style>
