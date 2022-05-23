const fs = require('fs')
const promises = fs.promises
const path = require('path')

const srcPath = path.join(__dirname, 'styles\\')
const destPath = path.join(__dirname, 'project-dist')

const writeStream = fs.createWriteStream(path.join(destPath, 'bundle.css'))

let stylesArr = []

function bundleCSS(styles) {

    writeStream.write(styles, "UTF8")
    writeStream.end()
}

async function getStyles(src) {
    const srcFiles = await promises.readdir(src)

    for (const file of srcFiles) {
        if (path.parse(src + file).ext == '.css') {
            
            const stylesFileRead = await promises.readFile(src + file, 'utf8')

            stylesArr.push(stylesFileRead)
        }
    }

    bundleCSS(stylesArr.join(''))
}

getStyles(srcPath)

// Что-то не получилось с пайпом, потом разберусь
// srcFiles.forEach(file => {
//     if (path.parse(src + file).ext == '.css') {
//         const readStream = fs.createReadStream(path.join(src, file.name), 'utf-8')
//         readStream.pipe(writeStream, {end: false})
//     }
// })