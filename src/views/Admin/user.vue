<template>
  <div id="admin_user">
    <!-- topbar -->
    <van-sticky>
      <van-nav-bar
        class="topbar"
        title="用户管理"
        left-arrow
        @click-left="returnPage"
        style=""
      />
    </van-sticky>
    <!-- content -->
    <div class="content admin_content">
      <div class="admin_title">管理员列表:</div>
      <van-collapse v-model="activeAdminNames">
        <van-collapse-item
          v-for="(item, index) in adminList"
          :key="index"
          :name="index"
          :disabled="item.id == currentUserId"
        >
          <template #title>
            <div>
              {{ item.name }}
            </div>
          </template>
          <div>
            <p>性别：{{ item.gender }}</p>
            <p>生日：{{ item.birth }}</p>
            <p>注册时间：{{ item.createAt }}</p>
            <van-row justify="end">
              <van-col span="12" />
              <van-col span="12" class="btn_col">
                <van-button
                  class="manage_btn"
                  round
                  color="linear-gradient(
                    90deg,
                    rgba(252, 59, 114, 0.78) 0%,
                    rgba(252, 59, 114, 1) 100%
                  )"
                  @click="updateRole('server', item.id)"
                  text="设为普通用户"
              /></van-col>
              <!-- <van-col span="12" class="btn_col"
                ><van-button
                  class="manage_btn"
                  plain
                  color="#ff5e7f"
                  round
                  text="删除"
                  @click="delUser(item.id)"
              /></van-col> -->
            </van-row>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div class="content admin_content">
      <div class="admin_title">用户列表:</div>
      <van-collapse v-model="activeUserNames">
        <van-collapse-item
          v-for="(item, index) in userList"
          :key="index"
          :name="index"
        >
          <template #title>
            <div>
              {{ item.name }}
            </div>
          </template>
          <div>
            <p>性别：{{ item.gender }}</p>
            <p>生日：{{ item.birth }}</p>
            <p>注册时间：{{ item.createAt }}</p>
            <van-row justify="end">
              <van-col span="12" />
              <van-col span="12" class="btn_col">
                <van-button
                  class="manage_btn"
                  round
                  color="linear-gradient(
                    90deg,
                    rgba(252, 59, 114, 0.78) 0%,
                    rgba(252, 59, 114, 1) 100%
                  )"
                  @click="updateRole('admin', item.id)"
                  text="设为管理员"
              /></van-col>
              <!-- <van-col span="12" class="btn_col"
                ><van-button
                  class="manage_btn"
                  plain
                  color="#ff5e7f"
                  round
                  @click="delUser(item.id)"
                  text="删除"
              /></van-col> -->
            </van-row>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  data () {
    return {
      currentUserId: 0,
      userDate: [],
      activeAdminNames: ['0'],
      activeUserNames: ['0']
    }
  },
  computed: {
    adminList () {
      return this.userDate.filter(x => x.role === 'admin').map(x => {
        return {
          index: x.index,
          id: x.id,
          name: x.name,
          gender: x.gender === '1' ? '男' : '女',
          birth: x.birth ? x.birth : '---',
          role: x.role,
          vip: x.vip,
          createAt: Vue.filter('date')(x.createAt)
        }
      })
    },
    userList () {
      return this.userDate.filter(x => x.role === 'server').map(x => {
        let gender = ''
        return {
          index: x.index,
          id: x.id,
          name: x.name,
          gender: x.gender === 1 ? '男' : '女',
          birth: x.birth ? x.birth : '---',
          role: x.role,
          vip: x.vip,
          createAt: Vue.filter('date')(x.createAt)
        }
      })
    }
  },
  methods: {
    init () {
      // 查询所有用户
      this.getAllUserList()
    },
    getAllUserList () {
      this.$axios.get('/users/list',)
        .then((res) => {
          this.userDate = res.data
        }).catch((err) => { })
    },
    updateRole (role, id) {
      console.log(role, id)
      this.$dialog.confirm({
        message: '确认修改该用户角色？',
      })
        .then(() => {
          this.$axios.patch('/users/update', { role: role, id: id })
            .then(() => {
              setTimeout(() => {
                this.$toast({
                  message: '修改成功'
                })
                this.init()
                this.activeAdminNames = ['0']
                this.activeUserNames = ['0']
              }, 1000)
            })
            .catch(() => { })
        })
        .catch(() => {
          this.$toast({
            message: '取消修改'
          })
        })
    },
    delUser (id) {
      this.$dialog.confirm({
        message: '确定删除该用户？',
      }).then(() => {
        this.$axios.delete('/users/del', { data: { id: id } })
          .then((res) => {
            this.$toast({
              message: '删除成功'
            })
            this.init()
            this.activeAdminNames = ['0']
            this.activeUserNames = ['0']
          }).catch((err) => {
            console.log(err)
          })
      }).catch(() => {
        this.$toast({
          message: '取消删除'
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
.content {
  margin: 10px 5px;
  /* background-color: #fff; */
  box-shadow: 0 0.06rem 0.2rem 0 rgb(121 152 215 / 20%);
}
.admin_title {
  padding: 15px 10px 10px 10px;
  font-weight: 600;
  color: #ff5e7f;
}
.btn_col {
  padding: 5px 10px;
}
.manage_btn {
  width: 100%;
  height: 30px;
}
</style>
