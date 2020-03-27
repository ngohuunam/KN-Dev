export const setMess = (state, value) => {
  state.message = value
}

export const setState = (state, payload) => {
  state[payload.state] = payload.value
}
