<template>
  <div>
    <sampleView ref="sv" @LendOut='lendout'></sampleView>
    <br><br><br>
  </div>
</template>

<script>
import { Swiper, CellBox, Group, XButton, XTable } from "vux";
import dd from "dingtalk-jsapi";
import sampleView from "./components/sampleView";
export default {
  components: {
    Swiper,
    CellBox,
    Group,
    XButton,
    XTable,
    sampleView
  },
  computed: {
    alowLendout() {
      return this.sample.CanLendOut || this.allSampleCanLend;
    },
    allSampleCanLend() {
      return this.$bus.allSampleCanLend;
    },
  },
  data() {
    return {
      sample: {},
      id: "",
      isdd: true,
      showlend: true,
      isLending: fasle,
    };
  },
  async mounted() {
    this.id = this.$route.params.id;
    this.showlend = this.$route.query.showlend == undefined ? true : false;

    console.log("showlend", this.showlend);
    console.log("bool2", !this.isdd && this.showlend)
    console.log("bool3", dd.other);
    let _this = this;
    this.sample = await this.$refs.sv.ShowSampleLendModel(this.id);
    if (dd.other) {
      this.isdd = false;
      console.log("bool_2", this.isdd, this.showlend);
      console.log("bool3", dd.other);
      console.log("bool4", (!this.isdd) && this.showlend)
    }
    else {
      dd.biz.navigation.setRight({
        show: _this.showlend && _this.alowLendout, //控制按钮显示， true 显示， false 隐藏， 默认true
        control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
        text: "借用", //控制显示文本，空字符串表示显示默认文本
        onSuccess: function (result) {
          //如果control为true，则onSuccess将在发生按钮点击事件被回调
          _this.lendout();
        },
        onFail: function (err) { }
      });

      dd.biz.navigation.setTitle({
        title: "样衣:" + _this.sample.StyleId //控制标题文本，空字符串表示显示默认文本
      });
    }
    document.body.scrollTop = 0;
    this.$vux.loading.hide();
  },
  methods: {
    beginLendOut() {
      this.doLendout(this.sample.StyleId).then(p => {
        this.isLending=false;
        this.$bus.$emit("addLend", this.sample);
        this.$router.push("/lend?showmenu=false");
      });
    },
    lendout() {
      if (!this.isLending) {
        this.isLending=true;
        let _this = this;
        if (this.alowLendout) {
          if (this.sample.CanLendOut) {
            _this.beginLendOut();
          } else {
            this.$vux.confirm.show({
              title: "不可外借",
              content: "此样衣被设定为不定外借，是否继续外借。",
              onConfirm() {
                _this.beginLendOut();
              }
            });
          }
        }
      }

    },

    doLendout(styleId) {
      let p = new Promise((resolve, reject) => {
        this.$util
          .post("/LendOut/DoLendOut", { styleId: styleId })
          .then(result => {
            resolve(this.sample);
          });
      });
      return p;
    },

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
.ivu-tag {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(0, 255, 0);
  color: rgb(255, 255, 255);
  display: inline-block;
  height: 22px;
  line-height: 22px;
  margin: 2px 4px 2px 0;
  padding: 0 8px;
  border: 1px solid #e8eaec;
  border-radius: 3px;
  background: #f7f7f7;
  font-size: 12px;
  vertical-align: middle;
  opacity: 1;
  overflow: hidden;
  cursor: pointer;
}
</style>
