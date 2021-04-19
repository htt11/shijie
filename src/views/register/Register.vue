<template>
  <div id="register">
    <div class="returnIcon">
      <van-icon
        name="arrow-left"
        color="#c8c9cc"
        size="25"
        @click="returnPage"
      />
    </div>
    <div class="content">
      <van-form @submit="onSubmit">
        <van-field
          v-model="name"
          name="用户名"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="password2"
          type="password"
          name="密码"
          label="确认密码"
          placeholder="请确认密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin-top: 30px">
          <van-button
            round
            block
            type="info"
            color="linear-gradient(90deg,rgba(252, 59, 114, 0.78) 0%,rgba(252, 59, 114, 1) 100%)"
            native-type="submit"
            >注册</van-button
          >
        </div>
      </van-form>
      <!-- <div class="input_content">
        <van-cell-group class="group_content">
          <van-field
            class="field_content"
            v-model="userInfo.name"
            left-icon="user-o"
            placeholder="请输入用户名"
            style="border-bottom: 1px solid #ddd"
          />
          <van-field
            class="field_content"
            v-model="userInfo.password"
            type="password"
            left-icon="idcard"
            placeholder="请输入密码"
          />
        </van-cell-group>
      </div> -->
      <!-- <div class="btn_content">
        <div class="btn_div">
          <button class="btn_item item_register" @click="sub()">注册</button>
        </div>
        <div class="btn_div">
          <button class="btn_item item_login">去登录</button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import qs from 'qs'

export default {
  name: "Register",
  data () {
    return {
      name: '',
      password: '',
      password2: ''
    }
  },
  methods: {
    returnPage () {
      this.$router.go(-1)
    },
    onSubmit () {
      if (this.password2 !== this.password) {
        this.$toast({
          message: '两次输入密码不一致'
        })
        return
      }
      this.$axios.post('/users', {
        name: this.name,
        password: this.password
      })
        .then((result) => {
          this.$toast.success({
            message: '注册成功',
            position: 'top'
          })
          this.$router.push({
            name: 'Login'
          })
        }).catch((err) => {
          console.log(err.response.status)
          console.log(err.response.status === 409)
          if (err.response.status === 409) {
            this.$toast.fail({
              message: '该用户名已存在',
              position: 'top'
            })
          }
        })
    }
  }
}
</script>

<style scoped>
#register {
  height: 100vh;
  background-color: #fff;
}
.returnIcon {
  padding: 20px;
}
.content {
  padding: 30px;
  margin: 0 20px;
  margin-top: 20%;
  border-radius: 12px;
  box-shadow: 0px 4px 20px 0px rgb(121 152 215 / 20%);
}
/* .content {
  padding: 0 30px;
  margin-top: 30%;
}
.input_content {
}
.group_content {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0px 4px 20px 0px rgb(121 152 215 / 20%);
}
.field_content {
  padding: 18px 10px;
  color: #172b4d;
}
.btn_content {
}
.btn_div {
  padding: 10px 0;
}
.btn_item {
  width: 100%;
  font-size: 14px;
  padding: 10px;
  border-radius: 30px;
  border: 1px solid #ff5474;
  box-shadow: 0px 4px 20px 0px rgb(121 152 215 / 20%);
}
/deep/ .van-field__left-icon {
  margin-right: 10px;
}
.item_login {
  color: #fff;
  background: linear-gradient(
    90deg,
    rgba(252, 59, 114, 0.78) 0%,
    rgba(252, 59, 114, 1) 100%
  );
}
.item_register {
  background: #fff;
  color: #ff5474;
  margin-top: 20px;
} */
</style>
