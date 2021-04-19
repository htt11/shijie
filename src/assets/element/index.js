import { 
  Backtop,
  Icon,
  Loading,
  Upload,
  Button
} from 'element-ui'
const element = {
  install: function (Vue) {
    Vue.use(Backtop),
    Vue.use(Icon),
    Vue.use(Loading),
    Vue.use(Upload),
    Vue.use(Button)
  }
}
export default element
