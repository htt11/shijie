<template>
  <div id="address">
    <div class="topbar">
      <van-nav-bar
        fixed
        placeholder
        title="收货地址"
        left-arrow
        @click-left="returnPage"
      />
    </div>
    <div class="default" v-if="addressList.length === 0">
      <div style="display: flex; justify-content: center">
        <div class="default_icon">
          <van-icon name="map-marked" color="#fac5d7" size="60" />
        </div>
      </div>
      <p class="default_text">您还没有收货地址，去添加吧</p>
    </div>
    <div
      class="address"
      v-else
      v-for="(item, index) in addressList"
      :key="index"
    >
      <div class="address_left" @click="onSelect(index)">
        <p style="margin-bottom: 8px">
          <span style="margin-right: 10px">{{ item.name }}</span>
          <span style="margin-right: 10px">{{ item.tel }}</span>
          <span v-if="item.isDefault === 1"
            ><van-tag color="rgb(252, 59, 114)" style="border-radius: 3px"
              >默认</van-tag
            ></span
          >
        </p>
        <p>
          <span
            >{{ item.province }}{{ item.city }}{{ item.county
            }}{{ item.addressDetail }}</span
          >
        </p>
      </div>
      <div class="address_right">
        <van-icon name="edit" @click="onEdit(item, index)" />
      </div>
    </div>
    <div class="addAddress">
      <van-button class="addBtn" round type="info" @click="onAdd"
        >添加收货地址</van-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'Address',
  data () {
    return {
      currentUserId: 0,
      addressList: []
    }
  },
  methods: {
    async init () {
      this.currentUserId = window.sessionStorage.getItem('user_id')
      await this.getAddressList()
    },
    getAddressList () {
      this.$axios.get('/address/list', {
        params: {
          'user_id': this.currentUserId
        }
      })
        .then((res) => {
          console.log(res.data)
          this.addressList = res.data
        }).catch((err) => { })
    },
    returnPage () {
      // this.$router.go(-1)
      this.$router.push({
        name: 'Profile'
      })
    },
    onAdd () {
      this.$router.push({
        name: 'AddAddress',
        params: { type: 'add' }
      })
    },
    onEdit (data) {
      data.isDefault = data.isDefault === 1 ? true : false
      this.$router.push({
        name: 'AddAddress',
        params: {
          type: 'edit',
          addressInfo: data
        }
      })
    },
    onSelect (index) {
      console.log('选中index', index)
    }
  },
  created () {
    this.init()
  }

}
</script>

<style scoped>
#address {
  padding-bottom: 50px;
}
/*  */
.default {
  padding: 76px;
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

/* address */
.address {
  display: flex;
  margin: 12px;
  padding: 15px 12px;
  font-size: 14px;
  box-shadow: rgb(121 152 215 / 20%) 0px 0.06rem 0.2rem 0px;
  border-radius: 5px;
  background-color: #fff;
}
.address_left {
  flex: 10;
}
.address_right {
  flex: 1;
}

/* 添加收货地址 */
.addAddress {
  width: 100%;
  padding: 5px 15px;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
}
.addBtn {
  width: 100%;
  border: none;
  background: linear-gradient(
    90deg,
    rgba(252, 59, 114, 0.78) 0%,
    rgb(252, 59, 114) 100%
  );
  box-shadow: rgb(121 152 215 / 20%) 0px 4px 0.2rem 0px;
}
</style>
