<template>
  <div id="cart">
    <!-- navbar -->
    <van-sticky>
      <van-nav-bar title="购物车" @click-left="returnPage">
        <template #left v-if="isFrom">
          <van-icon name="arrow-left" />
        </template>
        <template #right>
          <div class="manage">
            <div v-if="isManage || cartList.length === 0" @click="taggerText">
              管理
            </div>
            <div v-else style="display: flex; align-items: center">
              <van-icon
                name="delete-o"
                color="#000"
                size="15px"
                @click="emptyCart"
              />
              <span style="margin-left: 15px" @click="taggerText">完成</span>
            </div>
          </div>
        </template>
      </van-nav-bar>
    </van-sticky>
    <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      @refresh="onRefresh"
    >
      <div v-if="cartList.length === 0">
        <!-- content -->
        <div class="cart_content">
          <div>
            <div class="content_icon">
              <van-icon
                class="iconCart"
                name="shopping-cart"
                size="40px"
                color="#f9b7c8"
                style="margin-bottom: 20px"
              />
            </div>
            <div class="content_text">购物车还是空的</div>
            <div class="content_text">去挑些中意的商品吧，亲</div>
            <div class="content_button">
              <button class="linkBtn goHome" @click="clickButton('Home')">
                前往首页
              </button>
              <button class="linkBtn goSearch" @click="clickButton('Search')">
                去搜索
              </button>
            </div>
          </div>
        </div>
        <!-- 推荐 -->
        <div style="padding: 5px">
          <div class="cart_recommend">
            <van-divider
              :style="{
                color: ' #8b95a6',
                borderColor: '#d8d8d8',
                padding: '0 40px',
                fontSize: '0.26rem',
              }"
            >
              您可能会中意
            </van-divider>
            <van-grid :column-num="3" :border="false">
              <van-grid-item
                v-for="(item, index) in recommendList"
                :key="index"
                @click="getDetail(item.id)"
              >
                <van-image :src="require(`assets/img/${item.imgPath}`)" />
                <van-row class="contentWrap">
                  <van-col class="price" span="6">￥{{ item.price }}</van-col>
                  <van-col class="priceDel" span="10" offset="2"
                    >￥{{ item.oldPrice }}</van-col
                  >
                </van-row>
              </van-grid-item>
            </van-grid>
          </div>
        </div>
      </div>
      <div class="cartList" v-else v-loading="isLoading">
        <!-- 商品列表 -->
        <div
          class="cartList_box"
          v-for="(item, index) in cartList"
          :key="index"
          style="display: flex"
        >
          <van-checkbox
            :name="item.id"
            icon-size="15px"
            checked-color="#ff5e7f"
            style="padding-right: 5px"
            v-model="item.checked"
            @change="onCheckkBox(item)"
          >
          </van-checkbox>
          <van-swipe-cell class="cartList_box_item">
            <van-card
              :num="item.count"
              :price="`${item.price}.00`"
              :desc="item.params"
              :title="item.title"
              class="goods-card"
              :thumb="require(`assets/img/${item.imgPath}`)"
              :origin-price="item.oldPrice"
            >
              <template #footer>
                <van-stepper
                  class="text_stepper"
                  v-model="item.count"
                  button-size="20px"
                  min="0"
                  @plus="addCount(item.count, item)"
                  @minus="reduceCount(item.count, item, index)"
                />
              </template>
            </van-card>
            <template #right>
              <van-button
                square
                text="删除"
                type="danger"
                class="delete-button"
                @click="onClickDel(item.id)"
              />
            </template>
          </van-swipe-cell>
        </div>
      </div>
    </van-pull-refresh>
    <!-- 操作 -->
    <div class="cartManage" v-show="cartList.length !== 0">
      <van-submit-bar
        :price="goodsTotalPrice * 100"
        :button-text="`结算 (${goodsCount})`"
        button-color="#ff5e7f"
        @submit="onSubmit"
      >
        <van-checkbox
          v-model="allChecked"
          icon-size="15px"
          checked-color="#ff5e7f"
          @click="checkAll"
          >全选</van-checkbox
        >
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  data () {
    return {
      isLoading: false,
      isManage: true,
      radio: '0',
      cartList: [],
      recommendList: [
        { id: 27, price: 52, oldPrice: 168, imgPath: 'goods/27.jpg' },
        { id: 7, price: 75, oldPrice: 158, imgPath: 'goods/7.jpg' },
        { id: 8, price: 85, oldPrice: 168, imgPath: 'goods/8.jpg' },
        { id: 20, price: 25, oldPrice: 88, imgPath: 'goods/20.jpg' },
        { id: 21, price: 22, oldPrice: 39, imgPath: 'goods/21.jpg' },
        { id: 18, price: 99, oldPrice: 142, imgPath: 'goods/18.jpg' }
      ],
      goodsCount: 0,
      goodsTotalPrice: 0,
      allChecked: 0,
      result: [],
      currentUserId: 0,
      checkedArr: [],
      isFrom: false
    }
  },
  methods: {
    async init () {
      this.isLoading = true
      let from = this.$route.params.from
      // console.log(from)
      if (from === 'detail') {
        this.isFrom = true
      }
      if (!this.currentUserId) {
        this.cartList = []
        return
      }
      await this.getCartList(this.currentUserId)
      this.isLoading = false
    },
    getCartList (id) {
      this.$axios.get('/cart/list', {
        params: { user_id: id }
      }).then((res) => {
        // console.log(res.data)
        res.data.forEach(element => {
          element.checked = false
          // element.num = null
        })
        // console.log(res.data)
        this.cartList = res.data
      }).catch((err) => { });
    },
    // 回首页 / 去搜索
    clickButton (name) {
      this.$router.push({
        name: name
      })
    },
    getDetail (id) {
      this.$router.push({
        name: 'Detail',
        params: { goods_id: id }
      })
    },
    taggerText () {
      this.isManage = !this.isManage
    },
    // count +1
    addCount (count, item) {
      if (item.count <= 98) {
        item.count++
        this.shopNumber(item)
        this.onCheckkBox(item)
      }
    },
    // count -1
    reduceCount (count, item, index) {
      // console.log(item)
      if (item.count <= 1) {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '确定删除吗？',
        }).then(() => {
          this.$axios.delete('/cart/del', { data: { id: item.id } })
            .then((res) => {
              // console.log(res)
              this.$toast({
                message: '删除成功'
              })
            }).catch((err) => {
              console.log(err)
            })
          setTimeout(() => {
            this.cartList.splice(index, 1)
            this.onCheckkBox(item)
          }, 1000)
        }).catch(() => {
          // item.count++
        })
      } else {
        item.count--
        this.shopNumber(item)
        this.onCheckkBox(item)
      }
    },
    shopNumber (item) {
      let data = {
        user_id: item.user_id,
        count: item.count,
        goods_id: item.goods_id
      }
      this.$axios.post('/cart/update', data)
        .then((res) => { })
        .catch((err) => { })
    },
    // 单选
    onCheckkBox (item) {
      this.goodsCount = 0
      let arr = []
      let MoneyList = []
      this.cartList.forEach(item => {
        if (item.checked === true) {
          this.goodsCount += item.count
          MoneyList.push(item)
          arr.push(item.checked)
        }
      })
      if (arr.length === this.cartList.length) {
        this.allChecked = true
      } else {
        this.allChecked = false
      }
      this.goodsTotalPrice = 0;
      for (var i = 0; i < MoneyList.length; i++) {
        this.goodsTotalPrice += MoneyList[i].price * MoneyList[i].count
      }
    },
    // 全选
    checkAll () {
      this.cartList.forEach(item => {
        if (this.allChecked == true) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
    },
    // 提交
    onSubmit () {
      if (this.goodsCount === 0) {
        this.$toast({
          message: '请至少选择一个商品！'
        })
        return
      }
      let orderList = []
      orderList.totalPrice = this.goodsTotalPrice
      orderList.totalNum = this.goodsCount
      // console.log(orderList)
      let arr = []
      this.cartList.forEach(element => {
        if (element.checked) {
          arr.push(element)
        }
        orderList.goodsInfo = arr
      })
      this.$router.push({
        name: "Order",
        params: { orderList: orderList }
      })
    },
    onClickDel (id) {
      this.$dialog.confirm({
        message: '确定删除该商品吗？',
      }).then(() => {
        this.$axios.delete('/cart/del', { data: { id: id } })
          .then((res) => {
            // console.log(res)
            this.init()
            this.$toast({
              message: '删除成功'
            })
          }).catch((err) => {
            console.log(err)
          })
      }).catch(() => {
        this.$toast({
          message: '取消删除'
        })
      })

      // 

    },
    // 清空购物车
    emptyCart () {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '确定清空购物车吗？',
      }).then(() => {
        const id = window.sessionStorage.getItem('user_id')
        this.$axios.delete('/cart/empty', { data: { user_id: id } })
          .then((res) => {
            this.cartList = []
          })
          .catch((err) => {
            console.log(err)
          })
      }).catch(() => { })

    },
    onRefresh () {
      this.init()
    },
    returnPage () {
      let id = this.$route.params.goods_id
      this.$router.push({
        name: "Detail",
        params: { goods_id: id }
      })
    }
  },
  created () {
    this.currentUserId = window.sessionStorage.getItem('user_id')
    this.init()
  }
}
</script>

<style>
#cart {
}
.manage {
  font-weight: 600;
  color: #323232;
  font-size: 0.28rem;
}

/* cart_content */
.cart_content {
  background-color: #f7f7f7;
  margin: 0 7px;
  padding: 30px 0;
}
.cart_content .content_icon {
  text-align: center;
  /* margin: 35px 0 17px 0; */
}
.content_icon .iconCart {
  background-color: #f7e4e9;
  border-radius: 50%;
  padding: 15px;
}
.cart_content .content_text {
  display: block;
  text-align: center;
  color: rgba(23, 43, 77, 0.5);
  font-size: 0.26rem;
}
.cart_content .content_button {
  text-align: center;
  margin-top: 15px;
}
.cart_content .linkBtn {
  width: 35%;
  display: inline-block;
  border-radius: 20px;
  padding: 8px 20px;
  border: 1px solid #ff5e7f;
  font-size: 10px;
}
.cart_content .goHome {
  color: #fff;
  background: linear-gradient(
    90deg,
    rgba(252, 59, 114, 0.78) 0%,
    rgba(252, 59, 114, 1) 100%
  );
  margin-right: 10px;
}
.cart_content .goSearch {
  color: #ff5e7f;
  background-color: #fff;
}

/* cart_recommend */
.cart_recommend {
  background-color: #fff;
  box-shadow: 0px 6px 20px 0px rgb(121 152 215 / 20%);
  padding-top: 5px;
  border-radius: 10px;
}
.cart_recommend .contentWrap {
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
  /* margin-left: 5px; */
  text-decoration: line-through;
}

/* cartList */
.cartList {
  margin: 5px;
  margin-bottom: 55px;
}
.van-swipe-cell__wrapper {
  display: flex;
  align-items: center;
}
.cartList_box {
  margin: 5px;
  padding: 5px 10px;
  box-shadow: 0px 6px 20px 0px rgb(121 152 215 / 20%);
  border-radius: 5px;
}
.cartList_box_item {
}
.goods-card {
  padding: 8px 0;
}
.van-card__price {
  color: #ff5e7f;
}
.van-card__desc {
  display: inline-block;
  padding: 0 7px;
  border-radius: 10px;
  color: #a5adba;
  background-color: #f4f5f6;
}
.van-card__footer {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
#cart .van-card__num {
  display: none;
}

/*  */
.cartList .cart_item {
  background-color: #fff;
  box-shadow: 0px 6px 20px 0px rgb(121 152 215 / 20%);
  padding: 0 8px;
  border-radius: 5px;
  margin-bottom: 5px;
}
.cart_item .goods_radio {
  margin-top: 30px;
}
.cart_item .goods_img {
  padding-right: 5px;
}
.cart_item .goods_text {
  font-size: 0.5rem;
  padding: 10px 0;
}
.goods_text .text_title {
  font-weight: 600;
  color: #323232;
}
.goods_text .text_parameter {
  display: inline-block;
  box-sizing: border-box;
  align-items: center;
  padding: 2px 5px;
  margin: 2px 0 5px 0;
  color: #a5adba;
  background-color: #f4f5f6;
  border-radius: 10px;
}
.goods_text .text_price {
  font-weight: 600;
  color: #ff5e7f;
  display: flex;
  align-items: center;
}
.goods_text .text_stepper {
  display: inline-block;
  text-align: right;
}
.delete-button {
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(252, 59, 114, 0.78) 0%,
    rgba(252, 59, 114, 1) 100%
  );
  border: none;
}

/* cartManage */
.cartManage {
  width: 100%;
  font-size: 12px;
  background-color: #fff;
  /* position: fixed;
  bottom: 50px;
  left: 0; */
}
.cartManage .van-submit-bar {
  bottom: 50px;
  border-bottom: 1px solid #ebedf0;
}
.cartManage .van-submit-bar__price {
  color: #ff5e7f;
}
.cartManage .del_cart {
  width: 60%;
  height: 50px;
  background-color: #fff;
  z-index: 999;
  position: fixed;
  bottom: 50px;
  right: 0;
}
</style>
