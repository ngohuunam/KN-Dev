// import defaultState from '@/assets/defaultState'
// const defaultNewOrder = JSON.stringify(defaultState.newOrder)

const date = new Date()

export default {
  user: { name: '', dept: '', email: '' },
  token: '',
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
}
