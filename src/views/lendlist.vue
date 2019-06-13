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
  </div>
</template>

<script>
import {Actionsheet, Group, Cell, Panel, TransferDom, XButton } from "vux";
import dd from "dingtalk-jsapi";
export default {
  directives: {
    TransferDom
  },
  components: {
    Group,
    Cell,
    Panel,
    XButton,
    Actionsheet
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

    if (dd.other) this.isdd = false;
    else {
      dd.biz.navigation.setRight({
        show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
        control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
        text: "刷新", //控制显示文本，空字符串表示显示默认文本
        onSuccess: function(result) {
          //如果control为true，则onSuccess将在发生按钮点击事件被回调
          _this.getData();
        }
      });
      dd.biz.navigation.setTitle({
        title: "已借样衣" //控制标题文本，空字符串表示显示默认文本
      });
    }
    this.$vux.loading.hide();
  },
  methods: {
    doAction(menuKey, menuItem) {
      console.log(menuKey, menuItem);
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
          if (item.lendState == 1) {
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
        .post("/LendOut/cancelLend", { StyleId: this.currentItem.StyleId })
        .then(result => {
          this.$util.removeByValue(this.applyList, this.currentItem);
        });
    },

    showSample() {
      this.$router.push({
        path: "/sampleinfo/" + this.currentItem.StyleId,
        query: { showlend: false }
      });
      this.show = false;
    },
    getLendOutListFromServer() {
      return new Promise(resolve => {
        this.$util.get("/LendOut/GetLendOutList").then(result => {
          console.log(result);
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
    getShowLendList(ls) {
      //取数据
      console.log("sample:",ls);
      let pichost = this.$util.fileUrl;
      let list = ls.map(item => {
        let cf = this.$util.getMaterial(JSON.parse(item.Material));
        return {
          src: pichost + "/src/sample/pic/MinPic/" + item.Pic,
          title: item.StyleId + "&nbsp&nbsp[" + item.StatsText + "]",
          StyleId: item.StyleId,
          State: item.State,
          asLend: item.AsLend,
          lendState: item.LendState,
          desc:
            "款号:" +
            item.StyleNo +
            "，&nbsp针型:" +
            item.Gauge +
            "， &nbsp克重:" +
            item.Weight +
            "g， &nbsp成份:" +
            cf
        };
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
