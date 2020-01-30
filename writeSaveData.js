const fs = require('fs')
const SmartBuffer = require('smart-buffer').SmartBuffer

const getJSONFrom = (input) => {
  const jsonData = fs.readFileSync(input)
  return JSON.parse(jsonData)
}

const getSaveData = (input) => {
  const saveData = fs.readFileSync(input)
  return saveData
}

const writeJSONtoSave = (jsonSource, saveSource, saveSlot = 1) => {
  if (saveSlot <= 0 || saveSlot > 3) {
    throw new Error('Saveslot must be an integer between 1 and 3')
  }
  const json = getJSONFrom(jsonSource)
  const save = getSaveData(saveSource)
  let saveSB = SmartBuffer.fromBuffer(save)

  const {
    hunterAppearance: {
      makeup2Color,
      makeup2PosX,
      makeup2PosY,
      makeup2SizeX,
      makeup2SizeY,
      makeup2Glossy,
      makeup2Metallic,
      makeup2Type,
      makeup1Color,
      makeup1PosX,
      makeup1PosY,
      makeup1SizeX,
      makeup1SizeY,
      makeup1Gloss,
      makeup1Metallic,
      makeup1Type,
      leftEyeColor,
      rightEyeColor,
      eyebrowColor,
      facialHairColor,
      eyeWidth,
      eyeHeight,
      skinColorX,
      skinColorY,
      age,
      wrinkles,
      noseHeight,
      mouthHeight,
      gender,
      browType,
      faceType,
      eyeType,
      noseType,
      mouthType,
      eyebrowType,
      eyelashLength,
      facialHairtype,
      unused,
      hairColor,
      clothingColor,
      hairType,
      clothingType,
      voice,
      expression },
    hunterTransmog: {
      transmogHead,
      transmogArmor,
      transmogHands,
      transmogBelt,
      transmogFeet
    }
  } = json

  saveSB.writeColor = (color) => {
    saveSB.writeUInt8(color[0])
    saveSB.writeUInt8(color[1])
    saveSB.writeUInt8(color[2])
    if (color.length === 3) {
      saveSB.writeUInt8(255)
    } else {
      saveSB.writeUInt8(color[3])
    }
  }
  // magic numbers
  const startOfSaveSlots = 0x003004DC
  const lengthOfSaveSlot = 0xF6110

  const offSet = startOfSaveSlots + (lengthOfSaveSlot * (saveSlot - 1)) + 88
  const transmogOffset = offSet + 0xD4665 - 88

  saveSB.writeOffset = offSet
  saveSB.writeColor(makeup2Color)
  saveSB.writeFloatLE(makeup2PosX)
  saveSB.writeFloatLE(makeup2PosY)
  saveSB.writeFloatLE(makeup2SizeX)
  saveSB.writeFloatLE(makeup2SizeY)
  saveSB.writeFloatLE(makeup2Glossy)
  saveSB.writeFloatLE(makeup2Metallic)
  saveSB.writeInt32LE(makeup2Type)
  saveSB.writeColor(makeup1Color)
  saveSB.writeFloatLE(makeup1PosX)
  saveSB.writeFloatLE(makeup1PosY)
  saveSB.writeFloatLE(makeup1SizeX)
  saveSB.writeFloatLE(makeup1SizeY)
  saveSB.writeFloatLE(makeup1Gloss)
  saveSB.writeFloatLE(makeup1Metallic)
  saveSB.writeInt32LE(makeup1Type)
  saveSB.writeColor(leftEyeColor)
  saveSB.writeColor(rightEyeColor)
  saveSB.writeColor(eyebrowColor)
  saveSB.writeColor(facialHairColor)
  saveSB.writeInt8(eyeWidth)
  saveSB.writeInt8(eyeHeight)
  saveSB.writeUInt8(skinColorX)
  saveSB.writeUInt8(skinColorY)
  saveSB.writeUInt8(age)
  saveSB.writeUInt8(wrinkles)
  saveSB.writeInt8(noseHeight)
  saveSB.writeInt8(mouthHeight)
  saveSB.writeInt32LE(gender)
  saveSB.writeUInt8(browType)
  saveSB.writeUInt8(faceType)
  saveSB.writeUInt8(eyeType)
  saveSB.writeUInt8(noseType)
  saveSB.writeUInt8(mouthType)
  saveSB.writeUInt8(eyebrowType)
  saveSB.writeUInt8(eyelashLength)
  saveSB.writeUInt8(facialHairtype)
  saveSB.writeInt32LE(unused)
  saveSB.writeColor(hairColor)
  saveSB.writeColor(clothingColor)
  saveSB.writeInt16LE(hairType)
  saveSB.writeUInt8(clothingType)
  saveSB.writeUInt8(voice)
  saveSB.writeInt32LE(expression)
  // Skip ahead to transmog stuff
  saveSB.writeOffset = transmogOffset
  saveSB.writeInt32LE(transmogHead)
  saveSB.writeInt32LE(transmogArmor)
  saveSB.writeInt32LE(transmogHands)
  saveSB.writeInt32LE(transmogBelt)
  saveSB.writeInt32LE(transmogFeet)
  fs.writeFileSync(saveSource, saveSB.toBuffer())
}
// (jsonSource, saveSource, saveSlot = 1)
writeJSONtoSave('Cerid.json', 'savedata1000.dec')
module.exports = { writeJSONtoSave }
