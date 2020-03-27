import state from './home/state'
import * as mutations from './home/mutations'
import * as getters from './home/getters'
import * as actions from './home/actions'

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
