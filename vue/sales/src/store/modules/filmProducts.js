import state from './film-products/state'
import * as mutations from './film-products/mutations'
import * as getters from './film-products/getters'
import * as actions from './film-products/actions'

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
