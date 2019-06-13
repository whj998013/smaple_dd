<template>
  <div>
    <group>
      <cell-box v-if="!isdd">
        样衣ID：{{sample.StyleId}}
      </cell-box>
      <swiper
        :list="sample.PicList"
        height="240px"
        @on-click-list-item="showPic"
      ></swiper>
    </group>
    <group>

      <div style="padding:10px 15px 10px 15px">
        <div
          class="ivu-tag"
          :style="'background:'+item.color"
          v-for="item in sample.StyleTag"
          :key="item.name"
        >
          <span>{{item.name}}</span>
        </div>
      </div>

    </group>
    <group>
      <cell-box>
        款号：{{sample.StyleNo}}
      </cell-box>
      <cell-box>
        种类：{{sample.Kinds}}
      </cell-box>
      <cell-box>
        入库人：{{sample.User}}
      </cell-box>
      <cell-box>
        部门:{{sample.DeptName}}
      </cell-box>
      <cell-box>
        可否外借：{{canLendoutText}}
      </cell-box>
      <cell-box>
        零售价：{{sample.SalePrice}}
      </cell-box>
    </group>
    <group>
      <cell-box>
        针型：{{sample.Gauge}}
      </cell-box>
      <cell-box>
        尺码：{{sample.Size}}
      </cell-box>
      <cell-box>
        克重：{{sample.Weight}}g
      </cell-box>
      <cell-box>
        成份：{{Material}}
      </cell-box>
    </group>
    <group>
      <cell-box>
        现货信息：{{haveStock}}
      </cell-box>
      <cell-box v-if="sample.HaveStock">
        <x-table>
          <thead>
            <tr>
              <th>尺码</th>
              <th>颜色</th>
              <th>数量</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item,index) in sample.StockData"
              :key="index"
            >
              <td>{{item.size}}</td>
              <td>{{item.color}}</td>
              <td>{{item.num}}</td>
            </tr>
          </tbody>
        </x-table>
      </cell-box>

    </group>

    <group v-if="isLimt">
      <cell-box>
        成本价：{{sample.CostPrice}}
      </cell-box>
      <cell-box>
        出厂价：{{sample.FactoryPrice}}
      </cell-box>
      <cell-box>
        处理价：{{sample.DiscountPrice}}
      </cell-box>

    </group>
    <group v-if="isLimt">
      <cell-box>
        打样单位：{{sample.ProofingCompany}}
      </cell-box>
      <cell-box>
        工艺员：{{sample.TechnologyPeople}}
      </cell-box>
      <cell-box>
        程序员：{{sample.ProgamPeople}}
      </cell-box>
      <cell-box>
        织机时间：{{sample.WeaveTime}}
      </cell-box>
      <cell-box>
        套口时间：{{sample.LinkTime}}
      </cell-box>
      <cell-box>
        打样日期：{{sample.ProofingDate}}
      </cell-box>
    </group>
    <group v-if="isLimt">
      <cell-box>
        大货客户：{{sample.ClientName}}
      </cell-box>
      <cell-box>
        成衣工厂：{{sample.ProductFactory}}
      </cell-box>
      <cell-box>
        成衣数量：{{sample.ProductNum}}
      </cell-box>
      <cell-box>
        成衣价：{{sample.Price}}
      </cell-box>
      <cell-box>
        出货日期：{{sample.ProductDate}}
      </cell-box>
    </group>
    <group v-if="isLimt">
      <cell-box>附件：(请使用钉钉PC版下载附件)</cell-box>
      <cell-box
        v-for="(item,index) in sample.FileList"
        :key="index"
      >
        {{ item.name}}
      </cell-box>
      <cell-box v-if="!haveFile">
        没有附件
      </cell-box>
    </group>
    <x-button
      v-if="!isdd&&showlend"
      type="primary"
      @click.native="lendout"
    >借出</x-button>

    <br><br><br>
  </div>

</template>

<script>
import { Swiper, CellBox, Group, XButton, XTable } from "vux";
import dd from "dingtalk-jsapi";
export default {
  components: {
    Swiper,
    CellBox,
    Group,
    XButton,
    XTable
  },
  computed: {
    canLendoutText() {
      if (this.sample.CanLendOut) return "是";
      else return "否";
    },
    alowLendout() {
      return this.sample.CanLendOut || this.allSampleCanLend;
    },
    haveStock() {
      if (this.sample.HaveStock) return "有现货";
      else return "无现货";
    },
    allSampleCanLend() {
      return this.$bus.allSampleCanLend;
    },
    haveFile() {
      if (this.sample.FileList != undefined) {
        if (this.sample.FileList.length > 0) return true;
      }; 
       return false;
    }
  },
  data() {
    return {
      sample: {},
      picstr: "",
      id: "",
      Material: "",
      picstrList: [],
      isdd: true,
      showlend: true,
      isLimt: false
    };
  },
  mounted() {
    this.isLimt = this.$bus.isLimt;
    this.id = this.$route.params.id;
    this.showlend = this.$route.query.showlend == undefined ? true : false;
    let _this = this;
    this.getData().then(p => {
      if (dd.other) this.isdd = false;
      else {
        dd.biz.navigation.setRight({
          show: _this.showlend && _this.alowLendout, //控制按钮显示， true 显示， false 隐藏， 默认true
          control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
          text: "借用", //控制显示文本，空字符串表示显示默认文本
          onSuccess: function(result) {
            //如果control为true，则onSuccess将在发生按钮点击事件被回调
            _this.lendout();
          },
          onFail: function(err) {}
        });

        dd.biz.navigation.setTitle({
          title: "样衣:" + _this.sample.StyleId //控制标题文本，空字符串表示显示默认文本
        });
      }
    });
    document.body.scrollTop = 0;
    this.$vux.loading.hide();
  },
  methods: {
    beginLendOut() {
      this.doLendout(this.sample.StyleId).then(p => {
        this.$bus.$emit("addLend", this.sample);
        this.$router.push("/lend?showmenu=false");
      });
    },
    lendout() {
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
    },
    showPic(item) {
      dd.biz.util.previewImage({
        urls: this.picstrList,
        current: item.rurl //当前显示的图片链接
      });
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

    getData() {
      let p = new Promise((resolve, reject) => {
        console.log("getdata");
        this.$util
          .get("/sample/GetSample", {
            params: { styleId: this.id }
          })
          .then(result => {
            if (result.data) {
              
              this.sample = result.data;
              result.data.PicList.forEach(item => {
                //debugger;
                item.rurl = this.$util.fileUrl + "/src/sample/pic/" + item.name;
                item.img = this.$util.fileUrl + "/src/sample/pic/minPic/" + item.name;
                this.picstrList.push(item.rurl);
              });
              for (let p of result.data.Material) {
                this.Material =
                  this.Material + p.percent + "%" + p.materials + " ";
              }
              this.picstr = this.sample.PicList[0].name;
              resolve(this.sample);
            } else {
              reject(result.data);
            }
          });
      });
      return p;
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
