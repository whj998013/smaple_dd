<template>
  <div>
    <panel header="待借用清单&nbsp&nbsp(点'申请借用'发起借用申请）" :list="list" type="1" @on-click-item="handlePanelClick"></panel>
    <div>
      <span style="text-align: center;display:block;">
        <x-icon type="ios-plus" size="50" class="icon-red" style="padding:10 0 0 0;" @click="addLend"></x-icon>
      </span>
    </div>
    <x-button v-if="!isdd" type="primary" @click.native="applyLendOutConfirm">申请借用</x-button>
    <br>
    <br>
    <br>
    <div v-transfer-dom>

      <actionsheet v-model="show" :menus="menu" @on-click-menu="doAction" show-cancel>
      </actionsheet>
      <confirm v-model="showConfirm" title="确定吗" @on-cancel="handChacel" @on-confirm="applyLendOut">
        <p style="text-align:center;">{{confirmstr}}</p>
      </confirm>
    </div>
  </div>

</template>

<script>
import {
  Actionsheet,
  Group,
  Cell,
  Panel,
  TransferDom,
  XButton,
  Confirm
} from "vux";
import dd from "dingtalk-jsapi";
export default {
  directives: {
    TransferDom
  },
  components: {
    Group,
    XButton,
    Cell,
    Panel,
    Confirm,
    Actionsheet
  },
  inject:['reload'],
  data() {
    return {
      menu: {
        info: "详细信息",
        delete: "删除"
      },
      footer: {
        title: "点加号添加其它样衣"
      },
      currentLendOutNo: "",
      isdd: true,
      show: false,
      showConfirm: false,
      confirmstr: "",
      currentItem: {},
      lendlist: [],
      ic: 1
    };
  },
  computed: {
    list: function() {
      if (this.lendlist.length > 0) {
        return this.getShowLendList(this.lendlist);
      } else return null;
    }
  },
  mounted() {
    let _this = this;
    this.getLendListFromServer().then(p => {
      _this.lendlist = p;
    });
    if (dd.other) this.isdd = false;
    else {
      dd.biz.navigation.setRight({
        show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
        control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
        text: "申请借用", //控制显示文本，空字符串表示显示默认文本
        onSuccess: function(result) {
          //如果control为true，则onSuccess将在发生按钮点击事件被回调
          console.log("点申请借用");
          _this.applyLendOutConfirm();
        }
      });
      dd.biz.navigation.setTitle({
        title: "扫码借样" //控制标题文本，空字符串表示显示默认文本
      });
    }
    this.$vux.loading.hide();
  },

  methods: {
    doAction(menuKey, menuItem) {
      console.log(menuKey, menuItem);
      if (menuKey == "info") {
        this.showSample();
      } else if (menuKey == "delete") {
        this.deleteLend();
      }
    },
    applyLendOutConfirm() {
      //申请借用

      this.list.forEach(item => {
        if (!item.asLend) this.confirmstr += " [" + item.StyleId + "] ";
      });
      if (this.confirmstr == "") {
        this.applyLendOut();
      } else {
        this.confirmstr =
          "样衣:" +
          this.confirmstr +
<<<<<<< HEAD:src/views/lend.vue
          "被标记为不在库内或不可外借，是否继续发起申请？";
=======
          "不在库内或不可外借，是否继续发起申请。";
>>>>>>> master:src/views/sample/lend.vue
        this.showConfirm = true;
      };
     
    },
    handChacel() {
      (this.confirmstr = ""), (this.showConfirm = false);
    },
    applyLendOut() {
      let lendIdList = this.lendlist.map(item => {
        return item.Id;
      });
      this.$util.post("/LendOut/ApplyLendOut", lendIdList).then(result => {
        this.$vux.alert.show({
          title: "成功",
          content: "样衣外借申请已发出，等待管理员审批。"
        });
        
        this.reload();
        this.confirmstr="";
      });
    },

    addLend() {
      //打开扫码添加借用
      let _this = this;
      dd.biz.util.scan({
        type: "all", // type 为 all、qrCode、barCode，默认是all。
        onSuccess: function(data) {
          let bg = data.text.indexOf("/SI") + 1;
          if (bg > 10) {
            let styleId = data.text.substring(bg, bg + 11);
            _this.$router.push("/sampleinfo/" + styleId);
          }
        },
        onFail: function(err) {}
      });
    },
    showSample() {
      this.$router.push({
        path: "/sampleinfo/" + this.currentItem.StyleId,
        query: { showlend: false }
      });
      this.show = false;
    },
    deleteLend() {
      console.log("currtenitem:", this.currentItem);
      this.$util
        .post("/lendOut/deleteLend", [this.currentItem.Id])
        .then(result => {
          console.log(this.lendlist);
          for (var i = 0; i < this.lendlist.length; i++) {
            console.log("delete lend");
            if (this.lendlist[i].StyleId == this.currentItem.StyleId) {
              this.lendlist.splice(i, 1);
              break;
            }
          }
        });

      this.show = false;
    },
    handlePanelClick(item) {
      this.currentItem = item;
      this.show = true;
    },
    getData() {
      this.getLendListFromServer().then(p => {
      _this.lendlist = p;
    });;
    },
    getLendListFromServer() {
      return new Promise(resolve => {
        this.$util.get("/LendOut/GetLendList").then(result => {
          resolve(result.data);
        });
      });
    },

    getShowLendList(ls) {
      //取数据
      let pichost = this.$util.fileUrl;
      let list = ls.map(item => {
        let cf = this.$util.getMaterial(JSON.parse(item.Material));
        return {
          src: pichost + "/src/sample/pic/MinPic/" + item.Pic,
          title: item.StyleId + "&nbsp&nbsp[" + item.StatsText + "]",
          StyleId: item.StyleId,
          asLend: item.AsLend,
          Id: item.Id,
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
.vux-x-icon {
  fill: #f70968;
}
</style>
