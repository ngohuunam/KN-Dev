const crypto = require('crypto')
const bcrypt = require('bcrypt')

const secretKey = 'mySecretKey'
const algorithm = 'aes-192-cbc'

const cryptoApi = {}

cryptoApi.hashSync = (text, salt) => {
  return bcrypt.hashSync(text, salt)
}

cryptoApi.compareSync = (data, encrypted) => {
  return bcrypt.compareSync(data, encrypted)
}

cryptoApi.hash = async (text, salt) => {
  return await bcrypt.hash(text, salt)
}

cryptoApi.compare = async (data, encrypted) => {
  return await bcrypt.compare(data, encrypted)
}

cryptoApi.encrypt = text => {
  const key = crypto.scryptSync(secretKey, 'salt', 24)
  const iv = Buffer.alloc(16, 0)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

cryptoApi.createHash = text => {
  return crypto
    .createHmac('sha256', secretKey)
    .update(text)
    .digest('hex')
}

cryptoApi.decrypt = text => {
  const key = crypto.scryptSync(secretKey, 'salt', 24)
  const iv = Buffer.alloc(16, 0)
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(text, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

// const getSeq = fullSeq => fullSeq.slice(fullSeq.indexOf('-') + 1, fullSeq.indexOf('_'))
// cryptoApi.getEncryptSeqByHash = fullSeq => cryptoApi.createHash(getSeq(fullSeq))
// cryptoApi.getEncryptSeqByCypher = fullSeq => cryptoApi.encrypt(getSeq(fullSeq))
// cryptoApi.getDencryptSeqByCypher = fullSeq => cryptoApi.decrypt(getSeq(fullSeq))

// cryptoApi.getEncryptSeqByHash = fullSeq => cryptoApi.createHash(fullSeq)
// cryptoApi.getEncryptSeqByCypher = fullSeq => cryptoApi.encrypt(fullSeq)
// cryptoApi.getDencryptSeqByCypher = fullSeq => cryptoApi.decrypt(fullSeq)

module.exports = cryptoApi
