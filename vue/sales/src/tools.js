export default {
  tToString: function(timestamp, addTime, nullString, yFormat) {
    // console.log(timestamp)
    if (Number.isNaN(timestamp) || timestamp < 1553048548000) return nullString
    const _yFormat = yFormat ? yFormat : '2-digit'
    const _newDate = new Date(timestamp)
    const _opt = { day: '2-digit', month: '2-digit', year: _yFormat }
    const _optAddTime = { day: '2-digit', month: '2-digit', year: _yFormat, hour: '2-digit', minute: '2-digit' }
    return _newDate.toLocaleDateString('vi', addTime ? _optAddTime : _opt)
  },
  htmlStrip: function(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  },
  newOrder: (order, _id, user) => {
    const _newOrder = { ...order }
    _newOrder._id = _id
    _newOrder.shortTitle = _newOrder.shortTitle.toProperCase()
    _newOrder.foreignTitle = _newOrder.foreignTitle.toProperCase()
    _newOrder.vietnameseTitle = _newOrder.vietnameseTitle.toProperCase()
    _newOrder.createdBy = user
    _newOrder.premiereDate = _newOrder.premiereDate ? _newOrder.premiereDate.getTime() : null
    _newOrder.endAt = _newOrder.endAt ? _newOrder.endAt.getTime() : null
    _newOrder.status = 'Created'
    return _newOrder
  },
  dateToUnix: (dateStr, hasTime) => {
    if (dateStr) {
      const _dateTimeRegexCheck = hasTime ? /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/ : /(\d{2})\/(\d{2})\/(\d{4})/
      const _regexCheck = new RegExp(_dateTimeRegexCheck)
      if (_regexCheck.test(dateStr)) {
        const parts = dateStr.match(_dateTimeRegexCheck)
        const _dStr = parts[1]
        const _mStr = parts[2]
        const _yStr = parts[3]
        if (dateIsValid(_dStr, _mStr, _yStr)) {
          const _fitTimeZoneMs = 7 * 3600 * 1000
          const _dt = (hasTime ? Date.UTC(+_yStr, _mStr - 1, +_dStr, +parts[4], +parts[5]) : Date.UTC(+_yStr, _mStr - 1, +_dStr)) - _fitTimeZoneMs
          return _dt
        }
      }
    }
    return NaN
  },
}

const daysInMonth = (m, y) => {
  // m is 0 indexed: 0-11
  switch (m) {
    case 1:
      return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28
    case 8:
    case 3:
    case 5:
    case 10:
      return 30
    default:
      return 31
  }
}

const dateIsValid = (dStr, mStr, yStr) => {
  const d = parseInt(dStr)
  const m = parseInt(mStr) - 1
  const y = parseInt(yStr)
  console.log(d)
  console.log(m)
  console.log(y)
  return m >= 0 && m < 12 && d > 0 && d <= daysInMonth(m, y)
}

// const validateDate = (dateStr, hasTime) => {
//   if (dateStr) {
//     const _dateTimeRegexCheck = hasTime ? /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/ : /(\d{2})\/(\d{2})\/(\d{4})/
//     const _regexCheck = new RegExp(_dateTimeRegexCheck)
//     if (_regexCheck.test(dateStr)) {
//       const parts = dateStr.match(_dateTimeRegexCheck)
//       if (dateIsValid(parts[3], parts[2], parts[1])) {
//         const _fitTimeZoneMs = 7 * 24 * 3600 * 1000
//         const _dt = hasTime ? Date.UTC(+parts[3], parts[2] - 1, +parts[1], +parts[4], +parts[5]) : Date.UTC(+parts[3], parts[2] - 1, +parts[1])
//         return _dt + _fitTimeZoneMs
//       }
//     }
//   }
//   return NaN
// }
