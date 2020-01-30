const fs = require('fs')
const SmartBuffer = require('smart-buffer').SmartBuffer
const { equipToLayered } = require('./equipToLayered')
const getJSON = (input) => {
  fs.readFile(input, (err, data) => {
    if (err) throw err
    // Magic numbers
    const startOfSaveSlots = 0x003004DC
    const lengthOfSaveSlot = 0xF6110
    // const steamId = data.readInt32LE(0x28)
    const saves = []
    // There are only 3 save slots
    for (let i = startOfSaveSlots; i < startOfSaveSlots + 3 * lengthOfSaveSlot; i = i + lengthOfSaveSlot) {
      let saveSlot = SmartBuffer.fromBuffer(data.slice(i, i + lengthOfSaveSlot))

      saveSlot.readColor = (includeAlpha = false) => {
        let r = saveSlot.readUInt8()
        let g = saveSlot.readUInt8()
        let b = saveSlot.readUInt8()
        let a = saveSlot.readUInt8() // read the alpha to advance the cursor even when it's unused / always 255
        if (includeAlpha) {
          return [r, g, b, a]
        }
        return [r, g, b]
      }

      // General (we need hunter name and playtime to check if it's a valid save)
      const hunterName = saveSlot.readString(0x40).replace(/\0/g, '') // Trim the null characters, also it's max 16char
      saveSlot.readOffset = saveSlot.readOffset + 16
      // Here's what we're skipping:
      // const hunterRank = saveSlot.readInt32LE()
      // const zenny = saveSlot.readInt32LE()
      // const researchPoints = saveSlot.readInt32LE()
      // const hunterXP = saveSlot.readInt32LE()
      const playTimeInSeconds = saveSlot.readInt32LE()

      // Skip slots with default saveslot
      if (hunterName === 'PLAYER 1' && playTimeInSeconds === 0) {
        continue
      }

      // const newOffset = 872173

      // Get equipped item IDs
      const equippedIDArray = []
      const firstEquipped = 596643

      for (let equipSlot = 0; equipSlot < 5; equipSlot++) {
        let equipID = data.readUInt32LE(i + firstEquipped + (4 * equipSlot))
        equippedIDArray.push(equipID)
      }

      const testOffset = data.slice(i, i + lengthOfSaveSlot).indexOf(Buffer.from([0, 0, 0, 0, 26]), +1)
      console.log(testOffset)
      console.log(data.slice(i + testOffset - 12, i + testOffset + 64))

      // Get all equip IDS
      const firstEquipSlot = 678565
      const equipIDArray = []
      for (let equipSlot = 0; equipSlot <= 1000; equipSlot++) {
        let equipID = data.readUInt32LE(i + firstEquipSlot + (17 * 4 * equipSlot))
        equipIDArray.push(equipID)
      }

      // map Equipped item IDs to equip IDs to get Equipped Item styles
      const equippedArray = []

      equippedIDArray.map((ID) => equippedArray.push(equipIDArray[ID]))

      console.log(equippedArray)

      // Transmogrify equippedArray to layered armor numbers
      const equipToLayeredArray = [equippedArray].map((equip) => equipToLayered[equip] || equip)

      saveSlot.readOffset = saveSlot.readOffset + 4
      // Hunter Appearance
      const makeup2Color = saveSlot.readColor(true)
      const makeup2PosX = saveSlot.readFloatLE()
      const makeup2PosY = saveSlot.readFloatLE()
      const makeup2SizeX = saveSlot.readFloatLE()
      const makeup2SizeY = saveSlot.readFloatLE()
      const makeup2Glossy = saveSlot.readFloatLE()
      const makeup2Metallic = saveSlot.readFloatLE()
      const makeup2Type = saveSlot.readInt32LE()
      const makeup1Color = saveSlot.readColor(true)
      const makeup1PosX = saveSlot.readFloatLE()
      const makeup1PosY = saveSlot.readFloatLE()
      const makeup1SizeX = saveSlot.readFloatLE()
      const makeup1SizeY = saveSlot.readFloatLE()
      const makeup1Gloss = saveSlot.readFloatLE()
      const makeup1Metallic = saveSlot.readFloatLE()
      const makeup1Type = saveSlot.readInt32LE()
      const leftEyeColor = saveSlot.readColor()
      const rightEyeColor = saveSlot.readColor()
      const eyebrowColor = saveSlot.readColor()
      const facialHairColor = saveSlot.readColor()
      const eyeWidth = saveSlot.readInt8()
      const eyeHeight = saveSlot.readInt8()
      const skinColorX = saveSlot.readUInt8()
      const skinColorY = saveSlot.readUInt8()
      const age = saveSlot.readUInt8()
      const wrinkles = saveSlot.readUInt8()
      const noseHeight = saveSlot.readInt8()
      const mouthHeight = saveSlot.readInt8()
      const gender = saveSlot.readInt32LE() // First byte is 0 for male, 1 for female
      const browType = saveSlot.readUInt8()
      const faceType = saveSlot.readUInt8()
      const eyeType = saveSlot.readUInt8()
      const noseType = saveSlot.readUInt8()
      const mouthType = saveSlot.readUInt8()
      const eyebrowType = saveSlot.readUInt8()
      const eyelashLength = saveSlot.readUInt8()
      const facialHairtype = saveSlot.readUInt8()
      const unused = saveSlot.readInt32LE()
      const hairColor = saveSlot.readColor()
      const clothingColor = saveSlot.readColor(true)
      const hairType = saveSlot.readInt16LE()
      const clothingType = saveSlot.readUInt8()
      const voice = saveSlot.readUInt8()
      const expression = saveSlot.readInt32LE()
      // Palico Appearance
      const palicoPatternColor1 = saveSlot.readColor()
      const palicoPatternColor2 = saveSlot.readColor()
      const palicoPatternColor3 = saveSlot.readColor()
      const palicoFurColor = saveSlot.readColor()
      const palicoLeftEyeColor = saveSlot.readColor()
      const palicoRightEyeColor = saveSlot.readColor()
      const palicoClothingColor = saveSlot.readColor()
      const palicoFurLength = saveSlot.readFloatLE()
      const palicoFurThickness = saveSlot.readFloatLE()
      const palicoPatternType = saveSlot.readUInt8()
      const palicoEyeType = saveSlot.readUInt8()
      const palicoEarType = saveSlot.readUInt8()
      const palicoTailType = saveSlot.readUInt8()
      const palicoVoiceType = saveSlot.readUInt8()
      const palicoVoicePitch = saveSlot.readUInt8()
      // Skip ahead to grab Palico name
      saveSlot.readOffset = 0x2EB
      const palicoName = saveSlot.readString(0x40).replace(/\0/g, '')
      // Skip ahead to grab transmog info
      saveSlot.readOffset = 0xD4665
      const transmogHead = saveSlot.readInt32LE()
      const transmogArmor = saveSlot.readInt32LE()
      const transmogHands = saveSlot.readInt32LE()
      const transmogBelt = saveSlot.readInt32LE()
      const transmogFeet = saveSlot.readInt32LE()
      // Grab colors ... might also be bytes 715++, but I think that's the GC data
      saveSlot.readOffset = 872173
      const colorHead = saveSlot.readColor()
      const colorArmor = saveSlot.readColor()
      const colorHands = saveSlot.readColor()
      const colorBelt = saveSlot.readColor()
      const colorFeet = saveSlot.readColor()
      const hunterAppearance = {
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
        expression
      }
      const palicoAppearance = {
        palicoPatternColor1,
        palicoPatternColor2,
        palicoPatternColor3,
        palicoFurColor,
        palicoLeftEyeColor,
        palicoRightEyeColor,
        palicoClothingColor,
        palicoFurLength,
        palicoFurThickness,
        palicoPatternType,
        palicoEyeType,
        palicoEarType,
        palicoTailType,
        palicoVoiceType,
        palicoVoicePitch
      }
      const hunterTransmog = {
        transmogHead,
        transmogArmor,
        transmogHands,
        transmogBelt,
        transmogFeet
      }
      const hunterColors = {
        colorHead,
        colorArmor,
        colorHands,
        colorBelt,
        colorFeet
      }
      const saveObj = {
        hunterName,
        palicoName,
        hunterAppearance,
        palicoAppearance,
        hunterTransmog,
        hunterColors
      }

      saves.push(saveObj)
    }
    saves.map((save) => {
      fs.writeFile(`${save.hunterName}.json`, JSON.stringify(save, null, 2), (err) => {
        if (err) console.log(err)
      })
    })
  })
}

module.exports = { getJSON }
