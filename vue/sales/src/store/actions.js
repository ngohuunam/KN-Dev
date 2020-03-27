const host = 'http://127.0.0.1:3000/'
const fetchOp = method => {
  return {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  }
}

export const auth = async ({ state, commit }) => {
  state.dialog.loading = true
  const _fetchOp = fetchOp('post')
  _fetchOp.body = JSON.stringify({ userName: 'nam', passworr: '123' })
  const _resource = 'auth'
  const _url = host + _resource
  console.log('body', _fetchOp.body)
  try {
    const _res = await fetch(_url, _fetchOp)
    if (_res.status === 200) {
      const _json = await _res.json()
      console.log(`FETCH_POST ${_resource} response json: `, _json)
    } else commit('dialog/setMess', { message: 'Response Error: ' + _res.status, severity: 'error' })
  } catch (e) {
    console.error(e)
    commit('dialog/setMess', { message: 'Promise Error: ' + e, severity: 'error' })
  }
  setTimeout(() => {
    state.dialog.loading = false
  }, 100)
}
