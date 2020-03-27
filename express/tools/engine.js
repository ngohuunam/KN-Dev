const fs = require('fs')
const engine = {
  html: function(filePath, options, callback) {
    const _renderKeys = { ...{}, ...options }
    delete _renderKeys.settings
    delete _renderKeys._locals
    delete _renderKeys.cache
    if (options.dept) filePath = filePath.replace(options.dept, `${options.dept}/${options.dept}`)
    fs.readFile(filePath, function(err, content) {
      if (err) return callback(err)
      content = content.toString()
      for (let key in _renderKeys) {
        const _exp = `{{${key}}}`
        const _regex = new RegExp(_exp, 'g')
        content = content.replace(_regex, _renderKeys[key])
      }
      const rendered = content
      console.log('rendered', rendered)
      return callback(null, rendered)
    })
  },
}
module.exports = engine
