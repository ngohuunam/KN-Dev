import state from './film-orders-list/state'
import * as mutations from './film-orders-list/mutations'
import * as getters from './film-orders-list/getters'
import * as actions from './film-orders-list/actions'

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
