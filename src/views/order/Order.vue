<template>
  <div class="order">
    <div>
      <!-- topbar -->
      <div>
        <van-sticky>
          <van-nav-bar
            title="确认订单"
            left-arrow
            @click-left="returnPage"
          ></van-nav-bar>
        </van-sticky>
      </div>
      <!-- address -->
      <div class="address">
        <van-contact-card
          type="add"
          add-text="添加收货地址"
          @click="onAdd"
          v-if="isShowAddress"
        />
        <van-contact-card
          class="address_card"
          type="edit"
          :name="currentAddress.name"
          :tel="currentAddress.tel"
          @click="onClick"
          v-else
        />
      </div>
      <!-- content -->
      <div class="content">
        <div class="content_box">
          <div
            class="content_item"
            v-for="(item, index) in orderList.goodsInfo"
            :key="index"
          >
            <van-card
              class="content_card"
              :num="item.count"
              :desc="item.params"
              :price="`${item.price}.00`"
              :title="item.title"
              :thumb="require(`assets/img/${item.imgPath}`)"
            />
            <div class="content_text">
              小计：
              <span>￥{{ item.price * item.count }}.00</span>
            </div>
            <van-divider style="margin: 0 0 10px 0" />
          </div>
          <div class="content_text">配送方式：快递免邮</div>
          <div class="content_text">运费险：卖家赠送</div>
        </div>
      </div>
      <!-- footer -->
      <van-tabbar class="order_footer" fixed placeholder>
        <div>
          应付金额：<span style="color: #ff5e7f"
            >￥{{ orderList.totalPrice }}.00</span
          >
        </div>
        <van-button class="footer_btn" round color="#ff5e7f" @click="onSubmit"
          >去支付</van-button
        >
      </van-tabbar>
    </div>
    <!-- loading -->
    <div></div>
    <!-- van-action-sheet -->
    <van-action-sheet
      class="order_action"
      v-model="isShow"
      description="选择收货地址"
      close-on-click-action
    >
      <div class="content">
        <van-address-list
          v-model="chosenAddressId"
          :list="addressList"
          default-tag-text="默认"
          @add="onAdd"
          @select="onSelect"
        />
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
export default {
  name: "Order",
  data () {
    return {
      orderList: [],
      currentUserId: 0,
      addressList: [],
      currentAddress: {},
      isShow: false,
      chosenAddressId: 0,
      orderCode: '',
      isShowAddress: false,
      cartIdArr: []
    }
  },
  computed: {
  },
  methods: {
    async init () {
      this.currentUserId = window.sessionStorage.getItem('user_id')
      this.orderList = this.$route.params.orderList
      // console.log(this.orderList)
      await this.getAddressList()
      this.getCartId()
    },
    getAddressList () {
      this.$axios.get('/address/list', {
        params: {
          'user_id': this.currentUserId
        }
      })
        .then((res) => {
          if (res.data.length === 0) {
            console.log('无地址')
            this.isShowAddress = true
          } else if (res.data.length === 1) {
            let data = res.data[0]
            this.currentAddress = data
            this.chosenAddressId = data.id

            this.addressList = res.data
            this.addressList[0].address = data.province + data.city + data.county + data.addressDetail
          } else {
            this.addressList = res.data
            this.addressList.map(x => {
              if (x.isDefault === 1) {
                this.currentAddress = x
                this.chosenAddressId = x.id
              }
              x.address = x.province + x.city + x.county + x.addressDetail
            })
          }

        }).catch((err) => { })
    },
    getCartId () {
      this.orderList.goodsInfo.map(x => {
        this.cartIdArr.push(x.id)
      })
    },
    onClick () {
      this.isShow = true
    },
    onAdd () {
      this.$router.push({
        name: 'AddAddress',
        params: { type: 'add', from: 'order' }
      })
    },
    onSelect (item, index) {
      this.currentAddress = item
      this.isShow = false
    },
    onSubmit () {
      const data = { order_code: this.orderCode, user_id: this.currentUserId, total_price: this.orderList.totalPrice, total_count: this.orderList.totalNum, address_id: this.currentAddress.id }
      let status = 1
      this.$dialog.confirm({
        message: '确定支付吗？',
      }).then(() => {
        // 确认
        status = 2
        data.status = status
        this.$axios.post('/order/add', data)
          .then((res) => {
            this.pushGoods()
            this.delCart()
          })
          .catch((err) => {
            console.log(err)
          })
        setTimeout(() => {

          this.$toast({
            message: '支付成功'
          })
          this.$router.push({
            name: 'MyOrder',
            params: { status: 2 }
          })
        }, 1000)
      }).catch(() => {
        // 取消
        data.status = status
        this.$axios.post('/order/add', data)
          .then((res) => {
            this.pushGoods()
          })
          .catch((err) => { })
        setTimeout(() => {
          this.delCart()
          this.$toast({
            message: '取消支付'
          })
          this.$router.push({
            name: 'MyOrder',
            params: { status: 1 }
          })
        }, 1000)
      })
    },
    // 添加订单关联商品
    pushGoods () {
      this.orderList.goodsInfo.map(x => {
        const data = { order_code: this.orderCode, goods_id: x.id, count: x.count, title: x.title, price: x.price, img_path: x.imgPath, params: x.params }
        this.$axios.post('/order/additem', data)
          .then((res) => {
            // console.log(res.data)
          }).catch((err) => {
            console.log(err)
          })
      })
    },
    delCart () {
      this.cartIdArr.map(x => {
        this.$axios.delete('/cart/del', { data: { id: x } })
          .then((res) => {
            // console.log(res)

          }).catch((err) => {
            console.log(err)
          })

      })

    },
    getProjectNum () {
      const projectTime = new Date() // 当前中国标准时间
      const Year = projectTime.getFullYear() // 获取当前年份 支持IE和火狐浏览器.
      const Month = projectTime.getMonth() + 1 // 获取中国区月份
      const Day = projectTime.getDate() // 获取几号
      var CurrentDate = Year
      if (Month >= 10) { // 判断月份和几号是否大于10或者小于10
        CurrentDate += Month
      } else {
        CurrentDate += '0' + Month
      }
      if (Day >= 10) {
        CurrentDate += Day
      } else {
        CurrentDate += '0' + Day
      }
      return CurrentDate
    },
    returnPage () {
      this.$router.push({
        name: 'Cart'
      })
    }
  },
  created () {
    this.init()
    // 生成订单号
    this.orderCode = this.getProjectNum() + Math.floor(Math.random() * 10000)
  }

}
</script>

<style scoped>
/* address */
.address {
  padding: 5px;
}
.address_card {
  border-radius: 10px;
  box-shadow: rgb(121 152 215 / 20%) 0px 0.06rem 0.2rem 0px;
}
/* content */
.content {
  padding: 5px;
}
.content_box {
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: rgb(121 152 215 / 20%) 0px 0.06rem 0.2rem 0px;
}
.content_item {
  margin: 5px 0;
  /* padding: 10px; */
}
.content_card {
  border: 10px;
  margin-bottom: 10px;
  box-shadow: rgb(121 152 215 / 20%) 0px 0.06rem 0.2rem 0px;
}
.content_text {
  display: flex;
  justify-content: flex-end;
  font-size: 13px;
  margin: 20px 0 10px 0;
}
/* footer */
/deep/ .van-hairline--top-bottom {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  box-sizing: border-box;
  padding: 5px 10px;
}
.order_footer .footer_btn {
  width: 35%;
  height: 90%;
}

/* order_action */
.order_action {
}
/deep/ .van-address-list__add {
  background-color: #ff5e7f;
  border: none;
  display: none;
}
/deep/ .van-address-item__tag {
  background-color: rgb(252, 59, 114);
}
/deep/ .van-address-item__edit {
  display: none;
}
</style>
