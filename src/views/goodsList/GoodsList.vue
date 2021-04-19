<template>
  <div id="goodsList">
    <div class="navBar">
      <van-nav-bar
        title="商品列表"
        left-arrow
        fixed
        placeholder
        @click-left="returnPage"
        @click-right="goSearch"
      >
        <template #right>
          <van-icon name="search" size="18" />
        </template>
      </van-nav-bar>
      <div class="activeBtn">
        <div
          class="btn_item"
          :class="{ active: currentTab === 0 }"
          @click="taggerTab(0)"
        >
          综合
        </div>
        <div
          class="btn_item"
          :class="{ active: currentTab === 1 }"
          @click="taggerTab(1)"
        >
          价格
        </div>
        <div
          class="btn_item"
          :class="{ active: currentTab === 2 }"
          @click="taggerTab(2)"
        >
          销量
        </div>
      </div>
    </div>
    <div class="default" v-if="sellingList.length === 0">
      <div style="display: flex; justify-content: center">
        <div class="default_icon">
          <van-icon name="bag-o" color="#fac5d7" size="60" />
        </div>
      </div>
      <p class="default_text">暂无该商品，去逛逛其他的吧</p>
    </div>
    <div class="content">
      <van-grid :border="false" :column-num="2" :gutter="10">
        <van-grid-item
          v-for="(item, index) in sellingList"
          :key="index"
          @click="getDetail(item.goods_id)"
        >
          <van-image :src="require(`assets/img/${item.imgPath}`)" />
          <div class="goodsTitle van-multi-ellipsis--l2">
            {{ item.title }}
          </div>
          <van-row class="contentWrap">
            <van-col class="price" span="4">￥{{ item.price }}</van-col>
            <van-col class="priceDel" span="7" offset="2"
              >￥{{ item.oldPrice }}</van-col
            >
            <van-col style="font-size: 5px; text-align: right" span="11"
              >{{ item.sales }}人已购买</van-col
            >
          </van-row>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsList",
  data () {
    return {
      active: 0,
      currentTab: 0,
      sellingList: [],
      currentType: ''
    }
  },
  methods: {
    init () {
      this.currentType = this.$route.params.type
      let from = this.$route.params.from
      // console.log(this.currentType)
      if (from === 'home') {
        this.getTypeList(this.currentType)
      } else if (from === 'category') {
        let tag = this.$route.params.tag
        this.getTagList(this.currentType, tag)
      } else if (from === 'search') {
        let tag = this.$route.params.tag
        this.getALLGoods(tag)
      } else {
        this.getTypeList(this.currentType)
      }
    },
    // 获取商品列表
    getTypeList (type) {
      this.$axios.get('/goods/type', {
        params: { 'type': type }
      })
        .then((res) => {
          // console.log(res.data)
          this.sellingList = res.data
        }).catch((err) => { })
    },
    getTagList (type, tag) {
      this.$axios.get('/goods/type', {
        params: { 'type': type }
      })
        .then((res) => {
          // console.log(res.data)
          if (tag === '更多品牌') {
            this.sellingList = res.data
          } else {
            this.sellingList = res.data.filter(x => x.title.indexOf(tag) !== -1)
            // console.log(this.sellingList.length)
          }
        }).catch((err) => { })
    },
    getALLGoods (tag) {
      this.$axios.get('/goods/list')
        .then((res) => {
          this.sellingList = res.data.filter(x => x.title.indexOf(tag) !== -1)
        }).catch((err) => { })
    },
    // 切换tab
    taggerTab (index) {
      this.currentTab = index
      if (index === 1) {
        this.sellingList = this.sellingList.sort((a, b) => a.price < b.price ? -1 : 1)
      } else if (index === 2) {
        this.sellingList = this.sellingList.sort((a, b) => a.sales > b.sales ? -1 : 1)
      } else {
        // console.log(this.sellingList)
        this.sellingList = this.sellingList.sort((a, b) => a.title < b.title ? -1 : 1)
      }
    },
    returnPage () {
      let from = this.$route.params.from
      if (from === 'home') {
        this.$router.push({
          name: 'Home'
        })
      } else {
        this.$router.go(-1)
      }

    },
    goSearch () {
      this.$router.push({
        name: 'Search'
      })
    },
    getDetail (id) {
      this.$router.push({
        name: 'Detail',
        params: { goods_id: id }
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
.navBar {
  position: relative;
}
.navBar .activeBtn {
  width: 100%;
  display: flex;
  text-align: center;
  font-size: 13px;
  padding: 15px 0;
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 46px;
  z-index: 999;
}
.activeBtn .btn_item {
  flex: 1;
}

/*  */
.default {
  margin-top: 50px;
  /* padding: 76px; */
}
.default_icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  background-color: #f9f3fa;
}
.default_text {
  display: flex;
  justify-content: center;
  font-size: 0.26rem;
  color: rgba(23, 43, 77, 0.5);
}

/* content */
.content {
  margin-top: 50px;
  padding-bottom: 60px;
  background-color: #f9faff !important;
}
.content .van-tabs__nav {
  background-color: #f9faff !important;
}
.content .van-sticky {
  padding-top: 15px;
}
.content .van-tab__text {
  font-weight: 900;
}
.content .van-tabs__line {
  height: 1px;
  background-color: #ff5e7f;
}
.van-grid-item {
  box-shadow: 0px 6px 20px 0px rgb(121 152 215 / 20%);
}

.content .van-grid-item__content {
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0px 6px 20px 0px rgb(121 152 215 / 20%);
  padding: 8px 12px;
}
.content .goodsTitle {
  color: #172b4d;
  font-size: 12px;
  margin: 5px 0;
}
.content .contentWrap {
  width: 100%;
  margin: 5px 0;
}
.contentWrap .price {
  color: #ff5e7f;
  font-size: 0.3rem;
}
.contentWrap .priceDel {
  color: #a5adba;
  font-size: 0.24rem;
  margin-left: 8px;
  text-decoration: line-through;
}

/*  */
.active {
  color: #fc3b72 !important;
}
</style>
