<template>
  <div>
    <div class="topbar">
      <van-nav-bar :title="title" left-arrow @click-left="returnPage" />
    </div>
    <div class="content">
      <van-address-edit
        :area-list="areaList"
        :address-info="addressList"
        show-postal
        :show-delete="isDel"
        show-set-default
        @save="onSave"
        @delete="onDel"
        @cancel-delete="cancelDel"
      />
    </div>
  </div>
</template>

<script>
import Area from "components/common/area"

export default {
  name: 'AddAddress',
  // props: {
  //   addressInfo: Object
  // },
  data () {
    return {
      title: '',
      areaList: Area.areaList,
      addressList: {},
      isDel: false,
      currentUserId: 0,
      currentType: 'add'
    }
  },
  methods: {
    init () {
      // console.log(this.$route.params.type)
      this.currentUserId = window.sessionStorage.getItem('user_id')
      this.currentType = this.$route.params.type
      if (this.currentType === 'add') {
        this.title = '新增地址'
      } else if (this.currentType === 'edit') {
        this.title = '修改地址'
        this.isDel = true
        this.addressList = this.$route.params.addressInfo
      }
    },
    returnPage () {
      this.$router.go(-1)
    },
    // 保存
    async onSave (content) {
      console.log(content)
      console.log(this.currentType)
      if (this.currentType === 'add') {
        content.user_id = this.currentUserId
        // console.log(content)
        await this.$axios.post('/address/add', content)
          .then((res) => {
            this.$toast({
              message: '保存成功'
            })
            this.$router.go(-1)
            // this.$router.push({
            //   name: 'Address'
            // })
          }).catch((err) => {
            console.log(err)
          })
      } else if (this.currentType === 'edit') {
        // console.log(content)
        // 修改
        await this.$axios.post('/address/edit', content)
          .then((res) => {
            // console.log(res)
            this.$toast({
              message: '保存成功'
            })
            this.$router.push({
              name: 'Address'
            })
          }).catch((err) => {
            console.log(err)
          })

      }

    },
    onDel (content) {
      console.log("删除")
      const user_id = content.user_id
      const id = content.id
      this.$axios.delete('/address/del', { data: { user_id: user_id, id: id } })
        .then((res) => {
          console.log(res)
          this.$toast({
            message: '删除成功'
          })
          this.$router.push({
            name: 'Address'
          })
        }).catch((err) => {
          console.log(err)
        })

    },
    cancelDel (content) {
      console.log("取消删除")
    }

  },
  created () {
    this.init()
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
/* content */
.content {
  /* margin: 10px;
  box-shadow: rgb(121 152 215 / 20%) 0px 0.04rem 0.2rem 0px;
  border-radius: 0.12rem; */
}
/deep/ .van-address-edit__fields {
  box-shadow: rgb(121 152 215 / 20%) 0px 0.04rem 0.2rem 0px;
}
/deep/ .van-address-edit__default {
  box-shadow: rgb(121 152 215 / 20%) 0px 0.04rem 0.2rem 0px;
}
/* 保存 */
/deep/ .van-address-edit__buttons button:nth-child(1) {
  border: none;
  background: linear-gradient(
    90deg,
    rgba(252, 59, 114, 0.78) 0%,
    rgb(252, 59, 114) 100%
  );
  box-shadow: rgb(121 152 215 / 20%) 0px 4px 0.2rem 0px;
}
/deep/ .van-address-edit__buttons button:nth-child(2) {
}
/* /deep/ .van-button {
  border: none;
  background: linear-gradient(
    90deg,
    rgba(252, 59, 114, 0.78) 0%,
    rgb(252, 59, 114) 100%
  );
  box-shadow: rgb(121 152 215 / 20%) 0px 4px 0.2rem 0px;
} */
</style>
