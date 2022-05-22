const fs = require('fs')
const path = require('path')

try {
    fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, elements) => {
        const onlyFiles = elements.filter(el => el.isFile())
        for (let file of onlyFiles) {
            const filePath = path.join(__dirname, 'secret-folder', file.name)
            fs.stat(filePath, (err, stats) => {
                if (err) throw err
                const fileInfo = [path.basename(filePath, path.extname(filePath)), path.extname(filePath).slice(1), `${stats.size} b`]
                console.log(fileInfo.join(' - '))
            })
        }
    })
} catch {
    console.log(err)
}