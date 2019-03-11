<template>
  <div>

    <router-view keep-alive></router-view>
   
    <tabbar style="position:fixed">   
         <tabbar-item  selected link="/sampleList?showmenu=false">
        <img slot="icon" src="../assets/huopinliebiao.png">
        <span slot="label">样衣库</span>
      </tabbar-item>
      <tabbar-item   link="/lend?showmenu=false">
        <img slot="icon" src="../assets/erweima.png">
        <span slot="label">扫码借用</span>
      </tabbar-item>
      <tabbar-item  link="/lendlist?showmenu=false">
        <img slot="icon" src="../assets/gukeliebiao.png">
        <span slot="label">已借样衣</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Group, Cell, ViewBox, Tabbar, TabbarItem } from "vux";
import dd from "dingtalk-jsapi";
export default {
  components: {
    Group,
    Cell,
    ViewBox,
    Tabbar,
    TabbarItem
  },
  data() {
    return {
    };
  },
  methods: {
    scan() {
      dd.biz.util.scan({
        type: 'all', // type 为 all、qrCode、barCode，默认是all。
        onSuccess: function(data) {
        alert(data.text,'hello');
        },
        onFail: function(err) {}
      });
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
