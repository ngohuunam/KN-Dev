// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import tools from './tools'

const install = Vue => {
  // 4. add an instance method
  Vue.prototype.$tToString = tools.tToString
  Vue.prototype.$log = console.log.bind(console)
}
export { install }
