const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'text.txt')

const readableStream = new fs.ReadStream(filePath, 'utf-8')

readableStream.on('data', (chunk) => {process.stdout.write(chunk)})