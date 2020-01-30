const crypto = require('crypto')
const fs = require('fs')

const mhWorldKey = 'xieZjoe#P2134-3zmaghgpqoe0z8$3azeq'

const decrypt = (input, output) => {
  fs.readFile(input, (err, saveFile) => {
    if (err) throw err
    let decrypted = decryptSave(saveFile)
    const sha1 = byteSwap(decrypted).toString('hex', 0xC, 0xC + 0x14)
    const hash = crypto.createHash('sha1')
      .update(decrypted.slice(64))
      .digest('hex')
    if (hash !== sha1) {
      throw new Error('SHA1 mismatch')
    }
    console.log({ sha1, hash })
    fs.writeFile(output, decrypted, (err) => {
      if (err) throw err
    })
    console.log('Save decrypted')
  })
}

const encrypt = (input, output) => {
  fs.readFile(input, (err, saveFile) => {
    if (err) throw err
    const hash = crypto.createHash('sha1')
      .update(saveFile.slice(64))
      .digest('hex')

    saveFile = byteSwap(saveFile)
    saveFile.write(hash, 0xC, 0x14, 'hex')

    saveFile = byteSwap(saveFile)
    let encrypted = encryptSave(saveFile)
    fs.writeFile(output, encrypted, (err) => {
      if (err) throw err
    })
    console.log('Save encrypted')
  })
}

const decryptSave = (data) => {
  const decipher = crypto.createDecipheriv('bf-ecb', mhWorldKey, '')
  decipher.setAutoPadding(false)
  data = byteSwap(data)
  data = decipher.update(data)
  data = byteSwap(data)
  return data
}

const encryptSave = (data) => {
  const encipher = crypto.Cipheriv('bf-ecb', mhWorldKey, '')
  data = byteSwap(data)
  data = encipher.update(data)
  data = byteSwap(data)
  return data
}

const byteSwap = (data) => {
  let swapped = Buffer.alloc(data.length)
  if (data.length % 4) {
    throw Error('buffer not a multiple of 4 bytes')
  }
  for (let i = 0; i < data.length; i += 4) {
    swapped[i] = data[i + 3]
    swapped[i + 1] = data[i + 2]
    swapped[i + 2] = data[i + 1]
    swapped[i + 3] = data[i]
  }
  return swapped
}

module.exports = { byteSwap, decryptSave, encryptSave, encrypt, decrypt }
