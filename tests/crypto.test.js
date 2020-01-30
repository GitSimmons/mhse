const fs = require('fs')
const { byteSwap, decryptSave, encryptSave } = require('../crypto')

test('byteSwap returns swapped bytes for a small array', () => {
  expect(byteSwap([1, 2, 3, 4])).toEqual(Buffer.from([4, 3, 2, 1]))
})
test('byteswap should throw an error to swap bytes when it cannot, ie. not a multiple of four bytes', () => {
  expect(() => byteSwap([1, 2, 3])).toThrow()
})
test('byteSwap returns swapped bytes for a big array', () => {
  expect(byteSwap([1, 2, 3, 4, 5, 6, 7, 8])).toEqual(Buffer.from([4, 3, 2, 1, 8, 7, 6, 5]))
})

test('decrypting and encrypting something should yield itself', () => {
  const testBuffer = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8])
  const encrypted = encryptSave(testBuffer)
  const decrypted = decryptSave(encrypted)
  expect(decrypted).toEqual(testBuffer)
})
