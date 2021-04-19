import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import element from 'assets/element/index'

import axios from './axios'
import filter from '@/filter'

Vue.use(element)
Vue.use(filter)

import { 
  Button,
  Tabbar, 
  TabbarItem,
  Icon,
  Search,
  Swipe, 
  SwipeItem,
  Lazyload,
  Image as VanImage,
  Grid, 
  GridItem,
  Tab, 
  Tabs,
  NoticeBar,
  Loading,
  Divider,
  Col, 
  Row,
  NavBar,
  Sticky,
  Form,
  RadioGroup, 
  Radio,
  Stepper,
  Skeleton,
  SubmitBar,
  Checkbox, 
  CheckboxGroup,
  SwipeCell,
  Card,
  GoodsAction, 
  GoodsActionIcon, 
  GoodsActionButton,
  Rate,
  ActionSheet,
  Toast,
  Tag,
  Sku,
  Cell, 
  CellGroup,
  Field,
  Popup,
  DatetimePicker,
  Badge,
  AddressEdit ,
  Area ,
  AddressList,
  Dialog,
  PullRefresh,
  ContactCard,
  Popover,
  Overlay,
  Collapse, 
  CollapseItem
} from 'vant'


Vue.use(Button)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Icon)
Vue.use(Search)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(VanImage)
Vue.use(Lazyload)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(NoticeBar)
Vue.use(Loading)
Vue.use(Divider)
Vue.use(Col)
Vue.use(Row)
Vue.use(NavBar)
Vue.use(Sticky)
Vue.use(Form)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Stepper)
Vue.use(Skeleton)
Vue.use(SubmitBar)
Vue.use(Checkbox);
Vue.use(CheckboxGroup)
Vue.use(SwipeCell)
Vue.use(Card)
Vue.use(GoodsAction)
Vue.use(GoodsActionButton)
Vue.use(GoodsActionIcon)
Vue.use(Rate)
Vue.use(ActionSheet)
Vue.use(Toast)
Vue.use(Tag)
Vue.use(Sku)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Field)
Vue.use(Popup)
Vue.use(DatetimePicker)
Vue.use(Badge)
Vue.use(AddressEdit)
Vue.use(Area)
Vue.use(AddressList)
Vue.use(Dialog)
Vue.use(PullRefresh)
Vue.use(ContactCard)
Vue.use(Popover)
Vue.use(Overlay)
Vue.use(Collapse)
Vue.use(CollapseItem)

Vue.prototype.$axios = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
