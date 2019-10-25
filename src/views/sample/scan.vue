<template>
  <div>
    <h1>扫秒</h1>   
    <button @click="scan">scanCode</button>
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
      yourname: this.$bus.currentUser.Name,
     
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

</style>
