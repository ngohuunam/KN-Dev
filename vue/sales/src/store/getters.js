export const GET_ORDER_DETAIL = state => id => {
  return state.orderDetails.find(o => o._id === id) || { products: [] }
}

export const ORDERS_LIST_DIALOG = state => {
  return state.createNewOrder || state.wantDelOrder
}
