<template>
  <div>
    <group>
      <cell-box class="head">
        <span style="color">款式信息</span>
      </cell-box>
      <cell-box>
        单号：{{val.ProofOrderId}}&nbsp({{val.Dydbh}})
      </cell-box>
      <cell-box>
        款号：{{val.ProofStyle.ProofStyleNo}}
      </cell-box>
      <cell-box>
        成份：{{val.ProofStyle.Material}}
      </cell-box>
      <cell-box>
        支数：{{val.ProofStyle.Counts}}
      </cell-box>
      <cell-box>
        针型：{{val.ProofStyle.Gauge}}
      </cell-box>
    </group>
    <group>
      <cell-box class="head">
        <span style="color">打样信息</span>
      </cell-box>
      <cell-box>
        当前状态：{{val.ProofStatusText}}
      </cell-box>
      <cell-box>
        业务员：{{val.ProofApplyUserName}}
      </cell-box>
      <cell-box>
        业务部门：{{val.ProofApplyDeptName}}
      </cell-box>
      <cell-box>
        打样部门：{{val.ProofDept.DeptName}}
      </cell-box>
      <cell-box>
        打样类别：{{val.ProofStyle.ProofTypeText}}
      </cell-box>
      <cell-box>
        打样数量：{{val.ProofNum}}
      </cell-box>
      <cell-box>
        交期：{{$util.getGmtDate(val.RequiredDate)}}
      </cell-box>
      <cell-box>
        紧急度：{{val.Urgency}}
      </cell-box>
    </group>
    <group>
      <cell-box class="head">
        <span style="color">打样记录</span>
      </cell-box>
      <cell-box v-for="(item,index) in val.ProofTasks" :key="index">
        {{item.Process.ProcessName}}：{{item.UserName}}
      </cell-box>
      <cell-box v-if="val.ProofTasks.length<1">
        暂无打样记录
      </cell-box>
    </group>

  </div>
</template>

<script>
import { Group, Cell, CellBox } from "vux";
import dd from "dingtalk-jsapi";
export default {
  components: {
    Group,
    Cell,
    CellBox
  },
  data() {
    return {
      val: {
        ProofTasks:[],
        ProofDept: {
          DeptName: ''
        },
        ProofStyle: {
          ProofTypeText: ""
        }
      },
    };
  },
  methods: {
    show(v) {
      this.val = v;
    }
  },
  mounted() {
    //  this.$vux.loading.hide();
  }
};
</script>

<style>
.head {
  background-color: #2d8cf0;
  color: white;
}
</style>
