const host = 'http://127.0.0.1:3000/'
const getOp = {
  method: 'get',
  headers: {
    'Content-Type': 'application/json',
  },
}
export const getList = async ({ state, commit }) => {
  state.loading = true
  const _route = `${host}film/orders/list/${state.seq || 1}`
  try {
    const _res = await fetch(_route, getOp)
    if (_res.status === 200) {
      const _json = await _res.json()
      console.log(`GET film/orders/list/ response: `, _json)
      commit('setStates', { states: ['list', 'seq'], values: [_json.docs, _json.seq] })
    } else if (_res.status === 204) {
      console.log(_res.status)
    } else console.error(_res.status)
  } catch (e) {
    console.error(e)
  }
  state.loading = false
}
