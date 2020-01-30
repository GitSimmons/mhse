const fs = require('fs')
const SmartBuffer = require('smart-buffer').SmartBuffer

const diff2saves = (save1, save2) => {
  const fullSaveData1 = fs.readFileSync(save1)
  const fullSaveData2 = fs.readFileSync(save2)

  const startOfSaveSlots = 0x003004DC
  const lengthOfSaveSlot = 0xF6110
  let diff = {}
  const saveData1 = Buffer.from(fullSaveData1.slice(startOfSaveSlots, startOfSaveSlots + lengthOfSaveSlot))
  const saveData2 = Buffer.from(fullSaveData2.slice(startOfSaveSlots, startOfSaveSlots + lengthOfSaveSlot))

  for (let i = 0; i <= lengthOfSaveSlot; i++) {
    if (saveData1[i] !== saveData2[i]) {
      console.log(i)
      diff[i] = {
        1: saveData1[i],
        2: saveData2[i]
      }
    }
  }
  fs.writeFileSync('diff', JSON.stringify(diff, null, 2))
}
export const diff2saves
