import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    orders: [],
    products: [],
    products_selected: [],
    products_filter: [],
    jobs: [],
    jobs_selected: [],
    jobs_filter: [],
  },
  mutations: {
    SOCKET_ALL(state, message) {
      const _data = message.state
      state[_data] = message.value
    },
    ADD_PROD(state, payload) {
      console.log(payload)
      state.products.push(payload)
    },
    ORDER_SELECT(state, _id) {
      const _row = state.orders.find(o => o._id === _id)
      if (_row) _row.selected = true
      state.products_filter = state.products_filter.concat(state.products.filter(p => !state.products_filter.some(pf => pf.orderId === _id) && p.orderId === _id))
    },
    ORDER_UNSELECT(state, _id) {
      const _row = state.orders.find(o => o._id === _id)
      if (_row) delete _row.selected
      state.products_selected = state.products_selected.filter(p => p.orderId !== _id)
      state.products_filter = state.products_filter.filter(p => p.orderId !== _id)
      state.jobs_selected = state.jobs_selected.filter(j => j.orderId !== _id)
      state.jobs_filter = state.jobs_filter.filter(j => j.orderId !== _id)
    },
    ORDER_SELECT_ALL(state, datas) {
      datas.map(d => {
        const _id = d._id
        this.commit('ORDER_SELECT', _id)
      })
    },
    ORDER_UNSELECT_ALL(state) {
      state.orders.map(o => {
        if (o.selected) delete o.selected
      })
      state.products_selected = []
      state.products_filter = []
      state.jobs_selected = []
      state.jobs_filter = []
    },
    PROD_SELECTED(state, prods) {
      state.products_selected = prods
    },
    PROD_SELECT(state, _id) {
      const _row = state.products_filter.find(p => p._id === _id)
      if (_row) {
        _row.selected = true
        state.pro
      }
      state.jobs_filter = state.jobs_filter.concat(state.jobs.filter(j => !state.jobs_filter.some(jf => jf.prodId === _id) && j.prodId === _id))
    },
    PROD_UNSELECT(state, _id) {
      const _row = state.products_filter.find(p => p._id === _id)
      if (_row) delete _row.selected
      state.jobs_selected = state.jobs_selected.filter(j => j.orderId !== _id)
      state.jobs_filter = state.jobs_filter.filter(j => j.prodId !== _id)
    },
    PROD_SELECT_ALL(state, datas) {
      datas.map(d => {
        const _id = d._id
        this.commit('PROD_SELECT', _id)
      })
    },
    PROD_UNSELECT_ALL(state) {
      state.products.map(p => {
        if (p.selected) delete p.selected
      })
      state.jobs_selected = []
      state.jobs_filter = []
    },
    JOB_SELECTED(state, jobs) {
      state.jobs_selected = jobs
    },
    JOB_SELECT(state, _id) {
      const _row = state.jobs_filter.find(j => j._id === _id)
      if (_row) _row.selected = true
    },
    JOB_UNSELECT(state, _id) {
      const _row = state.jobs_filter.find(j => j._id === _id)
      if (_row) delete _row.selected
    },
  },
  actions: {},
  modules: {},
})
