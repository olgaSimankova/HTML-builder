const fs = require('fs')
const readline = require('readline')
const path = require('path')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const stdout = process.stdout
fs.createWriteStream(path.join(__dirname, 'text.txt'))

const writeToFile = () => {
    stdout.write('Привет! Напечатай что-нибудь:\n')
    rl.on('line', (text) => {
        if (text.trim()=='exit') {
            console.log("Ну пока :) Уачи!")
            process.exit()
        }
      fs.appendFile(path.join(__dirname, 'text.txt'), text + '\n', (err) => {
        if (err) return
      })
    })
  }

writeToFile()

rl.on("SIGINT", () => {
    console.log("Ну пока :) Уачи!")
    process.exit()
})