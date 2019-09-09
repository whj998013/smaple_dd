<template>
  <div>
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
  
  },
   mounted(){
      this.$vux.loading.hide();
  }
};
</script>

<style>


</style>
