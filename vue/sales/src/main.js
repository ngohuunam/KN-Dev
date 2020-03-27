import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'
import * as globalInstance from './globalInstance'

import DataTable from 'primevue/datatable'
Vue.component('DataTable', DataTable)

import Column from 'primevue/column'
Vue.component('Column', Column)

import ColumnGroup from 'primevue/columngroup'
Vue.component('ColumnGroup', ColumnGroup)

import InputText from 'primevue/inputtext'
Vue.component('InputText', InputText)

import Calendar from 'primevue/calendar'
Vue.component('Calendar', Calendar)

import MultiSelect from 'primevue/multiselect'
Vue.component('MultiSelect', MultiSelect)

import Toast from 'primevue/toast'
Vue.component('Toast', Toast)

import Button from 'primevue/button'
Vue.component('Button', Button)

import Dialog from 'primevue/dialog'
Vue.component('Dialog', Dialog)
const NewDialog = Vue.component('Dialog').extend({
  name: 'NewDialog',
  props: ['disableKeyTab'],
  documentKeyupListener: null,
  methods: {
    newOnKeyDown() {},
    replaceOnKeyDown(e) {
      if (!this.disableKeyTab) this.newOnKeyDown(e)
    },
    onKeyUp(event) {
      if (event.which === 13) {
        this.$emit('keyup-enter', event)
      } else if (event.which === 27) {
        this.$emit('keyup-escape', event)
      }
    },
    bindDocumentKeyupListener() {
      if (!this.documentKeyupListener) {
        this.documentKeyupListener = this.onKeyUp.bind(this)
        window.document.addEventListener('keyup', this.documentKeyupListener)
      }
    },
    unbindDocumentKeyupListener() {
      if (this.documentKeyupListener) {
        window.document.removeEventListener('keyup', this.documentKeyupListener)
        this.documentKeyupListener = null
      }
    },
  },
  created() {
    this.newOnKeyDown = this.onKeyDown
    this.onKeyDown = this.replaceOnKeyDown
  },
  mounted() {
    this.bindDocumentKeyupListener()
    this.removeStylesFromMask()
  },
  beforeDestroy() {
    this.disableDocumentSettings()
    this.unbindDocumentKeyupListener()
  },
})
Vue.component('NewDialog', NewDialog)

import Checkbox from 'primevue/checkbox'
Vue.component('Checkbox', Checkbox)

import ToggleButton from 'primevue/togglebutton'
Vue.component('ToggleButton', ToggleButton)

import ProgressBar from 'primevue/progressbar'
Vue.component('ProgressBar', ProgressBar)

import Dropdown from 'primevue/dropdown'
Vue.component('Dropdown', Dropdown)

import BlockUI from 'primevue/blockui'
Vue.component('BlockUI', BlockUI)

import ProgressSpinner from 'primevue/progressspinner'
Vue.component('ProgressSpinner', ProgressSpinner)

import Message from 'primevue/message'
Vue.component('Message', Message)
const NewMessage = Vue.component('Message').extend({
  name: 'NewMessage',
  documentClickListener: null,
  methods: {
    onClick() {
      this.$emit('close-message')
    },
    bindDocumentClickListener() {
      if (!this.documentClickListener) {
        this.documentClickListener = this.onClick.bind(this)
        document.querySelector('.p-messages-close.p-link').addEventListener('click', this.documentClickListener)
      }
    },
    unbindDocumentClickListener() {
      if (this.documentClickListener) {
        document.querySelector('.p-messages-close.p-link').removeEventListener('click', this.documentClickListener)
        this.documentClickListener = null
      }
    },
  },
  mounted() {
    this.bindDocumentClickListener()
  },
  beforeDestroy() {
    this.unbindDocumentClickListener()
  },
})
Vue.component('NewMessage', NewMessage)

import Menu from 'primevue/menu'
Vue.component('Menu', Menu)

import ContextMenu from 'primevue/contextmenu'
Vue.component('ContextMenu', ContextMenu)

import Chips from 'primevue/chips'
Vue.component('Chips', Chips)

// import Editor from 'primevue/editor'
// Vue.component('Editor', Editor)
// const NewEditor = Vue.component('Editor').extend({
//   name: 'NewEditor',
//   props: ['readOnly'],
// })
// Vue.component('NewEditor', NewEditor)

import Textarea from 'primevue/textarea'
Vue.component('Textarea', Textarea)

import FileUpload from 'primevue/fileupload'
Vue.component('FileUpload', FileUpload)

import InputMask from 'primevue/inputmask'
Vue.component('InputMask', InputMask)

import 'primevue/resources/themes/nova-light/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import '@/assets/myCss.css'

import ToastService from 'primevue/toastservice'
Vue.use(ToastService)

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.config.performance = true

const socket = io('http://127.0.0.1:3000')
Vue.use(VueSocketIOExt, socket, { store })
Vue.use(globalInstance)

const toProperCase = function() {
  return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

String.prototype.toProperCase = toProperCase
String.prototype.toDataId = function() {
  return this.toProperCase().replace(/\s/g, '')
}
Array.prototype.pushSorted = function(el, compareFn) {
  this.splice(
    (function(arr) {
      var m = 0
      var n = arr.length - 1

      while (m <= n) {
        var k = (n + m) >> 1
        var cmp = compareFn(el, arr[k])

        if (cmp > 0) m = k + 1
        else if (cmp < 0) n = k - 1
        else return k
      }

      return -m - 1
    })(this),
    0,
    el,
  )

  return this.length
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
