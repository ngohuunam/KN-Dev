import defaultState from '@/assets/defaultState'
const defaultNewOrder = JSON.stringify(defaultState.newOrder)

export default {
  list: [],
  selected: [],
  seq: null,
  loading: true,
  newOrder: JSON.parse(defaultNewOrder),
  message: {
    text: '',
    severity: '',
  },
  createNewOrder: false,
  wantDelOrder: false,
}
