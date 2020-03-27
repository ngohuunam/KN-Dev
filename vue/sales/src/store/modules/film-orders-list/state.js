// import defaultState from '@/assets/defaultState'
// const defaultNewOrder = JSON.stringify(defaultState.newOrder)

export default {
  list: [],
  selected: [],
  seq: null,
  loading: true,
  changes: [],
  newOrder: null,
  newOrderLabels: [
    { label: 'Foreign Title:', inputType: 'text', key: 'foreignTitle' },
    { label: 'Team:', inputType: 'dropdown', key: 'team', options: ['CJHK', 'Disney', 'Local', 'UIP', 'WB'] },
    { label: 'Premiere Date:', inputType: 'calendar-full', key: 'premiereDate' },
    { label: 'End Date:', inputType: 'calendar', key: 'endAt' },
    { label: 'Vietnamese Title:', inputType: 'text', key: 'vietnameseTitle' },
  ],
  newOrderConverted: null,
  newProd: null,
  newProdLabels: [
    { label: 'Product Name:', inputType: 'text', key: 'name' },
    { label: 'Type:', inputType: 'dropdown', key: 'type', options: ['Offset Print', 'Digital Print', 'Social Media', 'Web', 'Other'] },
    { label: 'End at:', inputType: 'calendar', key: 'endAt', dateFormat: 'dd/mm/yy', showTime: true },
  ],
  newProdConverted: null,
  message: {
    text: '',
    severity: '',
  },
  prodList: [],
  prodListSelected: [],
}
