<template>
  <div id="collect">
    <van-sticky>
      <van-nav-bar title="收藏" @click-left="returnPage">
        <template #left>
          <van-icon name="arrow-left" color="#323233" />
        </template>
        <template #right>
          <div class="manage">
            <div
              v-if="isManage || collectList.length === 0"
              @click="taggerText"
            >
              管理
            </div>
            <div v-else style="display: flex; align-items: center">
              <van-icon
                name="delete-o"
                color="#000"
                size="15px"
                @click="emptyCollect"
              />
              <span style="margin-left: 15px" @click="taggerText">完成</span>
            </div>
          </div>
        </template>
      </van-nav-bar>
    </van-sticky>
    <!-- 为空 -->
    <div class="default" v-if="collectList.length === 0">
      <div style="display: flex; justify-content: center">
        <div class="default_icon">
          <van-icon name="shop-collect-o" color="#fac5d7" size="60" />
        </div>
      </div>
      <p class="default_text">暂无收藏，去逛逛吧</p>
      <div class="content_button">
        <button class="linkBtn goHome" @click="clickButton('Home')">
          前往首页
        </button>
        <button class="linkBtn goSearch" @click="clickButton('Search')">
          去搜索
        </button>
      </div>
    </div>
    <!-- content -->
    <div
      class="content"
      v-else
      v-for="(item, index) in collectList"
      :key="index"
      v-loading="isLoading"
    >
      <van-swipe-cell>
        <van-card
          :price="`${item.price}.00`"
          :title="item.title"
          :thumb="require(`assets/img/${item.imgPath}`)"
          :origin-price="item.oldPrice"
        />
        <template #right>
          <van-button
            square
            text="删除"
            type="danger"
            class="delete-button"
            @click="onClickDel(item.id)"
          />
        </template>
      </van-swipe-cell>

      <!--  -->
      <!-- <van-card
        tag="标签"
        :price="item.price"
        :title="item.title"
        :thumb="item.imgPath"
        :origin-price="item.oldPrice"
      /> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Collect',
  data () {
    return {
      isLoading: false,
      currentUserId: 0,
      collectList: [],
      isManage: true
    }
  },
  methods: {
    async init () {
      this.isLoading = true
      this.currentUserId = window.sessionStorage.getItem('user_id')
      await this.getCollectList()
      this.isLoading = false
    },
    getCollectList () {
      this.$axios.get('/collect/list', {
        params: {
          'user_id': this.currentUserId
        }
      })
        .then((res) => {
          this.collectList = res.data
        }).catch((err) => { })
    },
    returnPage () {
      this.$router.push({
        name: 'Profile'
      })
    },
    taggerText () {
      this.isManage = !this.isManage
    },
    // 回首页 / 去搜索
    clickButton (name) {
      this.$router.push({
        name: name
      })
    },
    // 清空收藏
    emptyCollect () {
      console.log(this.currentUserId)
      this.$dialog.confirm({
        title: '温馨提示',
        message: '确定清空收藏吗？',
      }).then(() => {
        this.$axios.delete('/collect/empty', { data: { user_id: this.currentUserId } })
          .then((res) => {
            this.collectList = []
            this.$toast({
              message: '操作成功'
            })
          })
          .catch((err) => {
            console.log(err)
          })
      }).catch(() => {
        this.$toast({
          message: '取消操作'
        })
      })

    },
    onClickDel (id) {
      this.$dialog.confirm({
        message: '确定删除该商品吗？',
      }).then(() => {
        this.onDel(id)
      }).catch(() => {
        this.$toast({
          message: '取消删除'
        })
      })
    },
    async onDel (id) {
      await this.$axios.delete('/collect/del', { data: { id: id } })
        .then((res) => {
          this.$toast({
            message: '删除成功'
          })
          this.init()
        }).catch((err) => {
          console.log(err)
        })
    }
  },
  created () {
    this.init()
  }

}



</script>

<style scoped>
#collect {
  padding-bottom: 10px;
}
/*  */
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
.default .content_button {
  text-align: center;
  margin-top: 15px;
}
.default .linkBtn {
  width: 35%;
  display: inline-block;
  border-radius: 20px;
  padding: 8px 20px;
  border: 1px solid #ff5e7f;
  font-size: 10px;
}
.default .goHome {
  color: #fff;
  background: linear-gradient(
    90deg,
    rgba(252, 59, 114, 0.78) 0%,
    rgba(252, 59, 114, 1) 100%
  );
  margin-right: 10px;
}
.default .goSearch {
  color: #ff5e7f;
  background-color: #fff;
}

/* content */
.content {
  display: flex;
  margin: 12px;
  /* padding: 15px 12px; */
  font-size: 14px;
  box-shadow: rgb(121 152 215 / 20%) 0px 0.06rem 0.2rem 0px;
  border-radius: 5px;
  background-color: #fff;
  font-family: "Microsoft YaHei";
}
.van-swipe-cell {
  width: 100%;
}
.van-card {
  padding: 12px;
  border-radius: 10px;
}
.van-card__price {
  color: rgb(252, 59, 114);
  font-weight: 500;
}
.delete-button {
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(252, 59, 114, 0.78) 0%,
    rgba(252, 59, 114, 1) 100%
  );
  border: none;
}
</style>
