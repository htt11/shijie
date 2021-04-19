<template>
  <div id="userInfo">
    <div class="navbar">
      <van-nav-bar
        title="个人信息"
        right-text="保存"
        left-arrow
        fixed
        placeholder
        @click-left="returnPage"
        @click-right="saveInfo"
      />
    </div>
    <div class="content">
      <div class="content_pic">
        <div class="pic_circle">
          <!--  -->
          <div class="user_img" v-if="userInfo.role === 'server'">
            <span
              :class="`iconfont icon-v${userInfo.vip}`"
              style="font-size: 30px"
            ></span>
          </div>
          <div class="user_img" v-if="userInfo.role === 'admin'">
            <span
              class="iconfont icon-guanliyuan2"
              style="font-size: 30px"
            ></span>
          </div>
        </div>
      </div>
      <div class="content_text">
        <div class="text_item">
          <div style="display: flex; align-items: center">
            <span>昵称</span>
            <span style="font-size: 12px; color: #999; margin-left: 10px"
              >支持2-16个字符(中文、英文、数字)</span
            >
          </div>
          <van-field
            v-model="userInfo.name"
            class="item_input"
            maxlength="16"
            disabled
          />
        </div>
        <div
          class="text_item"
          style="display: flex; justify-content: space-between"
        >
          <p>性别</p>
          <van-radio-group
            v-model="gender"
            direction="horizontal"
            style="font-size: 14px"
          >
            <van-radio name="1" checked-color="#ff516c" icon-size="15px"
              >男</van-radio
            >
            <van-radio name="0" checked-color="#ff516c" icon-size="15px"
              >女</van-radio
            >
          </van-radio-group>
        </div>
        <div
          class="text_item"
          style="display: flex; justify-content: space-between"
        >
          <p>生日</p>
          <p
            style="font-size: 14px; display: flex; justify-content: content"
            @click="timeShow = true"
          >
            <span v-if="!birthdayTime">请选择 <van-icon name="arrow" /></span>
            <span v-else>{{ birthdayTime }}</span>
          </p>
          <van-popup v-model="timeShow" round position="bottom">
            <van-datetime-picker
              v-model="currentDate"
              type="date"
              title="日期"
              :min-date="minDate"
              :max-date="maxDate"
              @confirm="confirm(currentDate)"
              @cancel="timeShow = false"
            />
          </van-popup>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserInfo',
  data () {
    return {
      name: 'sigo20210301637833',
      gender: '1',
      imgPath: '',
      timeShow: false,
      userInfo: {},
      currentDate: new Date(),
      birthdayTime: '',
      minDate: new Date(1990, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(2021, 3, 1),
    }
  },
  methods: {
    init () {
      // console.log(this.$route.params.data)
      this.userInfo = this.$route.params.data
      let data = this.$route.params.data
      this.name = data.name
      this.gender = data.gender
      this.birthdayTime = data.birth
    },
    handleChange (file, fileList) {
      console.log(file)
      console.log(fileList)

      this.fileList = fileList.slice(-3);
    },
    returnPage () {
      this.$router.go(-1)
    },
    confirm (value) {
      let time = new Date(value)
      let year = time.getFullYear() + ''
      let month = (time.getMonth() + 1) + ''
      month = (month.length === 1 ? '0' + month : month)
      let day = time.getDate() + ''
      day = (day.length === 1 ? '0' + day : day)
      this.birthdayTime = [year, month, day].join('-')
      this.timeShow = false
    },
    saveInfo () {
      console.log(this.gender, this.birthdayTime)
      // console.log(this.isDefault)
      // if (this.isDefault) {
      //   this.$toast({
      //     message: '请选择头像',
      //     position: 'top',
      //   })
      //   return
      // }
      // if (!this.name) {
      //   this.$toast({
      //     message: '昵称不为空',
      //     position: 'top',
      //   })
      //   return
      // }
      // 发送请求
      this.$axios.patch('/users/addOtherInfo', { 'gender': this.gender, 'birth': this.birthdayTime, 'id': this.userInfo.id })
        .then(() => {
          setTimeout(() => {
            this.$toast({
              message: '保存成功'
            })
            this.$router.push({
              name: 'Profile'
            })
          }, 1000)
        })
        .catch(() => { })
    },
    clickBadge () {
      console.log('上传头像功能')
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
/deep/ .van-icon-arrow-left {
  color: #323233;
}
/deep/ .van-nav-bar__text {
  color: rgb(253, 95, 140);
}
.content {
  margin: 30px 10px;
  padding: 20px 10px;
  background-color: #fff;
  border-radius: 5px;
  font-family: "Microsoft YaHei";
  box-shadow: rgb(121 152 215 / 20%) 0px 6px 20px 0px;
}
.content_pic {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
.pic_circle {
  width: 20%;
}
.pic_circle_item {
  width: 100%;
  padding-bottom: 100%;
  border-radius: 50%;

  border: 1px solid #ccc;
  background-color: #f1f3f5;
  position: relative;
}
.pic_item {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
/* 默认头像图标 */
.van-icon-manager {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content_text {
}
.text_item {
  margin: 14px 10px;
  color: #a5adba;
}
.item_input {
  border: none;
  padding: 3px 8px;
  font-size: 10px;
  margin-top: 10px;
  background-color: rgb(248, 249, 250);
}
</style>
