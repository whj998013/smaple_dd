<template>
  <div>

    <router-view></router-view>
    <tabbar style="position:fixed">   
      <tabbar-item  selected link="/lend?showmenu=false">
        <img slot="icon" src="../assets/scan.png">
        <span slot="label">扫码借用</span>
      </tabbar-item>
      <tabbar-item badge=""  link="/lendlist?showmenu=false">
        <img slot="icon" src="../assets/sweater0.png">
        <img slot="icon-active" src="../assets/sweater1.png">
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
            msg: "Hello World!"
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
