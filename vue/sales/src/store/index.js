import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

import filmOrdersListModule from './modules/filmOrdersList'
import homeModule from './modules/home'
import dialogModule from './modules/dialog'

Vue.use(Vuex)

import state from './state'
import * as mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'

const store = new Vuex.Store({
  modules: { filmOrdersList: filmOrdersListModule, home: homeModule, dialog: dialogModule },
  state,
  mutations,
  getters,
  actions,
  // plugins: [createPersistedState({ paths: ['filmOrdersList.list', 'filmOrdersList.seq'], fetchBeforeUse: true })],
})

const hotReloadElements = ['./state', './mutations', './getters', './actions', './modules/filmOrdersList', './modules/home', './modules/dialog']

if (module.hot) {
  module.hot.accept(hotReloadElements, () => {
    const newMutations = require('./mutations').default
    const newGetters = require('./getters').default
    const newActions = require('./actions').default
    const newState = require('./state').default
    const newFilmOrdersListModule = require('./modules/filmOrdersList').default
    const newHomeModule = require('./modules/home').default
    const newDialogModule = require('./modules/dialog').default
    store.hotUpdate({
      state: newState,
      mutations: newMutations,
      getters: newGetters,
      actions: newActions,
      modules: {
        filmOrdersList: newFilmOrdersListModule,
        home: newHomeModule,
        dialog: newDialogModule,
      },
    })
  })
}

export default store
