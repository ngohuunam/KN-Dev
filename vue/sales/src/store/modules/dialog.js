import state from './dialog/state'
import * as mutations from './dialog/mutations'
import * as getters from './dialog/getters'
import * as actions from './dialog/actions'

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
