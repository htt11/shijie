<template>
  <div id="comment">
    <div class="comt_title">
      <van-nav-bar
        :title="`全部评论(${commentNums})`"
        left-arrow
        fixed
        placeholder
        @click-left="returnPage"
      />
    </div>
    <div class="comt_param commonStyle">
      <div>
        <span style="font-weight: 600; margin-right: 10px">总评</span>
        <van-rate
          v-model="starNums"
          allow-half
          readonly
          size="15px"
          color="#FC3B72"
        />
      </div>
      <div>
        <van-tag
          round
          type="primary"
          color="#f4f5f6"
          text-color="#000"
          v-for="(item, index) in tagList"
          :key="index"
          @click="clickTag(index)"
          :class="{ activeTag: currentTag === index }"
          >{{ item }}</van-tag
        >
      </div>
    </div>
    <div class="comt_content">
      <div
        class="com_content commonStyle"
        v-for="(item, index) in currentList"
        :key="index"
      >
        <div class="row_head">
          <div class="head_left">
            <van-image
              round
              width="30"
              height="30"
              fit="cover"
              :src="item.adminPic"
            />
          </div>
          <div class="head_right">
            <div>{{ item.adminName }}</div>
            <van-rate
              v-model="item.starNum"
              readonly
              size="10px"
              color="#FC3B72"
            />
          </div>
        </div>
        <div class="row_center">
          {{ item.content }}
        </div>
        <div class="row_pic">
          <van-row gutter="1">
            <van-col
              class="van-col-img"
              span="8"
              v-for="(value, index) in item.contentPic"
              :key="index"
            >
              <van-image class="comment_image" :src="value" />
            </van-col>
          </van-row>
        </div>
        <div class="row_footer">
          <div>{{ item.goodsParams }}</div>
          <div>{{ item.created }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Comment',
  data () {
    return {
      propsData: [],
      commentNums: 0,
      starNums: 5,
      tagList: ['全部', '最新', '晒图'],
      // commentData: [],
      currentTag: 0,
      currentList: [],
    }
  },
  computed: {
    commentData () {
      return this.propsData.reduce((xs, x) => {
        // let created = x.createAt.toLocaleDateString()
        xs.push({
          user_id: x.user_id,
          adminName: 'xxxxx',
          adminPic: '',
          contentPic: x.img_path ? x.img_path.split(',') : '',
          starNum: x.star,
          content: x.content,
          goodsParams: x.params,
          created: x.createAt
        })
        return xs
      }, [])
    }
  },
  methods: {
    init () {
      this.propsData = this.$route.params.comment
      this.currentList = this.commentData
      this.commentNums = this.currentList.length
      // this.currentList = this.commentData.sort((a, b) => b.starNum.toString().localeCompare(a.starNum.toString()))
      let num = 0
      let length = this.commentData.length
      this.commentData.filter(x => {
        num += x.starNum
        this.starNums = num / length
      })
    },
    returnPage () {
      this.$router.push({
        name: 'Detail',
        params: { goods_id: this.$route.params.id }
      })
    },
    clickTag (index) {
      this.currentTag = index
      this.currentList = this.commentData
      // 最新
      if (index === 1) {
        this.currentList = this.commentData.sort((a, b) => b.created.localeCompare(a.created))
      } else if (index === 2) {
        this.currentList = this.commentData.filter(x => x.contentPic.length !== 0)
      } else {
        this.currentList = this.commentData
      }
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
#comment {
  padding-bottom: 10px;
}
#comment .commonStyle {
  padding: 12px;
  margin-bottom: 10px;
  background-color: #fff;
  box-shadow: 0px 6px 20px 0px rgb(121 152 215 / 10%);
}
#comment .comt_title {
  /* padding: 5px 0; */
}
#comment .comt_param {
}
.comt_param .van-tag {
  margin: 8px 8px 0 0;
  padding: 5px 12px;
}
#comment .comt_content {
}
.com_content {
  padding: 20px 0 0 0;
}
.van-skeleton {
  padding: 0;
}
.com_content .row_head {
  display: flex;
}
.row_head .head_left {
  flex: 1;
  width: 30px;
  height: 30px;
}
.row_head .head_right {
  flex: 7;
}
.com_content .row_center {
  font-size: 12px;
  margin: 10px 0;
}
.row_pic {
  width: 100%;
}
.row_pic .van-col-img {
  width: 33.3%;
}
.row_pic .van-col-img .van-image {
  width: 100%;
  padding-bottom: 100%;
  position: relative !important;
}

/deep/ .van-image__img {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.com_content .row_footer {
  color: #a5adba;
  font-size: 12px;
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
}

.activeTag {
  color: #fff !important;
  background-color: #fc3b72 !important;
}
</style>
