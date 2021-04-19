<template>
  <div id="category">
    <div class="category_navBar">
      <van-search
        v-model="value"
        placeholder="搜索/商品/品牌/类别"
        @click="onSearch"
      />
    </div>
    <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      @refresh="onRefresh"
    >
      <div class="category_content">
        <van-tabs v-model="active" color="#ff5e7f" title-active-color="#ff5e7f">
          <van-tab title="彩色隐形眼镜">
            <div
              class="content_item"
              v-for="(item, index) in Color_contact_lens"
              :key="index"
            >
              <div class="content_item_title">
                <span
                  style="color: #ff5e7f"
                  class="iconfont icon-dian-copy"
                ></span>
                <span>{{ item.title }}</span>
              </div>
              <div class="content_item_cont">
                <van-tag
                  class="content_item_tag"
                  v-for="(value, index) in item.tags"
                  :key="index"
                  round
                  color="#f4f5f6"
                  text-color="#000"
                  @click="clickTag('美瞳', value)"
                  >{{ value }}</van-tag
                >
              </div>
            </div>
          </van-tab>
          <van-tab title="隐形眼镜">
            <div
              class="content_item"
              v-for="(item, index) in Contact_lenses"
              :key="index"
            >
              <div class="content_item_title">
                <span
                  style="color: #ff5e7f"
                  class="iconfont icon-dian-copy"
                ></span>
                <span>{{ item.title }}</span>
              </div>
              <div class="content_item_cont">
                <van-tag
                  class="content_item_tag"
                  v-for="(value, index) in item.tags"
                  :key="index"
                  round
                  color="#f4f5f6"
                  text-color="#000"
                  @click="clickTag('隐形', value)"
                  >{{ value }}</van-tag
                >
              </div>
            </div>
          </van-tab>

          <van-tab title="护理用品">
            <div
              class="content_item"
              v-for="(item, index) in Care_products"
              :key="index"
            >
              <div class="content_item_title">
                <span
                  style="color: #ff5e7f"
                  class="iconfont icon-dian-copy"
                ></span>
                <span>{{ item.title }}</span>
              </div>
              <div class="content_item_cont">
                <van-tag
                  class="content_item_tag"
                  v-for="(value, index) in item.tags"
                  :key="index"
                  round
                  color="#f4f5f6"
                  text-color="#000"
                  @click="clickTag('护理液', value)"
                  >{{ value }}</van-tag
                >
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
let Contact_lenses = [
  // { title: '热门搜索', tags: ['美若康', '欧舒', '硅水凝胶', '强生', '水梯度', '欧舒适'] },
  { title: '热销品牌', tags: ['爱尔康', '美若康', '库博', '博士伦', '强生', '菲士康', '更多品牌'] },
  { title: '抛弃周期', tags: ['日抛', '双周抛', '月抛', '半年抛', '年抛'] },
  { title: '镜片特点', tags: ['高透氧', '散光/远视', '高度数'] }
]

let Color_contact_lens = [
  { title: '热销品牌', tags: ['T-Garden', 'LaPeche拉拜诗', '森之漾', 'LuMia', '领丽秀', 'GIVRE', 'e Rouge', '更多品牌'] },
  { title: '人气系列', tags: ['实瞳/可芙蕾', '爱谢/erouge', '安目瞳/伞语', 'Givre', '陌森/星座系列'] },
  { title: '抛弃周期', tags: ['日抛', '双周抛', '月抛', '半年抛'] }
]

let Care_products = [
  { title: '护理液', tags: ['爱尔康', '博士伦/博乐纯', '视康/双氧水', '乐敦清', '海昌/视护能', '澜柏/高端', '人鱼姬', '菲士康', '更多品牌'] },
  // { title: 'RGP硬镜护理', tags: ['博视顿', '美尼康', '培克能', '培克能', 'RGP硬性镜盒'] },
  { title: '伴侣盒', tags: ['holy nara护理盒', 'Mooluns眸论', '凯达/好品质'] },
  { title: '眼部洗眼液', tags: ['日本科奈美'] },
  { title: '眼部周边', tags: ['蒸汽眼罩', '隐形眼镜清洗器'] }
]

export default {
  name: 'Category',
  data () {
    return {
      isLoading: false,
      value: '',
      active: 0,
      Contact_lenses: Contact_lenses,
      Color_contact_lens: Color_contact_lens,
      Care_products: Care_products
    }
  },
  methods: {
    init () {

    },
    clickTag (type, tag) {
      console.log(type, tag)
      this.$router.push({
        name: 'GoodsList',
        params: { 'type': type, 'tag': tag, from: 'category' }
      })
    },
    onSearch () {
      this.$router.push({
        name: 'Search'
      })
    },
    onRefresh () {
      this.isLoading = true
      this.init()
      this.isLoading = false
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
#category {
  background-color: #f9faff;
}

/* category_navBar */
.category_navBar .van-search {
  padding: 12px;
}
.category_navBar .van-search .van-search__content {
  border: 1px solid #aaa;
  border-radius: 5px;
  background-color: #fff;
}

/* category_content */
.category_content .content_item {
  padding: 10px 8px;
  margin-bottom: 10px;
  background-color: #fff;
  box-shadow: 0px 4px 10px 0px rgb(121 152 215 / 10%);
}
.content_item .content_item_title {
  font-size: 12px;
  margin-bottom: 10px;
}
.content_item_cont .content_item_tag {
  margin: 5px 8px;
  padding: 5px 12px;
}
</style>
