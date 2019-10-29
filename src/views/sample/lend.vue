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
      <popup v-model="showPopup">
        <div class="popup2">
          <group title="填写借用信息">
            <!-- <p>{{lendDay}},{{checkValue}}</p> -->
            <x-number title="借用天数" v-model="lendDay" width="100px" :min="1" :max="30"></x-number>
          </group>
          <group>
            <checklist title="选择用途" required :options="commonList" :max="1" v-model="checkValue"></checklist>
          </group>
          <group>
            <x-button type="primary" @click.native="doApplyLendOut" :disabled="isButtonDisable">确定</x-button>
            <x-button type="default" @click.native="showPopup=false">取消</x-button>
            <br>
          </group>
        </div>
      </popup>
    </div>
    <sampleView ref="sv" @Closed="sampleColse"></sampleView>
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
  Popup,
  Confirm,
  XNumber,
  Checklist
} from "vux";
import dd from "dingtalk-jsapi";
import sampleView from "./components/sampleView";
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
    Actionsheet,
    Popup,
    XNumber,
    Checklist,
    sampleView
  },
  inject: ['reload'],
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
      ic: 1,
      showPopup: false,
      lendDay: 7,
      commonList: [],
      checkValue: [],
    };
  },
  computed: {
    list: function () {
      if (this.lendlist.length > 0) {
        return this.getShowLendList(this.lendlist);
      } else return null;
    },
    isButtonDisable: function () {
      if (this.checkValue.length > 0) return false;
      else return true;
    }
  },
  mounted() {

    this.getLendListFromServer().then(p => {
      this.lendlist = p;
    });
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
          text: "申请借用", //控制显示文本，空字符串表示显示默认文本
          onSuccess: function (result) {
            //如果control为true，则onSuccess将在发生按钮点击事件被回调
            console.log("点申请借用");
            _this.applyLendOutConfirm();
          }
        });
        dd.biz.navigation.setTitle({
          title: "扫码借样" //控制标题文本，空字符串表示显示默认文本
        });
      }
    },
    sampleColse() {
      this.setNav();
    },
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
          "不在库内或不可外借，是否继续发起申请。";
        this.showConfirm = true;
      };

    },
    handChacel() {
      (this.confirmstr = ""), (this.showConfirm = false);
    },
    async applyLendOut() {
      let re = await this.$util.get("/Public/GetPurpose");
      console.log("s", re);
      this.commonList = re.data;
      this.confirmstr = "";
      this.showPopup = true;
    },
    doApplyLendOut() {

      let lendIdList = this.lendlist.map(item => {
        return item.Id;
      });
      let requestObj = {
        lendIdList,
        lendDay: this.lendDay,
        lendPurpost: this.checkValue[0]
      }

      this.$util.post("/LendOut/ApplyLendOut", requestObj).then(result => {
        this.$vux.alert.show({
          title: "成功",
          content: "样衣外借申请已发出，等待管理员审批。"
        });

        this.reload();
        this.confirmstr = "";
      });
    },

    addLend() {
      //打开扫码添加借用
      let _this = this;
      dd.biz.util.scan({
        type: "all", // type 为 all、qrCode、barCode，默认是all。
        onSuccess: function (data) {
          let bg = data.text.indexOf("/SI") + 1;
          if (bg > 10) {
            let styleId = data.text.substring(bg, bg + 11);
            _this.$router.push("/sampleinfo/" + styleId);
          }
        },
        onFail: function (err) { }
      });
    },
    showSample() {
      this.$refs.sv.ShowSample(this.currentItem.StyleId);
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
