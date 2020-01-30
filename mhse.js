
const { encrypt, decrypt } = require('./crypto')
const { getJSON } = require('./getJSON')

/* eslint no-unused-expressions: 0 */

require('yargs')
  .command('decrypt [source] [output]', 'Decrypt a save file', (yargs) => {
    yargs.positional('source', {
      describe: 'input file',
      default: 'savedata1000'
    }).positional('output', {
      describe: 'output file',
      default: 'savedata1000.dec'
    })
  }, (argv) => {
    console.log('Decrypting...')
    decrypt(argv.source, argv.output)
  })
  .command('encrypt [source] [output]', 'Encrypt a decrypted save file', (yargs) => {
    yargs.positional('source', {
      describe: 'input file',
      default: 'savedata1000.dec'
    }).positional('output', {
      describe: 'output file',
      default: 'savedata1000.enc'
    })
  }, (argv) => {
    console.log('Encrypting...')
    encrypt(argv.source, argv.output)
  })
  .command('getJSON [source]', 'Read decrypted save file and create JSON files for each character', (yargs) => {
    yargs.positional('source', {
      describe: 'Decrypted save file',
      default: './savedata1000.dec'
    })
  }, (argv) => {
    getJSON(argv.source)
  })
  .help()
  .argv
