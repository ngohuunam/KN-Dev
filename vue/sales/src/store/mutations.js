import Vue from 'vue'

export const LIST = (state, payload) => {
  state[payload.state] = payload.data
  state[payload.state + 'Seq'] = payload.update_seq
}

export const ALL = (state, payload) => {
  state[payload.state] = payload.data
  state[payload.state + 'UpdateSeq'] = payload.update_seq
}

export const PUSH = (state, payload) => {
  const _state = state[payload.state]
  const _data = payload.data
  const _idx = _state.findIndex(v => v._id === _data._id)
  if (_idx < 0) {
    _state.push(_data)
  } else if (_state[_idx]._rev !== _data._rev) Vue.set(_state, _idx, _data)
}

export const SPLICE = (state, payload) => {
  const _state = state[payload.state]
  const _idx = _state.findIndex(v => v._id === payload._id)
  _state.splice(_idx)
}

export const FILTER_REMOVE_ONE = (state, payload) => {
  state[payload.state] = state[payload.state].filter(v => v._id !== payload._id)
}

export const FILTER_REMOVE_SOME = (state, payload) => {
  state[payload.state] = state[payload.state].filter(v => !payload._ids.includes(v._id))
}

export const SORT = (state, payload) => {
  const _state = state[payload.state]
  const _key = payload.key
  _state.sort((a, b) => (a[_key] > b[_key] ? 1 : b[_key] > a[_key] ? -1 : 0))
}

export const SET_STATE = (state, payload) => {
  state[payload.state] = payload.value
}
