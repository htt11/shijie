<template>
  <div id="search">
    <div class="searchHead">
      <van-row>
        <van-col class="returnButton" span="2">
          <van-icon name="arrow-left" @click="returnPage" />
        </van-col>
        <van-col span="18">
          <van-search v-model="value" placeholder="搜索 商品/品牌/类别" />
        </van-col>
        <van-col class="searchButton" span="4" @click="toSearch()"
          >搜索</van-col
        >
      </van-row>
    </div>
    <div class="searchCom">
      <!-- 搜索历史 -->
      <div class="com_list" v-if="mySearch.length > 0">
        <div class="com_list_title">
          <span style="color: #ff5e7f" class="iconfont icon-dian-copy"></span>
          <span>搜索历史</span>
        </div>
        <div class="com_list">
          <van-tag
            class="com_list_item"
            v-for="(item, index) in mySearch"
            :key="index"
            round
            color="#f4f5f6"
            text-color="#000"
            @click="toSearch(item.tag)"
            >{{ item.tag }}</van-tag
          >
        </div>
      </div>
      <!-- 都在搜 -->
      <div class="com_list">
        <div class="com_list_title">
          <span style="color: #ff5e7f" class="iconfont icon-dian-copy"></span>
          <span>大家都在搜</span>
        </div>
        <div class="com_list">
          <van-tag
            class="com_list_item"
            v-for="(item, index) in searchComData"
            :key="index"
            round
            color="#f4f5f6"
            text-color="#000"
            @click="clickTag(item)"
            >{{ item }}</van-tag
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      currentUserId: 0,
      value: '',
      searchComData: [
        '硅水凝胶', '强生', '库博', '美若康', '水梯度', 'Bambi Series', 'evercolor', 'lalish', '拉拜诗樱桃小丸子', '人鱼姬'
      ],
      mySearch: []
    }
  },
  methods: {
    init () {
      if (this.currentUserId !== 0) {
        this.getSearchList()
      }
    },
    getSearchList () {
      this.$axios.get('/search/list', {
        params: {
          'user_id': this.currentUserId
        }
      })
        .then((res) => {
          this.mySearch = res.data
        }).catch((err) => { })
    },
    toSearch (tag) {
      let data = tag ? tag : this.value
      if (this.currentUserId !== 0) {
        if (this.mySearch.indexOf(data) !== -1) {
          return
        }
        this.$axios.post('/search/add', { tag: tag, user_id: this.currentUserId })
          .then((res) => {
            this.$router.push({
              name: 'GoodsList',
              params: { type: '', tag: this.value, from: 'search' }
            })
          }).catch((err) => {
            console.log(err)
          })
      } else {
        this.$router.push({
          name: 'GoodsList',
          params: { type: '', tag: data, from: 'search' }
        })
      }
    },
    clickTag (tag) {
      this.toSearch(tag)
    },
    returnPage () {
      // this.$router.go(-1)
      this.$router.push({
        name: 'Home'
      })
    },
  },
  created () {
    const userId = window.sessionStorage.getItem('user_id')
    this.currentUserId = userId ? userId : 0
    this.init()
  }
}
</script>

<style scoped>
#search {
  height: 100vh;
  background-color: #f9faff !important;
}

/* Search */
#search .searchHead {
  width: 100%;
  position: fixed;
  left: 0px;
  top: 0px;
  z-index: 10;
  background-color: #ff5e7f;
  /* background: linear-gradient(
    90deg,
    rgba(252, 59, 114, 1) 0%,
    rgba(252, 59, 114, 1) 100%
  ); */
}
.searchHead .van-row {
  display: flex;
  align-items: center;
  padding: 12px 15px;
}
.searchHead .van-search {
  padding: 0;
  border-radius: 5px;
}
.searchHead .returnButton {
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: end;
}
.searchHead .searchButton {
  color: #fff;
  font-size: 15px;
  text-align: center;
}

/* searchCom */
#search .searchCom {
  margin-top: 60px;
  width: 100%;
}
.searchCom .com_list {
  padding: 15px 8px;
  background-color: #fff;
  box-shadow: 0px 4px 10px 0px rgb(121 152 215 / 10%);
}
.searchCom .com_list_title {
  /* color: #000; */
  /* margin-bottom: 10px; */
}
.searchCom .com_list_item {
  margin: 5px 10px;
  padding: 5px 12px;
}
</style>
