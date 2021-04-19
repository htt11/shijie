<template>
  <div id="profile" v-loading="loading">
    <div class="profile-head">
      <div class="user" v-if="userInfo.role === 'server'">
        <van-row>
          <van-col span="5">
            <div class="user_img">
              <span
                :class="`iconfont icon-v${userInfo.vip}`"
                style="font-size: 30px"
              ></span>
            </div>
          </van-col>
          <van-col span="16" class="user_txet">
            <div style="margin-bottom: 5px">
              <span>{{ userInfo.name }}</span>
            </div>
            <span class="iconfont icon-VIP" style="color: #ff5f77"></span>
            <span style="color: #ccc; font-size: 10px"
              >成长值:{{ userInfo.score }}</span
            >
          </van-col>
          <van-col span="2" style="margin-top: 10px">
            <span
              class="iconfont icon-qiandao2"
              style="font-size: 30px; color: #fdbf46"
              @click="onSignIn"
            ></span>
          </van-col>
        </van-row>
      </div>
      <div class="user" v-if="userInfo.role === 'admin'">
        <van-row>
          <van-col span="5">
            <div class="user_img">
              <span
                :class="`iconfont icon-guanliyuan2`"
                style="font-size: 30px"
              ></span>
            </div>
          </van-col>
          <van-col span="16" class="user_txet">
            <div style="margin-bottom: 5px">
              <span>{{ userInfo.name }}</span>
            </div>
            <span
              class="iconfont icon-guanliyuan6"
              style="color: #ff5f77"
            ></span>
            <span style="color: #ccc; font-size: 10px"
              >成长值:{{ userInfo.score }}</span
            >
          </van-col>
          <van-col span="2" style="margin-top: 10px">
            <span
              class="iconfont icon-qiandao2"
              style="font-size: 30px; color: #fdbf46"
              @click="onSignIn"
            ></span>
          </van-col>
        </van-row>
      </div>

      <!-- 订单 -->
      <div class="order_list list_model">
        <div class="order_title">
          <div>我的订单</div>
          <div class="all_order">
            <span @click="toMyOrder">全部订单</span>
            <van-icon name="arrow" />
          </div>
        </div>
        <van-divider :style="{ borderColor: '#ddd', margin: '5px 0' }" />
        <div class="order_category">
          <div
            class="cat_item"
            v-for="(item, index) in orderList"
            :key="index"
            @click="onClick(item.status)"
          >
            <div style="margin-bottom: 10px">
              <van-badge :content="item.num" color="#fc5e8b">
                <van-icon
                  class="iconfont"
                  class-prefix="icon"
                  :name="item.icon"
                  size="30"
                  color="#fc5e8b"
                />
              </van-badge>
            </div>
            <div style="color: rgba(126, 137, 157, 1)">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- other -->
    <div class="other_list list_model">
      <div>
        <span class="order_title my_tool">我的工具</span>
      </div>
      <van-divider :style="{ borderColor: '#ddd', margin: '5px 0' }" />
      <div class="tool_category">
        <div
          class="tool_item"
          v-for="(item, index) in toolList"
          :key="index"
          @click="clickTool(item.title)"
        >
          <van-icon :name="item.icon" :size="20" style="margin-right: 10px" />
          <span>{{ item.title }}</span>
        </div>
      </div>
    </div>

    <div class="footer_btn" v-if="isLogin">
      <!-- 切换账号 -->
      <van-button
        class="footer_btn_item"
        round
        type="default"
        block
        @click="onTagger"
        >切换账号</van-button
      >

      <!-- 退出登录 -->
      <van-button
        class="footer_btn_item"
        round
        type="default"
        block
        @click="onEnd"
        >退出登录</van-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
      isLogin: false,
      loading: false,
      userInfo: {},
      currentUserId: 0,
      currentUserOrder: [],
      currentRole: 'server',
      orderList: {
        1: { title: '待付款', icon: 'daifukuan', num: 0, status: 1 },
        2: { title: '待发货', icon: 'daifahuo', num: 0, status: 2 },
        3: { title: '待收货', icon: 'daishouhuo', num: 0, status: 3 },
        4: { title: '交易完成', icon: 'daipingjia1', num: 0, status: 4 },
        5: { title: '售后', icon: 'shouhou', num: 0, status: 5 }
      },
      toolList: [
        { title: '个人信息', icon: 'records' },
        // { title: '余额/卡券', icon: 'balance-pay' },
        { title: '我的收藏', icon: 'star-o' },
        { title: '收货地址', icon: 'location-o' }
        // { title: '会员等级', icon: 'bar-chart-o' },
        // { title: '我的客服', icon: 'service-o' },
        // { title: '消息盒子', icon: 'envelop-o' },
        // { title: '价格保护', icon: 'peer-pay' },
      ]
    }
  },
  computed: {},
  methods: {
    init () {
      // console.log(window.sessionStorage.getItem('username'))
      this.isLogin = window.sessionStorage.getItem('username') ? true : false
      if (this.isLogin) {
        const name = window.sessionStorage.getItem('username')
        this.$axios.get('/users/userInfo', {
          params: {
            'name': name
          }
        })
          .then((res) => {
            // console.log(res.data)
            this.userInfo = res.data[0]
            this.currentUserId = this.userInfo.id
            this.currentRole = this.userInfo.role
            if (this.currentRole === 'admin') {
              this.toolList.push(
                { title: '用户管理', icon: 'manager-o' },
                { title: '订单管理', icon: 'bill-o' }
              )
            }
            // console.log(this.currentRole)
            window.sessionStorage.setItem('user_id', this.userInfo.id)
            // console.log(this.userInfo)
            // this.userInfo.imgPath = this.userInfo.imgPath ? this.userInfo.imgPath : 'https://img01.yzcdn.cn/vant/cat.jpeg'

            this.$axios.get('/order/count', {
              params: {
                'user_id': this.currentUserId
              }
            }).then((res) => {
              this.currentUserOrder = res.data
              // console.log(res.data)
              this.getOrderList(res.data)
            })
              .catch((err) => { })

          }).catch((err) => { })
      } else {
        this.$router.push({
          name: 'Login'
        })
      }
    },
    getOrderList (data) {
      // console.log(data)
      data.map(x => {
        switch (x.status) {
          case 1:
            this.orderList[1].num += x.count
            break
          case 2:
            this.orderList[2].num += x.count
            break
          case 3:
            this.orderList[3].num += x.count
            break
          case 4:
            this.orderList[4].num += x.count
            break
          case 6:
            this.orderList[5].num += x.count
            break
          case 7:
            this.orderList[5].num += x.count
            break
          case 9:
            this.orderList[9].num += x.count
            break
        }
      })
    },
    onClick (status) {
      if (status == 5) {
        this.$router.push({
          name: 'Refund'
        })
      } else {
        this.$router.push({
          name: 'MyOrder',
          params: { status: status }
        })
      }

    },
    onSignIn () {
      const date = new Date().toLocaleDateString()
      if (this.userInfo.sign != date) {
        let vip = 1
        if (this.userInfo.score + 20 >= 1000 && this.userInfo.score + 20 < 2000) {
          vip = 2
        } else if (this.userInfo.score + 20 >= 2000) {
          vip = 3
        }
        this.$axios.patch('/users/score', { id: this.currentUserId, score: this.userInfo.score + 20, sign: date, vip: vip })
          .then(() => {
            this.userInfo.score = this.userInfo.score + 20
            this.userInfo.vip = vip
            setTimeout(() => {
              this.$toast({
                message: '签到成功，成长值+20！'
              })
            }, 500)
          })
          .catch(() => { })
      } else {
        this.$toast({
          message: '今天已经签过到啦！'
        })
      }
    },
    goLogin () {
      this.$router.push({
        name: 'Login'
      })
    },
    goRegister () {
      this.$router.push({
        name: 'Register'
      })
    },
    clickTool (tool) {
      if (tool === '收货地址') {
        this.$router.push({
          name: 'Address'
        })
      } else if (tool === '我的收藏') {
        this.$router.push({
          name: 'Collect'
        })
      } else if (tool === '个人信息') {
        this.$router.push({
          name: 'UserInfo',
          params: { data: this.userInfo }
        })
      } else if (tool === '用户管理') {
        this.$router.push({
          name: 'AdminUser',
        })
      } else if (tool === '订单管理') {
        this.$router.push({
          name: 'AdminOrder'
        })
      }
    },
    onTagger () {
      this.$router.push({
        name: 'Login'
      })
    },
    onEnd () {
      // window.sessionStorage.removeItem('token')
      // window.sessionStorage.removeItem('user')
      window.sessionStorage.clear()
      this.isLogin = false
      this.$router.push({
        name: 'Home'
      })
    },
    toMyOrder () {
      this.$router.push({
        name: 'MyOrder'
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style>
#profile {
  height: 100vh;
  background-color: var(--color-background);
  margin-bottom: 50px;
}

.profile-head {
  /* background-image: linear-gradient(
    #ff5e7f,
    #ff5e7f 66%,
    #f9faff 66%,
    #f9faff 100%
  ); */
  background-image: linear-gradient(
    #ff5e7f,
    #ff5e7f 15%,
    #f9faff 40%,
    #f9faff 100%
  );
  padding-top: 6vh;
  padding-left: 10px;
  padding-right: 10px;
  position: relative;
}

/* user */
.user {
  /* text-align: center; */
  padding: 15px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0.06rem 0.2rem 0 rgb(121 152 215 / 20%);
}
.user_img {
  width: 60px;
  height: 60px;
  background-color: #fff3f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user_txet {
  padding: 5px 10px;
}

/*  */
.order_list {
  font-size: 0.26rem;
  border-radius: 5px;
  background-color: #fff !important;
  box-shadow: 0 0.06rem 0.2rem 0 rgb(121 152 215 / 20%);
  /* position: absolute;
  bottom: 0; */
}
.order_title {
  display: flex;
  padding: 20px 10px 10px 10px;
  justify-content: space-between;
}
.all_order {
  display: flex;
  align-items: center;
}
.order_category {
  display: flex;
  padding: 15px;
  justify-content: space-between;
}
.cat_item {
  text-align: center;
}

/* other_list */
.other_list {
  background-color: #fff;
  margin: 10px;
  border-radius: 5px;
  box-shadow: 0 0.06rem 0.2rem 0 rgb(121 152 215 / 20%);
  /* font-size: 0.29rem; */
}
.my_tool {
  color: #182c4e;
}

/* tool_category */
.tool_category {
  padding: 10px;
}
.tool_item {
  padding: 10px 5px;
  border-bottom: 1px solid #f2f3f5;
  display: flex;
  /* justify-content: center; */
  align-items: center;
}

/* footer_btn */
.footer_btn {
  padding: 0 20px;
}
.footer_btn_item {
  margin: 10px 0;
}
</style>
