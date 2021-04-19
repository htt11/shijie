<template>
  <div id="detail">
    <div class="goTop">
      <el-backtop
        target=".goTop"
        :visibility-height="100"
        :right="15"
        :bottom="60"
      >
        <i class="el-icon-top" style="color: #bbb"></i>
      </el-backtop>
      <van-pull-refresh
        v-model="isLoading"
        success-text="刷新成功"
        @refresh="onRefresh"
        v-loading="isLoading"
      >
        <div
          style="width: 100%; height: 65vh; background-color: #fff"
          v-if="isLoading"
        ></div>
        <van-tabs
          class="detail_content"
          v-model="active"
          scrollspy
          sticky
          color="#ff5e7f"
          title-active-color="#ff5e7f"
        >
          <van-icon
            class="returnBtn"
            name="arrow-left"
            size="17px"
            @click="returnPage"
          />
          <van-tab class="goods" title="商品" name="a">
            <!-- 轮播图 -->
            <van-swipe>
              <van-swipe-item
                v-for="(item, index) in detailData.swiperImages"
                :key="index"
              >
                <van-image
                  fit="contain"
                  :src="require(`assets/img/${item.img_path}`)"
                />
              </van-swipe-item>
            </van-swipe>
            <!-- 价格 -->
            <div class="goods_price">
              <span>￥</span>
              <span class="price_text">{{ detailData.price }}</span>
              <span class="price_del">￥{{ detailData.oldPrice }}</span>
            </div>
            <!-- 标题 -->
            <div class="goods_text">
              <div class="text_title">{{ detailData.title }}</div>
              <div class="text_desc">{{ detailData.desc }}</div>
              <div class="text_question" style="margin-top: 10px">
                <van-icon name="question-o" />
                <span @click="showPopup('problemShow')">常见问题</span>
                <van-action-sheet
                  round
                  v-model="problemShow"
                  :actions="problemActions"
                  cancel-text="完成"
                  description="常见问题"
                  close-on-click-action
                />
              </div>
            </div>
            <!-- 参数 -->
            <div class="other_text">
              <div class="goods_params options">
                <div class="text_question">
                  <van-icon name="question-o" />
                  <span @click="showPopup('optionShow')"
                    >不知道如何选择度数？</span
                  >
                  <van-action-sheet
                    v-model="optionShow"
                    title="如何选择读数"
                    round
                    closeable
                    cancel-text="完成"
                    close-on-click-action
                  >
                    <div class="actionSheet_content">
                      <div class="content_item">
                        <p class="content_item_title">隐形眼镜度数换算表</p>
                        <van-row
                          class="actionSheet_table"
                          type="flex"
                          justify="space-around"
                        >
                          <van-col class="actionSheet_title" span="3"
                            >框架度数</van-col
                          >
                          <van-col
                            class="actionSheet_cont"
                            v-for="(item, index) in eyesTable.contact"
                            :key="index"
                            span="3"
                          >
                            {{ item }}
                          </van-col>
                        </van-row>
                        <van-row
                          class="actionSheet_table"
                          type="flex"
                          justify="space-around"
                        >
                          <van-col class="actionSheet_title" span="3"
                            >隐形度数</van-col
                          >
                          <van-col
                            class="actionSheet_cont"
                            v-for="(item, index) in eyesTable.frame"
                            :key="index"
                            span="3"
                          >
                            {{ item }}
                          </van-col>
                        </van-row>
                      </div>
                      <div
                        class="content_item warm_prompt"
                        style="background-color: #f8f8f9; color: #969799"
                      >
                        <p style="color: #fc3b72">温馨提示：</p>
                        <p
                          v-for="(item, index) in promptData"
                          :key="index"
                          style="margin: 10px"
                        >
                          {{ item }}
                        </p>
                      </div>
                    </div>
                  </van-action-sheet>
                </div>
                <div class="text_question">
                  <van-icon name="question-o" />
                  <span @click="showPopup('priceShow')">计价单位说明</span>
                  <van-action-sheet
                    v-model="priceShow"
                    title="计价单位说明"
                    round
                    cancel-text="完成"
                    close-on-click-action
                  >
                    <div class="actionSheet_content">
                      <!-- 单片 -->
                      <div class="content_item">
                        <p class="content_item_title">单片</p>
                        <van-row
                          class="actionSheet_table"
                          type="flex"
                          justify="space-around"
                        >
                          <van-col class="actionSheet_title" span="6"
                            >规格说明</van-col
                          >
                          <van-col class="actionSheet_cont" span="18"
                            >每盒含一片镜片</van-col
                          >
                        </van-row>
                        <van-row
                          class="actionSheet_table"
                          type="flex"
                          justify="space-around"
                        >
                          <van-col class="actionSheet_title" span="6"
                            >如何选购</van-col
                          >
                          <van-col class="actionSheet_cont" span="18">
                            2盒为一副，选定订购数量为"2"，即购买了一副眼镜
                          </van-col>
                        </van-row>
                      </div>
                      <!-- 多片 -->
                      <div class="content_item">
                        <p class="content_item_title">多片</p>
                        <van-row
                          class="actionSheet_table"
                          type="flex"
                          justify="space-around"
                        >
                          <van-col class="actionSheet_title" span="6"
                            >规格说明</van-col
                          >
                          <van-col class="actionSheet_cont" span="18"
                            >每盒含多片度数相同的镜片，不拆卖</van-col
                          >
                        </van-row>
                        <van-row
                          class="actionSheet_table"
                          type="flex"
                          justify="space-around"
                        >
                          <van-col class="actionSheet_title" span="6"
                            >如何选购</van-col
                          >
                          <van-col class="actionSheet_cont" span="18">
                            1.两眼度数相同时，订购一盒即可满足佩戴需要；2.两眼度数不同时，按两眼度数分别订购1盒即可
                          </van-col>
                        </van-row>
                      </div>
                      <div class="content_item">
                        <van-row
                          class="actionSheet_table"
                          type="flex"
                          justify="space-around"
                        >
                          <van-col class="actionSheet_title" span="6"
                            >计价说明</van-col
                          >
                          <van-col class="actionSheet_cont" span="18"
                            >显示价格为该产品一盒的价格，购买多盒时所需付款为：
                            价格*总购买盒数</van-col
                          >
                        </van-row>
                      </div>
                    </div>
                  </van-action-sheet>
                </div>
              </div>
            </div>
          </van-tab>
          <!-- 评价 -->
          <!-- <van-tab title="评价" name="b">
            <div class="detail_item commment">
              <div class="com_title">
                <div>
                  <span class="shuxian"></span>
                  <span class="com_nums">评价({{ comment_length }})</span>
                </div>
                <div class="look_all" @click="getComment">
                  查看全部<van-icon name="arrow" />
                </div>
              </div>
              <van-divider />
            </div>
          </van-tab> -->
          <van-tab title="详情" name="c" style="padding-bottom: 20px">
            <div class="detail_item detail_info">
              <div class="info_title" style="margin-bottom: 10px">
                <span class="shuxian"></span>
                <span class="com_nums">图文详情</span>
              </div>
              <div>
                <van-image
                  v-for="(item, index) in detailData.detailImages"
                  :key="index"
                  :src="require(`assets/img/${item.img_path}`)"
                  fit="contain"
                />
              </div>
            </div>
          </van-tab>
          <van-icon
            class="homeBtn"
            name="wap-home-o"
            size="20"
            @click="returnHome"
          />
        </van-tabs>
        <!-- 商品导航 -->
        <van-goods-action>
          <!-- <van-goods-action-icon
        icon="chat-o"
        text="客服"
        @click="onClickContact"
      /> -->
          <van-goods-action-icon
            icon="star-o"
            text="收藏"
            @click="onClickCollect"
            v-if="!isCollected"
          />
          <van-goods-action-icon
            class="isCollected"
            icon="star"
            text="已收藏"
            @click="onClickCollect"
            color="#FC3B72"
            v-else
          />
          <van-goods-action-icon
            icon="cart-o"
            text="购物车"
            @click="onClickCart"
          />
          <van-goods-action-button
            class="action_btn"
            type="danger"
            text="加入购物车"
            @click="addCart"
          />
        </van-goods-action>
        <!-- 规格 -->
        <van-sku
          v-model="skuShow"
          :sku="sku"
          :goods="goods"
          :goods-id="currentGoodsId"
          :quota="0"
          :custom-stepper-config="customStepperConfig"
          @add-cart="onAddCartClicked"
          v-if="currentType === '隐形' || currentType === '美瞳'"
        />
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>

let problemActions = [
  {
    name: '1.隐形眼镜如何护理？',
    subname: '1.揉搓，冲洗镜片—镜片每面使用3滴护理液轻轻揉搓各20秒 2.浸泡4小时—彻底冲洗镜片，每面各五秒，洗完后置于镜盒内3.呈现柔软状态—在镜盒导入2 / 3护理液，至少浸泡4小时，直至镜片呈现柔软状态'
  },
  {
    name: '2.如何选择合适的抛弃周期？',
    subname: '隐形眼镜属于第三类医疗器械产品，它的验配属于一个医疗的过程，首先建议您到专业机构进行眼睛健康检查，确定是否能验配隐形眼镜，同时再根据自己平时的生活习惯挑选合适的镜片。小视建议：如果平时配戴较少，建议您选择日抛型隐形眼镜，每日抛弃无需护理，既健康又方便。如果您经常配戴隐形眼镜，在可以选择日抛的同时，您还可以选择双周抛及月抛硅水凝胶隐形眼镜。镜片周期越短，沉淀越少，眼睛受感染的几率就越低。而硅水凝胶镜片透氧性更高，眼球能得到充分的“呼吸”，所以不易产生红血丝或酸痛的状况。'
  },
  {
    name: '3.隐形眼镜每天可以戴多久？',
    subname: '配戴隐形眼镜的时间因人因镜片而异。专家建议一般水凝胶隐形眼镜每天配戴时间为8-10小时，硅水凝胶高透氧抛弃式镜片每天配戴不超过16小时，隐形眼镜应与框架眼镜交替使用，这样也可以使眼睛得到充分休息。如果您是初戴软性角膜接触镜，可参照以下戴镜时间：第一天：6-8小时第二天：8-10小时第三天：10-12小时第四天以后：不超过12小时'
  },
  {
    name: '4.隐形眼睛会滑来滑去，有时候还会模糊，怎么办？',
    subname: '有可能是镜片戴反了，也有可能是基弧不合适。首先请确认镜片正反面是否正确，若戴反了，会产生“滑片”现象。若镜片未戴反，可能您隐形眼镜的基弧跟您的角膜曲率不合适，就像穿了不合身的衣服一样。如镜片弧度太大，就会滑动，配戴不舒服，视力不清晰；如弧度太小，镜片过于紧绷，紧贴眼球，阻碍正常的新陈代谢。小视温馨提示：视客眼镜网提供多种基弧的隐形眼镜供您选择。'
  },
  {
    name: '5.开封的隐形眼镜如何保存？',
    subname: '日抛型（每天更换）软性隐形眼镜，每天使用完后即可扔掉，不能重复使用。2周（或2周以上）更换一次的软性隐形眼镜，每天使用完取下镜片后，请按照护理用品说明书进行镜片的护理（洗净、冲洗、消毒、保存）。保存镜片的镜片盒请放在直射日光照不到的清洁环境中，镜盒建议每月更换1次。'
  },
  {
    name: '6.未开封的隐形眼镜如何保存？',
    subname: '请避开直射日光，在室温下保存即可，不用放入冰箱。'
  },
  {
    name: '7.隐形眼镜盒需要更换吗？多久换一次？',
    subname: '请定期更换镜片盒。长时间使用，镜片盒上的脏东西，比如细菌、霉菌等粘着物，会污染隐形眼镜，并且会有导致眼睛感染的风险。特别是在使用隐形眼镜护理液的情况下，建议您1个月更换一次镜片盒。如果您购买的护理液附带镜片盒，建议每次开新瓶时，同时更换镜片盒。'
  }, {
    name: '8.女生月经期间可以配戴隐形眼镜吗？',
    subname: '一般情况下是不影响配戴隐形眼镜的。但在经期免疫力会有所下降，所以，更需要规范地配戴隐形眼镜和护理镜片，日抛型隐形眼镜是更理想的选择。'
  }, {
    name: '9.怀孕时能不能配戴隐形眼镜？',
    subname: '目前没有任何的临床实验证明妊娠期配戴隐形眼镜会对胎儿造成影响。但是妊娠一般都会导致准妈妈内分泌的变化，抵抗力下降，容易感染。并且如果有任何严重的妊娠并发症，比如水肿，高血压等，则先不要配戴隐形眼镜。通常医生建议在怀孕后三个月应停戴，产后6～8周（最好是三个月）再重新配戴。'
  }, {
    name: '10.游泳时能否配戴隐形眼镜？',
    subname: '游泳时不建议配戴隐形眼镜。因为游泳池的水或海水带有化学物质和细菌，会增加感染的风险。如必须使用隐形眼镜，建议使用日抛型，游泳完立即丢弃。同时最好再戴一副无度数的蛙镜，减少泳池水接触镜片的机会。'
  }, {
    name: '11.雾霾天怎样选择隐形眼镜？',
    subname: '雾霾天确实应该尽量选择配戴框架眼镜。因为在雾霾天里，空气里粉尘颗粒较多，容易被隐形眼镜镜片吸附，刺激眼部，镜片的透氧量下降，产生异物感、刺痛、发红等症状。如果坚持在雾霾天戴隐形眼镜，可以选择日抛型隐形眼镜，每天一副新镜片，远离沉淀，双眼健康，配戴更安心。如果是短周期抛弃型，则需要认真做好镜片的清洁护理工作，务必搓揉浸泡足够时间。'
  }, {
    name: '12.长周期镜片比短周期镜片质量好吗？',
    subname: '隐形眼镜和心脏瓣膜一样， 属于III医疗器械， 所以选择健康的隐形眼镜至关重要。短周期隐形眼镜，可以降低沉淀物在镜片上堆积的几率，降低眼部发炎的可能，是最健康的。一个显而易见的例子， 以前我们用玻璃的注射器， 针头通过消毒反复使用，而现在， 随着人们对健康意识的提高， 我们使用的是一次性的注射器。所以小视建议您使用短周期隐形眼镜，新鲜无负担， 越短越健康 '
  }, {
    name: '13.眼睛不适，有异物感，怎么办？',
    subname: '如双眼不适，请立即将镜片摘下确认不适原因。初戴者第一次配戴可能会有轻微不适、流泪、异物感等现象，这些都是正常的，经一段时间适应后这些症状即会消失。如出现异物感或视觉模糊，则可能是镜片沾上了微尘等异物或是戴反了。只需取下镜片，如检查无破损，经彻底清洁后再重新配戴。'
  }
]

let promptData = [
  '1、该换算表仅供新配戴用户参考，老用户现所戴度数高于以上标准 值的可以按习惯配镜。',
  '2、如果某个框架度数换算后没有对应的隐形眼镜，可以选择偏低最接近的度数。 举例：800度减少75度后是725度，没有725度则应选择700度，以此类推 ',
  '3、没有近视度数请选择“平光”。',
  '4、如果您有轻微散光（散光度数小于-1.50以下，并且近视度数、散光度数之比大于4），可将散光度数的二分之一加在验光度数内，再换算成相对应的隐形眼镜度数。 举例：近视-4.50散光-1.00，换算后度数为-4.75。 计算方法：框架度数为 - 4.50 + ( -1.00/2 ) = -5.00， 隐形度数为 -5.00 -(-0.25 )=-4.75',
  '5、若您对度数换算仍有疑问，请联系我们进行咨询，'
]

let sku = {
  tree: [
    {
      k: '颜色',
      k_s: 's1',
      v: [],
      largeImageMode: false, //  是否展示大图模式
    }
  ],
  list: [],
  price: '1.00', // 默认价格（单位元）
  stock_num: 227,
  messages: [
    {
      // 商品留言
      datetime: '0',
      multiple: '0',
      name: '度数',
      type: 'text',
      required: '1',
      placeholder: '请备注度数'
    }
  ],
  hide_stock: false // 是否隐藏剩余库存
}

export default {
  name: 'Detail',
  data () {
    return {
      isLoading: false,
      active: 'a',
      detailData: {
        title: '',
        price: 0,
        oldPrice: 0,
        desc: '',
        params: [],
        swiperImages: [],
        detailImages: []
      },
      comment_length: 0,
      commentData: [],
      loading: false,
      problemShow: false,
      optionShow: false,
      priceShow: false,
      problemActions: problemActions,
      eyesTable: {
        contact: ['<-4.00', '≤-5.25', '≤-7.00', '≤-8.50', '≤-9.75', '≤-11.00', '≤-11.50'],
        frame: ['无需换算', '减0.25', '减0.50', '减0.75', '减1.00', '减1.25', '减1.50']
      },
      promptData: promptData,
      isCollected: false,
      currentGoodsId: 0,
      currentUserId: 0,
      currentCollectId: 0,
      currentType: '',
      skuShow: false,
      sku: sku,
      goods: {},
      customStepperConfig: {
        // 自定义步进器超过限制时的回调
        handleOverLimit: (data) => { },
        // 步进器变化的回调
        handleStepperChange: currentValue => { },
        // 库存
        stockNum: 1999,
        // 格式化库存
        stockFormatter: stockNum => { },
      }
    }

  },
  methods: {
    async init () {
      this.isLoading = true
      this.currentGoodsId = this.$route.params.goods_id
      this.currentUserId = window.sessionStorage.getItem('user_id')
      // console.log(this.currentUserId)
      await this.getDetailById(this.currentGoodsId)
      await this.getSwiperById(this.currentGoodsId)
      await this.getImgById(this.currentGoodsId)
      await this.getCommentById(this.currentGoodsId)
      // await this.getSkuById(this.currentGoodsId)
      if (this.currentUserId) {
        await this.getCollectById(this.currentGoodsId, this.currentUserId)
      }
      this.isLoading = false
    },
    async onRefresh () {
      await this.init()
      setTimeout(() => {
        this.isLoading = false;
      }, 1000)
    },

    async getDetailById (id) {
      await this.$axios.get('/goods/detail', {
        params: { 'table': 'goods', 'goods_id': id }
      })
        .then((res) => {
          // console.log(res.data)
          this.currentType = res.data[0].type
          this.detailData = res.data[0]
          this.defaultPrice = this.detailData.price
        }).catch((err) => {

        })
    },
    async getSwiperById (id) {
      await this.$axios.get('/goods/detail', {
        params: { 'table': 'swiper_img', 'goods_id': id }
      })
        .then((res) => {
          this.detailData.swiperImages = res.data
        }).catch((err) => {

        })
    },
    async getImgById (id) {
      await this.$axios.get('/goods/detail', {
        params: { 'table': 'detail_img', 'goods_id': id }
      })
        .then((res) => {
          this.detailData.detailImages = res.data
        }).catch((err) => {

        })
    },
    async getCommentById (id) {
      // let user_id = 0
      await this.$axios.get('/goods/detail', {
        params: { 'table': 'comment', 'goods_id': id }
      })
        .then((res) => {
          this.comment_length = res.data.length
          this.commentData = res.data
        }).catch((err) => { })
    },
    async getSkuById (id) {
      await this.$axios.get('/goods/detail', {
        params: { 'table': 'sku', 'goods_id': id }
      })
        .then((res) => {
          // console.log(res.data)
          this.categorySku(res.data)
        }).catch((err) => { })
    },
    categorySku (data) {
      // console.log(data)
      this.sku.tree[0].v = []
      data.map((x, index) => {
        if (index === 0) {
          this.goods.picture = require(`assets/img/${x.img_path}`)
          this.sku.price = x.price + '.00'
          return
        }
        let a = {}
        a.id = x.id
        a.name = x.name
        a.imgUrl = require(`assets/img/${x.img_path}`)
        a.previewImgUrl = require(`assets/img/${x.img_path}`)
        // console.log(a)
        this.sku.tree[0].v.push(a)
        let b = {}
        b.id = this.currentGoodsId
        b.s1 = x.id
        b.name = x.name
        b.price = x.price * 100
        b.stock_num = 110
        // console.log(b)
        this.sku.list.push(b)
      })
    },
    // 是否被收藏
    getCollectById (goods_id, user_id) {
      this.$axios.get('/collect/select', {
        params: {
          'goods_id': goods_id,
          'user_id': user_id
        }
      })
        .then((res) => {
          this.currentCollectId = res.data[0].id
          this.isCollected = res.data.length === 0 ? false : true
        }).catch((err) => { })
    },
    // 全部评论
    getComment () {
      this.$router.push({
        name: 'Comment',
        params: { comment: this.commentData, id: this.currentGoodsId }
      })
    },
    showPopup (show) {
      if (show == 'problemShow') {
        this.problemShow = true
      } else if (show == 'optionShow') {
        this.optionShow = true
      } else if (show == 'priceShow') {
        this.priceShow = true
      }
    },
    onClickContact () {
      this.$toast({
        message: '联系客服'
      })
    },
    // 收藏
    onClickCollect () {
      if (!this.currentUserId) {
        this.$toast({
          message: '未登录，请前往登录！'
        })
        return
      }
      this.isCollected = !this.isCollected
      let content = { user_id: this.currentUserId, goods_id: this.currentGoodsId }
      if (!this.isCollected) {
        // 取消
        this.cancelCollect(content)
      } else {
        // 收藏
        this.subCollect(content)
      }
    },
    // 确认收藏
    async subCollect (content) {
      await this.$axios.post('/collect/add', content)
        .then((res) => {
        })
        .catch((err) => {
          console.log(err)
        })
      this.$toast({
        message: '收藏成功'
      })
    },
    // 取消收藏
    async cancelCollect () {
      await this.$axios.delete('/collect/del', { data: { id: this.currentCollectId } })
        .then((res) => {
          // console.log(res.data)
        }).catch((err) => {
          console.log(err)
        })
      this.$toast({
        message: '取消收藏'
      })
    },
    async addCart () {
      if (!this.currentUserId) {
        this.$toast({
          message: '未登录，请前往登录！'
        })
        return
      }
      // console.log(this.currentType)
      if (this.currentType === '美瞳') {
        await this.getSkuById(this.currentGoodsId)
        this.skuShow = true
      } else if (this.currentType === '隐形') {
        await this.getSkuById(this.currentGoodsId)
        this.sku.tree = []
        this.skuShow = true
      } else {
        let params = ' '
        let num = 1
        this.goAddCart(params, num)
      }
    },
    async onAddCartClicked (skuData) {
      // console.log(skuData)
      let params = ''
      if (this.currentType === '美瞳') {
        // console.log('美瞳')
        params = `${skuData.selectedSkuComb.name}/${skuData.cartMessages['度数']}`
      } else if (this.currentType === '隐形') {
        // console.log('隐形')
        params = `${skuData.cartMessages['度数']}`
      }
      let num = skuData.selectedNum
      this.goAddCart(params, num)
    },
    async goAddCart (params, num) {
      let length = 0
      let cartCount = 0
      // 1.查询购物车中是否存在该商品
      await this.$axios.get('/cart', {
        params: { goods_id: this.currentGoodsId, user_id: this.currentUserId, params: params }
      })
        .then((res) => {
          length = res.data.length
          cartCount = res.data[0].count
        }).catch((err) => { })
      // 2.添加到购物车
      if (length === 0) {
        await this.$axios.post('/cart/add', { goods_id: this.currentGoodsId, user_id: this.currentUserId, params: params, count: num })
          .then((res) => {
            this.$toast.success({
              message: '加入购物车成功'
            })
            this.skuShow = false
          })
          .catch((err) => { })
      } else {
        await this.$axios.post('/cart/update', { goods_id: this.currentGoodsId, user_id: this.currentUserId, params: params, count: cartCount + num })
          .then((res) => {
            this.$toast.success({
              message: '加入购物车成功'
            })
            this.skuShow = false
          })
          .catch((err) => { })
      }
    },
    onClickCart () {
      this.$router.push({
        name: 'Cart',
        params: { from: 'detail', goods_id: this.currentGoodsId }
      })
    },
    returnPage () {
      let from = this.$route.params.from
      if (from === 'home') {
        this.$router.push({
          name: 'Home'
        })
      } else {
        this.$router.go(-1)
      }
    },
    returnHome () {
      this.$router.push({
        name: 'Home'
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
#detail {
  background-color: #f9faff;
  padding-bottom: 50px;
}
.detail_content {
  position: relative;
}
/deep/ .detail_content .van-sticky {
  padding: 0 50px !important;
  background-color: #fff;
}
.returnBtn {
  display: inline-blocks;
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 999;
}
.homeBtn {
  position: absolute;
  top: 12px;
  right: 15px;
  z-index: 999;
}
/* goods */
.goods {
}
.goods .goods_price {
  color: #fff;
  padding: 10px 15px;
  border-radius: 5px;
  background: linear-gradient(90deg, #fc36e5 0%, #ff5757 100%);
  margin-top: -4px;
}
.goods_price .price_text {
  font-size: 28px;
  font-weight: 600px;
  margin-right: 10px;
}
.goods_price .price_del {
  font-size: 12px;
  text-decoration: line-through;
}

.goods .goods_text {
  padding: 12px;
  margin-bottom: 10px;
  background-color: #fff;
}
.goods_text .text_title {
  font-size: 16px;
  color: rgb(23, 43, 77);
  margin: 10px 0;
}
.goods_text .text_desc {
  font-size: 12px;
  color: rgb(94, 108, 132);
}
.text_question {
  font-size: 12px;
  color: rgb(165, 173, 186);
}
.warm_prompt {
  padding: 10px;
  margin-top: 10px;
}
.van-action-sheet__cancel {
  width: 90%;
  height: 40px;
  margin-left: 5%;
  color: #fff;
  border-radius: 30px;
  background: linear-gradient(
    90deg,
    rgba(252, 59, 114, 0.78) 0%,
    rgba(252, 59, 114, 1) 100%
  );
  box-shadow: 0px 4px 20px 0px rgb(121 152 215 / 20%);
}
/* other_text */
.other_text {
  width: 100%;
  background-color: #fff;
  padding: 12px;
  margin: 10px 0;
}
.goods_params {
  font-size: 13px;
  padding: 10px 0;
}
.options {
  display: flex;
  justify-content: space-between;
}

/*  */
.detail_item {
  padding: 12px 12px 0 12px;
  background-color: #fff;
}
.shuxian {
  width: 0.4rem;
  height: 0.9rem;
  background: linear-gradient(
    310deg,
    rgba(252, 112, 134, 1) 0%,
    rgba(254, 147, 162, 1) 100%
  );
  margin-right: 0.1rem;
  display: inline-block;
}
.van-action-sheet__header {
  height: 60px;
  color: #969799;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #f2f3f5;
}
.van-action-sheet__close {
  display: none;
}

/* ActionSheet */
.actionSheet_content {
  padding: 24px 13px 80px 13px;
}
.actionSheet_table {
  color: #969799;
}
.content_item {
  margin-bottom: 30px;
}
.content_item_title {
  font-size: 15px;
  margin-bottom: 10px;
}
.actionSheet_title {
  border: 1px solid #fff;
  background: rgba(182, 189, 199, 0.24);
}
.actionSheet_cont {
  border: 1px solid #fff;
  background: rgba(182, 189, 199, 0.12);
}
.text_question .van-col {
  padding: 5px;
}

/* commment */
.commment {
  font-size: 12px;
  color: rgba(50, 50, 50, 1);
}
.commment .com_title {
  display: flex;
  justify-content: space-between;
}
.com_nums {
  font-weight: 700;
  font-size: 0.24rem;
}
.commment .com_content {
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
  /* border-radius: 50%;
  background-color: #ccc; */
}
.row_head .head_right {
  flex: 7;
}
.com_content .row_center {
  font-size: 12px;
  margin: 10px 0;
}
.com_content .row_footer {
  color: #a5adba;
}
.com_title .look_all {
  color: #ff5757;
  font-size: 0.26rem;
}

/* goodsAction */
.van-goods-action {
  padding-right: 10px;
}
.isCollected {
  color: #fc3b72;
}
.action_btn {
  background: linear-gradient(
    90deg,
    rgba(252, 59, 114, 0.78) 0%,
    rgb(252, 59, 114) 100%
  );
}
/*  */
.goTop {
  height: 100vh;
  overflow-x: hidden;
}

/deep/ .van-sku-actions .van-button--danger {
  display: none;
}
/deep/ .van-sku-actions .van-button--warning {
  border-radius: 20px !important;
  background: linear-gradient(
    90deg,
    rgba(252, 59, 114, 0.78) 0%,
    rgb(252, 59, 114) 100%
  );
}
</style>
