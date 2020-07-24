<template>
  <div>
    <panel header="申请中" :list="applyList" type="1" @on-click-item="handlePanelClick"></panel>
    <panel header="借用中" :list="lendOutlist" type="1" @on-click-item="handlePanelClick2"></panel>
    <br><br><br>
    <div v-transfer-dom>
      <actionsheet v-model="show1" :menus="menu1" @on-click-menu="doAction" show-cancel>
      </actionsheet>
      <actionsheet v-model="show2" :menus="menu2" @on-click-menu="doAction" show-cancel>
      </actionsheet>
    </div>
    <sampleView ref="sv" @Closed="sampleColse"></sampleView>
  </div>
</template>

<script>
import { Actionsheet, TransferDom, Panel, } from "vux";
import dd from "dingtalk-jsapi";
import sampleView from "./components/sampleView";
export default {
  directives: {
    TransferDom
  },
  components: {
    Panel,
    Actionsheet,
    sampleView
  },

  data() {
    return {
      menu1: {
        info: "详细信息",
        cancelLend: "取消借用"
      },
      menu2: {
        info: "详细信息"
      },

      applyList: [],
      lendOutlist: [],
      currentItem: {},
      show1: false,
      show2: false
    };
  },
  mounted() {
    let _this = this;
    this.getData();

    this.setNav();
    this.$vux.loading.hide();
  },

  methods: {
    setNav() {

      let _this = this;
      if (dd.other) this.isdd = false;
      else {
        dd.biz.navigation.setRight({
          show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
          control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
          text: "刷新", //控制显示文本，空字符串表示显示默认文本
          onSuccess: function (result) {
            //如果control为true，则onSuccess将在发生按钮点击事件被回调
            _this.getData();
          }
        });
        dd.biz.navigation.setTitle({
          title: "已借样衣" //控制标题文本，空字符串表示显示默认文本
        });
      }

    },
    sampleColse() {
      this.setNav();
    },
    doAction(menuKey, menuItem) {
      // console.log(menuKey, menuItem);
      if (menuKey == "info") {
        this.showSample();
      } else if (menuKey == "cancelLend") {
        this.cancelLend();
      }
    },
    getData() {
      this.applyList = [];
      this.lendOutlist = [];
      this.getLendOutListFromServer().then(list => {
        let showlist = this.getShowLendList(list);
        showlist.map(item => {
          if (item.State == 1) {
            this.applyList.push(item);
          } else {
            this.lendOutlist.push(item);
          }
        });
      });
    },
    cancelLend() {
      //取消借用
      this.show = false;
      this.$util
        .post("apiaction/LendOut/cancelLend", { StyleId: this.currentItem.StyleId })
        .then(result => {
          this.$util.removeByValue(this.applyList, this.currentItem);
        });
    },

    showSample() {
      // this.$router.push({
      //   path: "/sampleinfo/" + this.currentItem.StyleId,
      //   query: { showlend: false }
      // });
      this.$refs.sv.ShowSample(this.currentItem.StyleId);
      this.show = false;
    },
    getLendOutListFromServer() {
      return new Promise(resolve => {
        this.$util.get("apiaction/LendOut/GetLendOutList").then(result => {
          resolve(result.data);
        });
      });
    },
    handlePanelClick(item) {
      this.currentItem = item;
      this.show1 = true;
    },
    handlePanelClick2(item) {
      this.currentItem = item;
      this.show2 = true;
    },
    DateMinus(date1, date2) {
      var sdate = new Date(date1);
      var now = new Date(date2);
      var days = now.getTime() - sdate.getTime();
      var day = parseInt(days / (1000 * 60 * 60 * 24));
      return day == 0 ? 1 : day;
    },
    getShowLendList(ls) {
      //取数据
      console.log("sample:", ls);
      let pichost = this.$util.fileUrl;
      let list = ls.list.map(item => {
        let titlestr = item.StyleId + '[审批中]';
        if (item.LendOutDate != null) {
          item.lendOutDay = this.DateMinus(item.LendOutDate, new Date());
          titlestr = (item.lendOutDay < item.LendDay) ? "<span style='color:#57a3f3'>" + item.StyleId + "[已借用" + item.lendOutDay + "天]</span>"
            : "<span style='color:#ed4014'>" + item.StyleId + "[已超期" + (item.lendOutDay - item.LendDay) + "天]</span>";
        }
        let obj = {
          src: pichost + "/src/sample/pic/MinPic/" + item.StylePic,
          title: titlestr,
          StyleId: item.StyleId,
          State: item.State,
          asLend: item.AsLend,
          desc: "<P>" + (item.LendOutDate == null ? '' : '借用日期:' + this.$util.getGmtDate(item.LendOutDate) + "</P><P>"
            + "申请借用:" + item.LendDay + "天" + "&nbsp借样用途:" + item.LendPurpose) + "</P>"
            + "<p>款号:" + item.StyleNo + "</p>"
        };
        return obj;
      });
      return list;
    }
  }
};
</script>

<style>
.vux-demo {
  text-align: center;
}
.logo {
  width: 100px;
  height: 100px;
}
</style>
