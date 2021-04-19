<template>
  <div id="admin_order">
    <!-- topbar -->
    <van-sticky>
      <van-nav-bar
        class="topbar"
        title="订单管理"
        left-arrow
        @click-left="returnPage"
        style=""
      />
    </van-sticky>
    <!-- tab标签页 -->
    <van-tabs class="tabs_content" v-model="activeName" sticky>
      <van-tab title="全部" name="all">
        <div class="default" v-if="orderListFirst.length === 0">
          <div style="display: flex; justify-content: center">
            <div class="default_icon">
              <van-icon name="bag-o" color="#fac5d7" size="60" />
            </div>
          </div>
          <p class="default_text">您还没有相关订单</p>
        </div>
        <div
          class="order_card"
          v-for="(item, index) in orderListFirst"
          :key="index"
        >
          <div style="padding: 10px 15px 0 15px; font-size: 14px">
            <span>用户ID：{{ item.user_name }}</span>
          </div>
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
          <!-- card -->
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
            <van-col span="8"> </van-col>
            <van-col span="16" style="dispaly: flex; text-align: right">
              <van-button
                class="card_btn"
                round
                type="info"
                size="small"
                color="rgb(252, 59, 114)"
                plain
                v-if="item.status === '待发货'"
                @click="onClickBtn(item.order_code)"
                >点击发货</van-button
              >
              <van-button
                class="card_btn"
                round
                type="info"
                size="small"
                color="rgb(252, 59, 114)"
                plain
                @click="onAgree(item.order_code)"
                v-if="item.status === '待退款'"
                >同意退款</van-button
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
          <div style="padding: 10px 15px 0 15px; font-size: 14px">
            <span>用户ID：{{ item.user_name }}</span>
          </div>
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
          <div style="padding: 10px 15px 0 15px; font-size: 14px">
            <span>用户ID：{{ item.user_name }}</span>
          </div>
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
            <van-col span="8"> </van-col>
            <van-col span="16" style="dispaly: flex; text-align: right">
              <van-button
                class="card_btn"
                round
                type="info"
                size="small"
                color="rgb(252, 59, 114)"
                plain
                v-if="item.status === '待发货'"
                @click="onClickBtn(item.order_code)"
                >点击发货</van-button
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
          <div style="padding: 10px 15px 0 15px; font-size: 14px">
            <span>用户ID：{{ item.user_name }}</span>
          </div>
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
        </div>
      </van-tab>
      <van-tab title="待退款" name="evaluate">
        <div class="default" v-if="refundOrderListFirst.length === 0">
          <div style="display: flex; justify-content: center">
            <div class="default_icon">
              <van-icon name="bag-o" color="#fac5d7" size="60" />
            </div>
          </div>
          <p class="default_text">您还没有相关订单</p>
        </div>

        <div
          class="order_card"
          v-for="(item, index) in refundOrderListFirst"
          :key="index"
        >
          <div style="padding: 10px 15px 0 15px; font-size: 14px">
            <span>用户ID：{{ item.user_name }}</span>
          </div>
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
              待退款
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
                color="rgb(252, 59, 114)"
                plain
                @click="onAgree(item.order_code)"
                >同意退款</van-button
              >
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
  1: { text: '待付款' },
  2: { text: '待发货' },
  3: { text: '待收货' },
  4: { text: '交易完成' },
  5: { text: '交易取消' },
  6: { text: '待退款' },
  7: { text: '退款成功' }
}

export default {
  data () {
    return {
      activeName: 'all',
      currentUserId: 0,
      orderList: [],
      isActionShow: false,
      currentOrderCode: '',
      addressById: []
    }
  },
  computed: {
    orderListFirst () {
      return this.orderList.map((x, index) => {
        x.createAt = Vue.filter('date')(new Date(x.createAt))
        return {
          index: index,
          user_name: x.user_name,
          createAt: Vue.filter('date')(new Date(x.createAt)),
          status: orderStatus[x.status].text,
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
    payOrderList () {
      return this.orderList.filter(x => x.status === 1)
    },
    payOrderListFirst () {
      return this.payOrderList.map(x => {
        x.createAt = Vue.filter('date')(new Date(x.createAt))
        return {
          user_name: x.user_name,
          createAt: Vue.filter('date')(new Date(x.createAt)),
          status: orderStatus[x.status].text,
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
          user_name: x.user_name,
          createAt: Vue.filter('date')(new Date(x.createAt)),
          status: orderStatus[x.status].text,
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
          user_name: x.user_name,
          createAt: Vue.filter('date')(new Date(x.createAt)),
          status: orderStatus[x.status].text,
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
    refundOrderList () {
      return this.orderList.filter(x => x.status === 6)
    },
    refundOrderListFirst () {
      return this.refundOrderList.map(x => {
        x.createAt = Vue.filter('date')(new Date(x.createAt))
        return {
          user_name: x.user_name,
          createAt: Vue.filter('date')(new Date(x.createAt)),
          status: orderStatus[x.status].text,
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
      this.$axios.get('/order/listAll',).then((res) => {
        // console.log(res.data)
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
      }
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
          this.$axios.patch('/order/update', { status: 0, order_code: code })
            .then(() => {
              setTimeout(() => {
                this.$toast({
                  message: '删除成功'
                })
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
    // 发货
    onClickBtn (code) {
      this.$dialog.confirm({
        message: '是否确定发货？',
      })
        .then(() => {
          this.$axios.patch('/order/update', { status: 3, order_code: code })
            .then(() => {
              setTimeout(() => {
                this.$toast({
                  message: '发货成功'
                })
                this.init()
              }, 1000)
            })
            .catch(() => { })
        })
        .catch(() => {
          this.$toast({
            message: '取消发货'
          })
        })
    },
    // 同意退款
    onAgree (code) {
      this.$dialog.confirm({
        message: '是否确定同意退款？',
      })
        .then(() => {
          this.$axios.patch('/order/update', { status: 7, order_code: code })
            .then(() => {
              setTimeout(() => {
                this.$toast({
                  message: '退款成功'
                })
                this.init()
              }, 1000)
            })
            .catch(() => { })
        })
        .catch(() => {
          this.$toast({
            message: '取消退款'
          })
        })
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
#admin_order {
  padding-bottom: 5px;
}
.topbar {
  /* padding: 6px 0; */
}
/deep/ .van-icon-arrow-left {
  color: #000;
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
</style>
