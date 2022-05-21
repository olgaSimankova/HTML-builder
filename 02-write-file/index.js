const fs = require('fs')
const readline = require('readline')
// const stream = require('stream')

const { stdin: input, stdout: output, stderr } = require('process');
const rl = readline.createInterface({ input, output })

rl.question('Привет! Напечатай что-нибудь:\n', (answer) => {
        const output = fs.createWriteStream('./02-write-file/text.txt')
        if (answer.toString().trim().includes('exit')) {
            rl.close()
            console.log("Ну пока :)")
        } else {
        output.write(answer + '\n')
    }
})

rl.on("SIGINT", () => {
    rl.close()
    console.log("Ну пока :)")
})