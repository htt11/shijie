<template>
  <div id="login">
    <div class="returnIcon">
      <van-icon
        name="arrow-left"
        color="#c8c9cc"
        size="25"
        @click="returnPage"
      />
    </div>
    <div class="content">
      <van-form @submit="onLogin">
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
        <div style="margin-top: 30px">
          <van-button
            round
            block
            type="info"
            native-type="submit"
            color="linear-gradient(90deg,rgba(252, 59, 114, 0.78) 0%,rgba(252, 59, 114, 1) 100%)"
            style="box-shadow: 0px 4px 20px 0px rgb(121 152 215 / 20%)"
            >登录</van-button
          >
          <van-button
            round
            block
            plain
            type="info"
            @click="onRegister"
            color="#ff5474"
            style="
              margin-top: 20px;
              border: 1px solid #ff5474;
              box-shadow: 0px 4px 20px 0px rgb(121 152 215 / 20%);
            "
            >去注册</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data () {
    return {
      name: '',
      password: ''
    }
  },
  methods: {
    returnPage () {
      // this.$router.go(-1)
      this.$router.push({
        name: 'Home'
      })
    },
    onLogin () {
      this.$axios.post('/login', {
        name: this.name,
        password: this.password
      })
        .then((res) => {
          const token = res.data.token
          window.sessionStorage.setItem('token', token)
          window.sessionStorage.setItem('username', this.name)
          this.$toast.success({
            message: '登录成功',
            position: 'top'
          })
          // this.$router.push({
          //   name: 'Home'
          // })
          this.$router.push({
            name: 'Profile'
          })
        }).catch((err) => {
          if (err.response.status === 400) {
            this.$toast.fail({
              message: '用户名或密码错误',
              position: 'top'
            })
          }
        })
    },
    onRegister () {
      this.$router.push({
        name: 'Register'
      })
    }
  }
}
</script>

<style scoped>
#login {
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
  margin-top: 20px;
}
.item_register {
  background: #fff;
  color: #ff5474;
} */
</style>
