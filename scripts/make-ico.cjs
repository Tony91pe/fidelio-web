// Genera src/app/favicon.ico dal PNG 32x32 esistente
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const pngPath = path.join(root, 'public', 'icons', 'icon-32x32.png')
const icoPath = path.join(root, 'src', 'app', 'favicon.ico')

const png = fs.readFileSync(pngPath)
const dataOffset = 6 + 16

const ico = Buffer.alloc(dataOffset + png.length)
ico.writeUInt16LE(0, 0)
ico.writeUInt16LE(1, 2)
ico.writeUInt16LE(1, 4)
ico.writeUInt8(32, 6)
ico.writeUInt8(32, 7)
ico.writeUInt8(0, 8)
ico.writeUInt8(0, 9)
ico.writeUInt16LE(1, 10)
ico.writeUInt16LE(32, 12)
ico.writeUInt32LE(png.length, 14)
ico.writeUInt32LE(dataOffset, 18)
png.copy(ico, dataOffset)

fs.writeFileSync(icoPath, ico)
console.log('src/app/favicon.ico scritto:', ico.length, 'bytes')
