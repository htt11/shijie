<template>
  <div id="myOrder">
    <!-- topbar -->
    <van-sticky>
      <van-nav-bar
        class="topbar"
        title="我的订单"
        left-arrow
        @click-left="returnPage"
        style=""
      />
    </van-sticky>
    <!-- tab标签页-->
    <van-tabs
      class="tabs_content"
      v-model="activeName"
      sticky
      swipeable
      v-if="orderListFirst.length !== 0"
    >
      <van-tab title="全部" name="all">
        <div class="default" v-if="orderListFirst.length === 0">
          <div style="display: flex; justify-content: center">
            <div class="default_icon">
              <van-icon name="bag-o" color="#fac5d7" size="60" />
            </div>
          </div>
          <p class="default_text">您还没有订单，快去添加一个吧</p>
        </div>
        <div
          class="order_card"
          v-for="(item, index) in orderListFirst"
          :key="index"
        >
          <van-row
            type="flex"
            justify="space-between"
            style="padding: 10px 15px 5px 15px; font-size: 14px"
          >
            <van-col span="18">订单时间：{{ item.createAt }}</van-col>
            <van-col
              span="6"
              style="text-align: right; color: rgb(252, 59, 114)"
            >
              {{ item.status }}
            </van-col>
          </van-row>
          <div style="display: flex">
            <van-card
              :price="`${item.price}.00`"
              :title="item.title"
              :thumb="require(`assets/img/${item.img_path}`)"
            />
            <div
              style="
                display: flex;
                align-items: center;
                background-color: #fafafa;
                padding: 0 5px;
              "
            >
              <van-icon
                name="arrow"
                @click="showOrderDetail(item.order_code, item.address_id)"
              />
            </div>
          </div>
          <div style="text-align: right; margin: 8px; font-size: 14px">
            共{{ item.total_count }}件商品，合计：￥{{ item.total_price }}.00
          </div>
          <van-divider style="margin: 0" />
          <van-row
            type="flex"
            justify="space-between"
            style="padding: 10px 15px 10px 15px; align-items: center"
          >
            <van-col span="8">
              <van-col span="8">
                <!-- <van-icon
                  name="delete-o"
                  @click="onDel(item.order_code)"
                  v-if="
                    item.status === '交易完成' ||
                    item.status === '交易取消' ||
                    item.status === '退款成功'
                  "
                /> -->
              </van-col>
            </van-col>
            <van-col
              span="16"
              style="dispaly: flex; text-align: right"
              v-if="
                item.status !== '交易完成' &&
                item.status !== '等待退款' &&
                item.status !== '交易取消' &&
                item.status !== '退款成功'
              "
            >
              <van-button
                class="card_btn"
                round
                type="info"
                size="small"
                color="rgba(23, 43, 77, 0.5)"
                plain
                v-if="item.status === '待付款'"
                @click="onCancel(item.order_code)"
                >取消订单</van-button
              >
              <van-button
                class="card_btn"
                round
                type="info"
                size="small"
                color="rgba(23, 43, 77, 0.5)"
                plain
                v-if="item.status === '待收货' || item.status === '待发货'"
                @click="onRefund(item.order_code)"
                >申请退款</van-button
              >
              <van-button
                class="card_btn"
                round
                type="info"
                size="small"
                color="rgb(252, 59, 114)"
                plain
                v-if="item.status !== '交易取消'"
                @click="onClickBtn(item.btn, item.order_code)"
                >{{ item.btn }}</van-button
              >
            </van-col>
          </van-row>
        </div>
      </van-tab>
      <van-tab title="待付款" name="pay">
        <div class="default" v-if="payOrderListFirst.length === 0">
          <div style="display: flex; justify-content: center">
            <div class="default_icon">
              <van-icon name="bag-o" color="#fac5d7" size="60" />
            </div>
          </div>
          <p class="default_text">您还没有相关订单</p>
        </div>
        <div
          class="order_card"
          v-for="(item, index) in payOrderListFirst"
          :key="index"
        >
          <van-row
            type="flex"
            justify="space-between"
            style="padding: 10px 15px 5px 15px; font-size: 14px"
          >
            <van-col span="20">订单时间：{{ item.createAt }}</van-col>
            <van-col
              span="4"
              style="text-align: right; color: rgb(252, 59, 114)"
            >
              待付款
            </van-col>
          </van-row>
          <div style="display: flex">
            <van-card
              :price="`${item.goodsFirst.price}.00`"
              :title="item.goodsFirst.title"
              :thumb="require(`assets/img/${item.goodsFirst.img_path}`)"
            />
            <div
              style="
                display: flex;
                align-items: center;
                background-color: #fafafa;
                padding: 0 5px;
              "
            >
              <van-icon
                name="arrow"
                @click="showOrderDetail(item.order_code, item.address_id)"
              />
            </div>
          </div>
          <div style="text-align: right; margin: 8px; font-size: 14px">
            共{{ item.total_count }}件商品，合计：￥{{ item.total_price }}.00
          </div>
          <van-divider style="margin: 0" />
          <van-row
            type="flex"
            justify="space-between"
            style="padding: 10px 15px 10px 15px; align-items: center"
          >
            <van-col span="8"></van-col>
            <van-col span="16" style="dispaly: flex; text-align: right">
              <van-button
                class="card_btn"
                round
                type="info"
                size="small"
                color="rgba(23, 43, 77, 0.5)"
                plain
                @click="onCancel(item.order_code)"
                >取消订单</van-button
              >
              <van-button
                class="card_btn"
                round
                type="info"
                size="small"
                color="rgb(252, 59, 114)"
                plain
                @click="onClickBtn(item.btn, item.order_code)"
                >去付款</van-button
              >
            </van-col>
          </van-row>
        </div>
      </van-tab>
      <van-tab title="待发货" name="deliver">
        <div class="default" v-if="deliverOrderListFirst.length === 0">
          <div style="display: flex; justify-content: center">
            <div class="default_icon">
              <van-icon name="bag-o" color="#fac5d7" size="60" />
            </div>
          </div>
          <p class="default_text">您还没有相关订单</p>
        </div>
        <div
          class="order_card"
          v-for="(item, index) in deliverOrderListFirst"
          :key="index"
        >
          <van-row
            type="flex"
            justify="space-between"
            style="padding: 10px 15px 5px 15px; font-size: 14px"
          >
            <van-col span="20">订单时间：{{ item.createAt }}</van-col>
            <van-col
              span="4"
              style="text-align: right; color: rgb(252, 59, 114)"
            >
              待发货
            </van-col>
          </van-row>
          <div style="display: flex">
            <van-card
              :price="`${item.goodsFirst.price}.00`"
              :title="item.goodsFirst.title"
              :thumb="require(`assets/img/${item.goodsFirst.img_path}`)"
            />
            <div
              style="
                display: flex;
                align-items: center;
                background-color: #fafafa;
                padding: 0 5px;
              "
            >
              <van-icon
                name="arrow"
                @click="showOrderDetail(item.order_code, item.address_id)"
              />
            </div>
          </div>
          <div style="text-align: right; margin: 8px; font-size: 14px">
            共{{ item.total_count }}件商品，合计：￥{{ item.total_price }}.00
          </div>
          <van-divider style="margin: 0" />
          <van-row
            type="flex"
            justify="space-between"
            style="padding: 10px 15px 10px 15px; align-items: center"
          >
            <van-col span="8"></van-col>
            <van-col span="16" style="dispaly: flex; text-align: right">
              <van-button
                class="card_btn"
                round
                type="info"
                size="small"
                color="rgba(23, 43, 77, 0.5)"
                plain
                @click="onRefund(item.order_code)"
                >申请退款</van-button
              >
              <van-button
                class="card_btn"
                round
                type="info"
                size="small"
                color="rgb(252, 59, 114)"
                plain
                @click="onClickBtn(item.btn, item.order_code)"
                >催发货</van-button
              >
            </van-col>
          </van-row>
        </div>
      </van-tab>
      <van-tab title="待收货" name="take">
        <div class="default" v-if="takeOrderListFirst.length === 0">
          <div style="display: flex; justify-content: center">
            <div class="default_icon">
              <van-icon name="bag-o" color="#fac5d7" size="60" />
            </div>
          </div>
          <p class="default_text">您还没有相关订单</p>
        </div>
        <div
          class="order_card"
          v-for="(item, index) in takeOrderListFirst"
          :key="index"
        >
          <van-row
            type="flex"
            justify="space-between"
            style="padding: 10px 15px 5px 15px; font-size: 14px"
          >
            <van-col span="20">订单时间：{{ item.createAt }}</van-col>
            <van-col
              span="4"
              style="text-align: right; color: rgb(252, 59, 114)"
            >
              待收货
            </van-col>
          </van-row>
          <div style="display: flex">
            <van-card
              :price="`${item.goodsFirst.price}.00`"
              :title="item.goodsFirst.title"
              :thumb="require(`assets/img/${item.goodsFirst.img_path}`)"
            />
            <div
              style="
                display: flex;
                align-items: center;
                background-color: #fafafa;
                padding: 0 5px;
              "
            >
              <van-icon
                name="arrow"
                @click="showOrderDetail(item.order_code, item.address_id)"
              />
            </div>
          </div>
          <div style="text-align: right; margin: 8px; font-size: 14px">
            共{{ item.total_count }}件商品，合计：￥{{ item.total_price }}.00
          </div>
          <van-divider style="margin: 0" />
          <van-row
            type="flex"
            justify="space-between"
            style="padding: 10px 15px 10px 15px; align-items: center"
          >
            <van-col span="8"></van-col>
            <van-col span="16" style="dispaly: flex; text-align: right">
              <van-button
                class="card_btn"
                round
                type="info"
                size="small"
                color="rgba(23, 43, 77, 0.5)"
                plain
                @click="onRefund(item.order_code)"
                >申请退款</van-button
              >
              <van-button
                class="card_btn"
                round
                type="info"
                size="small"
                color="rgb(252, 59, 114)"
                plain
                @click="onClickBtn(item.btn, item.order_code)"
                >去收货</van-button
              >
            </van-col>
          </van-row>
        </div>
      </van-tab>
      <van-tab title="交易完成" name="evaluate">
        <div class="default" v-if="evaluateOrderListFirst.length === 0">
          <div style="display: flex; justify-content: center">
            <div class="default_icon">
              <van-icon name="bag-o" color="#fac5d7" size="60" />
            </div>
          </div>
          <p class="default_text">您还没有相关订单</p>
        </div>
        <div
          class="order_card"
          v-for="(item, index) in evaluateOrderListFirst"
          :key="index"
        >
          <van-row
            type="flex"
            justify="space-between"
            style="padding: 10px 15px 5px 15px; font-size: 14px"
          >
            <van-col span="19">订单时间：{{ item.createAt }}</van-col>
            <van-col
              span="5"
              style="text-align: right; color: rgb(252, 59, 114)"
            >
              交易完成
            </van-col>
          </van-row>
          <div style="display: flex">
            <van-card
              :price="`${item.goodsFirst.price}.00`"
              :title="item.goodsFirst.title"
              :thumb="require(`assets/img/${item.goodsFirst.img_path}`)"
            />
            <div
              style="
                display: flex;
                align-items: center;
                background-color: #fafafa;
                padding: 0 5px;
              "
            >
              <van-icon
                name="arrow"
                @click="showOrderDetail(item.order_code, item.address_id)"
              />
            </div>
          </div>
          <div style="text-align: right; margin: 8px; font-size: 14px">
            共{{ item.total_count }}件商品，合计：￥{{ item.total_price }}.00
          </div>
          <van-divider style="margin: 0" />
          <van-row
            type="flex"
            justify="space-between"
            style="padding: 10px 15px 10px 15px; align-items: center"
          >
            <van-col span="8">
              <van-col span="8"></van-col>
            </van-col>
            <van-col span="16" style="dispaly: flex; text-align: right">
              <!-- <van-button
                class="card_btn"
                round
                type="info"
                size="small"
                color="rgb(252, 59, 114)"
                plain
                @click="onClickBtn(item.btn, item.order_code)"
                >去评价</van-button
              > -->
            </van-col>
          </van-row>
        </div>
      </van-tab>
    </van-tabs>

    <!-- van-action-sheet -->
    <van-action-sheet
      class="order_action"
      v-model="isActionShow"
      :description="`订单信息 (${currentOrderCode})`"
      close-on-click-action
    >
      <div class="content">
        <van-address-list :switchable="false" :list="currentAddresslist" />
        <van-divider />
        <van-card
          v-for="(item, index) in currentOrderDetail"
          :key="index"
          class="detail_card"
          :num="item.count"
          :desc="item.params"
          :price="`${item.price}.00`"
          :title="item.title"
          :thumb="require(`assets/img/${item.img_path}`)"
        />
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import Vue from 'vue'

let orderStatus = {
  1: { text: '待付款', btn: "去付款" },
  2: { text: '待发货', btn: "催发货" },
  3: { text: '待收货', btn: "确认收货" },
  // 4: { text: '交易完成', btn: "去评价" },
  4: { text: '交易完成', btn: " " },
  5: { text: '交易取消', btn: " " },
  6: { text: '等待退款', btn: " " },
  7: { text: '退款成功', btn: " " }
}

export default {
  data () {
    return {
      activeName: 'all',
      currentUserId: 0,
      orderList: [],
      isActionShow: false,
      currentOrderCode: '',
      addressById: [],
      url: ''
    }
  },
  computed: {
    orderListFirst () {
      return this.orderList.map((x, index) => {
        x.createAt = Vue.filter('date')(new Date(x.createAt))
        this.url = x.goods_info[0].img_path
        this.url = x.goods_info[0].img_path
        return {
          index: index,
          createAt: Vue.filter('date')(new Date(x.createAt)),
          status: orderStatus[x.status].text,
          btn: orderStatus[x.status].btn,

          title: x.goods_info[0].title,
          price: x.goods_info[0].price,
          // img_path: ,
          // goodsFirst: {
          //   title: x.goods_info[0].title,
          //   price: x.goods_info[0].price,
          //   img_path: x.goods_info[0].img_path
          // },
          title: x.goods_info[0].title,
          price: x.goods_info[0].price,
          img_path: x.goods_info[0].img_path,
          total_count: x.total_count,
          total_price: x.total_price,
          order_code: x.order_code,
          address_id: x.address_id
        }
      })
    },
    payOrderList () {
      return this.orderList.filter(x => x.status === 1)
    },
    payOrderListFirst () {
      return this.payOrderList.map(x => {
        x.createAt = Vue.filter('date')(new Date(x.createAt))
        return {
          createAt: Vue.filter('date')(new Date(x.createAt)),
          status: orderStatus[x.status].text,
          btn: orderStatus[x.status].btn,
          goodsFirst: {
            title: x.goods_info[0].title,
            price: x.goods_info[0].price,
            img_path: x.goods_info[0].img_path
          },
          total_count: x.total_count,
          total_price: x.total_price,
          order_code: x.order_code,
          address_id: x.address_id
        }
      })
    },
    deliverOrderList () {
      return this.orderList.filter(x => x.status === 2)
    },
    deliverOrderListFirst () {
      return this.deliverOrderList.map(x => {
        x.createAt = Vue.filter('date')(new Date(x.createAt))
        return {
          createAt: Vue.filter('date')(new Date(x.createAt)),
          status: orderStatus[x.status].text,
          btn: orderStatus[x.status].btn,
          goodsFirst: {
            title: x.goods_info[0].title,
            price: x.goods_info[0].price,
            img_path: x.goods_info[0].img_path
          },
          total_count: x.total_count,
          total_price: x.total_price,
          order_code: x.order_code,
          address_id: x.address_id
        }
      })
    },
    takeOrderList () {
      return this.orderList.filter(x => x.status === 3)
    },
    takeOrderListFirst () {
      return this.takeOrderList.map(x => {
        x.createAt = Vue.filter('date')(new Date(x.createAt))
        return {
          createAt: Vue.filter('date')(new Date(x.createAt)),
          status: orderStatus[x.status].text,
          btn: orderStatus[x.status].btn,
          goodsFirst: {
            title: x.goods_info[0].title,
            price: x.goods_info[0].price,
            img_path: x.goods_info[0].img_path
          },
          total_count: x.total_count,
          total_price: x.total_price,
          order_code: x.order_code,
          address_id: x.address_id
        }
      })
    },
    evaluateOrderList () {
      return this.orderList.filter(x => x.status === 4)
    },
    evaluateOrderListFirst () {
      return this.evaluateOrderList.map(x => {
        x.createAt = Vue.filter('date')(new Date(x.createAt))
        return {
          createAt: Vue.filter('date')(new Date(x.createAt)),
          status: orderStatus[x.status].text,
          btn: orderStatus[x.status].btn,
          goodsFirst: {
            title: x.goods_info[0].title,
            price: x.goods_info[0].price,
            img_path: x.goods_info[0].img_path
          },
          total_count: x.total_count,
          total_price: x.total_price,
          order_code: x.order_code,
          address_id: x.address_id
        }
      })
    },
    currentOrderDetail () {
      return this.orderList.reduce((xs, x, index) => {
        if (x.order_code === this.currentOrderCode) {
          xs = x.goods_info
        }
        return xs
      }, [])
    },
    currentAddresslist () {
      return this.addressById.map(x => {
        return {
          id: x.id,
          name: x.name,
          tel: x.tel,
          address: x.province + x.city + x.county + x.addressDetail
        }
      })
    }
  },
  methods: {
    async init () {
      await this.getOrderList()
      if (this.$route.params.status) {
        this.categoryOrder(this.$route.params.status)
      }
    },
    getOrderList () {
      this.$axios.get('/order/list', {
        params: {
          'user_id': this.currentUserId
        }
      }).then((res) => {
        console.log(res.data)
        this.orderList = res.data.sort((a, b) => a.createAt > b.createAt ? -1 : 1)
      }).catch((err) => { })
    },
    categoryOrder (status) {
      switch (status) {
        case 1:
          this.activeName = 'pay'
          break
        case 2:
          this.activeName = 'deliver'
          break
        case 3:
          this.activeName = 'take'
          break
        case 4:
          this.activeName = 'evaluate'
          break
        case 5:
          this.activeName = 'afterSales'
          break
      }
      console.log(this.activeName)
    },
    async showOrderDetail (code, id) {
      // console.log(code, id)
      this.currentOrderCode = code
      await this.getAddressById(id)
      this.isActionShow = true
    },
    getAddressById (id) {
      this.$axios.get('/address/select', {
        params: {
          'id': id
        }
      })
        .then((res) => {
          this.addressById = res.data
        }).catch((err) => { })
    },
    onCancel (code) {
      this.$dialog.confirm({
        message: '是否确定取消该订单？',
      })
        .then(() => {
          this.$axios.patch('/order/update', { status: 6, order_code: code })
            .then(() => {
              setTimeout(() => {
                this.$toast({
                  message: '取消订单成功'
                })
                this.init()
              }, 1000)
            })
            .catch(() => { })
        })
        .catch(() => {
          this.$toast({
            message: '已取消操作'
          })
        })
    },

    onDel (code) {
      this.$dialog.confirm({
        message: '是否确定删除该订单？',
      })
        .then(() => {
          // this.$axios.delete('/order/del', { data: { user_id: this.currentUserId, order_code: code } })
          //   .then((res) => {
          //     // console.log(res)
          //     this.$toast({
          //       message: '删除成功'
          //     })
          //   }).catch((err) => {
          //     console.log(err)
          //   })
          this.$axios.patch('/order/update', { status: 0, order_code: code })
            .then(() => {
              setTimeout(() => {
                this.$toast({
                  message: '取消订单成功'
                })
                this.init()
              }, 1000)
            })
            .catch(() => { })

        })
        .catch(() => {
          this.$toast({
            message: '取消删除'
          })
        })
    },
    onClickBtn (type, code) {
      // console.log(type, code)
      if (type === '去付款') {
        this.goPay(code)
      } else if (type === '催发货') {
        this.pushDelivery()
      } else if (type === '确认收货') {
        this.goReceive(code)
      } else if (type === '去评价') {
        this.goEvalute(code)
      } else if (type === '申请退款') {
        this.goRefund(code)
      }
    },
    // 去付款
    goPay (code) {
      this.$dialog.confirm({
        message: '是否确定支付？',
      })
        .then(() => {
          this.$axios.patch('/order/update', { status: 2, order_code: code })
            .then(() => {
              setTimeout(() => {
                this.$toast({
                  message: '支付成功'
                })
                this.init()
              }, 1000)
            })
            .catch(() => { })
        })
        .catch(() => {
          this.$toast({
            message: '取消支付'
          })
        })
    },
    // 催发货
    pushDelivery () {
      this.$toast({
        message: '催发货成功'
      })
    },
    // 去收货
    goReceive (code) {
      this.$dialog.confirm({
        message: '是否确定收货？',
      })
        .then(() => {
          this.$axios.patch('/order/update', { status: 4, order_code: code })
            .then(() => {
              setTimeout(() => {
                this.$toast({
                  message: '收货成功'
                })
              }, 1000)
              this.init()
            })
            .catch(() => { })
        })
        .catch(() => {
          this.$toast({
            message: '取消收货'
          })
        })
    },
    // 申请退款
    onRefund (code) {
      this.$dialog.confirm({
        message: '是否确定申请退款？',
      })
        .then(() => {
          this.$axios.patch('/order/update', { status: 6, order_code: code })
            .then(() => {
              setTimeout(() => {
                this.$toast({
                  message: '申请成功，等待审批'
                })
              }, 1000)
              this.init()
            })
            .catch(() => { })
        })
        .catch(() => {
          this.$toast({
            message: '取消申请'
          })
        })
    },
    // 去评价
    goEvalute (code) {
      console.log('评价')
    },
    returnPage () {
      this.$router.push({
        name: 'Profile'
      })
    }
  },
  created () {
    this.currentUserId = window.sessionStorage.getItem('user_id')
    this.init()
  }
}
</script>

<style scoped>
#myOrder {
  padding-bottom: 5px;
}
.topbar {
  /* padding: 6px 0; */
}
/deep/ .van-icon-arrow-left {
  color: #000;
}

/* default */
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
/* tabs_content */
.tabs_content {
}
.order_card {
  margin: 10px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: rgb(121 152 215 / 20%) 0px 0.06rem 0.2rem 0px;
}
.card_btn {
  padding: 0 20px;
}

/*  */
.content {
  padding: 20px 5px;
}
.detail_card {
  border-radius: 10px;
  border: 1px solid #ebeef5;
  box-shadow: rgb(121 152 215 / 20%) 0px 0.06rem 0.2rem 0px;
}
/deep/ .content .van-address-list {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 0;
  box-shadow: rgb(121 152 215 / 20%) 0px 0.06rem 0.2rem 0px;
}
/deep/ .content .van-radio__icon--round {
  display: none;
}
/deep/ .content .van-address-item__edit {
  display: none;
}
/deep/ .content .van-address-list__bottom {
  display: none;
}
</style>
