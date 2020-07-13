<template>
  <div>
    <search v-show="isShowSeach" v-model="seachValue" @on-cancel="onCancel" @on-submit="onSubmit" position="absolute" ref="search"></search>
    <x-button v-if="!isdd" type="primary" @click.native="showSeach">搜索</x-button>
    <panel id="S_content" :header="'共有'+seachObj.total+'款样衣'" :list="sampleList" type="1" @on-click-item="handlePanelClick"></panel>
    <load-more :show-loading="loading" :tip="tips"></load-more>
    <br>
    <br>
    <div v-transfer-dom>
      <actionsheet v-model="show2" :menus="menu2" @on-click-menu="doAction" show-cancel>
      </actionsheet>
    </div>
    <sampleView ref="sv" @Closed="sampleColse"></sampleView>
  </div>
</template>

<script>
import {
  Search,
  Actionsheet,
  Group,
  Cell,
  Panel,
  TransferDom,
  XButton,
  LoadMore
} from "vux";
import dd from "dingtalk-jsapi";
import sampleView from "./components/sampleView"
export default {
  directives: {
    TransferDom
  },
  components: {
    Search,
    Group,
    Cell,
    Panel,
    XButton,
    Actionsheet,
    LoadMore,
    sampleView
  },
  data() {
    return {
      show2: false,
      menu2: {
        info: "详细信息"
      },
      currentItem: {},
      isdd: true,
      isShowSeach: false,
      seachValue: "",
      sampleList: [],
      data: [],
      REQUIRE: true,
      loading: false,
      tips: "",
      seachObj: {
        current: 1,
        total: 0,
        pageSize: 20,
        Key: "", //关建词
        dateValue: [], //日期区间
        State: 0, //状态,
        UserId: []
      }
    };
  },
  methods: {
    sampleColse() {
      this.setNav();
    },
    onSubmit() {
      this.seachObj.Key = this.seachValue;
      this.seachObj.current = 1;
      this.REQUIRE = true;
      this.data = [];
      this.sampleList = [];
      this.tips = "";
      this.getData();
    },
    doAction(menuKey, menuItem) {
      if (menuKey == "info") {
        this.showSample();
      }
    },
    showSample() {
      this.$refs.sv.ShowSample(this.currentItem.StyleId);
      this.show = false;
    },
    showSeach() {
      this.isShowSeach = true;

      this.$nextTick(() => {
        this.$refs.search.setFocus();
        document.body.scrollTop = 0;
      });
    },
    onCancel() {
     
      this.isShowSeach = false;
      this.seachValue = "";
      if (this.seachObj.Key != "") {
        this.seachObj.Key = "";
        this.seachObj.current = 1;
        this.tips = "";
        this.getData();
      }
    },
    handlePanelClick(item) {
      this.currentItem = item;
      this.show2 = true;
    },
    getData() {
      console.log("seachobj",this.seachObj);
      return new Promise(resolve => {
        this.$util.post("sample/getsamplelist", this.seachObj).then(result => {
          this.seachObj.total = result.data.total;
          this.data = this.data.concat(result.data.items);
          this.sampleList = this.sampleList.concat(
            this.getShowLendList(result.data.items)
          );
          resolve(result.data);
        });
      });
    },
    getShowLendList(ls) {
      //取数据
      // debugger;
      let pichost = this.$util.fileUrl;
      let list = ls.map(item => {
        let cf = this.$util.getMaterial(item.Material);
        return {
          src: pichost + "/src/sample/pic/MinPic/" + item.Pic,
          title: item.StyleId,
          StyleId: item.StyleId,
          desc:
            "<p>款号:" +
            item.StyleNo +
            "</p><p>针型:" +
            item.Gauge +
            "&nbsp&nbsp&nbsp克重:" +
            item.Weight +
            "g</p>成份:" +
            cf +
            ""
        };
      });
      return list;
    },
    scrollBottom() {
      // 滚动到页面底部时
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop; // 滚动高度
      if (
        window.screen.height + scrollTop >= document.body.clientHeight &&
        this.REQUIRE
      ) {
        // 请求的数据未加载完成时，滚动到底部不再请求数据
        this.REQUIRE = false;
        this.loading = true;
        this.seachObj.current++;
        this.getData()
          .then(re => {
            if (re.items.length > 0) {
              this.$nextTick(() => {
                // 请求的数据加载完成后，再次滚动到底部时，允许请求据
                this.REQUIRE = true;
                this.loading = false;
              });
            } else {
              this.loading = false;
              this.tips = "我是有底线的！";
            }
          })
          .catch(() => {
            this.tips = "连接失败，请稍后重试";
            // 请求失败时，将 REQUIRE 置为 true，滚动到底部时，再次请求
          });
      }
    },
    setNav() {
      let _this = this;
      if (dd.other) this.isdd = false;
      else {
        dd.biz.navigation.setRight({
          show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
          control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
          text: "搜索", //控制显示文本，空字符串表示显示默认文本
          onSuccess: function (result) {
            //如果control为true，则onSuccess将在发生按钮点击事件被回调
            _this.showSeach();
          }
        });
        dd.biz.navigation.setTitle({
          title: "样衣库" //控制标题文本，空字符串表示显示默认文本
        });
      }
    }
  },
  mounted() {
    this.$vux.loading.hide();
    this.setNav();
    this.getData();
    window.addEventListener("scroll", this.scrollBottom);

  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollBottom);
  }
};
</script>

<style>
</style>
