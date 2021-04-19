<template>
  <div id="home" style="background-color: #ccc">
    <div class="goTop">
      <el-backtop
        target=".goTop"
        :visibility-height="100"
        :right="15"
        :bottom="60"
      >
        <i class="el-icon-top" style="color: #bbb"></i>
      </el-backtop>

      <van-overlay :show="isLoading" @click="show = false"
        ><van-loading
          style="position: fixed; left: 50%; top: 50%; z-index: 999"
        />
      </van-overlay>
      <!-- 搜索框 -->
      <div class="homeSearch">
        <van-search
          placeholder="搜索 商品/品牌/类别"
          @focus="onFocus"
          background="#ff5e7f"
          shape="round"
        />
      </div>
      <van-pull-refresh
        v-model="isLoading"
        success-text="刷新成功"
        @refresh="onRefresh"
      >
        <!-- 轮播图 -->
        <div class="homeSwiper">
          <div>
            <van-swipe
              class="my-swipe"
              :autoplay="3000"
              indicator-color="white"
            >
              <van-swipe-item v-for="(image, index) in images" :key="index">
                <!-- <van-image style="boder-radius: 10px" :src="image" />
             -->
                <van-image :src="image">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </van-swipe-item>
            </van-swipe>
          </div>
        </div>
        <!-- <van-image :src="require('assets/img/home/swiper1.jpg')" /> -->
        <!-- notice -->
        <div class="homeNotice">
          <van-notice-bar
            left-icon="volume-o"
            :text="noticeText"
            color="#ff5e7f"
            background="#fff"
            mode="closeable"
          />
        </div>
        <!-- Grid  -->
        <div class="homeGrid">
          <van-grid :border="false">
            <van-grid-item @click="goodsList('隐形')">
              <div class="circle" style="background-color: #ff976abf">
                <van-icon
                  class="iconfont"
                  class-prefix="icon"
                  name="eyes_icon"
                  size="25"
                  color="#fbf2ee"
                ></van-icon>
              </div>
              <span class="grid_item">隐形眼镜</span>
            </van-grid-item>
            <van-grid-item @click="goodsList('美瞳')">
              <div class="circle" style="background-color: #66dace">
                <van-icon
                  class="iconfont"
                  class-prefix="icon"
                  name="yinxingyanjing"
                  size="25"
                  color="#e4f8f6"
                ></van-icon>
              </div>
              <span class="grid_item">美瞳</span>
            </van-grid-item>
            <van-grid-item @click="goodsList('护理液')">
              <div class="circle" style="background-color: #66caf9">
                <van-icon
                  class="iconfont"
                  class-prefix="icon"
                  name="gehu"
                  size="25"
                ></van-icon>
              </div>
              <span class="grid_item">护理液</span>
            </van-grid-item>
            <van-grid-item @click="goodsList('伴侣盒')">
              <div class="circle" style="background-color: #d2c4fc">
                <van-icon
                  class="iconfont"
                  class-prefix="icon"
                  name="fendihe"
                  size="25"
                  color="#ebe5fd"
                ></van-icon>
              </div>
              <span class="grid_item">伴侣盒</span>
            </van-grid-item>
          </van-grid>
        </div>
        <!-- image -->
        <div class="homeImage" style="height: 15%; padding: 0 5px">
          <van-image :src="require('assets/img/home/show.jpg')" />
        </div>
        <!-- Tab -->
        <div class="homeTab">
          <van-tabs
            v-model="activeName"
            sticky
            title-active-color="#ff5e7f"
            title-inactive-color="#beb4dc"
            offset-top="60px"
          >
            <van-tab title="热卖单品" name="a">
              <van-grid :border="false" :column-num="2" :gutter="10">
                <van-grid-item
                  v-for="(item, index) in sellingList"
                  :key="index"
                  @click="getDetail(item.goods_id)"
                >
                  <van-image :src="require(`assets/img/${item.imgPath}`)" />
                  <!-- <van-image :src="item.imgPath" v-else /> -->
                  <div class="goodsTitle van-multi-ellipsis--l2">
                    {{ item.title }}
                  </div>
                  <van-row class="contentWrap">
                    <van-col class="price" span="6">￥{{ item.price }}</van-col>
                    <van-col class="priceDel" span="16" offset="2"
                      >￥{{ item.oldPrice }}</van-col
                    >
                  </van-row>
                </van-grid-item>
              </van-grid>
            </van-tab>
            <van-tab title="新款上市" name="b">
              <van-grid :border="false" :column-num="2" :gutter="10">
                <van-grid-item
                  v-for="(item, index) in grassList"
                  :key="index"
                  @click="getDetail(item.goods_id)"
                >
                  <van-image :src="require(`assets/img/${item.imgPath}`)" />
                  <div class="goodsTitle van-multi-ellipsis--l2">
                    {{ item.title }}
                  </div>
                  <van-row class="contentWrap">
                    <van-col class="price" span="6">￥{{ item.price }}</van-col>
                    <van-col class="priceDel" span="16" offset="2"
                      >￥{{ item.oldPrice }}</van-col
                    >
                  </van-row>
                </van-grid-item>
              </van-grid>
            </van-tab>
          </van-tabs>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data () {
    return {
      isLoading: false,
      value: '',
      images: [
        require('assets/img/home/swiper1.jpg'),
        require('assets/img/home/swiper2.jpg'),
        require('assets/img/home/swiper3.jpg'),
        require('assets/img/home/swiper4.jpg')
      ],
      activeName: 'a',
      noticeText: '通知：受疫情影响，部分中高风险地区的快递时效无法保证，我们将根据各地区疫情发展情况，作快递延迟发货、停发调整，非中高风险地区发货不受影响。',
      goodsListData: []
    }
  },
  computed: {
    sellingList () {
      return this.goodsListData.filter(x => x.isHost === 1)
    },
    grassList () {
      return this.goodsListData.filter(x => x.isRecom === 1)
    }

  },
  methods: {
    async init () {
      await this.getGoodsList()
    },
    getGoodsList () {
      // 获取商品
      this.$axios.get('/goods/list')
        .then((res) => {
          // console.log(res.data)
          this.goodsListData = res.data
        }).catch((err) => { })
    },
    onFocus () {
      this.$router.push({
        name: 'Search'
      })
      // this.isShowCancel = true
    },
    goodsList (type) {
      this.$router.push({
        name: 'GoodsList',
        params: { 'type': type, 'from': 'home' }
      })
    },
    getDetail (id) {
      this.$router.push({
        name: 'Detail',
        params: { goods_id: id, 'from': 'home' }
      })
    },
    async onRefresh () {
      this.isLoading = true
      await this.init()
      this.isLoading = false
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
#home {
  height: 100vh;
  background-color: #f9faff !important;
}
/* Search */
#home .homeSearch {
  width: 100%;
  height: 60px;
  position: fixed;
  left: 0px;
  top: 0px;
  z-index: 10;
  background-color: #f9faff !important;
}
.homeSearch .van-search {
  border: 3px solid rgb(255, 94, 127);
}
.homeSearch .van-search__content--round {
  border-radius: 10px !important;
}

/* Swiper */
.homeSwiper {
  margin-top: 60px;
  padding: 10px;
  background-image: linear-gradient(
    #ff5e7f,
    #ff5e7f 40%,
    #f9faff 70%,
    #f9faff 100%
  );
}
.homeSwiper .van-image__img {
  border-radius: 3px;
}

/* notice */
.homeNotice {
  /* border-radius: 10px; */
  margin: 0 10px;
}
.homeNotice .van-notice-bar {
  height: 20px !important;
  padding: 0 8px !important;
  font-size: 12px;
  border: 2px solid #ffd992;
  border-radius: 1rem;
}

/* grid */
.homeGrid .grid_item {
  font-size: 0.24rem;
  margin-top: 8px;
  color: #a4aebf;
}
.homeGrid .circle {
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  position: relative;
}
.homeGrid .iconfont {
  font-size: 20px !important;
  position: absolute;
  left: 6px;
  top: 5px;
}
.van-grid-item__content {
  background: #f9faff;
}
/* image */
.homeImage .van-image {
  margin-top: 5px;
  display: inline;
}
.homeImage .van-image__img {
  border-radius: 3px;
}

/* tab */
.homeTab {
  padding-bottom: 60px;
  background-color: #f9faff !important;
}
.homeTab .van-tabs__nav {
  background-color: #f9faff !important;
}
.homeTab .van-sticky {
  padding-top: 15px;
}
.homeTab .van-tab__text {
  font-weight: 900;
}
.homeTab .van-tabs__line {
  height: 1px;
  background-color: #ff5e7f;
}
.homeTab .van-grid-item__content {
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0px 6px 20px 0px rgb(121 152 215 / 20%);
  padding: 8px 12px;
}
.homeTab .goodsTitle {
  color: #172b4d;
  font-size: 12px;
  margin: 5px 0;
}
.homeTab .contentWrap {
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
.goTop {
  height: 100vh;
  overflow-x: hidden;
}
/deep/ .van-tabs__line {
  background-color: #ff5e7f;
}
</style>
