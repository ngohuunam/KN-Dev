import Vue from 'vue'

export const push = (state, payload) => {
  const _state = state[payload.state]
  const _data = payload.data
  const _idx = _state.findIndex(v => v._id === _data._id)
  if (_idx < 0) {
    _state.push(_data)
  } else if (_state[_idx]._rev !== _data._rev) Vue.set(_state, _idx, _data)
}

export const splice = (state, payload) => {
  const _state = state[payload.state]
  const _idx = _state.findIndex(v => v._id === payload._id)
  _state.splice(_idx)
}

export const filterOne = (state, payload) => {
  state[payload.state] = state[payload.state].filter(v => v._id !== payload._id)
}

export const filterSomeByIndexOf = (state, payload) => {
  state[payload.state] = state[payload.state].filter(v => v._id.indexOf(payload._id) < 0)
}

export const filterSome = (state, payload) => {
  state[payload.state] = state[payload.state].filter(v => !payload._ids.includes(v._id))
}

export const sort = (state, payload) => {
  const _state = state[payload.state]
  const _key = payload.key
  _state.sort((a, b) => (a[_key] > b[_key] ? 1 : b[_key] > a[_key] ? -1 : 0))
}

export const setState = (state, payload) => {
  state[payload.state] = payload.value
}

export const setStates = (state, payload) => {
  payload.states.map((st, idx) => (state[st] = payload.values[idx]))
}

export const setMess = (state, value) => {
  state.message = value
}
